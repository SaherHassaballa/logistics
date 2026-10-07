import React from 'react';
import {
  Cpu,
  ShieldCheck,
  CheckCircle,
  FileSearch,
  Scale,
  Radar,
  Users2,
  DollarSign,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIAgentId } from '../../types';

export const AIOperationsSection: React.FC = () => {
  const { language, setCurrentView, aiAgents } = useApp();
  const isAr = language === 'ar';

  const agentIcons: Record<AIAgentId, any> = {
    CUSTOMER_SUPPORT: Users2,
    OPERATIONS: Radar,
    COLLECTIONS: DollarSign,
    DELIVERY_DISCOVERY: FileSearch,
    DISPATCH: Cpu,
    MANAGEMENT: Scale,
    CUSTOMER_COMMUNICATION: ShieldCheck,
  };

  return (
    <section id="ai-operations" className="py-20 border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-[#070e1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400"></span>
            <span>{isAr ? 'الطبقة التشغيلية الذكية' : 'AI-Native Operational Layer'}</span>
            <span className="text-slate-400">·</span>
            <span>{isAr ? 'إشراف بشري كامل' : 'Human-in-the-Loop Governance'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAr
              ? 'الذكاء الاصطناعي كطبقة تشغيل لوجستية، وليس كبرمجية غير منضبطة'
              : 'An Intelligent Operational Layer. Governed by Human Rules.'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isAr
              ? 'لا يقتصر Request Delivery على كونه سوقاً للشحن؛ بل هو نظام تشغيل لوجستي متكامل تعمل فيه 7 وكلاء ذكاء اصطناعي جنباً إلى جنب مع مسؤولي العمليات، مع اشتراط الموافقة البشرية على أي قرار مالي أو استثنائي.'
              : 'Request Delivery operates an AI agent layer that works alongside human fleet managers. High-impact actions like financial settlements, driver suspensions, and waiver credits strictly require human approval.'}
          </p>
        </div>

        {/* The 7 AI Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {aiAgents.slice(0, 6).map((agent) => {
            const Icon = agentIcons[agent.id] || Cpu;
            return (
              <div
                key={agent.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm space-y-3 hover:border-sky-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                        {isAr ? agent.nameAr : agent.nameEn}
                      </h3>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {agent.tasksToday} tasks today
                      </div>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Active</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isAr ? agent.roleAr : agent.roleEn}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Accuracy: <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{agent.accuracyRate}%</span></span>
                  <span>Approval req: <span className="font-mono font-medium">{agent.pendingApprovals > 0 ? 'Enforced' : 'None'}</span></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Human-in-the-Loop Governance Workflow Callout */}
        <div className="rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-gradient-to-r from-sky-50 via-white to-sky-50 dark:from-slate-900 dark:via-[#09152b] dark:to-slate-900 p-6 lg:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                <Lock className="w-3.5 h-3.5" />
                <span>{isAr ? 'نموذج الحوكمة والتحكم البشري الصارم' : 'Strict Human-in-the-Loop Verification'}</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {isAr
                  ? 'يقترح الذكاء الاصطناعي ← يفحص النظام القواعد ← يعتمد المسؤول البشري ← يُنفذ القرار'
                  : 'AI Proposes → System Validates → Human Approves → Action Executes'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAr
                  ? 'لا يمتلك أي وكيل ذكاء اصطناعي تصريحاً لتسوية المبالغ أو تعديل الرسوم أو تجميد حساب كابتن بشكل مستقل دون موافقة مدير العمليات وتوثيق العملية في سجل التدقيق غير القابل للتعديل.'
                  : 'Sensitive financial adjustments, waivers, suspensions, and disputes are placed in an operational approval queue. All decisions create immutable audit logs.'}
              </p>
            </div>

            <button
              onClick={() => setCurrentView('ADMIN_DASHBOARD')}
              className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center gap-2 whitespace-nowrap transition-all"
            >
              <span>{isAr ? 'استعراض مركز التحكم بالذكاء الاصطناعي' : 'Explore AI Control Center'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
