import React, { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageCircle,
  Calendar,
  Ruler,
  Clock,
  Sparkles,
  ShieldCheck,
  Edit,
  Save,
  CheckCircle2
} from "lucide-react";
import { Customer, BrideMeasurements } from "../types/wamas";

interface BrideCRMProps {
  customers: Customer[];
  onUpdateCustomerMeasurements: (customerId: string, measurements: BrideMeasurements) => void;
  onAddNewCustomer: (customer: Customer) => void;
}

export const BrideCRM: React.FC<BrideCRMProps> = ({
  customers,
  onUpdateCustomerMeasurements,
  onAddNewCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(customers[0] || null);
  const [isEditingMeasurements, setIsEditingMeasurements] = useState(false);
  const [measurementsForm, setMeasurementsForm] = useState<BrideMeasurements>(
    selectedCustomer?.measurements || {
      bust: 90,
      waist: 68,
      hips: 96,
      hollowToHem: 144,
      heelHeight: 8,
    }
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBrideForm, setNewBrideForm] = useState({
    fullName: "",
    phone: "",
    nationalId: "",
    address: "صنعاء / الرياض",
    weddingDate: "2026-09-20",
    eventType: "WEDDING" as Customer["eventType"],
    bust: 90,
    waist: 68,
    hips: 96,
    hollowToHem: 144,
    heelHeight: 8,
    notes: "",
  });

  const filteredCustomers = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.customerCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setMeasurementsForm(customer.measurements);
    setIsEditingMeasurements(false);
  };

  const handleSaveMeasurements = () => {
    if (!selectedCustomer) return;
    const updated: BrideMeasurements = {
      ...measurementsForm,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    onUpdateCustomerMeasurements(selectedCustomer.id, updated);
    setIsEditingMeasurements(false);
    alert("تم تحديث مقاسات الخياطة للعروس بنجاح! 📐✨");
  };

  const handleCreateBrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrideForm.fullName || !newBrideForm.phone) return;

    const newCode = `CUST-2026-${String(customers.length + 81).padStart(3, "0")}`;
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      customerCode: newCode,
      fullName: newBrideForm.fullName,
      phone: newBrideForm.phone,
      nationalId: newBrideForm.nationalId || "1099887766",
      address: newBrideForm.address,
      weddingDate: newBrideForm.weddingDate,
      eventType: newBrideForm.eventType,
      measurements: {
        bust: Number(newBrideForm.bust),
        waist: Number(newBrideForm.waist),
        hips: Number(newBrideForm.hips),
        hollowToHem: Number(newBrideForm.hollowToHem),
        heelHeight: Number(newBrideForm.heelHeight),
        notes: newBrideForm.notes,
        updatedAt: new Date().toISOString().split("T")[0],
      },
      loyaltyPoints: 50,
      totalSpent: 0,
      notes: newBrideForm.notes,
      riskRating: "LOW",
      createdAt: new Date().toISOString().split("T")[0],
    };

    onAddNewCustomer(newCust);
    setSelectedCustomer(newCust);
    setMeasurementsForm(newCust.measurements);
    setIsAddModalOpen(false);
    alert(`تم تسجيل ملف العروس ${newCust.fullName} بنجاح! 👰`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif-luxury tracking-tight">
            سجل العرائس وجدول قياسات الخياطة (Bride CRM & Measurement Sheet)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ملفات رقمية دقيقة لمقاسات العرائس، مواعيد الأعراس، التوجيهات الفنية لمشغل الخياطة، والمراسلة المباشرة.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل عروس جديدة</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Brides List (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث باسم العروس أو الهاتف..."
                className="w-full bg-white border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredCustomers.map((cust) => {
              const isSelected = selectedCustomer?.id === cust.id;
              return (
                <div
                  key={cust.id}
                  onClick={() => handleSelectCustomer(cust)}
                  className={`p-3.5 cursor-pointer transition-colors text-xs space-y-1.5 ${
                    isSelected ? "bg-amber-50/90 border-r-4 border-amber-600" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{cust.fullName}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {cust.customerCode}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {cust.phone}
                    </span>
                    <span className="font-bold text-purple-700">
                      زفاف: {cust.weddingDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Bride Card & Measurement Sheet (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          {selectedCustomer ? (
            <>
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 font-serif-luxury">
                      {selectedCustomer.fullName}
                    </h2>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                      عروس مميزة (VIP)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    الهاتف: <span className="font-mono font-semibold text-slate-700">{selectedCustomer.phone}</span> | العنوان: {selectedCustomer.address}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>مراسلة واتساب</span>
                  </a>
                </div>
              </div>

              {/* Body Measurement Card (Sheet) */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-amber-700" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        كارت المقاسات المعتمد للخياط (Body Measurement Card)
                      </h3>
                      <span className="text-[11px] text-slate-500">
                        آخر تحديث: {selectedCustomer.measurements.updatedAt || "2026-08-28"}
                      </span>
                    </div>
                  </div>

                  {!isEditingMeasurements ? (
                    <button
                      onClick={() => setIsEditingMeasurements(true)}
                      className="flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 bg-white border border-amber-200 px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>تعديل المقاسات</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveMeasurements}
                      className="flex items-center gap-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-lg shadow-xs cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>حفظ المقاسات</span>
                    </button>
                  )}
                </div>

                {/* Measurement inputs/display */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] text-slate-400 font-bold block mb-1">محيط الصدر (Bust)</span>
                    {isEditingMeasurements ? (
                      <input
                        type="number"
                        value={measurementsForm.bust}
                        onChange={(e) => setMeasurementsForm({ ...measurementsForm, bust: Number(e.target.value) })}
                        className="w-full text-center font-bold text-amber-900 border border-slate-300 rounded p-1 text-sm"
                      />
                    ) : (
                      <span className="text-lg font-black text-amber-900">{selectedCustomer.measurements.bust} <span className="text-xs font-normal">سم</span></span>
                    )}
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] text-slate-400 font-bold block mb-1">محيط الخصر (Waist)</span>
                    {isEditingMeasurements ? (
                      <input
                        type="number"
                        value={measurementsForm.waist}
                        onChange={(e) => setMeasurementsForm({ ...measurementsForm, waist: Number(e.target.value) })}
                        className="w-full text-center font-bold text-amber-900 border border-slate-300 rounded p-1 text-sm"
                      />
                    ) : (
                      <span className="text-lg font-black text-amber-900">{selectedCustomer.measurements.waist} <span className="text-xs font-normal">سم</span></span>
                    )}
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] text-slate-400 font-bold block mb-1">محيط الأرداف (Hips)</span>
                    {isEditingMeasurements ? (
                      <input
                        type="number"
                        value={measurementsForm.hips}
                        onChange={(e) => setMeasurementsForm({ ...measurementsForm, hips: Number(e.target.value) })}
                        className="w-full text-center font-bold text-amber-900 border border-slate-300 rounded p-1 text-sm"
                      />
                    ) : (
                      <span className="text-lg font-black text-amber-900">{selectedCustomer.measurements.hips} <span className="text-xs font-normal">سم</span></span>
                    )}
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] text-slate-400 font-bold block mb-1">الطول للأرض (Hem)</span>
                    {isEditingMeasurements ? (
                      <input
                        type="number"
                        value={measurementsForm.hollowToHem}
                        onChange={(e) => setMeasurementsForm({ ...measurementsForm, hollowToHem: Number(e.target.value) })}
                        className="w-full text-center font-bold text-purple-900 border border-slate-300 rounded p-1 text-sm"
                      />
                    ) : (
                      <span className="text-lg font-black text-purple-900">{selectedCustomer.measurements.hollowToHem} <span className="text-xs font-normal">سم</span></span>
                    )}
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] text-slate-400 font-bold block mb-1">ارتفاع الكعب (Heel)</span>
                    {isEditingMeasurements ? (
                      <input
                        type="number"
                        value={measurementsForm.heelHeight}
                        onChange={(e) => setMeasurementsForm({ ...measurementsForm, heelHeight: Number(e.target.value) })}
                        className="w-full text-center font-bold text-purple-900 border border-slate-300 rounded p-1 text-sm"
                      />
                    ) : (
                      <span className="text-lg font-black text-purple-900">{selectedCustomer.measurements.heelHeight} <span className="text-xs font-normal">سم</span></span>
                    )}
                  </div>
                </div>

                {/* Seamstress Notes */}
                <div className="text-xs bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">توجيهات التعديل والتضييق لمسؤولة الخياطة:</span>
                  {isEditingMeasurements ? (
                    <textarea
                      rows={2}
                      value={measurementsForm.notes || ""}
                      onChange={(e) => setMeasurementsForm({ ...measurementsForm, notes: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none"
                    />
                  ) : (
                    <p className="text-slate-600 italic">
                      "{selectedCustomer.measurements.notes || "لا توجد تعديلات خاصة، المقاس قياسي ومطابق."}"
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400">اختر عروساً من القائمة لعرض التفاصيل</div>
          )}
        </div>
      </div>

      {/* Add Bride Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
                تسجيل عروس جديدة وأخذ القياسات
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBrideSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">الاسم الكامل للعروس:</label>
                <input
                  type="text"
                  required
                  value={newBrideForm.fullName}
                  onChange={(e) => setNewBrideForm({ ...newBrideForm, fullName: e.target.value })}
                  placeholder="مثال: ريم خالد القحطاني"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">رقم الهاتف (الواتساب):</label>
                  <input
                    type="tel"
                    required
                    value={newBrideForm.phone}
                    onChange={(e) => setNewBrideForm({ ...newBrideForm, phone: e.target.value })}
                    placeholder="05xxxxxxxx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">تاريخ حفل الزفاف:</label>
                  <input
                    type="date"
                    required
                    value={newBrideForm.weddingDate}
                    onChange={(e) => setNewBrideForm({ ...newBrideForm, weddingDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-bold text-purple-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الصدر (سم):</label>
                  <input
                    type="number"
                    value={newBrideForm.bust}
                    onChange={(e) => setNewBrideForm({ ...newBrideForm, bust: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded p-1.5 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الخصر (سم):</label>
                  <input
                    type="number"
                    value={newBrideForm.waist}
                    onChange={(e) => setNewBrideForm({ ...newBrideForm, waist: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded p-1.5 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الأرداف (سم):</label>
                  <input
                    type="number"
                    value={newBrideForm.hips}
                    onChange={(e) => setNewBrideForm({ ...newBrideForm, hips: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded p-1.5 text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ملاحظات التعديل والتفضيلات:</label>
                <textarea
                  rows={2}
                  value={newBrideForm.notes}
                  onChange={(e) => setNewBrideForm({ ...newBrideForm, notes: e.target.value })}
                  placeholder="تفضيلات قصة الفستان، التطريز، أو موعد البروفة..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors cursor-pointer shadow-xs"
                >
                  حفظ وتأكيد ملف العروس
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
