import React from 'react'

export default function Header({ assessment, onSimulate, onReset, isSimulating }) {
  const level = assessment?.level ?? 0
  const levelName = assessment?.name ?? '加载中...'
  const levelColor = assessment?.color ?? '#6B7280'

  const glowClass = level >= 3 ? 'glow-red' : level >= 2 ? 'glow-orange' : level >= 1 ? 'glow-yellow' : ''

  return (
    <header className="border-b border-dark-border bg-dark-card/50">
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left: Title and Status */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-100 flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                金融危机监测体系
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Crisis Monitoring System — JCS Framework
              </p>
            </div>

            {/* Overall Status Badge */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full border ${glowClass} transition-all duration-500`}
              style={{
                borderColor: levelColor,
                backgroundColor: `${levelColor}15`,
              }}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full ${level >= 2 ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: levelColor }}
              />
              <span className="text-sm font-semibold" style={{ color: levelColor }}>
                {levelName}
              </span>
              <span className="text-xs text-gray-400">Lv.{level}</span>
            </div>
          </div>

          {/* Right: Simulation Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 mr-2">情景模拟：</span>
            <button
              onClick={() => onSimulate('normal')}
              disabled={isSimulating}
              className="px-3 py-1.5 text-xs rounded-md bg-green-900/30 text-green-400 border border-green-800 hover:bg-green-900/50 transition-colors disabled:opacity-50"
            >
              正常
            </button>
            <button
              onClick={() => onSimulate('liquidity_stress')}
              disabled={isSimulating}
              className="px-3 py-1.5 text-xs rounded-md bg-orange-900/30 text-orange-400 border border-orange-800 hover:bg-orange-900/50 transition-colors disabled:opacity-50"
            >
              流动性紧张
            </button>
            <button
              onClick={() => onSimulate('systemic')}
              disabled={isSimulating}
              className="px-3 py-1.5 text-xs rounded-md bg-red-900/30 text-red-400 border border-red-800 hover:bg-red-900/50 transition-colors disabled:opacity-50"
            >
              系统性危机
            </button>
            <button
              onClick={onReset}
              className="px-3 py-1.5 text-xs rounded-md bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-gray-700 transition-colors"
            >
              重置
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
