export type AppLanguage = 'en' | 'ar';
export type AppTheme = 'light' | 'dark';

export type UserRole = 'CUSTOMER' | 'DRIVER' | 'ADMIN' | 'OPERATIONS_MANAGER';

export type AppView = 'WEBSITE' | 'CUSTOMER_APP' | 'DRIVER_APP' | 'ADMIN_DASHBOARD' | 'SYSTEM_SPECS';

export type VehicleCategory =
  | 'MOTORCYCLE'
  | 'SCOOTER'
  | 'CARGO_TRICYCLE'
  | 'VAN'
  | 'PICKUP'
  | 'SMALL_TRUCK'
  | 'MEDIUM_TRUCK'
  | 'LARGE_TRUCK';

export interface VehicleSpec {
  id: VehicleCategory;
  nameEn: string;
  nameAr: string;
  iconName: string;
  idealForEn: string;
  idealForAr: string;
  maxWeightKg: number;
  dimensionsEn: string;
  dimensionsAr: string;
  baseFareEgp: number;
  perKmEgp: number;
  exampleVehicle: string;
}

export type ShipmentCategory =
  | 'PERSONAL_PACKAGE'
  | 'BUSINESS_GOODS'
  | 'FURNITURE'
  | 'ELECTRONICS'
  | 'DOCUMENTS'
  | 'FOOD_PERISHABLES'
  | 'SPARE_PARTS'
  | 'CONSTRUCTION'
  | 'COMMERCIAL_FREIGHT'
  | 'WAREHOUSE_TRANSFER';

export type DeliveryStatus =
  | 'DRAFT'
  | 'BROADCASTING'
  | 'OFFERS_RECEIVED'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_ARRIVING_PICKUP'
  | 'PICKUP_IN_PROGRESS'
  | 'IN_TRANSIT'
  | 'DRIVER_ARRIVED_DROPOFF'
  | 'DELIVERED'
  | 'DISPUTED'
  | 'CANCELLED';

export type StopType = 'PICKUP' | 'DROPOFF' | 'WAYPOINT' | 'WAREHOUSE' | 'RETURN';

export interface DeliveryStop {
  id: string;
  type: StopType;
  sequence: number; // 0 for pickup, 1, 2... for intermediate stops, last for final dropoff
  title?: string;
  address: string;
  addressAr?: string;
  city: string;
  lat: number;
  lng: number;
  contactName: string;
  contactPhone: string;
  instructions?: string;
  packageAction?: string; // e.g. "Pick up 2 pallets", "Deliver 5 packages"
  completed?: boolean;
}

export interface LocationPoint {
  address: string;
  addressAr?: string;
  city: string;
  lat: number;
  lng: number;
  contactName: string;
  contactPhone: string;
  notes?: string;
}

export type NegotiationParty = 'CUSTOMER' | 'DRIVER';
export type NegotiationStatus = 'OFFER' | 'COUNTER_OFFER' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';

export interface NegotiationRound {
  id: string;
  roundNumber: number;
  proposedBy: NegotiationParty;
  proposerName: string;
  amountEgp: number;
  timestamp: string;
  status: NegotiationStatus;
  note?: string;
}

export interface DriverOffer {
  id: string;
  deliveryId: string;
  driverId: string;
  driverName: string;
  driverAvatar: string;
  driverPhone: string;
  driverRating: number;
  completedDeliveries: number;
  vehicleType: VehicleCategory;
  vehicleModel: string;
  vehiclePlate: string;
  distanceFromPickupKm?: number;
  proposedPrice: number;
  initialCustomerPrice?: number;
  etaMinutes: number;
  message?: string;
  createdAt: string;
  expiresAt: string;
  isExpired?: boolean;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COUNTERED' | 'EXPIRED';
  negotiationHistory: NegotiationRound[];
}

export interface DeliveryTimelineEvent {
  status: DeliveryStatus;
  timestamp: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  actor: string;
  gpsCoords?: { lat: number; lng: number };
}

export interface DeliveryRequest {
  id: string;
  trackingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  pickup: LocationPoint;
  dropoff: LocationPoint;
  stops?: DeliveryStop[];
  estimatedDrivingMinutes?: number;
  shipmentCategory: ShipmentCategory;
  description: string;
  weightKg: number;
  dimensionsCm: { length: number; width: number; height: number };
  quantity: number;
  specialHandling: {
    fragile?: boolean;
    helperRequired?: boolean;
    refrigeration?: boolean;
    waterproof?: boolean;
  };
  recommendedVehicle: VehicleCategory;
  selectedVehicle: VehicleCategory;
  distanceKm: number;
  estimatedPrice: number;
  customerOfferPrice: number;
  agreedPrice: number;
  aiMarketPriceRange?: {
    minEgp: number;
    maxEgp: number;
    medianEgp: number;
    reasoning: string;
    drivingMinutes: number;
  };
  pricingMode: 'ESTIMATED' | 'CUSTOMER_OFFER' | 'MARKETPLACE';
  status: DeliveryStatus;
  assignedDriver?: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    vehicleType: VehicleCategory;
    vehiclePlate: string;
    vehicleModel: string;
    currentCoords: { lat: number; lng: number };
  };
  pickupOtp: string;
  dropoffOtp: string;
  pickupConfirmedAt?: string;
  deliveredAt?: string;
  pickupProofPhotoUrl?: string;
  deliveryProofPhotoUrl?: string;
  timeline: DeliveryTimelineEvent[];
  offers: DriverOffer[];
  createdAt: string;
}

export interface DriverProfile {
  id: string;
  name: string;
  nameAr?: string;
  phone: string;
  avatar: string;
  vehicleType: VehicleCategory;
  vehicleModel: string;
  vehiclePlate: string;
  rating: number;
  completedDeliveries: number;
  currentCoords: { lat: number; lng: number };
  isOnline: boolean;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED' | 'SUSPENDED';
  documents: {
    nationalId: string;
    drivingLicense: string;
    vehicleRegistration: string;
    selfieVerified: boolean;
  };
  joinedDate: string;
}

export interface SettlementStatement {
  id: string;
  driverId: string;
  driverName: string;
  periodStart: string;
  periodEnd: string;
  completedDeliveriesCount: number;
  totalCashCollected: number;
  platformFeePercentage: number;
  platformFeeAmount: number;
  driverNetEarnings: number;
  outstandingBalance: number;
  status: 'PENDING_RECONCILIATION' | 'GENERATED' | 'NOTIFIED' | 'SETTLED';
  reconciledByAI: boolean;
  notes?: string;
}

export type AIAgentId =
  | 'CUSTOMER_SUPPORT'
  | 'OPERATIONS'
  | 'COLLECTIONS'
  | 'DELIVERY_DISCOVERY'
  | 'DISPATCH'
  | 'MANAGEMENT'
  | 'CUSTOMER_COMMUNICATION';

export interface AIAgentInfo {
  id: AIAgentId;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  status: 'ACTIVE' | 'STANDBY' | 'PAUSED';
  tasksToday: number;
  successfulActions: number;
  pendingApprovals: number;
  accuracyRate: number;
  lastActivity: string;
  descriptionEn: string;
  descriptionAr: string;
}

export interface AIApprovalItem {
  id: string;
  agentId: AIAgentId;
  agentName: string;
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  financialImpactEgp?: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  payload: Record<string, any>;
}

export interface AIAuditLogEntry {
  id: string;
  timestamp: string;
  agentId: AIAgentId;
  agentName: string;
  toolUsed: string;
  inputSummary: string;
  outputSummary: string;
  requiresApproval: boolean;
  status: 'EXECUTED' | 'AWAITING_APPROVAL' | 'REJECTED';
}

export interface DisputeCase {
  id: string;
  deliveryId: string;
  trackingNumber: string;
  reportedBy: 'CUSTOMER' | 'DRIVER';
  reporterName: string;
  type: 'DAMAGED_PACKAGE' | 'MISSING_PACKAGE' | 'DRIVER_NO_SHOW' | 'CASH_DISCREPANCY' | 'DELAY';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  claimedAmountEgp: number;
  description: string;
  evidenceTimeline: string[];
  openedAt: string;
  resolution?: string;
}
