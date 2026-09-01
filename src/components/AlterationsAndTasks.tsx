import React, { useState } from "react";
import {
  Scissors,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  User,
  Ruler
} from "lucide-react";
import { AlterationOrder, Customer, PhysicalItem } from "../types/wamas";

interface AlterationsAndTasksProps {
  alterations: AlterationOrder[];
  customers: Customer[];
  dresses: PhysicalItem[];
  currency: string;
  onUpdateAlterationStatus: (orderId: string, status: AlterationOrder["status"]) => void;
  onAddNewAlteration: (order: AlterationOrder) => void;
}

export const AlterationsAndTasks: React.FC<AlterationsAndTasksProps> = ({
  alterations,
  customers,
  dresses,
  currency,
  onUpdateAlterationStatus,
  onAddNewAlteration,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || "");
  const [selectedDressId, setSelectedDressId] = useState(dresses[0]?.id || "");
  const [seamstressName, setSeamstressName] = useState("المعلمة فاطمة - قسم التعديل");
  const [fittingDate, setFittingDate] = useState("2026-09-18");
  const [deliveryDate, setDeliveryDate] = useState("2026-09-22");
  const [modifications, setModifications] = useState("تضييق الخصر 2 سم وقصر الطول للأرض 3 سم");
  const [cost, setCost] = useState<number>(80);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === selectedCustomerId);
    const dr = dresses.find((d) => d.id === selectedDressId);
    if (!cust || !dr) return;

    const newOrder: AlterationOrder = {
      id: `alt-${Date.now()}`,
      orderNumber: `ALT-2026-${String(alterations.length + 1).padStart(3, "0")}`,
      customerId: cust.id,
      customerName: cust.fullName,
      itemId: dr.id,
      itemName: dr.name,
      seamstressName,
      status: "IN_PROGRESS",
      fittingDate,
      deliveryDate,
      modificationsNeeded: modifications,
      cost,
      paid: true,
      notes: "تم أخذ مقاسات البروفة بالكامل",
    };

    onAddNewAlteration(newOrder);
    setIsAddModalOpen(false);
    alert("تم إصدار كارت أمر التعديل والبروفة بنجاح! ✂️👗");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif-luxury tracking-tight">
            مشغل التعديلات ومواعيد البروفات (Alterations & Fitting Board)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            متابعة أوامر تضييق وتوسيع الفساتين، قص الطول، وتنسيق مواعيد بروفات العرائس المسبقة.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>كارت تعديل جديد</span>
        </button>
      </div>

      {/* Alterations Kanban / Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {alterations.map((alt) => (
          <div
            key={alt.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded border border-indigo-200">
                  {alt.orderNumber}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    alt.status === "COMPLETED"
                      ? "bg-emerald-100 text-emerald-800"
                      : alt.status === "READY_FOR_FITTING"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {alt.status === "COMPLETED"
                    ? "جاهز للتسليم ✓"
                    : alt.status === "READY_FOR_FITTING"
                    ? "جاهز للبروفة 👗"
                    : "قيد التنفيذ ✂️"}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{alt.customerName}</span>
                </h3>
                <p className="text-xs text-amber-900 font-semibold mt-0.5">
                  👗 {alt.itemName}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-slate-700 flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-indigo-600" />
                  <span>المطلوب تنفيذه:</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {alt.modificationsNeeded}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">تاريخ البروفة:</span>
                  <span className="font-bold text-purple-700">{alt.fittingDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">تاريخ التسليم:</span>
                  <span className="font-bold text-slate-800">{alt.deliveryDate}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">المعلمة: {alt.seamstressName.split("-")[0]}</span>
              {alt.status !== "COMPLETED" && (
                <button
                  onClick={() => onUpdateAlterationStatus(alt.id, "COMPLETED")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  اعتماد اكتمال التعديل ✓
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
                إصدار كارت أمر تعديل فستان (Alteration Order)
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">العروس:</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} - {c.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">الفستان المراد تعديله:</label>
                <select
                  value={selectedDressId}
                  onChange={(e) => setSelectedDressId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium"
                >
                  {dresses.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.itemCode} - {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">موعد البروفة:</label>
                  <input
                    type="date"
                    required
                    value={fittingDate}
                    onChange={(e) => setFittingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">موعد التسليم النهائي:</label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">تفاصيل التعديلات المطلوبة للخياطة:</label>
                <textarea
                  rows={2}
                  required
                  value={modifications}
                  onChange={(e) => setModifications(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors cursor-pointer shadow-xs"
                >
                  إرسال لمشغل التعديل
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
