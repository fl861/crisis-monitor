import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { CRISIS_SEVERITY_MODEL } from '../data/monitoringFramework'
import { assessIndicatorLevel } from '../utils/crisisEngine'

export default function SeverityWatershed({ snapshot, assessment }) {
  const eurBasis = snapshot.eur_usd_basis
  const jpyBasis = snapshot.jpy_usd_basis
  const swap3y = snapshot.swap_spread_3y

  const eurLevel = assessIndicatorLevel('eur_usd_basis', eurBasis?.value)
  const jpyLevel = assessIndicatorLevel('jpy_usd_basis', jpyBasis?.value)
  const swapLevel = assessIndicatorLevel('swap_spread_3y', swap3y?.value)

  const basisChartData = [
    { name: 'EUR/USD', value: Math.abs(eurBasis?.value || 0), raw: eurBasis?.value, color: eurLevel.color },
    { name: 'JPY/USD', value: Math.abs(jpyBasis?.value || 0), raw: jpyBasis?.value, color: jpyLevel.color },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-100">危机烈度分水岭判断</h2>
        <p className="text-sm text-gray-500 mt-1">Severity Watershed — 区分"流动性紧张" vs "系统性危机"的核心逻辑</p>
      </div>

      {/* Core Logic Explanation */}
      <div className="indicator-card border-l-4 border-l-blue-500">
        <h3 className="text-sm font-semibold text-blue-400 mb-3">核心判断逻辑</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-xs text-gray-500 mb-2">第一看：Swap Spread（先行指标）</div>
            <p className="text-sm text-gray-300">
              Swap Spread是Dealer资产负债表压力的核心"温度计"。急剧下行意味着Dealer正在"躺平"，拒绝提供流动性。
            </p>
            <div className="mt-3 flex items-center gap-3 px-3 py-2 rounded-lg bg-dark-bg/60">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: swapLevel.color }} />
              <span className="text-sm text-gray-300">3Y Swap Spread:</span>
              <span className="text-lg font-bold text-gray-100">{swap3y?.value} bp</span>
              <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${swapLevel.color}20`, color: swapLevel.color }}>
                {swapLevel.label}
              </span>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-2">第二看：货币基差（定性分水岭）</div>
            <p className="text-sm text-gray-300">
              货币基差划清红线——平稳 = 可恢复的技术性波动；急剧恶化 = 系统性危机（金融机构生存问题）。
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-dark-bg/60">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: eurLevel.color }} />
                <span className="text-sm text-gray-300">EUR/USD:</span>
                <span className="text-lg font-bold text-gray-100">{eurBasis?.value} bp</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${eurLevel.color}20`, color: eurLevel.color }}>
                  {eurLevel.label}
                </span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-dark-bg/60">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: jpyLevel.color }} />
                <span className="text-sm text-gray-300">JPY/USD:</span>
                <span className="text-lg font-bold text-gray-100">{jpyBasis?.value} bp</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${jpyLevel.color}20`, color: jpyLevel.color }}>
                  {jpyLevel.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Severity Levels */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          危机等级定义 <span className="text-gray-500">Crisis Severity Levels</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {CRISIS_SEVERITY_MODEL.levels.map((lvl) => {
            const isCurrentLevel = assessment?.level === lvl.level
            return (
              <div
                key={lvl.level}
                className={`rounded-xl p-4 border transition-all duration-500 ${
                  isCurrentLevel ? 'ring-2 scale-105' : 'opacity-60'
                }`}
                style={{
                  borderColor: isCurrentLevel ? lvl.color : '#334155',
                  backgroundColor: isCurrentLevel ? `${lvl.color}10` : '#1E293B',
                  ringColor: lvl.color,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      isCurrentLevel ? 'animate-pulse' : ''
                    }`}
                    style={{ backgroundColor: `${lvl.color}30`, color: lvl.color }}
                  >
                    {lvl.level}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: isCurrentLevel ? lvl.color : '#94A3B8' }}>
                      {lvl.name}
                    </div>
                    <div className="text-xs text-gray-500">{lvl.nameEn}</div>
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-2">
                  {lvl.description}
                </p>

                <div className="text-xs text-gray-500 border-t border-dark-border pt-2 mt-2">
                  <span className="text-gray-400">条件：</span>{lvl.criteria}
                </div>

                <div className="text-xs mt-2 px-2 py-1 rounded bg-dark-bg/50" style={{ color: lvl.color }}>
                  {lvl.action}
                </div>

                {lvl.historicalExample && (
                  <div className="text-xs text-gray-500 mt-2">
                    案例：{lvl.historicalExample}
                  </div>
                )}

                {isCurrentLevel && (
                  <div className="text-xs text-center mt-3 font-medium" style={{ color: lvl.color }}>
                    ← 当前状态
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 2025 April Case Study */}
      <div className="indicator-card">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">
          案例解读：2025年4月美国市场动荡
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="text-sm text-gray-300 leading-relaxed">
              <p className="mb-2">Swap Spread在一天内从-20bp跌破-36bp，Dealer资产负债表出现极端压力。</p>
              <p className="mb-2">但货币基差仅出现小幅扰动，说明离岸美元流动性并未受到系统性冲击。</p>
              <p className="font-medium" style={{ color: '#EA580C' }}>
                判断结论：流动性紧张（Lv.2），而非系统性危机（Lv.3+）
              </p>
            </div>
            <div className="text-xs text-gray-500">
              关键区分点：Dealer层面的"躺平"可以通过央行干预或市场自我修复来解决；<br/>
              而系统性危机意味着金融机构的生存问题。
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-500 mb-2">关键指标对比</div>
            {[
              { label: '3Y Swap Spread', value: '-36bp', status: '极端', color: '#DC2626' },
              { label: 'EUR/USD Basis', value: '-15bp', status: '小幅扰动', color: '#CA8A04' },
              { label: 'VIX', value: '28', status: '恐慌', color: '#EA580C' },
              { label: 'HY Spread', value: '450bp', status: '走阔', color: '#CA8A04' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-dark-bg/60">
                <span className="text-sm text-gray-400">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-200">{item.value}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
