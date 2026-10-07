import React, { useState } from 'react';
import {
  Database,
  Smartphone,
  Server,
  Cpu,
  Layers,
  Code2,
  FileCode,
  CheckCircle2,
  Lock,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SystemSpecsPortal: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'DATABASE' | 'API' | 'MOBILE' | 'AI_ARCH' | 'DEPLOYMENT'>('DATABASE');

  const databaseEntities = [
    {
      name: 'users',
      purpose: 'Core identity, phone OTP credential, role RBAC (CUSTOMER, DRIVER, ADMIN, OPS)',
      fields: ['id (uuid)', 'phone (varchar)', 'full_name', 'role (enum)', 'is_active', 'created_at'],
    },
    {
      name: 'drivers',
      purpose: 'Courier profile, current geohash, active shift status, rating metrics',
      fields: ['id', 'user_id (fk)', 'vehicle_id (fk)', 'is_online (bool)', 'rating (numeric)', 'completed_trips', 'wallet_balance'],
    },
    {
      name: 'vehicles',
      purpose: 'Fleet asset registration, cargo category, payload limit, inspection certificate',
      fields: ['id', 'category (enum)', 'plate_number', 'model_year', 'max_weight_kg', 'cubic_meters', 'is_verified'],
    },
    {
      name: 'deliveries',
      purpose: 'Shipment contract, route waypoints, dimensions, agreed fare, status FSM',
      fields: ['id', 'tracking_number', 'customer_id (fk)', 'driver_id (fk)', 'status (enum)', 'pickup_otp', 'dropoff_otp', 'agreed_price'],
    },
    {
      name: 'delivery_offers',
      purpose: 'Marketplace bidding records, driver counter-offers, arrival ETA minutes',
      fields: ['id', 'delivery_id (fk)', 'driver_id (fk)', 'proposed_price', 'eta_minutes', 'message', 'created_at'],
    },
    {
      name: 'settlements',
      purpose: '5-Day cycle financial reconciliation, 3% platform fee, driver net payout',
      fields: ['id', 'driver_id (fk)', 'period_start', 'period_end', 'total_cash_collected', 'platform_fee_pct', 'platform_fee_amount', 'status'],
    },
    {
      name: 'ai_approvals',
      purpose: 'Human-in-the-loop governance queue for sensitive financial/operational tasks',
      fields: ['id', 'agent_id', 'title', 'financial_impact', 'risk_level', 'status (PENDING/APPROVED/REJECTED)', 'human_reviewer_id'],
    },
    {
      name: 'audit_logs',
      purpose: 'Immutable event log for all platform mutations and AI agent tool invocations',
      fields: ['id', 'actor_type', 'actor_id', 'action', 'tool_name', 'input_payload (jsonb)', 'output_payload (jsonb)', 'timestamp'],
    },
  ];

  const apiEndpoints = [
    { method: 'POST', path: '/api/v1/auth/phone-otp', desc: 'Request 6-digit SMS verification code' },
    { method: 'POST', path: '/api/v1/deliveries/quote', desc: 'AI-assisted vehicle recommendation & market price estimation' },
    { method: 'POST', path: '/api/v1/deliveries', desc: 'Create delivery request and broadcast to eligible hauler pool' },
    { method: 'POST', path: '/api/v1/deliveries/:id/offers', desc: 'Submit driver marketplace counter-offer or accept fare' },
    { method: 'POST', path: '/api/v1/deliveries/:id/accept-offer', desc: 'Customer selects driver and locks dispatch contract' },
    { method: 'POST', path: '/api/v1/deliveries/:id/verify-otp', desc: 'Validate pickup or dropoff 6-digit OTP token' },
    { method: 'GET',  path: '/api/v1/settlements/5-day-cycle', desc: 'Generate 5-day driver statement with 3% platform fee calculation' },
    { method: 'POST', path: '/api/v1/ai/agent-run', desc: 'Invoke AI agent workflow with human approval enforcement' },
    { method: 'WS',   path: 'wss://gateway/fleet/telemetry', desc: 'Real-time WebSocket GPS telemetry stream & bidding broadcasts' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060c18] text-slate-900 dark:text-slate-100 pb-20 transition-colors">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#081020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
            <Cpu className="w-4 h-4" />
            <span>Founding Engineering Blueprints</span>
            <span className="text-slate-400">·</span>
            <span className="font-mono">Production Architecture v2.6</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Request Delivery System Architecture & Technical Specifications
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Complete technical blueprint covering the relational PostgreSQL schema, NestJS backend API,
            React Native + Expo mobile client architecture, and the provider-agnostic AI agent layer.
          </p>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('DATABASE')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'DATABASE'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              PostgreSQL Relational Schema
            </button>
            <button
              onClick={() => setActiveTab('MOBILE')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'MOBILE'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              React Native + Expo Mobile Strategy
            </button>
            <button
              onClick={() => setActiveTab('API')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'API'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              NestJS REST & WebSocket API
            </button>
            <button
              onClick={() => setActiveTab('AI_ARCH')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'AI_ARCH'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              AI Provider Abstraction Layer
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 text-xs">
        {/* TAB 1: DATABASE */}
        {activeTab === 'DATABASE' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-sky-500" />
                  <span>Relational Entities & Table Architecture</span>
                </h3>
                <span className="font-mono text-slate-400">PostgreSQL 16 + PostGIS</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Strict relational integrity with PostGIS spatial indexes (geohashing) for driver proximity
                queries and immutable ledger tables for driver cash collections and 5-day cycle statements.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {databaseEntities.map((ent) => (
                  <div
                    key={ent.name}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-sm">
                        TABLE {ent.name}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">{ent.purpose}</p>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-1">
                      {ent.fields.map((f, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[10px]"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MOBILE APPS ARCHITECTURE */}
        {activeTab === 'MOBILE' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-sky-500" />
                <span>Mobile Strategy: React Native + Expo + TypeScript</span>
              </h3>
              <span className="font-mono text-sky-600 font-bold">Recommended Architecture</span>
            </div>

            <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 space-y-2">
              <h4 className="font-bold text-sky-900 dark:text-sky-200 text-sm">
                Why React Native + Expo was selected over Flutter:
              </h4>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-xs">
                <li>
                  <strong>1. Zero Logic Duplication:</strong> Shares 100% of TypeScript DTOs, Zod validation
                  schemas, vehicle pricing formulas, and AIProvider interfaces between web and mobile.
                </li>
                <li>
                  <strong>2. Background Telemetry:</strong> Expo Location TaskManager provides native Android and
                  iOS background GPS tracking for drivers even when the app is locked or screen is off.
                </li>
                <li>
                  <strong>3. Seamless Push Notifications:</strong> Unified Expo Push Notifications infrastructure
                  for OTP handshakes, incoming driver counter-offers, and 5-day cycle collection alerts.
                </li>
                <li>
                  <strong>4. Fast Iteration & OTA Updates:</strong> Instant Over-The-Air updates for urgent
                  operational rule changes without waiting for 48-hour App Store review cycles.
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">Customer Mobile App (iOS / Android)</h4>
                <p className="text-slate-500 text-[11px]">
                  Minimalist one-thumb booking, live Google Maps route tracking, biometric token storage, and
                  recipient OTP sharing via native WhatsApp intents.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">Driver Partner App (iOS / Android)</h4>
                <p className="text-slate-500 text-[11px]">
                  High-contrast sunlight mode, turn-by-turn navigation deep linking (Google Maps / Waze), native
                  camera inspection captures, and 5-day cash collection wallet.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: API SPEC */}
        {activeTab === 'API' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-sky-500" />
                <span>NestJS Enterprise REST & Real-Time Gateway</span>
              </h3>
              <span className="font-mono text-slate-400">OpenAPI 3.1 Specification</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {apiEndpoints.map((ep, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        ep.method === 'POST'
                          ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                          : ep.method === 'GET'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{ep.path}</span>
                  </div>
                  <span className="text-slate-500 font-sans text-xs">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AI ARCHITECTURE */}
        {activeTab === 'AI_ARCH' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-500" />
                <span>Pluggable AIProvider Architecture</span>
              </h3>
              <span className="font-mono text-sky-600 font-bold">Provider-Agnostic Interface</span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To prevent vendor lock-in, all AI capabilities are encapsulated in an abstract{' '}
              <code className="font-mono text-sky-600">AIProvider</code> contract. The system seamlessly
              switches between Google Gemini, Claude, and on-premise models, while enforcing tool execution
              schemas and supervisor approvals for all financial settlements.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto space-y-1">
              <div className="text-slate-400">// Unified AI Provider Interface</div>
              <div className="text-sky-400">export interface AIProvider {'{'}</div>
              <div className="pl-4">name: string;</div>
              <div className="pl-4">chat(messages: AIChatMessage[], context?: Record&lt;string, any&gt;): Promise&lt;string&gt;;</div>
              <div className="pl-4">generateStructuredOutput&lt;T&gt;(prompt: string, schema: string): Promise&lt;T&gt;;</div>
              <div className="pl-4">runAgent(agentId: AIAgentId, query: string, ctx: any): Promise&lt;AgentResult&gt;;</div>
              <div className="pl-4">recommendVehicle(shipment: CargoSpecs): Promise&lt;VehicleFit&gt;;</div>
              <div className="pl-4">calculateSettlement(driverData: SettlementParams): SettlementResult;</div>
              <div className="text-sky-400">{'}'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
