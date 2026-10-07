import React, { useState } from 'react';
import {
  Activity,
  Layers,
  Users,
  Truck,
  DollarSign,
  ShieldAlert,
  Cpu,
  MessageSquare,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Sparkles,
  Sliders,
  TrendingUp,
  MapPin,
  RefreshCw,
  Clock,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MapVisualizer } from '../common/MapVisualizer';
import { DirectNegotiationModal } from '../common/DirectNegotiationModal';
import { defaultAIProvider } from '../../services/aiProvider';
import { AIAgentId, DeliveryRequest, DriverOffer } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    language,
    deliveries,
    activeDelivery,
    drivers,
    approveDriverVerification,
    settlements,
    platformFeePercentage,
    setPlatformFeePercentage,
    markSettlementSettled,
    generateNewSettlementCycle,
    aiAgents,
    toggleAgentStatus,
    aiApprovals,
    approveAIAction,
    rejectAIAction,
    aiAuditLogs,
    disputes,
    resolveDispute,
  } = useApp();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'MAP' | 'ORDERS' | 'COLLECTIONS' | 'AI_OPERATIONS' | 'AI_CHAT' | 'DISPUTES' | 'DRIVERS'
  >('OVERVIEW');

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; text: string; time: string; toolCall?: string }[]
  >([
    {
      role: 'assistant',
      text: '[DEMO DATA LOGISTICS COPILOT] System operational. 6 drivers registered, 3 active shipments monitored across Zagazig and 10th of Ramadan. Ready for inquiries on settlements, fleet capacity, and route exceptions.',
      time: '15:50',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Fee input state
  const [tempFeePct, setTempFeePct] = useState(platformFeePercentage);
  const [inspectionNegotiation, setInspectionNegotiation] = useState<{
    delivery: DeliveryRequest;
    offer: DriverOffer;
  } | null>(null);

  // Top metrics calculations
  const totalDeliveries = deliveries.length;
  const activeCount = deliveries.filter((d) => d.status !== 'DELIVERED' && d.status !== 'CANCELLED').length;
  const driversOnline = drivers.filter((d) => d.isOnline).length;
  const totalGrossCash = settlements.reduce((acc, s) => acc + s.totalCashCollected, 0);
  const totalPlatformFees = settlements.reduce((acc, s) => acc + s.platformFeeAmount, 0);
  const pendingApprovalsCount = aiApprovals.filter((a) => a.status === 'PENDING').length;
  const openDisputesCount = disputes.filter((d) => d.status === 'OPEN' || d.status === 'INVESTIGATING').length;

  const handleSendAiChat = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    const userMsg = {
      role: 'user' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsAiLoading(true);

    try {
      const res = await defaultAIProvider.runAgent('COLLECTIONS', text, {
        totalCashCollected: totalGrossCash,
        platformFeePercentage,
        outstandingBalance: 4889,
      });

      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: res.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolCall: res.toolCallExecuted,
        },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060c18] text-slate-900 dark:text-slate-100 pb-20 transition-colors">
      {/* Top Admin Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#081020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Operations Command Center</span>
                <span className="text-slate-400">·</span>
                <span className="font-mono">Zagazig & 10th of Ramadan Grid</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-0.5">
                {isAr ? 'لوحة التحكم والعمليات المركزية' : 'Central Logistics & AI Operations Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                5-Day Fee: <strong className="text-sky-600 dark:text-sky-400">{platformFeePercentage}%</strong>
              </span>
              <button
                onClick={generateNewSettlementCycle}
                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-sky-500" />
                <span>Run AI Reconciliation</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === 'OVERVIEW'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Overview & KPIs
            </button>
            <button
              onClick={() => setActiveTab('COLLECTIONS')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === 'COLLECTIONS'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              5-Day Collections & Fees ({platformFeePercentage}%)
            </button>
            <button
              onClick={() => setActiveTab('AI_OPERATIONS')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'AI_OPERATIONS'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-sky-500" />
              <span>AI Operations Control ({pendingApprovalsCount} Approvals)</span>
            </button>
            <button
              onClick={() => setActiveTab('AI_CHAT')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'AI_CHAT'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>AI Fleet Copilot</span>
            </button>
            <button
              onClick={() => setActiveTab('ORDERS')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === 'ORDERS'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Orders ({deliveries.length})
            </button>
            <button
              onClick={() => setActiveTab('DRIVERS')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === 'DRIVERS'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Driver Verification ({drivers.length})
            </button>
            <button
              onClick={() => setActiveTab('DISPUTES')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'DISPUTES'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Disputes ({openDisputesCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin View Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top 8 Key Logistics Metrics (from User Brief) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Active Deliveries</div>
            <div className="font-mono text-base font-extrabold text-sky-600 dark:text-sky-400 mt-0.5">
              {activeCount}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Orders Today</div>
            <div className="font-mono text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
              18
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Completed</div>
            <div className="font-mono text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              15
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Drivers Online</div>
            <div className="font-mono text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
              {driversOnline}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-semibold text-slate-400">5D Cash Pool</div>
            <div className="font-mono text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
              EGP {totalGrossCash.toLocaleString()}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Platform Fees</div>
            <div className="font-mono text-base font-extrabold text-sky-600 dark:text-sky-400 mt-0.5">
              EGP {totalPlatformFees.toFixed(0)}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-semibold text-slate-400">AI Approvals</div>
            <div className="font-mono text-base font-extrabold text-amber-500 mt-0.5">
              {pendingApprovalsCount}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Open Disputes</div>
            <div className="font-mono text-base font-extrabold text-rose-500 mt-0.5">
              {openDisputesCount}
            </div>
          </div>
        </div>

        {/* TAB: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Live Radar Map */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-500" />
                    <span>Real-Time Logistics Fleet Surveillance</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Live GPS Coordinates</span>
                </div>
                {activeDelivery && (
                  <MapVisualizer
                    pickup={activeDelivery.pickup}
                    dropoff={activeDelivery.dropoff}
                    vehicleType={activeDelivery.selectedVehicle}
                    driverName={activeDelivery.assignedDriver?.name}
                    statusText="Active Freight Dispatch"
                    className="h-[360px] w-full"
                  />
                )}
              </div>

              {/* Recent Orders Stream */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Cargo Deliveries</h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {deliveries.map((del) => (
                    <div key={del.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-mono font-bold text-sky-600 dark:text-sky-400">
                          {del.trackingNumber} · {del.description}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {del.pickup.city} → {del.dropoff.city} · {del.selectedVehicle} · Agreed EGP {del.agreedPrice}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-[11px]">
                        {del.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Configurable Fee & Fast AI Actions */}
            <div className="lg:col-span-4 space-y-4">
              {/* Platform Fee Control Box */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-sky-500" />
                    <span>Configurable Business Rule</span>
                  </h4>
                  <span className="font-mono text-sky-600 font-bold">PLATFORM_FEE_PERCENTAGE</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  The platform commission deducted from gross cash collections during 5-day cycle statements. Default is 3.0%.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="15"
                    value={tempFeePct}
                    onChange={(e) => setTempFeePct(Number(e.target.value))}
                    className="w-24 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-center"
                  />
                  <span className="font-bold text-slate-600 dark:text-slate-300">%</span>
                  <button
                    onClick={() => {
                      setPlatformFeePercentage(tempFeePct);
                      alert(`Platform fee updated to ${tempFeePct}%. New cycles will calculate using this rate.`);
                    }}
                    className="flex-1 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-colors"
                  >
                    Save Business Rule
                  </button>
                </div>
              </div>

              {/* Pending Human Approvals Queue */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-sky-500" />
                    <span>AI Propose / Human Approve</span>
                  </h4>
                  <span className="text-[10px] font-bold text-amber-500 font-mono">
                    {pendingApprovalsCount} Pending
                  </span>
                </div>

                <div className="space-y-3">
                  {aiApprovals
                    .filter((a) => a.status === 'PENDING')
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-2"
                      >
                        <div className="font-bold text-slate-900 dark:text-white">
                          {isAr ? item.titleAr : item.titleEn}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          {isAr ? item.summaryAr : item.summaryEn}
                        </p>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => approveAIAction(item.id)}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => rejectAIAction(item.id)}
                            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 font-semibold rounded flex items-center justify-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  {pendingApprovalsCount === 0 && (
                    <div className="text-slate-400 text-center py-4 italic">
                      All AI proposed actions reviewed and executed.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: 5-DAY COLLECTIONS MODULE */}
        {activeTab === 'COLLECTIONS' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    SETTLEMENTS & CASH COLLECTIONS ENGINE
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-0.5">
                    5-Day Settlement Reconciliation Cycle
                  </h3>
                  <p className="text-slate-500">
                    Governed by rule PLATFORM_FEE_PERCENTAGE = {platformFeePercentage}%
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={generateNewSettlementCycle}
                    className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Generate New 5-Day Statement Batch</span>
                  </button>
                </div>
              </div>

              {/* Collections Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                      <th className="pb-3">Statement ID</th>
                      <th className="pb-3">Driver Partner</th>
                      <th className="pb-3">Cycle Window</th>
                      <th className="pb-3">Trips</th>
                      <th className="pb-3">Cash Collected</th>
                      <th className="pb-3">Fee ({platformFeePercentage}%)</th>
                      <th className="pb-3">Driver Net</th>
                      <th className="pb-3">Outstanding Remittance</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {settlements.map((stl) => (
                      <tr key={stl.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 font-mono font-bold text-sky-600 dark:text-sky-400">
                          {stl.id}
                        </td>
                        <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                          {stl.driverName}
                        </td>
                        <td className="py-3.5 text-slate-500 font-mono text-[11px]">
                          {stl.periodStart} → {stl.periodEnd}
                        </td>
                        <td className="py-3.5 font-mono">{stl.completedDeliveriesCount}</td>
                        <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                          EGP {stl.totalCashCollected.toLocaleString()}
                        </td>
                        <td className="py-3.5 font-mono font-bold text-sky-600 dark:text-sky-400">
                          EGP {stl.platformFeeAmount.toFixed(2)}
                        </td>
                        <td className="py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          EGP {stl.driverNetEarnings.toFixed(2)}
                        </td>
                        <td className="py-3.5 font-mono font-bold">
                          EGP {stl.outstandingBalance.toFixed(2)}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              stl.status === 'SETTLED'
                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                                : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                            }`}
                          >
                            {stl.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          {stl.status !== 'SETTLED' ? (
                            <button
                              onClick={() => markSettlementSettled(stl.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold"
                            >
                              Mark Settled
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[11px] font-mono">Closed ✓</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: AI OPERATIONS CONTROL CENTER */}
        {activeTab === 'AI_OPERATIONS' && (
          <div className="space-y-6">
            {/* The 7 Agents Monitor Cards */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Active AI Agents Operational Status
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time execution telemetry and task success rates
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-sky-600">7 Registered Agents</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {aiAgents.map((ag) => (
                  <div
                    key={ag.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white">{ag.nameEn}</h4>
                      <button
                        onClick={() => toggleAgentStatus(ag.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ag.status === 'ACTIVE'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                        }`}
                      >
                        {ag.status}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">{ag.roleEn}</p>
                    <div className="grid grid-cols-3 gap-1 text-[11px] font-mono pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div>Tasks: {ag.tasksToday}</div>
                      <div>Pass: {ag.successfulActions}</div>
                      <div>Acc: {ag.accuracyRate}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Audit Logs Table */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Immutable AI Audit Logs
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase text-slate-400">
                      <th className="pb-2">Time</th>
                      <th className="pb-2">Agent</th>
                      <th className="pb-2">Tool Executed</th>
                      <th className="pb-2">Input Details</th>
                      <th className="pb-2">Result</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                    {aiAuditLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="py-2.5 text-slate-400">{log.timestamp}</td>
                        <td className="py-2.5 font-bold font-sans text-slate-900 dark:text-white">
                          {log.agentName}
                        </td>
                        <td className="py-2.5 text-sky-600 dark:text-sky-400">{log.toolUsed}</td>
                        <td className="py-2.5 text-slate-600 dark:text-slate-300 font-sans">{log.inputSummary}</td>
                        <td className="py-2.5 text-slate-500 font-sans">{log.outputSummary}</td>
                        <td className="py-2.5">
                          <span className="text-emerald-600 font-bold">{log.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: AI CHAT ASSISTANT */}
        {activeTab === 'AI_CHAT' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Interactive Logistics Copilot
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Query active shipments, calculate driver collections, or simulate vehicle dispatches
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-sky-600 font-mono">DEMO INTELLIGENCE</span>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => handleSendAiChat('How much do we need to collect from drivers this week?')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors"
              >
                "How much do we need to collect from drivers this week?"
              </button>
              <button
                onClick={() => handleSendAiChat('Which drivers are currently near Zagazig and available for pickup?')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors"
              >
                "Which drivers are near Zagazig?"
              </button>
              <button
                onClick={() => handleSendAiChat('Are there any late shipments or road bottlenecks right now?')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors"
              >
                "Any delivery delays on Belbeis road?"
              </button>
            </div>

            {/* Chat Box */}
            <div className="h-80 overflow-y-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xl p-3.5 rounded-xl space-y-1 ${
                      msg.role === 'user'
                        ? 'bg-sky-600 text-white font-medium'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    {msg.toolCall && (
                      <div className="text-[10px] font-mono text-sky-600 dark:text-sky-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                        Executed tool: {msg.toolCall}
                      </div>
                    )}
                    <span className="text-[10px] opacity-60 block text-right">{msg.time}</span>
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="text-slate-400 italic flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-sky-500" />
                  <span>AI Agent processing operational database query...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendAiChat();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about active shipments, drivers, collections, or vehicle capacity..."
                className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium text-xs"
              />
              <button
                type="submit"
                disabled={isAiLoading}
                className="px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB: DISPUTES */}
        {activeTab === 'DISPUTES' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 text-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Dispute Investigation Desk
            </h3>
            <div className="space-y-4">
              {disputes.map((dsp) => (
                <div
                  key={dsp.id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-rose-600">Case #{dsp.id}</span>
                      <span className="text-slate-400 mx-2">·</span>
                      <span className="font-bold text-slate-900 dark:text-white">{dsp.type}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      Claimed: EGP {dsp.claimedAmountEgp}
                    </span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300">{dsp.description}</p>

                  <div className="space-y-1 text-[11px] text-slate-500 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Evidence Chain of Custody:
                    </span>
                    {dsp.evidenceTimeline.map((ev, i) => (
                      <div key={i}>• {ev}</div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => resolveDispute(dsp.id, 'Claim reimbursed via platform cargo guarantee')}
                      className="px-4 py-2 bg-sky-600 text-white font-bold rounded-lg"
                    >
                      Resolve Case
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: DRIVERS VERIFICATION */}
        {activeTab === 'DRIVERS' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Driver Onboarding & License Audit
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {drivers.map((drv) => (
                <div key={drv.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={drv.avatar}
                      alt={drv.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{drv.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">({drv.phone})</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {drv.vehicleModel} · Plate: {drv.vehiclePlate} · Deliveries: {drv.completedDeliveries}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        drv.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                      }`}
                    >
                      {drv.verificationStatus}
                    </span>
                    {drv.verificationStatus === 'PENDING' && (
                      <button
                        onClick={() => approveDriverVerification(drv.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded"
                      >
                        Approve License
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: ORDERS TABLE */}
        {activeTab === 'ORDERS' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              All Shipment Records
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase text-slate-400">
                    <th className="pb-2">Track #</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Route</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Vehicle</th>
                    <th className="pb-2">Fare</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Negotiation Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {deliveries.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-mono font-bold text-sky-600 dark:text-sky-400">
                        {d.trackingNumber}
                      </td>
                      <td className="py-3 font-medium text-slate-900 dark:text-white">
                        {d.customerName}
                      </td>
                      <td className="py-3 text-slate-500">
                        {d.pickup.city} → {d.dropoff.city}
                      </td>
                      <td className="py-3">{d.shipmentCategory}</td>
                      <td className="py-3">{d.selectedVehicle}</td>
                      <td className="py-3 font-mono font-bold">EGP {d.agreedPrice}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {d.offers.length > 0 ? (
                          <button
                            onClick={() =>
                              setInspectionNegotiation({
                                delivery: d,
                                offer: d.offers[0],
                              })
                            }
                            className="px-2.5 py-1 rounded bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-bold text-[10px] hover:bg-sky-100 transition-colors"
                          >
                            Rounds ({d.offers[0]?.negotiationHistory?.length || 1})
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[10px] font-mono">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Admin Negotiation Inspector Modal */}
      {inspectionNegotiation && (
        <DirectNegotiationModal
          isOpen={!!inspectionNegotiation}
          onClose={() => setInspectionNegotiation(null)}
          delivery={inspectionNegotiation.delivery}
          offer={inspectionNegotiation.offer}
          userRole="CUSTOMER"
        />
      )}
    </div>
  );
};
