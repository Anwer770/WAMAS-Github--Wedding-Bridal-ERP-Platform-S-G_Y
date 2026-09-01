import React, { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { DressCatalog } from "./components/DressCatalog";
import { BookingEngine } from "./components/BookingEngine";
import { RentalVault } from "./components/RentalVault";
import { BrideCRM } from "./components/BrideCRM";
import { POSSales } from "./components/POSSales";
import { ManufacturingOrderComponent } from "./components/ManufacturingOrder";
import { AlterationsAndTasks } from "./components/AlterationsAndTasks";
import { KoshaAndServices } from "./components/KoshaAndServices";
import { AccountingCashbox } from "./components/AccountingCashbox";
import { ReportsBI } from "./components/ReportsBI";
import { EventExperience } from "./components/EventExperience";
import { SettingsRBAC } from "./components/SettingsRBAC";
import { AIImageAnalyzer } from "./components/AIImageAnalyzer";

import {
  initialDresses,
  initialBookings,
  initialCustomers,
  initialCollaterals,
  initialManufacturingOrders,
  initialAlterations,
  initialKoshaProjects,
  initialFleet,
  initialJournalEntries,
  initialCashSession,
} from "./data/initialData";

import {
  NavTab,
  UserRole,
  PhysicalItem,
  Booking,
  Customer,
  CollateralRecord,
  ManufacturingOrder,
  AlterationOrder,
  KoshaProject,
  FleetVehicle,
  JournalEntry,
  CashSession,
  BrideMeasurements,
  DressState,
} from "./types/wamas";

export function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [currentRole, setCurrentRole] = useState<UserRole>("ADMIN");
  const [currency, setCurrency] = useState<string>("ر.س");
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Core Business State
  const [dresses, setDresses] = useState<PhysicalItem[]>(initialDresses);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [collaterals, setCollaterals] = useState<CollateralRecord[]>(initialCollaterals);
  const [manufacturingOrders, setManufacturingOrders] = useState<ManufacturingOrder[]>(initialManufacturingOrders);
  const [alterations, setAlterations] = useState<AlterationOrder[]>(initialAlterations);
  const [koshaProjects, setKoshaProjects] = useState<KoshaProject[]>(initialKoshaProjects);
  const [fleet, setFleet] = useState<FleetVehicle[]>(initialFleet);
  const [journals, setJournals] = useState<JournalEntry[]>(initialJournalEntries);
  const [cashSession, setCashSession] = useState<CashSession>(initialCashSession);

  // State Transition Handlers
  const handleUpdateDressState = (dressId: string, newState: DressState, notes?: string) => {
    setDresses((prev) =>
      prev.map((d) => (d.id === dressId ? { ...d, state: newState } : d))
    );
  };

  const handleAddNewDress = (newDress: PhysicalItem) => {
    setDresses((prev) => [newDress, ...prev]);
  };

  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    // Transition dress state to BOOKED
    setDresses((prev) =>
      prev.map((d) =>
        d.id === newBooking.itemId
          ? { ...d, state: "BOOKED", timesRented: d.timesRented + 1, totalRevenue: d.totalRevenue + newBooking.rentalPrice }
          : d
      )
    );
    // Create automatic Journal Entry for advance deposit
    const newJournal: JournalEntry = {
      id: `jv-${Date.now()}`,
      entryNumber: `JV-2026-${String(journals.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      description: `استلام عربون حجز ${newBooking.bookingNumber} - العروس ${newBooking.customerName}`,
      category: "RENTAL_INCOME",
      lines: [
        { id: "l1", account: "101 - الصندوق الرئيسي (كاش)", debit: newBooking.depositPaid, credit: 0 },
        { id: "l2", account: "401 - إيرادات تأجير فساتين", debit: 0, credit: newBooking.depositPaid },
      ],
      posted: true,
      createdBy: "النظام الآلي",
    };
    setJournals((prev) => [newJournal, ...prev]);
  };

  const handleDeliverBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "DELIVERED" } : b))
    );
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setDresses((prev) =>
        prev.map((d) => (d.id === booking.itemId ? { ...d, state: "DELIVERED" } : d))
      );
    }
  };

  const handleReturnBooking = (
    bookingId: string,
    damageDeduction: number,
    lateFee: number,
    notes: string
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "COMPLETED" } : b))
    );
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      // Transition dress state to CLEANING (Mandatory 48-Hour Buffer period)
      setDresses((prev) =>
        prev.map((d) => (d.id === booking.itemId ? { ...d, state: "CLEANING" } : d))
      );
    }
  };

  const handleUpdateCustomerMeasurements = (customerId: string, measurements: BrideMeasurements) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, measurements } : c))
    );
  };

  const handleAddNewCustomer = (customer: Customer) => {
    setCustomers((prev) => [customer, ...prev]);
  };

  const handleRecordSale = (saleData: any) => {
    // Mark sold dresses as SOLD
    const soldIds = saleData.items.map((i: any) => i.dress.id);
    setDresses((prev) =>
      prev.map((d) => (soldIds.includes(d.id) ? { ...d, state: "SOLD" } : d))
    );
    // Add sale journal
    const newJournal: JournalEntry = {
      id: `jv-${Date.now()}`,
      entryNumber: `JV-2026-${String(journals.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      description: `مبيعات مباشرة فاتورة رقم ${saleData.invoiceNo}`,
      category: "RENTAL_INCOME",
      lines: [
        { id: "l1", account: "101 - الصندوق الرئيسي (كاش)", debit: saleData.total, credit: 0 },
        { id: "l2", account: "402 - إيرادات بيع فساتين وأكسسوارات", debit: 0, credit: saleData.total },
      ],
      posted: true,
      createdBy: "كاشير نقطة البيع",
    };
    setJournals((prev) => [newJournal, ...prev]);
  };

  const handleAddNewManufacturingOrder = (order: ManufacturingOrder) => {
    setManufacturingOrders((prev) => [order, ...prev]);
  };

  const handleUpdateManufacturingStatus = (
    orderId: string,
    status: ManufacturingOrder["status"],
    qcApproved: boolean
  ) => {
    setManufacturingOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, qcApproved } : o))
    );
  };

  const handleAddNewAlteration = (order: AlterationOrder) => {
    setAlterations((prev) => [order, ...prev]);
  };

  const handleUpdateAlterationStatus = (orderId: string, status: AlterationOrder["status"]) => {
    setAlterations((prev) =>
      prev.map((a) => (a.id === orderId ? { ...a, status } : a))
    );
  };

  const handleUpdateKoshaStatus = (projectId: string, status: KoshaProject["status"]) => {
    setKoshaProjects((prev) =>
      prev.map((k) => (k.id === projectId ? { ...k, status } : k))
    );
  };

  const handleUpdateVehicleStatus = (vehicleId: string, status: FleetVehicle["status"]) => {
    setFleet((prev) =>
      prev.map((f) => (f.id === vehicleId ? { ...f, status } : f))
    );
  };

  const handleAddJournalEntry = (entry: JournalEntry) => {
    setJournals((prev) => [entry, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-900 font-sans antialiased" dir="rtl">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        badgeCounts={{
          dresses: dresses.filter((d) => d.state === "AVAILABLE").length,
          bookings: bookings.filter((b) => b.status === "CONFIRMED").length,
          alterations: alterations.filter((a) => a.status === "IN_PROGRESS").length,
          manufacturing: manufacturingOrders.filter((m) => m.status !== "COMPLETED").length,
          vault: collaterals.filter((c) => c.status === "HELD_IN_VAULT").length,
        }}
        counts={{
          availableDresses: dresses.filter((d) => d.state === "AVAILABLE").length,
          activeBookings: bookings.filter((b) => b.status === "CONFIRMED").length,
          heldCollaterals: collaterals.filter((c) => c.status === "HELD_IN_VAULT").length,
          urgentAlterations: alterations.filter((a) => a.status === "IN_PROGRESS").length,
          pendingCleanings: dresses.filter((d) => d.state === "CLEANING").length,
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          currency={currency}
          onCurrencyChange={setCurrency}
          activeTab={activeTab}
          onOpenAIModal={() => setIsAIModalOpen(true)}
          cashSession={cashSession}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === "dashboard" && (
            <Dashboard
              dresses={dresses}
              bookings={bookings}
              customers={customers}
              collaterals={collaterals}
              manufacturingOrders={manufacturingOrders}
              alterations={alterations}
              currency={currency}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAIAnalyzer={() => setIsAIModalOpen(true)}
            />
          )}

          {(activeTab === "catalog" || activeTab === "dresses") && (
            <DressCatalog
              dresses={dresses}
              currency={currency}
              onUpdateDressState={handleUpdateDressState}
              onAddNewDress={handleAddNewDress}
              onOpenAIAnalyzer={() => setIsAIModalOpen(true)}
            />
          )}

          {activeTab === "bookings" && (
            <BookingEngine
              dresses={dresses}
              bookings={bookings}
              customers={customers}
              currency={currency}
              onAddBooking={handleAddBooking}
            />
          )}

          {activeTab === "vault" && (
            <RentalVault
              bookings={bookings}
              collaterals={collaterals}
              dresses={dresses}
              currency={currency}
              onDeliverBooking={handleDeliverBooking}
              onReturnBooking={handleReturnBooking}
            />
          )}

          {activeTab === "brides" && (
            <BrideCRM
              customers={customers}
              onUpdateCustomerMeasurements={handleUpdateCustomerMeasurements}
              onAddNewCustomer={handleAddNewCustomer}
            />
          )}

          {(activeTab === "sales" || activeTab === "pos") && (
            <POSSales
              dresses={dresses}
              currency={currency}
              onRecordSale={handleRecordSale}
            />
          )}

          {activeTab === "manufacturing" && (
            <ManufacturingOrderComponent
              orders={manufacturingOrders}
              currency={currency}
              onAddNewOrder={handleAddNewManufacturingOrder}
              onUpdateOrderStatus={handleUpdateManufacturingStatus}
            />
          )}

          {activeTab === "alterations" && (
            <AlterationsAndTasks
              alterations={alterations}
              customers={customers}
              dresses={dresses}
              currency={currency}
              onUpdateAlterationStatus={handleUpdateAlterationStatus}
              onAddNewAlteration={handleAddNewAlteration}
            />
          )}

          {(activeTab === "kosha" || activeTab === "fleet") && (
            <KoshaAndServices
              koshaProjects={koshaProjects}
              fleet={fleet}
              currency={currency}
              onUpdateKoshaStatus={handleUpdateKoshaStatus}
              onUpdateVehicleStatus={handleUpdateVehicleStatus}
            />
          )}

          {activeTab === "accounting" && (
            <AccountingCashbox
              journals={journals}
              cashSession={cashSession}
              currency={currency}
              onAddJournalEntry={handleAddJournalEntry}
            />
          )}

          {activeTab === "reports" && (
            <ReportsBI
              dresses={dresses}
              bookings={bookings}
              currency={currency}
            />
          )}

          {activeTab === "invitations" && (
            <EventExperience customers={customers} />
          )}

          {activeTab === "settings" && (
            <SettingsRBAC
              currentRole={currentRole}
              onRoleChange={setCurrentRole}
              currency={currency}
              onCurrencyChange={setCurrency}
            />
          )}

          {(activeTab === "ai_analyzer" || activeTab === "ai-analyzer") && (
            <div className="space-y-4">
              <AIImageAnalyzer
                currency={currency}
                onAddAnalyzedDress={handleAddNewDress}
              />
            </div>
          )}
        </main>
      </div>

      {/* AI Image Analyzer Modal Triggered from Header / Floating Button */}
      {isAIModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-100 my-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsAIModalOpen(false)}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer transition-colors z-10"
            >
              ✕
            </button>
            <AIImageAnalyzer
              currency={currency}
              onAddAnalyzedDress={(dress) => {
                handleAddNewDress(dress);
                setIsAIModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

