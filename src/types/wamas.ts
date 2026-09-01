export type DressState =
  | "AVAILABLE"      // 🟢 متاح
  | "BOOKED"         // 🔵 محجوز
  | "FITTING"        // 🟡 في البروفا
  | "DELIVERED"      // 🟠 مُسلّم / خارج المركز
  | "CLEANING"       // 🧺 في المغسلة والتنظيف
  | "ALTERATION"     // ✂️ في التعديل والخياطة
  | "MAINTENANCE"    // 🔧 في الصيانة والترميم
  | "DAMAGED"        // ❌ تالف
  | "LOST"           // ⚠️ مفقود
  | "SOLD"           // 📦 مباع
  | "OUT_OF_SERVICE" // 🗄️ خارج الخدمة
  | "ARCHIVED";      // 📁 أرشيف

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "FITTING"
  | "DELIVERED"
  | "RETURNED"
  | "COMPLETED"
  | "CANCELLED";

export type CollateralType = "CASH" | "GOLD" | "WEAPON" | "IDENTITY_DOC" | "OTHER";

export type UserRole =
  | "SUPER_ADMIN"
  | "BRANCH_MANAGER"
  | "ACCOUNTANT"
  | "CASHIER"
  | "RECEPTIONIST"
  | "TAILOR"
  | "ADMIN";

export type NavTab =
  | "dashboard"
  | "catalog"
  | "dresses"
  | "bookings"
  | "vault"
  | "brides"
  | "sales"
  | "pos"
  | "manufacturing"
  | "alterations"
  | "kosha"
  | "fleet"
  | "accounting"
  | "reports"
  | "invitations"
  | "settings"
  | "ai_analyzer"
  | "ai-analyzer";


export interface PhysicalItem {
  id: string;
  itemCode: string; // e.g. DR-2026-001
  name: string;
  category: "WEDDING_ROYAL" | "CLASSIC_WHITE" | "ENGAGEMENT" | "EVENING" | "TRADITIONAL_KAFTAN" | "SUIT" | "ACCESSORY";
  size: string; // 36, 38, 40, 42, 44, 46, Free Size
  color: string;
  fabric: string;
  state: DressState;
  condition: "EXCELLENT" | "GOOD" | "MINOR_WEAR" | "DAMAGED";
  rentalPrice: number;
  salePrice: number;
  securityDeposit: number;
  acquisitionCost: number;
  timesRented: number;
  totalRevenue: number;
  imageUrl: string;
  galleryUrls?: string[];
  qrCodeUrl?: string;
  barcode: string;
  branch: string;
  locationInStore: string;
  notes?: string;
  lastMaintainedAt?: string;
  createdAt: string;
}

export interface BrideMeasurements {
  bust: number; // الصدر (سم)
  waist: number; // الخصر (سم)
  hips: number; // الأرداف (سم)
  hollowToHem: number; // من الكتف للأرض (سم)
  heelHeight: number; // طول الكعب (سم)
  shoulderWidth?: number; // عرض الكتفين (سم)
  armLength?: number; // طول الكم (سم)
  notes?: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  customerCode: string;
  fullName: string;
  phone: string;
  phoneSecondary?: string;
  nationalId: string;
  idCardImageUrl?: string;
  address: string;
  weddingDate: string;
  eventType: "WEDDING" | "ENGAGEMENT" | "HENNA" | "SOIRÉE";
  measurements: BrideMeasurements;
  loyaltyPoints: number;
  totalSpent: number;
  notes?: string;
  riskRating: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
}

export interface CollateralRecord {
  id: string;
  type: CollateralType;
  description: string;
  estimatedValue: number;
  cashAmount?: number;
  serialOrTagNumber?: string;
  photoUrls?: string[];
  identityDocDetails?: {
    docType: "NATIONAL_ID" | "PASSPORT" | "FAMILY_CARD";
    docNumber: string;
    holderName: string;
    holderPhone: string;
    frontImage?: string;
    backImage?: string;
  };
  status: "HELD_IN_VAULT" | "RELEASED" | "CONFISCATED_FOR_DAMAGES";
  receiptVoucherNo: string;
  receivedAt: string;
  releasedAt?: string;
  vaultLocation: string; // Safe #1, Drawer B
}

export interface Booking {
  id: string;
  bookingNumber: string; // BK-2026-001
  customerId: string;
  customerName: string;
  customerPhone: string;
  itemId: string;
  itemName: string;
  itemCode: string;
  eventDate: string;
  fittingDate: string;
  deliveryDate: string;
  returnDate: string;
  bufferStartDate: string;
  bufferEndDate: string;
  rentalPrice: number;
  discount: number;
  tax: number;
  totalPrice: number;
  depositPaid: number;
  securityDepositAmount: number;
  remainingBalance: number;
  status: BookingStatus;
  collateral?: CollateralRecord;
  contractSigned: boolean;
  contractNumber: string;
  accessoriesIncluded: string[];
  notes?: string;
  createdAt: string;
}

export interface ManufacturingOrder {
  id: string;
  orderNumber: string; // MO-2026-001
  title: string;
  dressCategory: string;
  targetSize: string;
  color: string;
  status: "DESIGN" | "CUTTING" | "SEWING" | "QC_INSPECTION" | "COMPLETED";
  // 4 mandatory photos as defined in PRD Section 19
  images: {
    collar: string;
    sleeve: string;
    front: string;
    back: string;
  };
  bomMaterials: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    unitCost: number;
    totalCost: number;
  }[];
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  assignedTailor: string;
  startDate: string;
  dueDate: string;
  qcApproved: boolean;
  notes?: string;
}

export interface AlterationTask {
  id: string;
  orderNumber?: string;
  bookingId?: string;
  customerId?: string;
  customerName: string;
  itemId?: string;
  dressCode?: string;
  dressName?: string;
  itemName?: string;
  fittingDate: string;
  deliveryDate: string;
  taskType?: "SIZE_ADJUSTMENT" | "HEMMING" | "EMBROIDERY_FIX" | "SLEEVES_ATTACH";
  assignedTailor?: string;
  seamstressName?: string;
  priority?: "URGENT" | "HIGH" | "NORMAL";
  status: "TODO" | "IN_PROGRESS" | "READY_FOR_FITTING" | "COMPLETED";
  instructions?: string;
  modificationsNeeded?: string;
  measurementsSummary?: string;
  cost: number;
  paid?: boolean;
  notes?: string;
}

export type AlterationOrder = AlterationTask;

export interface KoshaProject {
  id: string;
  code?: string;
  projectCode?: string;
  title: string;
  customerName?: string;
  venueName: string;
  hallName?: string;
  eventDate: string;
  setupDate?: string;
  setupStartTime?: string;
  dismantleDate?: string;
  packageType?: "ROYAL_GOLD" | "MODERN_FLORAL" | "CLASSIC_WHITE" | "CUSTOM_LUXURY";
  totalPrice: number;
  depositPaid?: number;
  teamLeader?: string;
  status: "CONFIRMED" | "PREPARING" | "INSTALLED" | "SETUP_IN_PROGRESS" | "ACTIVE_EVENT" | "DISMANTLED" | "COMPLETED";
  components?: string[];
  checklist?: { task: string; done: boolean }[];
  milestones?: { id: string; title: string; scheduledTime: string; completed: boolean }[];
}

export interface VehicleRental {
  id: string;
  model: string;
  plateNumber: string;
  color: string;
  dailyRate?: number;
  rentalPricePerTrip?: number;
  driverName?: string;
  driverPhone?: string;
  driverIncluded: boolean;
  status: "AVAILABLE" | "BOOKED" | "IN_USE" | "DISPATCHED" | "MAINTENANCE";
  nextEventDate?: string;
  imageUrl?: string;
}

export type FleetVehicle = VehicleRental;


export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  category?: string;
  referenceType?: "BOOKING" | "SALE" | "SECURITY_DEPOSIT" | "EXPENSE" | "PURCHASE" | "DAMAGE_SETTLEMENT";
  referenceId?: string;
  lines: {
    id?: string;
    accountId?: string;
    account?: string;
    accountName?: string;
    debit: number;
    credit: number;
  }[];
  totalDebit?: number;
  totalCredit?: number;
  posted?: boolean;
  postedBy?: string;
  createdBy?: string;
}

export interface CashSession {
  id: string;
  cashboxName: string;
  openedAt?: string;
  closedAt?: string;
  openedBy?: string;
  openingBalance: number;
  closingBalance?: number;
  totalReceipts: number;
  totalDisbursements: number;
  expectedBalance: number;
  actualBalance?: number;
  difference?: number;
  status: "OPEN" | "CLOSED" | "RECONCILED";
  operator?: string;
}


export interface AIAnalysisResult {
  dressTitle: string;
  category: string;
  silhouette: string;
  necklineAndSleeves: string;
  fabricAndEmbroidery: string;
  colorTone: string;
  estimatedCondition: string;
  damageInspection: {
    hasDamage: boolean;
    damageDescription: string;
    severity: "NONE" | "MINOR" | "MODERATE" | "SEVERE";
    repairRecommendation: string;
  };
  recommendedRentalPrice: number;
  recommendedSalePrice: number;
  recommendedSecurityDeposit: number;
  recommendedBodyType: string;
  cleaningAndCareGuide: string;
  stylingAccessories: string[];
  marketingDescription: string;
}

export interface InvitationEvent {
  id: string;
  eventTitle: string;
  brideName: string;
  groomName: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  mapCoordinates?: string;
  welcomeMessage: string;
  dressCode: string;
  themeColor: string;
  invitationSlug: string;
  totalInvited: number;
  rsvpStats: {
    attending: number;
    declined: number;
    pending: number;
  };
  guests: {
    id: string;
    name: string;
    phone: string;
    companions: number;
    rsvpStatus: "ATTENDING" | "DECLINED" | "PENDING";
    tableNumber?: string;
    checkedIn: boolean;
  }[];
}
