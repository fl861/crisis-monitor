/**
 * 金融危机监测体系 - 基于锦成盛资管分析框架
 * Financial Crisis Monitoring Framework
 *
 * 核心理念：从微观交易结构和参与者行为机制出发，
 * 而非依赖宏观"叙事陷阱"来判断危机。
 */

// ========================================
// 一、危机演进五阶段监测模型
// ========================================
export const CRISIS_PHASES = [
  {
    id: 'phase_1',
    phase: 1,
    name: '资产下跌引发资金需求',
    nameEn: 'Asset Decline Triggers Funding Demand',
    description: '资产价格下跌导致投资者需要追加保证金或出售资产换取现金',
    monitoringTargets: ['市场深度', '买卖价差'],
    keySignals: [
      '买盘迅速消失',
      '买卖价差急剧拉大',
      '抵押融资渠道开始堵塞',
    ],
    indicators: ['market_depth', 'bid_ask_spread'],
    severity: 'warning',
    color: '#CA8A04', // yellow
  },
  {
    id: 'phase_2',
    phase: 2,
    name: '抛售压力扩散至其他资产',
    nameEn: 'Selling Pressure Spreads Cross-Asset',
    description: '不同类别资产开始同步下跌，流动性紧张从局部向全局蔓延',
    monitoringTargets: ['跨资产相关性'],
    keySignals: [
      '股票、债券、商品同步下跌',
      '出现"无差别抛售"',
      '跨资产相关性骤升',
    ],
    indicators: ['cross_asset_correlation', 'asset_sync_decline'],
    severity: 'elevated',
    color: '#EA580C', // orange
  },
  {
    id: 'phase_3',
    phase: 3,
    name: '市场中性策略被迫解盘',
    nameEn: 'Market Neutral Strategies Forced Unwind',
    description: '高杠杆中性策略开始被迫平仓，放大市场波动（关键转折点）',
    monitoringTargets: ['新老券利差', '风格因子表现', '基差(Basis)'],
    keySignals: [
      '新老券利差急剧走阔',
      '中小盘股相对大盘股超额波动',
      '风格因子崩盘',
      '"劣质资产跌、避险资产涨"分裂现象',
    ],
    indicators: ['on_off_run_spread', 'style_factor_performance', 'basis_spread'],
    severity: 'high',
    color: '#DC2626', // red
  },
  {
    id: 'phase_4',
    phase: 4,
    name: 'Dealer"躺平"并反向Front Run',
    nameEn: 'Dealer Withdrawal & Front Running',
    description: 'Dealer拒绝提供流动性甚至反向操作，危机急剧加速',
    monitoringTargets: ['Swap Spread（利率互换利差）'],
    keySignals: [
      'Swap Spread急剧走负',
      '3年期Swap Spread跌破-36bp',
      'Dealer压低报价、拒绝交易',
      'Dealer抢先做空加剧踩踏',
    ],
    indicators: ['swap_spread_3y', 'swap_spread_5y', 'swap_spread_10y'],
    severity: 'critical',
    color: '#DC2626', // red
  },
  {
    id: 'phase_5',
    phase: 5,
    name: '全市场Flight to Quality（功能丧失）',
    nameEn: 'Market-wide Flight to Quality',
    description: '市场完全丧失定价和融资功能，违约风险向实体传导',
    monitoringTargets: ['信用利差', '融资市场利率', '交易对手方风险'],
    keySignals: [
      '信用债市场冻结',
      '高收益债利差飙升',
      'Libor-OIS利差大幅上升',
      '违约风险从金融领域向实体传导',
    ],
    indicators: ['credit_spread_hy', 'libor_ois_spread', 'counterparty_risk'],
    severity: 'critical',
    color: '#7F1D1D', // dark red
  },
];

// ========================================
// 二、核心监测指标体系
// ========================================
export const MONITORING_INDICATORS = {
  // --- A. Dealer健康度指标（最核心） ---
  dealer_health: {
    category: 'Dealer健康度',
    categoryEn: 'Dealer Health',
    icon: 'Thermometer',
    priority: 'critical',
    indicators: [
      {
        id: 'swap_spread_3y',
        name: '3年期Swap Spread',
        nameEn: '3Y Swap Spread',
        unit: 'bp',
        description: 'Dealer资产负债表压力的核心"温度计"',
        thresholds: {
          normal: { max: -10, label: '正常', color: '#16A34A' },
          warning: { max: -20, label: '关注', color: '#CA8A04' },
          elevated: { max: -30, label: '紧张', color: '#EA580C' },
          critical: { max: -36, label: '危险', color: '#DC2626' },
          extreme: { max: -Infinity, label: '极端', color: '#7F1D1D' },
        },
        historicalBenchmark: '2025年4月：从-20bp跌破-36bp（一天内）',
      },
      {
        id: 'swap_spread_5y',
        name: '5年期Swap Spread',
        nameEn: '5Y Swap Spread',
        unit: 'bp',
        description: '中期Dealer压力指标',
        thresholds: {
          normal: { max: -5, label: '正常', color: '#16A34A' },
          warning: { max: -15, label: '关注', color: '#CA8A04' },
          elevated: { max: -25, label: '紧张', color: '#EA580C' },
          critical: { max: -35, label: '危险', color: '#DC2626' },
          extreme: { max: -Infinity, label: '极端', color: '#7F1D1D' },
        },
      },
      {
        id: 'swap_spread_10y',
        name: '10年期Swap Spread',
        nameEn: '10Y Swap Spread',
        unit: 'bp',
        description: '长期Dealer压力指标',
        thresholds: {
          normal: { max: -5, label: '正常', color: '#16A34A' },
          warning: { max: -15, label: '关注', color: '#CA8A04' },
          elevated: { max: -25, label: '紧张', color: '#EA580C' },
          critical: { max: -35, label: '危险', color: '#DC2626' },
          extreme: { max: -Infinity, label: '极端', color: '#7F1D1D' },
        },
      },
    ],
  },

  // --- B. 危机烈度分水岭指标 ---
  crisis_severity: {
    category: '危机烈度分水岭',
    categoryEn: 'Crisis Severity Watershed',
    icon: 'AlertTriangle',
    priority: 'critical',
    indicators: [
      {
        id: 'eur_usd_basis',
        name: '欧元/美元货币基差',
        nameEn: 'EUR/USD Cross Currency Basis',
        unit: 'bp',
        description: '离岸美元流动性压力的关键指标。区分"流动性紧张"vs"系统性危机"的核心分水岭',
        thresholds: {
          normal: { max: -10, label: '正常', color: '#16A34A' },
          warning: { max: -25, label: '小幅扰动', color: '#CA8A04' },
          elevated: { max: -50, label: '流动性紧张', color: '#EA580C' },
          critical: { max: -100, label: '系统性压力', color: '#DC2626' },
          extreme: { max: -Infinity, label: '生存危机', color: '#7F1D1D' },
        },
        historicalBenchmark: '2025年4月：小幅扰动但总体平稳 → 仅Dealer躺平 | 2008年/2020年3月：飙升 → 系统性危机',
      },
      {
        id: 'jpy_usd_basis',
        name: '日元/美元货币基差',
        nameEn: 'JPY/USD Cross Currency Basis',
        unit: 'bp',
        description: '日本金融机构美元融资渠道状况',
        thresholds: {
          normal: { max: -15, label: '正常', color: '#16A34A' },
          warning: { max: -30, label: '小幅扰动', color: '#CA8A04' },
          elevated: { max: -60, label: '流动性紧张', color: '#EA580C' },
          critical: { max: -120, label: '系统性压力', color: '#DC2626' },
          extreme: { max: -Infinity, label: '生存危机', color: '#7F1D1D' },
        },
      },
    ],
  },

  // --- C. 市场流动性指标 ---
  market_liquidity: {
    category: '市场流动性',
    categoryEn: 'Market Liquidity',
    icon: 'Droplets',
    priority: 'high',
    indicators: [
      {
        id: 'market_depth',
        name: '市场深度',
        nameEn: 'Market Depth',
        unit: 'index',
        description: '衡量市场承受冲击的能力',
        thresholds: {
          normal: { min: 80, label: '正常', color: '#16A34A' },
          warning: { min: 60, label: '减弱', color: '#CA8A04' },
          elevated: { min: 40, label: '脆弱', color: '#EA580C' },
          critical: { min: 20, label: '枯竭', color: '#DC2626' },
          extreme: { min: 0, label: '崩溃', color: '#7F1D1D' },
        },
      },
      {
        id: 'bid_ask_spread',
        name: '买卖价差',
        nameEn: 'Bid-Ask Spread',
        unit: 'bp',
        description: 'Dealer提供流动性意愿的直接体现',
        thresholds: {
          normal: { max: 5, label: '正常', color: '#16A34A' },
          warning: { max: 15, label: '走阔', color: '#CA8A04' },
          elevated: { max: 30, label: '急剧走阔', color: '#EA580C' },
          critical: { max: 50, label: '流动性枯竭', color: '#DC2626' },
          extreme: { max: Infinity, label: '市场冻结', color: '#7F1D1D' },
        },
      },
    ],
  },

  // --- D. 策略平仓监测指标 ---
  strategy_unwind: {
    category: '策略平仓监测',
    categoryEn: 'Strategy Unwind Monitor',
    icon: 'Unplug',
    priority: 'high',
    indicators: [
      {
        id: 'on_off_run_spread',
        name: '新老券利差',
        nameEn: 'On/Off-the-Run Spread',
        unit: 'bp',
        description: '债券中性套利策略被迫平仓的信号',
        thresholds: {
          normal: { max: 5, label: '正常', color: '#16A34A' },
          warning: { max: 10, label: '走阔', color: '#CA8A04' },
          elevated: { max: 20, label: '异常', color: '#EA580C' },
          critical: { max: 35, label: '策略解盘', color: '#DC2626' },
          extreme: { max: Infinity, label: '全面平仓', color: '#7F1D1D' },
        },
      },
      {
        id: 'style_factor_performance',
        name: '大小盘风格因子',
        nameEn: 'Size Factor Performance',
        unit: '%',
        description: '中小盘相对大盘股超额波动，反映多因子策略解盘',
        thresholds: {
          normal: { max: 2, label: '正常', color: '#16A34A' },
          warning: { max: 5, label: '分化', color: '#CA8A04' },
          elevated: { max: 10, label: '极端分化', color: '#EA580C' },
          critical: { max: 20, label: '因子崩盘', color: '#DC2626' },
          extreme: { max: Infinity, label: '全面踩踏', color: '#7F1D1D' },
        },
      },
      {
        id: 'basis_spread',
        name: '期现基差',
        nameEn: 'Futures Basis Spread',
        unit: 'bp',
        description: '基差交易策略压力指标',
        thresholds: {
          normal: { max: 10, label: '正常', color: '#16A34A' },
          warning: { max: 25, label: '走阔', color: '#CA8A04' },
          elevated: { max: 50, label: '异常', color: '#EA580C' },
          critical: { max: 80, label: '策略解盘', color: '#DC2626' },
          extreme: { max: Infinity, label: '崩溃', color: '#7F1D1D' },
        },
      },
    ],
  },

  // --- E. 信用与融资市场指标 ---
  credit_funding: {
    category: '信用与融资市场',
    categoryEn: 'Credit & Funding Markets',
    icon: 'Building2',
    priority: 'medium',
    indicators: [
      {
        id: 'credit_spread_ig',
        name: '投资级信用利差',
        nameEn: 'IG Credit Spread',
        unit: 'bp',
        description: '投资级债券信用风险定价',
        thresholds: {
          normal: { max: 100, label: '正常', color: '#16A34A' },
          warning: { max: 150, label: '走阔', color: '#CA8A04' },
          elevated: { max: 200, label: '紧张', color: '#EA580C' },
          critical: { max: 300, label: '恐慌', color: '#DC2626' },
          extreme: { max: Infinity, label: '冻结', color: '#7F1D1D' },
        },
      },
      {
        id: 'credit_spread_hy',
        name: '高收益债利差',
        nameEn: 'HY Credit Spread',
        unit: 'bp',
        description: '高收益债市场风险溢价，Flight to Quality的终极体现',
        thresholds: {
          normal: { max: 350, label: '正常', color: '#16A34A' },
          warning: { max: 500, label: '走阔', color: '#CA8A04' },
          elevated: { max: 700, label: '紧张', color: '#EA580C' },
          critical: { max: 1000, label: '恐慌', color: '#DC2626' },
          extreme: { max: Infinity, label: '市场冻结', color: '#7F1D1D' },
        },
      },
      {
        id: 'libor_ois_spread',
        name: 'SOFR-OIS利差',
        nameEn: 'SOFR-OIS Spread',
        unit: 'bp',
        description: '银行间融资压力',
        thresholds: {
          normal: { max: 10, label: '正常', color: '#16A34A' },
          warning: { max: 25, label: '走阔', color: '#CA8A04' },
          elevated: { max: 50, label: '紧张', color: '#EA580C' },
          critical: { max: 100, label: '恐慌', color: '#DC2626' },
          extreme: { max: Infinity, label: '银行间冻结', color: '#7F1D1D' },
        },
      },
    ],
  },

  // --- F. 跨资产传染指标 ---
  cross_asset: {
    category: '跨资产传染',
    categoryEn: 'Cross-Asset Contagion',
    icon: 'Network',
    priority: 'medium',
    indicators: [
      {
        id: 'cross_asset_correlation',
        name: '跨资产相关性',
        nameEn: 'Cross-Asset Correlation',
        unit: 'index',
        description: '股债商品同步下跌程度',
        thresholds: {
          normal: { max: 0.3, label: '正常分化', color: '#16A34A' },
          warning: { max: 0.5, label: '趋同', color: '#CA8A04' },
          elevated: { max: 0.7, label: '高度同步', color: '#EA580C' },
          critical: { max: 0.9, label: '无差别抛售', color: '#DC2626' },
          extreme: { max: 1.0, label: '全面崩溃', color: '#7F1D1D' },
        },
      },
      {
        id: 'vix_index',
        name: 'VIX波动率指数',
        nameEn: 'VIX Index',
        unit: '',
        description: '市场恐慌程度（辅助指标）',
        thresholds: {
          normal: { max: 15, label: '平静', color: '#16A34A' },
          warning: { max: 20, label: '不安', color: '#CA8A04' },
          elevated: { max: 30, label: '恐慌', color: '#EA580C' },
          critical: { max: 45, label: '极端恐慌', color: '#DC2626' },
          extreme: { max: Infinity, label: '市场崩溃', color: '#7F1D1D' },
        },
      },
    ],
  },

  // --- G. 系统脆弱性辅助监测 ---
  systemic_vulnerability: {
    category: '系统脆弱性',
    categoryEn: 'Systemic Vulnerability',
    icon: 'ShieldAlert',
    priority: 'low',
    indicators: [
      {
        id: 'cre_concentration',
        name: '商业地产贷款集中度',
        nameEn: 'CRE Loan Concentration',
        unit: '%',
        description: '评估"震源"风险',
      },
      {
        id: 'hy_refinancing_pressure',
        name: '高收益债到期再融资压力',
        nameEn: 'HY Refinancing Wall',
        unit: '$B',
        description: '评估"放大器"风险',
      },
      {
        id: 'carry_crowding',
        name: 'Carry交易拥挤度',
        nameEn: 'Carry Trade Crowding',
        unit: 'index',
        description: '"通往地狱之路是由正Carry铺就的"',
      },
      {
        id: 'jpy_carry_position',
        name: '日元套息头寸规模',
        nameEn: 'JPY Carry Position Size',
        unit: '$B',
        description: '日元套息交易拥挤程度',
      },
    ],
  },
};

// ========================================
// 三、危机烈度判断模型
// ========================================
export const CRISIS_SEVERITY_MODEL = {
  levels: [
    {
      level: 0,
      name: '正常',
      nameEn: 'Normal',
      color: '#16A34A',
      description: '市场流动性充足，Dealer正常运作',
      criteria: 'Swap Spread稳定，货币基差正常',
      action: '常规监测',
    },
    {
      level: 1,
      name: '关注',
      nameEn: 'Watch',
      color: '#CA8A04',
      description: '局部流动性指标出现异常，但尚未形成传导',
      criteria: '个别指标进入警告区间',
      action: '提高监测频率，关注传导迹象',
    },
    {
      level: 2,
      name: '流动性紧张',
      nameEn: 'Liquidity Stress',
      color: '#EA580C',
      description: 'Dealer"躺平"导致流动性紧张，但货币基差平稳',
      criteria: 'Swap Spread急剧下行，但货币基差仅小幅扰动',
      action: '密切监测货币基差，评估央行干预可能性',
      historicalExample: '2025年4月美国市场动荡',
    },
    {
      level: 3,
      name: '系统性危机',
      nameEn: 'Systemic Crisis',
      color: '#DC2626',
      description: '金融机构出现生存危机，货币基差急剧恶化',
      criteria: '货币基差急剧走阔，Swap Spread极端',
      action: '预期央行以最后贷款人身份大规模注入流动性',
      historicalExample: '2008年金融危机、2020年3月',
    },
    {
      level: 4,
      name: '市场功能丧失',
      nameEn: 'Market Dysfunction',
      color: '#7F1D1D',
      description: '市场完全丧失定价和融资功能',
      criteria: '信用市场冻结，违约链条向实体传导',
      action: '全面避险，等待政策强力干预',
    },
  ],

  // 核心判断逻辑
  severityDetermination: {
    primaryIndicator: '货币基差（Cross Currency Basis）',
    rule: '用货币基差划清红线：平稳 = 可恢复的技术性波动 | 急剧恶化 = 系统性危机',
    secondaryIndicator: 'Swap Spread',
    secondaryRule: '紧盯Swap Spread作为Dealer行为和流动性紧张程度的先行指标',
  },
};

// ========================================
// 四、危机成因分析框架（理论支撑）
// ========================================
export const CRISIS_CAUSES_FRAMEWORK = {
  microStructure: {
    name: '微观结构失衡与Dealer躺平',
    description: '做市商资产负债表压力导致流动性供给断裂',
    deathSpiral: [
      '资产下跌引发补仓需求',
      'Dealer拒绝提供流动性',
      '市场中性策略被迫平仓',
      'Dealer反向Front Run加剧踩踏',
      '全市场Flight to Quality与功能丧失',
    ],
  },
  leverageCarry: {
    name: '杠杆、Carry交易与"确定性陷阱"',
    quote: 'The road to hell is paved with positive carry',
    description: '过强的"确定性"吸引杠杆资金涌入，使市场异常脆弱',
    examples: [
      { market: '中国债市', period: '2024-2025', risk: '资产荒推动Carry交易拥挤' },
      { market: '全球Alpha因子', period: '2025', risk: '冗余流动性干涸时套利策略逆转' },
      { market: '日元套息', period: '2024', risk: '做空日元头寸过度拥挤' },
    ],
  },
  structuralHomogeneity: {
    name: '市场参与者结构趋同',
    description: '量化策略普及、ETF扩张、散户行为趋同导致"机器抱团"',
    amplification: '上涨时吸血流动性，下跌时多杀多',
  },
  macroShifts: {
    name: '宏观与政策背景深层变化',
    items: [
      '中国经济进入"自然周期"，政策传导效率下降',
      '美国经济内部严重分化',
      '央行货币机制转型',
      '全球产业链重构',
    ],
  },
  antiPatterns: {
    name: '需要警惕的"叙事陷阱"',
    traps: [
      '美林时钟机械套用',
      '关税必然导致衰退',
      '央行一定会救市（Fed Put）',
      '简单照搬历史模式（如2018年Trump Trade）',
    ],
  },
};
