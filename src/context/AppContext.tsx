import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AppLanguage,
  AppTheme,
  UserRole,
  AppView,
  DeliveryRequest,
  DriverProfile,
  SettlementStatement,
  AIAgentInfo,
  AIApprovalItem,
  AIAuditLogEntry,
  DisputeCase,
  DeliveryStatus,
  DriverOffer,
  VehicleCategory,
  ShipmentCategory,
} from '../types';
import {
  MOCK_ACTIVE_DELIVERIES,
  MOCK_DRIVERS,
  MOCK_SETTLEMENTS,
  MOCK_AI_AGENTS,
  MOCK_AI_APPROVALS,
  MOCK_AI_AUDIT_LOGS,
  MOCK_DISPUTES,
} from '../data/mockData';

interface AppContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  deliveries: DeliveryRequest[];
  activeDelivery: DeliveryRequest | null;
  setActiveDeliveryId: (id: string | null) => void;
  createDeliveryRequest: (req: Partial<DeliveryRequest>) => DeliveryRequest;
  submitDriverOffer: (deliveryId: string, offer: Omit<DriverOffer, 'id' | 'createdAt'>) => void;
  submitCounterOffer: (
    deliveryId: string,
    offerId: string,
    counterPrice: number,
    proposedBy: 'CUSTOMER' | 'DRIVER',
    note?: string
  ) => void;
  acceptDriverOffer: (deliveryId: string, offerId: string) => void;
  declineOffer: (deliveryId: string, offerId: string, declinedBy: 'CUSTOMER' | 'DRIVER') => void;
  updateDeliveryStatus: (
    deliveryId: string,
    status: DeliveryStatus,
    note?: string,
    photoUrl?: string
  ) => void;
  verifyDeliveryOtp: (
    deliveryId: string,
    otpCode: string,
    step: 'PICKUP' | 'DROPOFF'
  ) => { success: boolean; message: string };

  drivers: DriverProfile[];
  updateDriverStatus: (driverId: string, isOnline: boolean) => void;
  approveDriverVerification: (driverId: string) => void;

  platformFeePercentage: number;
  setPlatformFeePercentage: (pct: number) => void;
  settlements: SettlementStatement[];
  markSettlementSettled: (id: string) => void;
  generateNewSettlementCycle: () => void;

  aiAgents: AIAgentInfo[];
  toggleAgentStatus: (agentId: string) => void;
  aiApprovals: AIApprovalItem[];
  approveAIAction: (id: string) => void;
  rejectAIAction: (id: string) => void;
  aiAuditLogs: AIAuditLogEntry[];
  addAuditLog: (entry: Omit<AIAuditLogEntry, 'id' | 'timestamp'>) => void;

  disputes: DisputeCase[];
  resolveDispute: (id: string, resolution: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<AppTheme>('light');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [currentRole, setCurrentRole] = useState<UserRole>('CUSTOMER');
  const [currentView, setCurrentView] = useState<AppView>('WEBSITE');

  const [deliveries, setDeliveries] = useState<DeliveryRequest[]>(MOCK_ACTIVE_DELIVERIES);
  const [activeDeliveryId, setActiveDeliveryId] = useState<string | null>('del-101');
  const [drivers, setDrivers] = useState<DriverProfile[]>(MOCK_DRIVERS);
  const [platformFeePercentage, setPlatformFeePercentage] = useState<number>(3.0);
  const [settlements, setSettlements] = useState<SettlementStatement[]>(MOCK_SETTLEMENTS);
  const [aiAgents, setAiAgents] = useState<AIAgentInfo[]>(MOCK_AI_AGENTS);
  const [aiApprovals, setAiApprovals] = useState<AIApprovalItem[]>(MOCK_AI_APPROVALS);
  const [aiAuditLogs, setAiAuditLogs] = useState<AIAuditLogEntry[]>(MOCK_AI_AUDIT_LOGS);
  const [disputes, setDisputes] = useState<DisputeCase[]>(MOCK_DISPUTES);

  // Sync theme with DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync language and dir with DOM
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const activeDelivery = deliveries.find((d) => d.id === activeDeliveryId) || null;

  const createDeliveryRequest = (req: Partial<DeliveryRequest>): DeliveryRequest => {
    const newId = `del-${Date.now().toString().slice(-4)}`;
    const randomTrack = `RD-EG-${Math.floor(10000 + Math.random() * 90000)}`;
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const dropoffOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const stopsList: DeliveryStop[] = req.stops && req.stops.length >= 2
      ? req.stops
      : [
          {
            id: `stop-${Date.now()}-0`,
            type: 'PICKUP',
            sequence: 0,
            title: 'Pickup Location',
            address: req.pickup?.address || 'Zagazig Warehouse Hub',
            city: req.pickup?.city || 'Zagazig',
            lat: req.pickup?.lat || 30.5877,
            lng: req.pickup?.lng || 31.502,
            contactName: req.customerName || 'Ahmed Mostafa',
            contactPhone: req.customerPhone || '+20 100 000 1234',
          },
          {
            id: `stop-${Date.now()}-1`,
            type: 'DROPOFF',
            sequence: 1,
            title: 'Final Destination',
            address: req.dropoff?.address || '10th of Ramadan Heavy Bay',
            city: req.dropoff?.city || '10th of Ramadan',
            lat: req.dropoff?.lat || 30.3015,
            lng: req.dropoff?.lng || 31.7428,
            contactName: req.dropoff?.contactName || 'Mohamed El-Sayed',
            contactPhone: req.dropoff?.contactPhone || '+20 111 222 3333',
          },
        ];

    const customerPrice = Number(req.customerOfferPrice || req.estimatedPrice || 400);

    const newDelivery: DeliveryRequest = {
      id: newId,
      trackingNumber: randomTrack,
      customerId: 'cust-current',
      customerName: req.customerName || 'Ahmed Mostafa',
      customerPhone: req.customerPhone || '+20 100 000 1234',
      pickup: {
        address: stopsList[0].address,
        addressAr: stopsList[0].addressAr,
        city: stopsList[0].city,
        lat: stopsList[0].lat,
        lng: stopsList[0].lng,
        contactName: stopsList[0].contactName,
        contactPhone: stopsList[0].contactPhone,
        notes: stopsList[0].instructions,
      },
      dropoff: {
        address: stopsList[stopsList.length - 1].address,
        addressAr: stopsList[stopsList.length - 1].addressAr,
        city: stopsList[stopsList.length - 1].city,
        lat: stopsList[stopsList.length - 1].lat,
        lng: stopsList[stopsList.length - 1].lng,
        contactName: stopsList[stopsList.length - 1].contactName,
        contactPhone: stopsList[stopsList.length - 1].contactPhone,
        notes: stopsList[stopsList.length - 1].instructions,
      },
      stops: stopsList,
      estimatedDrivingMinutes: req.estimatedDrivingMinutes || Math.round((req.distanceKm || 40) * 1.5),
      shipmentCategory: req.shipmentCategory || 'PERSONAL_PACKAGE',
      description: req.description || 'General packaged goods',
      weightKg: req.weightKg || 45,
      dimensionsCm: req.dimensionsCm || { length: 50, width: 40, height: 30 },
      quantity: req.quantity || 1,
      specialHandling: req.specialHandling || {},
      recommendedVehicle: req.recommendedVehicle || 'PICKUP',
      selectedVehicle: req.selectedVehicle || req.recommendedVehicle || 'PICKUP',
      distanceKm: req.distanceKm || 38.5,
      estimatedPrice: req.estimatedPrice || customerPrice,
      customerOfferPrice: customerPrice,
      agreedPrice: customerPrice,
      pricingMode: req.pricingMode || 'CUSTOMER_OFFER',
      status: 'OFFERS_RECEIVED',
      pickupOtp,
      dropoffOtp,
      timeline: [
        {
          status: 'BROADCASTING',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'Shipment Created',
          titleAr: 'تم إنشاء طلب الشحن ونشره للسائقين',
          description: `Customer proposed EGP ${customerPrice} across ${stopsList.length} stops`,
          descriptionAr: `عرض العميل سعر ${customerPrice} ج.م عبر ${stopsList.length} محطات`,
          actor: 'Customer',
        },
      ],
      offers: [
        {
          id: `off-${Date.now()}-1`,
          deliveryId: newId,
          driverId: 'drv-01',
          driverName: 'Ahmed Hassan (أحمد حسن)',
          driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          driverPhone: '+20 100 482 9101',
          driverRating: 4.95,
          completedDeliveries: 342,
          vehicleType: req.selectedVehicle || 'PICKUP',
          vehicleModel: 'Chevrolet T-Series Pickup',
          vehiclePlate: 'ط ص ع 4819',
          distanceFromPickupKm: 2.4,
          proposedPrice: Math.round(customerPrice + 50),
          initialCustomerPrice: customerPrice,
          etaMinutes: 8,
          message: 'Nearby in Zagazig, equipped with cargo straps and ready to load immediately.',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 300000).toISOString(),
          status: 'PENDING',
          negotiationHistory: [
            {
              id: `neg-${Date.now()}-1`,
              roundNumber: 1,
              proposedBy: 'CUSTOMER',
              proposerName: req.customerName || 'Customer',
              amountEgp: customerPrice,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'OFFER',
            },
            {
              id: `neg-${Date.now()}-2`,
              roundNumber: 2,
              proposedBy: 'DRIVER',
              proposerName: 'Ahmed Hassan',
              amountEgp: Math.round(customerPrice + 50),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'COUNTER_OFFER',
              note: 'Counter-offer (+EGP 50) based on cargo weight & multi-stop route',
            },
          ],
        },
        {
          id: `off-${Date.now()}-2`,
          deliveryId: newId,
          driverId: 'drv-02',
          driverName: 'Mohamed El-Sayed (محمد السيد)',
          driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          driverPhone: '+20 114 592 1044',
          driverRating: 4.88,
          completedDeliveries: 289,
          vehicleType: req.selectedVehicle || 'PICKUP',
          vehicleModel: 'Toyota Hilux Single Cab',
          vehiclePlate: 'ق س م 9120',
          distanceFromPickupKm: 4.8,
          proposedPrice: Math.round(customerPrice + 20),
          initialCustomerPrice: customerPrice,
          etaMinutes: 14,
          message: 'Can start right away. Fast delivery via regional highway.',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 270000).toISOString(),
          status: 'PENDING',
          negotiationHistory: [
            {
              id: `neg-${Date.now()}-3`,
              roundNumber: 1,
              proposedBy: 'CUSTOMER',
              proposerName: req.customerName || 'Customer',
              amountEgp: customerPrice,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'OFFER',
            },
            {
              id: `neg-${Date.now()}-4`,
              roundNumber: 2,
              proposedBy: 'DRIVER',
              proposerName: 'Mohamed El-Sayed',
              amountEgp: Math.round(customerPrice + 20),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'COUNTER_OFFER',
              note: 'Fair counter-offer (+EGP 20) with live tracking',
            },
          ],
        },
        {
          id: `off-${Date.now()}-3`,
          deliveryId: newId,
          driverId: 'drv-03',
          driverName: 'Omar Samir (عمر سمير)',
          driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
          driverPhone: '+20 122 839 4910',
          driverRating: 4.96,
          completedDeliveries: 412,
          vehicleType: req.selectedVehicle || 'PICKUP',
          vehicleModel: 'Nissan Hardbody Pickup',
          vehiclePlate: 'م ن ق 1324',
          distanceFromPickupKm: 3.5,
          proposedPrice: customerPrice,
          initialCustomerPrice: customerPrice,
          etaMinutes: 11,
          message: 'Accepting your offer of EGP ' + customerPrice + '. Ready to roll.',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 240000).toISOString(),
          status: 'PENDING',
          negotiationHistory: [
            {
              id: `neg-${Date.now()}-5`,
              roundNumber: 1,
              proposedBy: 'CUSTOMER',
              proposerName: req.customerName || 'Customer',
              amountEgp: customerPrice,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'OFFER',
            },
            {
              id: `neg-${Date.now()}-6`,
              roundNumber: 2,
              proposedBy: 'DRIVER',
              proposerName: 'Omar Samir',
              amountEgp: customerPrice,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'ACCEPTED',
              note: 'Driver agreed to your exact offer price',
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setDeliveries((prev) => [newDelivery, ...prev]);
    setActiveDeliveryId(newId);

    // Record audit log
    addAuditLog({
      agentId: 'DISPATCH',
      agentName: 'Marketplace Dispatch Agent',
      toolUsed: 'broadcastNewOrderToDrivers()',
      inputSummary: `Order ${randomTrack}: ${newDelivery.weightKg}kg, ${newDelivery.selectedVehicle}`,
      outputSummary: 'Broadcasted to 12 nearby verified drivers, generated 2 initial offers',
      requiresApproval: false,
      status: 'EXECUTED',
    });

    return newDelivery;
  };

  const submitDriverOffer = (deliveryId: string, offer: Omit<DriverOffer, 'id' | 'createdAt'>) => {
    const newOffer: DriverOffer = {
      ...offer,
      id: `off-${Date.now()}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 300000).toISOString(),
      status: 'PENDING',
      negotiationHistory: [
        {
          id: `neg-${Date.now()}`,
          roundNumber: 1,
          proposedBy: 'DRIVER',
          proposerName: offer.driverName,
          amountEgp: offer.proposedPrice,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'OFFER',
          note: offer.message || 'Driver offer submitted',
        },
      ],
    };

    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id === deliveryId) {
          const updatedOffers = [...d.offers, newOffer];
          return {
            ...d,
            status: d.status === 'BROADCASTING' ? 'OFFERS_RECEIVED' : d.status,
            offers: updatedOffers,
          };
        }
        return d;
      })
    );
  };

  const submitCounterOffer = (
    deliveryId: string,
    offerId: string,
    counterPrice: number,
    proposedBy: 'CUSTOMER' | 'DRIVER',
    note?: string
  ) => {
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id === deliveryId) {
          const updatedOffers = d.offers.map((off) => {
            if (off.id === offerId) {
              const nextRoundNum = (off.negotiationHistory?.length || 0) + 1;
              const newRound: any = {
                id: `neg-${Date.now()}-${nextRoundNum}`,
                roundNumber: nextRoundNum,
                proposedBy,
                proposerName: proposedBy === 'CUSTOMER' ? d.customerName : off.driverName,
                amountEgp: counterPrice,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'COUNTER_OFFER',
                note: note || (proposedBy === 'CUSTOMER' ? `Customer countered with EGP ${counterPrice}` : `Driver countered with EGP ${counterPrice}`),
              };

              return {
                ...off,
                proposedPrice: counterPrice,
                status: 'COUNTERED' as const,
                expiresAt: new Date(Date.now() + 300000).toISOString(),
                isExpired: false,
                negotiationHistory: [...(off.negotiationHistory || []), newRound],
              };
            }
            return off;
          });

          const timelineEvent = {
            status: 'OFFERS_RECEIVED' as DeliveryStatus,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: proposedBy === 'CUSTOMER' ? `Customer Countered (EGP ${counterPrice})` : `Driver Countered (EGP ${counterPrice})`,
            titleAr: proposedBy === 'CUSTOMER' ? `قدم العميل عرضاً مضاداً بـ ${counterPrice} ج.م` : `قدم الكابتن عرضاً مضاداً بـ ${counterPrice} ج.م`,
            description: note || `Counter-offer of EGP ${counterPrice} submitted.`,
            descriptionAr: `تم تقديم عرض سعر مضاد بقيمة ${counterPrice} ج.م.`,
            actor: proposedBy === 'CUSTOMER' ? d.customerName : 'Driver Partner',
          };

          return {
            ...d,
            offers: updatedOffers,
            timeline: [...d.timeline, timelineEvent],
          };
        }
        return d;
      })
    );

    addAuditLog({
      agentId: 'DISPATCH',
      agentName: 'Marketplace Negotiation Engine',
      toolUsed: `counterOffer(party: ${proposedBy}, price: ${counterPrice})`,
      inputSummary: `Order ${deliveryId}, Offer ${offerId}`,
      outputSummary: `New negotiation round registered at EGP ${counterPrice}`,
      requiresApproval: false,
      status: 'EXECUTED',
    });
  };

  const declineOffer = (deliveryId: string, offerId: string, declinedBy: 'CUSTOMER' | 'DRIVER') => {
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id === deliveryId) {
          const updatedOffers = d.offers.map((off) => {
            if (off.id === offerId) {
              const nextRoundNum = (off.negotiationHistory?.length || 0) + 1;
              const newRound: any = {
                id: `neg-${Date.now()}-${nextRoundNum}`,
                roundNumber: nextRoundNum,
                proposedBy: declinedBy,
                proposerName: declinedBy === 'CUSTOMER' ? d.customerName : off.driverName,
                amountEgp: off.proposedPrice,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'DECLINED',
                note: `${declinedBy} declined the offer of EGP ${off.proposedPrice}`,
              };
              return {
                ...off,
                status: 'DECLINED' as const,
                negotiationHistory: [...(off.negotiationHistory || []), newRound],
              };
            }
            return off;
          });
          return {
            ...d,
            offers: updatedOffers,
          };
        }
        return d;
      })
    );
  };

  const acceptDriverOffer = (deliveryId: string, offerId: string) => {
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id === deliveryId) {
          const chosenOffer = d.offers.find((o) => o.id === offerId);
          if (!chosenOffer) return d;

          const nextRoundNum = (chosenOffer.negotiationHistory?.length || 0) + 1;
          const acceptedRound: any = {
            id: `neg-${Date.now()}-${nextRoundNum}`,
            roundNumber: nextRoundNum,
            proposedBy: 'CUSTOMER',
            proposerName: d.customerName,
            amountEgp: chosenOffer.proposedPrice,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'ACCEPTED',
            note: `Final price agreed: EGP ${chosenOffer.proposedPrice} ✓`,
          };

          const updatedOffers = d.offers.map((o) => {
            if (o.id === offerId) {
              return {
                ...o,
                status: 'ACCEPTED' as const,
                negotiationHistory: [...(o.negotiationHistory || []), acceptedRound],
              };
            }
            return {
              ...o,
              status: o.status === 'PENDING' ? ('DECLINED' as const) : o.status,
            };
          });

          const assignedDriver = {
            id: chosenOffer.driverId,
            name: chosenOffer.driverName,
            phone: chosenOffer.driverPhone,
            rating: chosenOffer.driverRating,
            vehicleType: chosenOffer.vehicleType,
            vehiclePlate: chosenOffer.vehiclePlate,
            vehicleModel: chosenOffer.vehicleModel,
            currentCoords: { lat: 30.584, lng: 31.508 },
          };

          const newTimelineEvent = {
            status: 'DRIVER_ASSIGNED' as DeliveryStatus,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: `Price Agreed: EGP ${chosenOffer.proposedPrice} ✓ (${chosenOffer.driverName})`,
            titleAr: `تم الاتفاق على السعر: ${chosenOffer.proposedPrice} ج.م ✓ (${chosenOffer.driverName})`,
            description: `Direct negotiation completed. Platform fee (${platformFeePercentage}%): EGP ${((chosenOffer.proposedPrice * platformFeePercentage) / 100).toFixed(2)}. Driver dispatched.`,
            descriptionAr: `اكتمل التفاوض المباشر. عمولة المنصة (${platformFeePercentage}%): ${((chosenOffer.proposedPrice * platformFeePercentage) / 100).toFixed(2)} ج.م. انطلق السائق للاستلام.`,
            actor: 'Customer Decision',
          };

          return {
            ...d,
            status: 'DRIVER_ARRIVING_PICKUP',
            assignedDriver,
            agreedPrice: chosenOffer.proposedPrice,
            offers: updatedOffers,
            timeline: [...d.timeline, newTimelineEvent],
          };
        }
        return d;
      })
    );

    addAuditLog({
      agentId: 'DISPATCH',
      agentName: 'Marketplace Negotiation Engine',
      toolUsed: `lockAgreedPrice(order: ${deliveryId}, offer: ${offerId})`,
      inputSummary: `Agreed fare locked with chosen driver`,
      outputSummary: `Immutable contract created; platform fee calculation queued`,
      requiresApproval: false,
      status: 'EXECUTED',
    });
  };

  const updateDeliveryStatus = (
    deliveryId: string,
    status: DeliveryStatus,
    note?: string,
    photoUrl?: string
  ) => {
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id === deliveryId) {
          const titles: Record<DeliveryStatus, { en: string; ar: string }> = {
            DRAFT: { en: 'Draft', ar: 'مسودة' },
            BROADCASTING: { en: 'Broadcasting', ar: 'جاري البحث عن كباتن' },
            OFFERS_RECEIVED: { en: 'Offers Received', ar: 'وصول عروض السائقين' },
            DRIVER_ASSIGNED: { en: 'Driver Assigned', ar: 'تم تعيين السائق' },
            DRIVER_ARRIVING_PICKUP: { en: 'Driver Arriving at Pickup', ar: 'السائق في الطريق للاستلام' },
            PICKUP_IN_PROGRESS: { en: 'Pickup Verified & Handed Over', ar: 'تم تأكيد الاستلام وبدء الرحلة' },
            IN_TRANSIT: { en: 'In Transit', ar: 'الشحنة في الطريق' },
            DRIVER_ARRIVED_DROPOFF: { en: 'Driver Arrived at Destination', ar: 'وصل السائق لموقع التسليم' },
            DELIVERED: { en: 'Delivery Completed & Verified', ar: 'تم اكتمال التسليم بنجاح مع OTP' },
            DISPUTED: { en: 'Dispute Raised', ar: 'تم فتح نزاع بخصوص الشحنة' },
            CANCELLED: { en: 'Cancelled', ar: 'تم الإلغاء' },
          };

          const event = {
            status,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: titles[status]?.en || status,
            titleAr: titles[status]?.ar || status,
            description: note || `Status transitioned to ${status}`,
            descriptionAr: note || `تحديث حالة الشحنة إلى ${titles[status]?.ar || status}`,
            actor: 'System / Driver',
          };

          return {
            ...d,
            status,
            pickupProofPhotoUrl: photoUrl && status === 'PICKUP_IN_PROGRESS' ? photoUrl : d.pickupProofPhotoUrl,
            deliveryProofPhotoUrl: photoUrl && status === 'DELIVERED' ? photoUrl : d.deliveryProofPhotoUrl,
            deliveredAt: status === 'DELIVERED' ? new Date().toISOString() : d.deliveredAt,
            timeline: [...d.timeline, event],
          };
        }
        return d;
      })
    );
  };

  const verifyDeliveryOtp = (
    deliveryId: string,
    otpCode: string,
    step: 'PICKUP' | 'DROPOFF'
  ): { success: boolean; message: string } => {
    const delivery = deliveries.find((d) => d.id === deliveryId);
    if (!delivery) return { success: false, message: 'Delivery not found' };

    const expectedOtp = step === 'PICKUP' ? delivery.pickupOtp : delivery.dropoffOtp;
    if (otpCode.trim() !== expectedOtp.trim()) {
      return { success: false, message: `Invalid ${step} OTP code. Expected ${expectedOtp}` };
    }

    if (step === 'PICKUP') {
      updateDeliveryStatus(
        deliveryId,
        'PICKUP_IN_PROGRESS',
        `Pickup verified with OTP ${otpCode}. Chain of custody initialized.`
      );
    } else {
      updateDeliveryStatus(
        deliveryId,
        'DELIVERED',
        `Recipient confirmed handover with OTP ${otpCode}. Cash collection recorded.`
      );
    }

    return { success: true, message: 'Verification code confirmed successfully!' };
  };

  const updateDriverStatus = (driverId: string, isOnline: boolean) => {
    setDrivers((prev) =>
      prev.map((drv) => (drv.id === driverId ? { ...drv, isOnline } : drv))
    );
  };

  const approveDriverVerification = (driverId: string) => {
    setDrivers((prev) =>
      prev.map((drv) => (drv.id === driverId ? { ...drv, verificationStatus: 'VERIFIED' } : drv))
    );
  };

  const markSettlementSettled = (id: string) => {
    setSettlements((prev) =>
      prev.map((stl) =>
        stl.id === id ? { ...stl, status: 'SETTLED', outstandingBalance: 0 } : stl
      )
    );
  };

  const generateNewSettlementCycle = () => {
    const newStatement: SettlementStatement = {
      id: `stl-5d-${Date.now().toString().slice(-4)}`,
      driverId: 'drv-01',
      driverName: 'Ahmed Hassan (أحمد حسن)',
      periodStart: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      periodEnd: new Date().toISOString().split('T')[0],
      completedDeliveriesCount: 38,
      totalCashCollected: 16400,
      platformFeePercentage,
      platformFeeAmount: (16400 * platformFeePercentage) / 100,
      driverNetEarnings: 16400 - (16400 * platformFeePercentage) / 100,
      outstandingBalance: (16400 * platformFeePercentage) / 100,
      status: 'GENERATED',
      reconciledByAI: true,
      notes: `Generated on demand via AI Collections Agent at ${platformFeePercentage}% platform fee.`,
    };

    setSettlements((prev) => [newStatement, ...prev]);

    addAuditLog({
      agentId: 'COLLECTIONS',
      agentName: '5-Day Collections Agent',
      toolUsed: 'createSettlementStatement()',
      inputSummary: `Triggered 5-day cycle calculation at ${platformFeePercentage}%`,
      outputSummary: `Generated statement #${newStatement.id} for Ahmed Hassan`,
      requiresApproval: false,
      status: 'EXECUTED',
    });
  };

  const toggleAgentStatus = (agentId: string) => {
    setAiAgents((prev) =>
      prev.map((ag) =>
        ag.id === agentId
          ? {
              ...ag,
              status: ag.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE',
            }
          : ag
      )
    );
  };

  const approveAIAction = (id: string) => {
    setAiApprovals((prev) =>
      prev.map((appr) => (appr.id === id ? { ...appr, status: 'APPROVED' } : appr))
    );
    addAuditLog({
      agentId: 'MANAGEMENT',
      agentName: 'Human Operations Manager',
      toolUsed: 'humanApproval(actionId: ' + id + ')',
      inputSummary: `Approved pending action ${id}`,
      outputSummary: 'Executed financial/operational rule with verified supervisor audit token',
      requiresApproval: false,
      status: 'EXECUTED',
    });
  };

  const rejectAIAction = (id: string) => {
    setAiApprovals((prev) =>
      prev.map((appr) => (appr.id === id ? { ...appr, status: 'REJECTED' } : appr))
    );
    addAuditLog({
      agentId: 'MANAGEMENT',
      agentName: 'Human Operations Manager',
      toolUsed: 'humanReject(actionId: ' + id + ')',
      inputSummary: `Rejected pending action ${id}`,
      outputSummary: 'Action blocked from ledger execution',
      requiresApproval: false,
      status: 'REJECTED',
    });
  };

  const addAuditLog = (entry: Omit<AIAuditLogEntry, 'id' | 'timestamp'>) => {
    const newLog: AIAuditLogEntry = {
      ...entry,
      id: `log-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setAiAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const resolveDispute = (id: string, resolution: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'RESOLVED', resolution } : d))
    );
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        currentRole,
        setCurrentRole,
        currentView,
        setCurrentView,
        deliveries,
        activeDelivery,
        setActiveDeliveryId,
        createDeliveryRequest,
        submitDriverOffer,
        submitCounterOffer,
        acceptDriverOffer,
        declineOffer,
        updateDeliveryStatus,
        verifyDeliveryOtp,
        drivers,
        updateDriverStatus,
        approveDriverVerification,
        platformFeePercentage,
        setPlatformFeePercentage,
        settlements,
        markSettlementSettled,
        generateNewSettlementCycle,
        aiAgents,
        toggleAgentStatus,
        aiApprovals,
        approveAIAction,
        rejectAIAction,
        aiAuditLogs,
        addAuditLog,
        disputes,
        resolveDispute,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
