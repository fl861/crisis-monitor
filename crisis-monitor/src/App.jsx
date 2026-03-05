import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import CrisisGauge from './components/CrisisGauge'
import PhaseTimeline from './components/PhaseTimeline'
import IndicatorDashboard from './components/IndicatorDashboard'
import SeverityWatershed from './components/SeverityWatershed'
import AlertFeed from './components/AlertFeed'
import FrameworkPanel from './components/FrameworkPanel'
import HistoricalComparison from './components/HistoricalComparison'
import { currentSnapshot, systemAssessment, alertLog } from './data/mockData'
import { assessOverallCrisisLevel, assessCurrentPhase } from './utils/crisisEngine'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [crisisAssessment, setCrisisAssessment] = useState(null)
  const [activePhases, setActivePhases] = useState([])
  const [snapshot, setSnapshot] = useState(currentSnapshot)
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    const assessment = assessOverallCrisisLevel(snapshot)
    setCrisisAssessment(assessment)
    const phases = assessCurrentPhase(snapshot)
    setActivePhases(phases)
  }, [snapshot])

  // 模拟危机升级场景
  const simulateCrisis = (level) => {
    setIsSimulating(true)
    const scenarios = {
      normal: {
        swap_spread_3y: { value: -8, change: 0.5, trend: 'stable' },
        swap_spread_5y: { value: -5, change: 0.3, trend: 'stable' },
        swap_spread_10y: { value: -3, change: 0.1, trend: 'stable' },
        eur_usd_basis: { value: -5, change: 0.2, trend: 'stable' },
        jpy_usd_basis: { value: -8, change: 0.1, trend: 'stable' },
        market_depth: { value: 90, change: 2, trend: 'improving' },
        bid_ask_spread: { value: 3, change: -0.5, trend: 'improving' },
        on_off_run_spread: { value: 2, change: -0.3, trend: 'stable' },
        style_factor_performance: { value: 0.8, change: -0.1, trend: 'stable' },
        basis_spread: { value: 5, change: -1, trend: 'stable' },
        credit_spread_ig: { value: 80, change: -3, trend: 'improving' },
        credit_spread_hy: { value: 300, change: -10, trend: 'improving' },
        libor_ois_spread: { value: 5, change: -0.5, trend: 'stable' },
        cross_asset_correlation: { value: 0.15, change: -0.05, trend: 'stable' },
        vix_index: { value: 13, change: -1, trend: 'improving' },
      },
      liquidity_stress: {
        swap_spread_3y: { value: -38, change: -15, trend: 'deteriorating' },
        swap_spread_5y: { value: -28, change: -10, trend: 'deteriorating' },
        swap_spread_10y: { value: -22, change: -8, trend: 'deteriorating' },
        eur_usd_basis: { value: -18, change: -5, trend: 'watching' },
        jpy_usd_basis: { value: -22, change: -6, trend: 'watching' },
        market_depth: { value: 35, change: -25, trend: 'deteriorating' },
        bid_ask_spread: { value: 25, change: 15, trend: 'deteriorating' },
        on_off_run_spread: { value: 18, change: 10, trend: 'deteriorating' },
        style_factor_performance: { value: 8, change: 5, trend: 'deteriorating' },
        basis_spread: { value: 40, change: 20, trend: 'deteriorating' },
        credit_spread_ig: { value: 160, change: 40, trend: 'deteriorating' },
        credit_spread_hy: { value: 520, change: 120, trend: 'deteriorating' },
        libor_ois_spread: { value: 30, change: 15, trend: 'deteriorating' },
        cross_asset_correlation: { value: 0.55, change: 0.25, trend: 'deteriorating' },
        vix_index: { value: 32, change: 12, trend: 'deteriorating' },
      },
      systemic: {
        swap_spread_3y: { value: -65, change: -30, trend: 'deteriorating' },
        swap_spread_5y: { value: -50, change: -25, trend: 'deteriorating' },
        swap_spread_10y: { value: -40, change: -20, trend: 'deteriorating' },
        eur_usd_basis: { value: -110, change: -60, trend: 'deteriorating' },
        jpy_usd_basis: { value: -95, change: -50, trend: 'deteriorating' },
        market_depth: { value: 12, change: -40, trend: 'deteriorating' },
        bid_ask_spread: { value: 55, change: 35, trend: 'deteriorating' },
        on_off_run_spread: { value: 38, change: 25, trend: 'deteriorating' },
        style_factor_performance: { value: 22, change: 15, trend: 'deteriorating' },
        basis_spread: { value: 85, change: 50, trend: 'deteriorating' },
        credit_spread_ig: { value: 320, change: 150, trend: 'deteriorating' },
        credit_spread_hy: { value: 1100, change: 500, trend: 'deteriorating' },
        libor_ois_spread: { value: 90, change: 60, trend: 'deteriorating' },
        cross_asset_correlation: { value: 0.85, change: 0.45, trend: 'deteriorating' },
        vix_index: { value: 65, change: 35, trend: 'deteriorating' },
      },
    }
    setSnapshot(scenarios[level] || currentSnapshot)
    setTimeout(() => setIsSimulating(false), 500)
  }

  const resetToLive = () => {
    setSnapshot(currentSnapshot)
    setIsSimulating(false)
  }

  const tabs = [
    { id: 'dashboard', label: '监测仪表盘', labelEn: 'Dashboard' },
    { id: 'phases', label: '危机演进', labelEn: 'Crisis Phases' },
    { id: 'severity', label: '烈度判断', labelEn: 'Severity' },
    { id: 'history', label: '历史对比', labelEn: 'Historical' },
    { id: 'framework', label: '分析框架', labelEn: 'Framework' },
  ]

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header
        assessment={crisisAssessment}
        onSimulate={simulateCrisis}
        onReset={resetToLive}
        isSimulating={isSimulating}
      />

      {/* Tab Navigation */}
      <div className="border-b border-dark-border sticky top-0 bg-dark-bg/95 backdrop-blur-sm z-40">
        <div className="max-w-[1600px] mx-auto px-6">
          <nav className="flex gap-1 -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-xs text-gray-500 ml-1.5 hidden sm:inline">{tab.labelEn}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Row: Crisis Gauge + Alert Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <CrisisGauge assessment={crisisAssessment} />
              </div>
              <div className="lg:col-span-2">
                <AlertFeed alerts={alertLog} assessment={systemAssessment} />
              </div>
            </div>

            {/* Indicator Dashboard */}
            <IndicatorDashboard snapshot={snapshot} />
          </div>
        )}

        {activeTab === 'phases' && (
          <PhaseTimeline activePhases={activePhases} snapshot={snapshot} />
        )}

        {activeTab === 'severity' && (
          <SeverityWatershed snapshot={snapshot} assessment={crisisAssessment} />
        )}

        {activeTab === 'history' && (
          <HistoricalComparison snapshot={snapshot} />
        )}

        {activeTab === 'framework' && (
          <FrameworkPanel />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-border mt-12 py-6 text-center text-xs text-gray-500">
        <p>金融危机监测体系 v1.0 | 基于锦成盛资管分析框架构建</p>
        <p className="mt-1">核心理念：从微观交易结构和参与者行为机制出发，摒弃宏观"叙事陷阱"</p>
      </footer>
    </div>
  )
}
