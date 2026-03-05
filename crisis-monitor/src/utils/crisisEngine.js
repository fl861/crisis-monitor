/**
 * 危机评估引擎
 * Crisis Assessment Engine
 *
 * 根据锦成盛资管框架，实现自动化的危机等级评估
 */

import { MONITORING_INDICATORS, CRISIS_SEVERITY_MODEL, CRISIS_PHASES } from '../data/monitoringFramework';

/**
 * 评估单个指标的状态等级
 */
export function assessIndicatorLevel(indicatorId, value) {
  // 在所有类别中查找指标
  for (const category of Object.values(MONITORING_INDICATORS)) {
    if (!category.indicators) continue;
    const indicator = category.indicators.find(ind => ind.id === indicatorId);
    if (!indicator || !indicator.thresholds) continue;

    const thresholds = indicator.thresholds;

    // 判断是"越大越危险"还是"越小越危险"
    if (thresholds.normal?.max !== undefined) {
      // 越大越危险（如bid_ask_spread）或越负越危险（如swap_spread）
      if (value <= thresholds.normal.max) return { level: 'normal', ...thresholds.normal };
      if (value <= thresholds.warning.max) return { level: 'warning', ...thresholds.warning };
      if (value <= thresholds.elevated.max) return { level: 'elevated', ...thresholds.elevated };
      if (thresholds.critical && value <= thresholds.critical.max) return { level: 'critical', ...thresholds.critical };
      return { level: 'extreme', ...thresholds.extreme };
    }

    if (thresholds.normal?.min !== undefined) {
      // 越小越危险（如market_depth）
      if (value >= thresholds.normal.min) return { level: 'normal', ...thresholds.normal };
      if (value >= thresholds.warning.min) return { level: 'warning', ...thresholds.warning };
      if (value >= thresholds.elevated.min) return { level: 'elevated', ...thresholds.elevated };
      if (thresholds.critical && value >= thresholds.critical.min) return { level: 'critical', ...thresholds.critical };
      return { level: 'extreme', ...thresholds.extreme };
    }
  }

  return { level: 'unknown', label: '未知', color: '#6B7280' };
}

/**
 * 根据锦成盛框架评估整体危机等级
 * 核心逻辑：
 * 1. 先看Swap Spread（Dealer温度计）
 * 2. 再看货币基差（划清红线：流动性紧张 vs 系统性危机）
 * 3. 辅助参考策略平仓和信用指标
 */
export function assessOverallCrisisLevel(snapshot) {
  const scores = {};

  // 评估所有指标
  for (const [id, data] of Object.entries(snapshot)) {
    scores[id] = assessIndicatorLevel(id, data.value);
  }

  // 核心判断逻辑（锦成盛框架）
  const swapSpreadLevel = scores.swap_spread_3y?.level || 'normal';
  const eurBasisLevel = scores.eur_usd_basis?.level || 'normal';
  const jpyBasisLevel = scores.jpy_usd_basis?.level || 'normal';

  const levelMap = { normal: 0, warning: 1, elevated: 2, critical: 3, extreme: 4 };

  // 货币基差是核心分水岭
  const basisMaxLevel = Math.max(
    levelMap[eurBasisLevel] || 0,
    levelMap[jpyBasisLevel] || 0
  );

  // Swap Spread是先行指标
  const swapLevel = levelMap[swapSpreadLevel] || 0;

  let overallLevel;

  if (basisMaxLevel >= 3) {
    // 货币基差进入critical/extreme → 系统性危机
    overallLevel = Math.max(3, basisMaxLevel);
  } else if (swapLevel >= 3) {
    // Swap Spread极端但货币基差平稳 → 流动性紧张（可恢复）
    overallLevel = 2;
  } else if (swapLevel >= 2) {
    overallLevel = 2;
  } else {
    // 综合评估所有指标
    const allLevels = Object.values(scores).map(s => levelMap[s.level] || 0);
    const avgLevel = allLevels.reduce((a, b) => a + b, 0) / allLevels.length;
    const maxLevel = Math.max(...allLevels);

    if (maxLevel >= 3 || avgLevel >= 2) overallLevel = 2;
    else if (maxLevel >= 2 || avgLevel >= 1) overallLevel = 1;
    else overallLevel = 0;
  }

  return {
    level: overallLevel,
    ...CRISIS_SEVERITY_MODEL.levels[overallLevel],
    indicatorScores: scores,
  };
}

/**
 * 判断当前危机演进阶段
 */
export function assessCurrentPhase(snapshot) {
  const activePhases = [];

  // Phase 1: 市场深度下降 + 价差走阔
  const depthLevel = assessIndicatorLevel('market_depth', snapshot.market_depth?.value);
  const spreadLevel = assessIndicatorLevel('bid_ask_spread', snapshot.bid_ask_spread?.value);
  if (['warning', 'elevated', 'critical', 'extreme'].includes(depthLevel.level) ||
      ['warning', 'elevated', 'critical', 'extreme'].includes(spreadLevel.level)) {
    activePhases.push({ ...CRISIS_PHASES[0], active: true, currentLevel: depthLevel.level });
  }

  // Phase 2: 跨资产相关性上升
  const corrLevel = assessIndicatorLevel('cross_asset_correlation', snapshot.cross_asset_correlation?.value);
  if (['warning', 'elevated', 'critical', 'extreme'].includes(corrLevel.level)) {
    activePhases.push({ ...CRISIS_PHASES[1], active: true, currentLevel: corrLevel.level });
  }

  // Phase 3: 策略平仓信号
  const onOffLevel = assessIndicatorLevel('on_off_run_spread', snapshot.on_off_run_spread?.value);
  const factorLevel = assessIndicatorLevel('style_factor_performance', snapshot.style_factor_performance?.value);
  if (['elevated', 'critical', 'extreme'].includes(onOffLevel.level) ||
      ['elevated', 'critical', 'extreme'].includes(factorLevel.level)) {
    activePhases.push({ ...CRISIS_PHASES[2], active: true, currentLevel: onOffLevel.level });
  }

  // Phase 4: Dealer躺平
  const swapLevel = assessIndicatorLevel('swap_spread_3y', snapshot.swap_spread_3y?.value);
  if (['elevated', 'critical', 'extreme'].includes(swapLevel.level)) {
    activePhases.push({ ...CRISIS_PHASES[3], active: true, currentLevel: swapLevel.level });
  }

  // Phase 5: Flight to Quality
  const creditLevel = assessIndicatorLevel('credit_spread_hy', snapshot.credit_spread_hy?.value);
  const liborLevel = assessIndicatorLevel('libor_ois_spread', snapshot.libor_ois_spread?.value);
  if (['critical', 'extreme'].includes(creditLevel.level) ||
      ['critical', 'extreme'].includes(liborLevel.level)) {
    activePhases.push({ ...CRISIS_PHASES[4], active: true, currentLevel: creditLevel.level });
  }

  return activePhases;
}

/**
 * 生成趋势箭头
 */
export function getTrendIcon(trend) {
  switch (trend) {
    case 'improving': return { icon: '↗', color: '#16A34A', label: '改善' };
    case 'stable': return { icon: '→', color: '#6B7280', label: '稳定' };
    case 'watching': return { icon: '↘', color: '#CA8A04', label: '关注' };
    case 'deteriorating': return { icon: '↓', color: '#DC2626', label: '恶化' };
    default: return { icon: '→', color: '#6B7280', label: '稳定' };
  }
}
