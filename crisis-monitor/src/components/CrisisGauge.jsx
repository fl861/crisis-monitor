import React from 'react'
import { CRISIS_SEVERITY_MODEL } from '../data/monitoringFramework'

export default function CrisisGauge({ assessment }) {
  const level = assessment?.level ?? 0
  const levelData = CRISIS_SEVERITY_MODEL.levels[level]

  // SVG gauge parameters
  const radius = 80
  const circumference = Math.PI * radius // half circle
  const progress = (level / 4) * circumference
  const offset = circumference - progress

  return (
    <div className="indicator-card">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        综合危机等级 <span className="text-gray-500">Overall Crisis Level</span>
      </h3>

      <div className="flex flex-col items-center">
        {/* Gauge SVG */}
        <svg width="200" height="120" viewBox="0 0 200 120">
          {/* Background arc */}
          <path
            d="M 10 110 A 80 80 0 0 1 190 110"
            fill="none"
            stroke="#334155"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Color segments */}
          {CRISIS_SEVERITY_MODEL.levels.map((lvl, i) => {
            const segStart = (i / 5) * 180 - 90
            const segEnd = ((i + 1) / 5) * 180 - 90
            const startRad = (segStart * Math.PI) / 180
            const endRad = (segEnd * Math.PI) / 180
            const x1 = 100 + 80 * Math.cos(startRad)
            const y1 = 110 + 80 * Math.sin(startRad)
            const x2 = 100 + 80 * Math.cos(endRad)
            const y2 = 110 + 80 * Math.sin(endRad)
            return (
              <path
                key={i}
                d={`M ${x1} ${y1} A 80 80 0 0 1 ${x2} ${y2}`}
                fill="none"
                stroke={lvl.color}
                strokeWidth="12"
                strokeLinecap="round"
                opacity={i <= level ? 1 : 0.2}
              />
            )
          })}

          {/* Needle */}
          {(() => {
            const angle = (level / 4) * 180 - 180
            const rad = (angle * Math.PI) / 180
            const needleLen = 60
            const nx = 100 + needleLen * Math.cos(rad)
            const ny = 110 + needleLen * Math.sin(rad)
            return (
              <g>
                <line
                  x1="100" y1="110" x2={nx} y2={ny}
                  stroke={levelData?.color || '#6B7280'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{ transition: 'all 1s ease-in-out' }}
                />
                <circle cx="100" cy="110" r="6" fill={levelData?.color || '#6B7280'} />
                <circle cx="100" cy="110" r="3" fill="#0F172A" />
              </g>
            )
          })()}

          {/* Level labels */}
          <text x="10" y="118" fill="#6B7280" fontSize="8" textAnchor="start">0</text>
          <text x="190" y="118" fill="#6B7280" fontSize="8" textAnchor="end">4</text>
        </svg>

        {/* Level info */}
        <div className="text-center mt-2">
          <div className="text-3xl font-bold" style={{ color: levelData?.color }}>
            {levelData?.name || '---'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {levelData?.nameEn || '---'}
          </div>
          <p className="text-xs text-gray-400 mt-3 max-w-[250px] leading-relaxed">
            {levelData?.description || ''}
          </p>
        </div>

        {/* Action recommendation */}
        {levelData?.action && (
          <div className="mt-4 w-full px-3 py-2 rounded-lg bg-dark-bg/50 border border-dark-border">
            <div className="text-xs text-gray-500 mb-1">建议操作</div>
            <div className="text-sm text-gray-300">{levelData.action}</div>
          </div>
        )}
      </div>
    </div>
  )
}
