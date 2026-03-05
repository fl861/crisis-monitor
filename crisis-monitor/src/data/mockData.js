/**
 * 模拟实时监测数据
 * Mock real-time monitoring data for dashboard demonstration
 */

// 生成带有波动的时间序列数据
function generateTimeSeries(baseValue, volatility, trend, count = 60) {
  const data = [];
  let value = baseValue;
  const now = Date.now();

  for (let i = count - 1; i >= 0; i--) {
    const noise = (Math.random() - 0.5) * 2 * volatility;
    const trendComponent = trend * (count - i) / count;
    value = baseValue + trendComponent + noise;
    data.push({
      time: new Date(now - i * 60 * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      timestamp: now - i * 60 * 1000,
      value: Math.round(value * 100) / 100,
    });
  }
  return data;
}

// 当前指标快照
export const currentSnapshot = {
  // Dealer健康度
  swap_spread_3y: { value: -18.5, change: -2.3, trend: 'deteriorating' },
  swap_spread_5y: { value: -12.8, change: -1.5, trend: 'deteriorating' },
  swap_spread_10y: { value: -8.2, change: -0.8, trend: 'stable' },

  // 危机烈度分水岭
  eur_usd_basis: { value: -8.5, change: 0.5, trend: 'stable' },
  jpy_usd_basis: { value: -12.3, change: -1.2, trend: 'stable' },

  // 市场流动性
  market_depth: { value: 72, change: -5, trend: 'deteriorating' },
  bid_ask_spread: { value: 8.2, change: 1.5, trend: 'deteriorating' },

  // 策略平仓
  on_off_run_spread: { value: 4.5, change: 0.8, trend: 'stable' },
  style_factor_performance: { value: 1.8, change: 0.3, trend: 'stable' },
  basis_spread: { value: 12.5, change: 2.1, trend: 'watching' },

  // 信用与融资
  credit_spread_ig: { value: 95, change: 5, trend: 'stable' },
  credit_spread_hy: { value: 340, change: 12, trend: 'watching' },
  libor_ois_spread: { value: 8.5, change: 0.5, trend: 'stable' },

  // 跨资产
  cross_asset_correlation: { value: 0.25, change: 0.05, trend: 'stable' },
  vix_index: { value: 16.8, change: 1.2, trend: 'watching' },
};

// 时间序列数据
export const timeSeriesData = {
  swap_spread_3y: generateTimeSeries(-15, 3, -5, 120),
  swap_spread_5y: generateTimeSeries(-10, 2, -3, 120),
  eur_usd_basis: generateTimeSeries(-7, 2, -1, 120),
  jpy_usd_basis: generateTimeSeries(-10, 3, -2, 120),
  market_depth: generateTimeSeries(80, 5, -10, 120),
  bid_ask_spread: generateTimeSeries(5, 2, 3, 120),
  vix_index: generateTimeSeries(14, 2, 3, 120),
  credit_spread_hy: generateTimeSeries(320, 15, 20, 120),
};

// 历史危机对比数据
export const historicalCrises = [
  {
    name: '2008金融危机',
    date: '2008-09',
    indicators: {
      swap_spread_3y: -80,
      eur_usd_basis: -150,
      credit_spread_hy: 2000,
      vix_index: 80,
      market_depth: 10,
    },
  },
  {
    name: '2020年3月',
    date: '2020-03',
    indicators: {
      swap_spread_3y: -50,
      eur_usd_basis: -120,
      credit_spread_hy: 1100,
      vix_index: 82,
      market_depth: 15,
    },
  },
  {
    name: '2022英国养老金危机',
    date: '2022-09',
    indicators: {
      swap_spread_3y: -45,
      eur_usd_basis: -35,
      credit_spread_hy: 600,
      vix_index: 33,
      market_depth: 30,
    },
  },
  {
    name: '2025年4月动荡',
    date: '2025-04',
    indicators: {
      swap_spread_3y: -36,
      eur_usd_basis: -15,
      credit_spread_hy: 450,
      vix_index: 28,
      market_depth: 40,
    },
  },
];

// 预警事件日志
export const alertLog = [
  {
    id: 1,
    timestamp: '2026-03-05 14:32:18',
    level: 'info',
    indicator: 'swap_spread_3y',
    message: '3Y Swap Spread降至-18.5bp，进入关注区间',
    value: -18.5,
  },
  {
    id: 2,
    timestamp: '2026-03-05 13:15:42',
    level: 'warning',
    indicator: 'bid_ask_spread',
    message: '国债买卖价差走阔至8.2bp，市场深度下降',
    value: 8.2,
  },
  {
    id: 3,
    timestamp: '2026-03-05 11:08:33',
    level: 'info',
    indicator: 'basis_spread',
    message: '期现基差走阔至12.5bp，需持续关注',
    value: 12.5,
  },
  {
    id: 4,
    timestamp: '2026-03-05 09:45:12',
    level: 'info',
    indicator: 'vix_index',
    message: 'VIX升至16.8，市场情绪略有不安',
    value: 16.8,
  },
  {
    id: 5,
    timestamp: '2026-03-04 16:30:00',
    level: 'info',
    indicator: 'eur_usd_basis',
    message: '欧元货币基差稳定于-8.5bp，离岸美元流动性正常',
    value: -8.5,
  },
];

// 当前系统评估
export const systemAssessment = {
  overallLevel: 1,
  overallName: '关注',
  overallColor: '#CA8A04',
  currentPhase: 1,
  summary: '当前市场处于关注状态。Swap Spread略有下行但仍在正常区间，货币基差平稳表明离岸美元流动性充足。需关注Dealer资产负债表压力及策略拥挤度的边际变化。',
  keyRisks: [
    'Dealer资产负债表因国债供给承压，Swap Spread有下行趋势',
    '市场深度较前期下降，流动性缓冲削弱',
    '部分Carry交易策略拥挤度上升',
  ],
  positiveFactors: [
    '货币基差（EUR/JPY）保持平稳，无系统性融资压力',
    '信用利差处于正常区间',
    '跨资产相关性低，未出现无差别抛售',
  ],
};
