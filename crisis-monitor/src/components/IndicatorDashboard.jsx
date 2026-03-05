import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { MONITORING_INDICATORS } from '../data/monitoringFramework'
import { assessIndicatorLevel, getTrendIcon } from '../utils/crisisEngine'
import { timeSeriesData } from '../data/mockData'

function IndicatorCard({ indicator, data, isExpanded, onToggle }) {
  const assessment = assessIndicatorLevel(indicator.id, data.value)
  const trend = getTrendIcon(data.trend)
  const chartData = timeSeriesData[indicator.id]

  return (
    <div
      className={`indicator-card cursor-pointer transition-all duration-300 ${
        isExpanded ? 'col-span-2 row-span-2' : ''
      }`}
      style={{
        borderLeftColor: assessment.color,
        borderLeftWidth: '3px',
      }}
      onClick={() => onToggle(indicator.id)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-200 truncate">
            {indicator.name}
          </h4>
          <p className="text-xs text-gray-500 truncate">{indicator.nameEn}</p>
        </div>
        <div
          className="px-2 py-0.5 rounded text-xs font-medium ml-2 whitespace-nowrap"
          style={{
            backgroundColor: `${assessment.color}20`,
            color: assessment.color,
          }}
        >
          {assessment.label}
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end gap-3 mb-3">
        <span className="text-2xl font-bold text-gray-100">
          {data.value}
        </span>
        <span className="text-sm text-gray-500 mb-0.5">{indicator.unit}</span>
        <div className="flex items-center gap-1 mb-0.5 ml-auto">
          <span style={{ color: trend.color }} className="text-lg">{trend.icon}</span>
          <span className={`text-xs ${data.change > 0 ? 'text-red-400' : data.change < 0 ? 'text-green-400' : 'text-gray-400'}`}>
            {data.change > 0 ? '+' : ''}{data.change}
          </span>
        </div>
      </div>

      {/* Mini chart */}
      {chartData && (
        <div className="h-16 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.slice(-30)}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={assessment.color}
                strokeWidth={1.5}
                dot={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#94A3B8' }}
                formatter={(value) => [`${value} ${indicator.unit}`, indicator.name]}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Expanded details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-dark-border space-y-3">
          <p className="text-xs text-gray-400 leading-relaxed">{indicator.description}</p>

          {indicator.thresholds && (
            <div className="space-y-1.5">
              <div className="text-xs text-gray-500 font-medium">阈值设定</div>
              {Object.entries(indicator.thresholds).map(([key, thresh]) => (
                <div key={key} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: thresh.color }} />
                  <span className="text-gray-400 w-12">{thresh.label}</span>
                  <span className="text-gray-500">
                    {thresh.max !== undefined ? `≤ ${thresh.max === Infinity ? '∞' : thresh.max}` : ''}
                    {thresh.min !== undefined ? `≥ ${thresh.min}` : ''}
                    {indicator.unit}
                  </span>
                </div>
              ))}
            </div>
          )}

          {indicator.historicalBenchmark && (
            <div className="text-xs text-gray-500">
              <span className="text-gray-400">历史参考：</span>{indicator.historicalBenchmark}
            </div>
          )}

          {/* Larger chart when expanded */}
          {chartData && (
            <div className="h-40 -mx-2 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: '#94A3B8' }}
                    formatter={(value) => [`${value} ${indicator.unit}`, indicator.name]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={assessment.color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function IndicatorDashboard({ snapshot }) {
  const [expandedId, setExpandedId] = useState(null)
  const [filter, setFilter] = useState('all')

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const categories = Object.entries(MONITORING_INDICATORS)
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }

  const filteredCategories = filter === 'all'
    ? categories
    : categories.filter(([_, cat]) => cat.priority === filter)

  // Sort by priority
  filteredCategories.sort((a, b) =>
    (priorityOrder[a[1].priority] ?? 99) - (priorityOrder[b[1].priority] ?? 99)
  )

  return (
    <div>
      {/* Category filter */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xs text-gray-500">筛选：</span>
        {[
          { id: 'all', label: '全部' },
          { id: 'critical', label: '核心', color: '#DC2626' },
          { id: 'high', label: '重要', color: '#EA580C' },
          { id: 'medium', label: '辅助', color: '#CA8A04' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              filter === f.id
                ? 'bg-blue-900/30 border-blue-700 text-blue-400'
                : 'bg-dark-card border-dark-border text-gray-400 hover:text-gray-200'
            }`}
          >
            {f.color && (
              <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: f.color }} />
            )}
            {f.label}
          </button>
        ))}
      </div>

      {/* Indicator Grid */}
      {filteredCategories.map(([key, category]) => (
        <div key={key} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-base font-semibold text-gray-200">
              {category.category}
            </h3>
            <span className="text-xs text-gray-500">{category.categoryEn}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                category.priority === 'critical' ? 'bg-red-900/30 text-red-400' :
                category.priority === 'high' ? 'bg-orange-900/30 text-orange-400' :
                'bg-gray-700/50 text-gray-400'
              }`}
            >
              {category.priority === 'critical' ? '核心' :
               category.priority === 'high' ? '重要' : '辅助'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {category.indicators?.map(indicator => {
              const data = snapshot[indicator.id]
              if (!data) return null
              return (
                <IndicatorCard
                  key={indicator.id}
                  indicator={indicator}
                  data={data}
                  isExpanded={expandedId === indicator.id}
                  onToggle={handleToggle}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
