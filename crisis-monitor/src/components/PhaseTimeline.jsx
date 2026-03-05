import React from 'react'
import { CRISIS_PHASES } from '../data/monitoringFramework'
import { assessIndicatorLevel } from '../utils/crisisEngine'

export default function PhaseTimeline({ activePhases, snapshot }) {
  const activeIds = new Set(activePhases.map(p => p.id))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-100">危机演进五阶段模型</h2>
        <p className="text-sm text-gray-500 mt-1">Crisis Evolution 5-Phase Model — 锦成盛资管框架</p>
      </div>

      <div className="relative">
        {CRISIS_PHASES.map((phase, index) => {
          const isActive = activeIds.has(phase.id)
          const activeData = activePhases.find(p => p.id === phase.id)

          return (
            <div key={phase.id} className="relative flex gap-6 pb-8 last:pb-0">
              {/* Vertical connector line */}
              {index < CRISIS_PHASES.length - 1 && (
                <div
                  className="absolute left-5 top-10 w-0.5 h-full -ml-px"
                  style={{
                    background: isActive
                      ? `linear-gradient(to bottom, ${phase.color}, ${CRISIS_PHASES[index + 1]?.color || '#334155'})`
                      : '#334155'
                  }}
                />
              )}

              {/* Phase number circle */}
              <div
                className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 ${
                  isActive ? 'animate-pulse-slow' : ''
                }`}
                style={{
                  borderColor: isActive ? phase.color : '#475569',
                  backgroundColor: isActive ? `${phase.color}30` : '#1E293B',
                  color: isActive ? phase.color : '#64748B',
                }}
              >
                {phase.phase}
              </div>

              {/* Phase content */}
              <div
                className={`crisis-phase-card flex-1 ${isActive ? 'glow-' + (phase.severity === 'critical' ? 'red' : phase.severity === 'high' ? 'orange' : 'yellow') : ''}`}
                style={{
                  borderLeftColor: isActive ? phase.color : '#475569',
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-100 flex items-center gap-2">
                      {phase.name}
                      {isActive && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-normal"
                          style={{
                            backgroundColor: `${phase.color}20`,
                            color: phase.color,
                          }}
                        >
                          活跃
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{phase.nameEn}</p>
                  </div>

                  {isActive && activeData?.currentLevel && (
                    <div className="text-xs text-gray-400">
                      当前烈度: <span style={{ color: phase.color }}>{activeData.currentLevel}</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-400 mt-3">{phase.description}</p>

                {/* Key signals */}
                <div className="mt-4">
                  <div className="text-xs text-gray-500 font-medium mb-2">关键信号 Key Signals:</div>
                  <div className="space-y-1.5">
                    {phase.keySignals.map((signal, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: isActive ? phase.color : '#475569' }}
                        />
                        <span className={isActive ? 'text-gray-200' : 'text-gray-500'}>
                          {signal}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monitoring targets */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {phase.monitoringTargets.map((target, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md bg-dark-bg/60 text-gray-400 border border-dark-border"
                    >
                      {target}
                    </span>
                  ))}
                </div>

                {/* Related indicators with current values */}
                {isActive && phase.indicators && (
                  <div className="mt-4 pt-3 border-t border-dark-border">
                    <div className="text-xs text-gray-500 mb-2">关联指标当前值:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {phase.indicators.map(indId => {
                        const data = snapshot[indId]
                        if (!data) return null
                        const level = assessIndicatorLevel(indId, data.value)
                        return (
                          <div key={indId} className="flex items-center gap-2 text-xs bg-dark-bg/40 rounded px-2 py-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: level.color }} />
                            <span className="text-gray-400">{indId.replace(/_/g, ' ')}</span>
                            <span className="ml-auto font-mono text-gray-200">{data.value}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Death Spiral explanation */}
      <div className="indicator-card mt-8">
        <h3 className="text-base font-semibold text-gray-200 mb-3">
          死亡螺旋机制 <span className="text-gray-500 text-sm font-normal">Death Spiral Mechanism</span>
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          从微观交易结构出发理解危机传导——而非依赖宏观"叙事陷阱"
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {[
            '资产下跌',
            '补仓需求',
            'Dealer拒绝流动性',
            '策略强制平仓',
            'Dealer反向Front Run',
            '全市场踩踏',
            'Flight to Quality',
          ].map((step, i, arr) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded-lg bg-dark-bg text-sm text-gray-300 border border-dark-border">
                {step}
              </span>
              {i < arr.length - 1 && (
                <span className="text-gray-600">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
