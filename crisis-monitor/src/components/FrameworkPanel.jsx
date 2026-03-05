import React, { useState } from 'react'
import { CRISIS_CAUSES_FRAMEWORK } from '../data/monitoringFramework'

function AccordionSection({ title, subtitle, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="indicator-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <span className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-dark-border">
          {children}
        </div>
      )}
    </div>
  )
}

export default function FrameworkPanel() {
  const fw = CRISIS_CAUSES_FRAMEWORK

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-100">分析框架与理论支撑</h2>
        <p className="text-sm text-gray-500 mt-1">
          Analytical Framework — 锦成盛资管"从微观结构到系统性判断"方法论
        </p>
      </div>

      {/* Core Philosophy */}
      <div className="indicator-card border-l-4 border-l-purple-500">
        <h3 className="text-sm font-semibold text-purple-400 mb-2">核心理念</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          从<strong>微观交易结构和参与者行为机制</strong>出发理解和判断危机，
          而非依赖宏观层面的"叙事陷阱"。关注的不是"发生了什么事件"，
          而是"市场微观结构正在发生什么变化"。
        </p>
      </div>

      {/* Framework sections */}
      <div className="space-y-4">
        <AccordionSection
          title={fw.microStructure.name}
          subtitle="做市商行为与死亡螺旋"
          defaultOpen={true}
        >
          <p className="text-sm text-gray-400 mb-4">{fw.microStructure.description}</p>
          <div className="text-xs text-gray-500 mb-3 font-medium">死亡螺旋传导链:</div>
          <div className="relative pl-4">
            {fw.microStructure.deathSpiral.map((step, i) => (
              <div key={i} className="relative pb-4 last:pb-0">
                {i < fw.microStructure.deathSpiral.length - 1 && (
                  <div className="absolute left-0 top-3 w-0.5 h-full bg-red-900/50 -ml-2" />
                )}
                <div className="flex items-center gap-3">
                  <div className="relative z-10 w-4 h-4 rounded-full bg-red-900/50 border border-red-700 flex items-center justify-center text-xs text-red-400 -ml-4">
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-300">{step}</span>
                </div>
              </div>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection
          title={fw.leverageCarry.name}
          subtitle={fw.leverageCarry.quote}
        >
          <p className="text-sm text-gray-400 mb-4">{fw.leverageCarry.description}</p>
          <blockquote className="text-sm text-orange-400/80 italic border-l-2 border-orange-800 pl-3 mb-4">
            "{fw.leverageCarry.quote}"
          </blockquote>
          <div className="text-xs text-gray-500 mb-3 font-medium">当前案例:</div>
          <div className="space-y-2">
            {fw.leverageCarry.examples.map((ex, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-dark-bg/60">
                <span className="text-xs px-2 py-0.5 rounded bg-orange-900/30 text-orange-400 whitespace-nowrap">
                  {ex.market}
                </span>
                <span className="text-xs text-gray-500">{ex.period}</span>
                <span className="text-sm text-gray-300 flex-1">{ex.risk}</span>
              </div>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection
          title={fw.structuralHomogeneity.name}
          subtitle="量化趋同与"机器抱团""
        >
          <p className="text-sm text-gray-400 mb-3">{fw.structuralHomogeneity.description}</p>
          <div className="px-3 py-2.5 rounded-lg bg-dark-bg/60 text-sm text-gray-300">
            <span className="text-yellow-400/80">放大效应:</span> {fw.structuralHomogeneity.amplification}
          </div>
        </AccordionSection>

        <AccordionSection
          title={fw.macroShifts.name}
          subtitle="结构性变化而非周期性波动"
        >
          <div className="space-y-2">
            {fw.macroShifts.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm">
                <span className="text-blue-500 mt-0.5">●</span>
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection
          title={fw.antiPatterns.name}
          subtitle="不要掉入这些陷阱"
        >
          <div className="space-y-2">
            {fw.antiPatterns.traps.map((trap, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm px-3 py-2.5 rounded-lg bg-red-900/10 border border-red-900/20">
                <span className="text-red-500 mt-0.5">✕</span>
                <span className="text-gray-300">{trap}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            这些"叙事陷阱"看似逻辑自洽，但忽略了微观结构的实际状态。
            正确的分析方法是先看市场微观结构数据，再结合宏观背景进行判断。
          </p>
        </AccordionSection>
      </div>

      {/* Methodology summary */}
      <div className="indicator-card border-t-2 border-t-blue-500">
        <h3 className="text-sm font-semibold text-gray-200 mb-3">方法论总结</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-dark-bg/50">
            <div className="text-2xl mb-1">🔬</div>
            <div className="text-sm font-medium text-gray-200">微观优先</div>
            <div className="text-xs text-gray-500 mt-1">先看交易结构数据，再做宏观判断</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-dark-bg/50">
            <div className="text-2xl mb-1">🧭</div>
            <div className="text-sm font-medium text-gray-200">分水岭判断</div>
            <div className="text-xs text-gray-500 mt-1">用货币基差区分流动性紧张vs系统性危机</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-dark-bg/50">
            <div className="text-2xl mb-1">⚙️</div>
            <div className="text-sm font-medium text-gray-200">机制驱动</div>
            <div className="text-xs text-gray-500 mt-1">理解Dealer行为机制，而非追逐叙事</div>
          </div>
        </div>
      </div>
    </div>
  )
}
