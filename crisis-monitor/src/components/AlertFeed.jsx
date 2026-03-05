import React from 'react'

const levelConfig = {
  info: { bg: 'bg-blue-900/20', border: 'border-blue-800', text: 'text-blue-400', dot: 'bg-blue-400', label: '信息' },
  warning: { bg: 'bg-yellow-900/20', border: 'border-yellow-800', text: 'text-yellow-400', dot: 'bg-yellow-400', label: '警告' },
  elevated: { bg: 'bg-orange-900/20', border: 'border-orange-800', text: 'text-orange-400', dot: 'bg-orange-400', label: '升级' },
  critical: { bg: 'bg-red-900/20', border: 'border-red-800', text: 'text-red-400', dot: 'bg-red-400', label: '严重' },
}

export default function AlertFeed({ alerts, assessment }) {
  return (
    <div className="indicator-card h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">
          系统评估与预警 <span className="text-gray-500">Assessment & Alerts</span>
        </h3>
        <span className="text-xs text-gray-500">{alerts.length} 条预警</span>
      </div>

      {/* System Assessment */}
      <div
        className="rounded-lg p-4 mb-4 border"
        style={{
          borderColor: assessment.overallColor,
          backgroundColor: `${assessment.overallColor}10`,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: assessment.overallColor }} />
          <span className="text-sm font-medium" style={{ color: assessment.overallColor }}>
            系统综合评估：{assessment.overallName} (Lv.{assessment.overallLevel})
          </span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed mb-3">{assessment.summary}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-red-400/80 font-medium mb-1.5">需关注风险:</div>
            {assessment.keyRisks.map((risk, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-gray-400 mb-1">
                <span className="text-red-500 mt-0.5">!</span>
                <span>{risk}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs text-green-400/80 font-medium mb-1.5">积极因素:</div>
            {assessment.positiveFactors.map((factor, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-gray-400 mb-1">
                <span className="text-green-500 mt-0.5">+</span>
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert list */}
      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
        {alerts.map(alert => {
          const config = levelConfig[alert.level] || levelConfig.info
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border ${config.bg} ${config.border}`}
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${config.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
                  <span className="text-xs text-gray-500">{alert.timestamp}</span>
                </div>
                <p className="text-sm text-gray-300">{alert.message}</p>
              </div>
              <span className="text-xs font-mono text-gray-400 flex-shrink-0">{alert.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
