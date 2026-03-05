import React from 'react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { historicalCrises } from '../data/mockData'
import { assessIndicatorLevel } from '../utils/crisisEngine'

export default function HistoricalComparison({ snapshot }) {
  // Normalize values for radar chart comparison (0-100 scale)
  const normalize = (id, value) => {
    const absVal = Math.abs(value)
    const ranges = {
      swap_spread_3y: 100,
      eur_usd_basis: 200,
      credit_spread_hy: 2500,
      vix_index: 100,
      market_depth: 100,
    }
    const range = ranges[id] || 100
    // For market_depth, higher is better so invert
    if (id === 'market_depth') return Math.min(100, (100 - value) / range * 100)
    return Math.min(100, absVal / range * 100)
  }

  const radarKeys = ['swap_spread_3y', 'eur_usd_basis', 'credit_spread_hy', 'vix_index', 'market_depth']
  const radarLabels = {
    swap_spread_3y: 'Swap Spread',
    eur_usd_basis: 'EUR Basis',
    credit_spread_hy: 'HY Spread',
    vix_index: 'VIX',
    market_depth: 'Depth (inv)',
  }

  const radarData = radarKeys.map(key => {
    const point = { indicator: radarLabels[key] }
    point['当前'] = normalize(key, snapshot[key]?.value || 0)
    historicalCrises.forEach(crisis => {
      point[crisis.name] = normalize(key, crisis.indicators[key] || 0)
    })
    return point
  })

  const colors = ['#3B82F6', '#EF4444', '#F97316', '#A855F7', '#10B981']

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-100">历史危机对比分析</h2>
        <p className="text-sm text-gray-500 mt-1">Historical Crisis Comparison — 当前 vs 历史危机</p>
      </div>

      {/* Radar chart */}
      <div className="indicator-card">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          多维雷达对比 <span className="text-gray-500">Multi-Dimension Radar</span>
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis
                dataKey="indicator"
                tick={{ fontSize: 11, fill: '#94A3B8' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#64748B' }}
              />
              <Radar
                name="当前"
                dataKey="当前"
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
              {historicalCrises.map((crisis, i) => (
                <Radar
                  key={crisis.name}
                  name={crisis.name}
                  dataKey={crisis.name}
                  stroke={colors[i + 1]}
                  fill={colors[i + 1]}
                  fillOpacity={0.05}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
              ))}
              <Legend
                wrapperStyle={{ fontSize: 12, color: '#94A3B8' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison table */}
      <div className="indicator-card overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          指标详细对比 <span className="text-gray-500">Detailed Comparison</span>
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left py-2 px-3 text-gray-400 font-medium">指标</th>
              <th className="text-right py-2 px-3 text-blue-400 font-medium">当前</th>
              {historicalCrises.map(crisis => (
                <th key={crisis.name} className="text-right py-2 px-3 text-gray-400 font-medium whitespace-nowrap">
                  {crisis.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {radarKeys.map(key => {
              const currentVal = snapshot[key]?.value || 0
              const currentLevel = assessIndicatorLevel(key, currentVal)
              return (
                <tr key={key} className="border-b border-dark-border/50 hover:bg-dark-bg/30">
                  <td className="py-2.5 px-3 text-gray-300">{radarLabels[key]}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="font-mono font-bold text-gray-100">{currentVal}</span>
                    <span
                      className="ml-2 text-xs px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${currentLevel.color}20`, color: currentLevel.color }}
                    >
                      {currentLevel.label}
                    </span>
                  </td>
                  {historicalCrises.map(crisis => {
                    const val = crisis.indicators[key]
                    const level = assessIndicatorLevel(key, val)
                    return (
                      <td key={crisis.name} className="py-2.5 px-3 text-right">
                        <span className="font-mono text-gray-300">{val}</span>
                        <span
                          className="ml-2 text-xs px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: `${level.color}20`, color: level.color }}
                        >
                          {level.label}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Key insight */}
      <div className="indicator-card border-l-4 border-l-blue-500">
        <h3 className="text-sm font-semibold text-blue-400 mb-2">分析要点</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>
            历史对比应聚焦于<strong className="text-gray-200">微观结构指标的模式匹配</strong>，而非简单的数值比较。
            同样的VIX水平在不同市场结构下意味着截然不同的风险。
          </p>
          <p>
            关键区分：2025年4月动荡中货币基差保持平稳，与2008/2020年的系统性危机有本质区别。
            这一区分直接决定了应对策略——前者可以逢低布局，后者需要全面避险。
          </p>
        </div>
      </div>
    </div>
  )
}
