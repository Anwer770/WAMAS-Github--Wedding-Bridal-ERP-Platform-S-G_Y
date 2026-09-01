import React, { useState } from "react";
import {
  Scissors,
  Plus,
  Camera,
  Layers,
  CheckCircle2,
  DollarSign,
  PackageCheck,
  AlertTriangle,
  Clock,
  Printer
} from "lucide-react";
import { ManufacturingOrder } from "../types/wamas";

interface ManufacturingOrderProps {
  orders: ManufacturingOrder[];
  currency: string;
  onAddNewOrder: (order: ManufacturingOrder) => void;
  onUpdateOrderStatus: (orderId: string, status: ManufacturingOrder["status"], qcApproved: boolean) => void;
}

export const ManufacturingOrderComponent: React.FC<ManufacturingOrderProps> = ({
  orders,
  currency,
  onAddNewOrder,
  onUpdateOrderStatus,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<ManufacturingOrder>(orders[0] || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New MO Form
  const [newMOForm, setNewMOForm] = useState({
    title: "",
    dressCategory: "WEDDING_ROYAL",
    targetSize: "38",
    color: "أوف وايت لؤلؤي",
    assignedTailor: "المعلمة أمينة - خبيرة فساتين الزفاف",
    laborCost: 900,
    overheadCost: 200,
    dueDate: "2026-09-20",
    notes: "",
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMOForm.title) return;

    const newMoNumber = `MO-2026-${String(orders.length + 1).padStart(3, "0")}`;
    const defaultMaterials = [
      { id: "m1", name: "تُل فرنسي حريري طبقات", quantity: 15, unit: "متر", unitCost: 45, totalCost: 675 },
      { id: "m2", name: "دانتيل كوردونيه مطرز بالزيركون", quantity: 5, unit: "متر", unitCost: 120, totalCost: 600 },
      { id: "m3", name: "أحجار كرستال سواروفسكي ولؤلؤ", quantity: 1, unit: "طقم", unitCost: 400, totalCost: 400 },
    ];
    const materialsTotal = defaultMaterials.reduce((sum, m) => sum + m.totalCost, 0);

    const newMO: ManufacturingOrder = {
      id: `mo-${Date.now()}`,
      orderNumber: newMoNumber,
      title: newMOForm.title,
      dressCategory: newMOForm.dressCategory,
      targetSize: newMOForm.targetSize,
      color: newMOForm.color,
      status: "CUTTING",
      images: {
        collar: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=400&q=80",
        sleeve: "https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=400&q=80",
        front: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=400&q=80",
        back: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80",
      },
      bomMaterials: defaultMaterials,
      laborCost: Number(newMOForm.laborCost),
      overheadCost: Number(newMOForm.overheadCost),
      totalCost: materialsTotal + Number(newMOForm.laborCost) + Number(newMOForm.overheadCost),
      assignedTailor: newMOForm.assignedTailor,
      startDate: new Date().toISOString().split("T")[0],
      dueDate: newMOForm.dueDate,
      qcApproved: false,
      notes: newMOForm.notes,
    };

    onAddNewOrder(newMO);
    setSelectedOrder(newMO);
    setIsAddModalOpen(false);
    alert(`تم فتح أمر التصنيع ${newMoNumber} وتوجيه كارت الشغل للمشغل بنجاح! ✂️✨`);
  };

  const handleAdvanceStatus = (order: ManufacturingOrder) => {
    let nextStatus: ManufacturingOrder["status"] = "SEWING";
    let isQc = false;

    if (order.status === "DESIGN") nextStatus = "CUTTING";
    else if (order.status === "CUTTING") nextStatus = "SEWING";
    else if (order.status === "SEWING") nextStatus = "QC_INSPECTION";
    else if (order.status === "QC_INSPECTION") {
      nextStatus = "COMPLETED";
      isQc = true;
    }

    onUpdateOrderStatus(order.id, nextStatus, isQc);
    alert(`تم تحديث مرحلة أمر التصنيع إلى: ${nextStatus} 🧵`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif-luxury tracking-tight">
            إدارة التصنيع المخصص وأوامر الشغل في المشغل (Atelier & BOM)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            دورة تصنيع متكاملة تشمل الصور الأربع الإلزامية (الكوليه، الأكمام، الصدر، والظهر)، استهلاك المواد، والتكلفة المرجحة.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>فتح أمر تصنيع جديد (MO)</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Orders List (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-800 flex justify-between items-center">
            <span>أوامر التشغيل المفتوحة</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">{orders.length} أوامر</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {orders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-3.5 cursor-pointer transition-colors text-xs space-y-1.5 ${
                    isSelected ? "bg-purple-50/80 border-r-4 border-purple-700" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-900">{order.orderNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {order.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 line-clamp-1">{order.title}</h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>المعلمة: {order.assignedTailor}</span>
                    <span className="font-bold text-emerald-700">{order.totalCost} {currency}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details & 4 Mandatory Photos (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          {selectedOrder ? (
            <>
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded">
                      {selectedOrder.orderNumber}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 font-serif-luxury">
                      {selectedOrder.title}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    المقاس: {selectedOrder.targetSize} | اللون: {selectedOrder.color} | الاستحقاق: {selectedOrder.dueDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedOrder.status !== "COMPLETED" && (
                    <button
                      onClick={() => handleAdvanceStatus(selectedOrder)}
                      className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      نقل للمرحلة التالية ➔
                    </button>
                  )}
                </div>
              </div>

              {/* 4 Mandatory Inspection Photos (Section 19 in PRD) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-purple-600" />
                    <span>الصور الأربع الإلزامية للفحص والتنفيذ (الكوليه، الأكمام، الصدر، والخلف):</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    مكتملة 4/4 ✓
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 text-center text-xs">
                    <img
                      src={selectedOrder.images.collar}
                      alt="Collar"
                      className="w-full h-28 object-cover object-top"
                    />
                    <div className="p-1.5 font-bold text-slate-700">1. الكوليه (Collar)</div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 text-center text-xs">
                    <img
                      src={selectedOrder.images.sleeve}
                      alt="Sleeve"
                      className="w-full h-28 object-cover object-top"
                    />
                    <div className="p-1.5 font-bold text-slate-700">2. الأكمام (Sleeve)</div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 text-center text-xs">
                    <img
                      src={selectedOrder.images.front}
                      alt="Front"
                      className="w-full h-28 object-cover object-top"
                    />
                    <div className="p-1.5 font-bold text-slate-700">3. الصدر (Front)</div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 text-center text-xs">
                    <img
                      src={selectedOrder.images.back}
                      alt="Back"
                      className="w-full h-28 object-cover object-top"
                    />
                    <div className="p-1.5 font-bold text-slate-700">4. الظهر (Back)</div>
                  </div>
                </div>
              </div>

              {/* Bill of Materials (BOM) Consumption */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <span>قائمة الخامات والمواد المستهلكة (BOM):</span>
                  </span>
                  <span>
                    إجمالي الخامات:{" "}
                    {selectedOrder.bomMaterials.reduce((s, m) => s + m.totalCost, 0)} {currency}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="text-[11px] text-slate-400 border-b border-slate-200">
                      <tr>
                        <th className="pb-1">المادة الخام</th>
                        <th className="pb-1">الكمية المسحوبة</th>
                        <th className="pb-1">سعر الوحدة</th>
                        <th className="pb-1">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
                      {selectedOrder.bomMaterials.map((mat) => (
                        <tr key={mat.id}>
                          <td className="py-2">{mat.name}</td>
                          <td className="py-2">{mat.quantity} {mat.unit}</td>
                          <td className="py-2">{mat.unitCost} {currency}</td>
                          <td className="py-2 font-bold text-slate-900">{mat.totalCost} {currency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cost Summary Breakdown */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-1">أجر اليد والمصنعية:</span>
                  <span className="font-bold text-slate-800">{selectedOrder.laborCost} {currency}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-1">المصاريف غير المباشرة:</span>
                  <span className="font-bold text-slate-800">{selectedOrder.overheadCost} {currency}</span>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                  <span className="text-purple-800 font-bold block mb-1">إجمالي تكلفة المنتج النهائي:</span>
                  <span className="font-black text-base text-purple-950">{selectedOrder.totalCost} {currency}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400">اختر أمر تصنيع للمعاينة والتفاصيل</div>
          )}
        </div>
      </div>

      {/* Add MO Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
                فتح أمر تصنيع فستان جديد (MO)
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">اسم وموديل الفستان للتصنيع:</label>
                <input
                  type="text"
                  required
                  value={newMOForm.title}
                  onChange={(e) => setNewMOForm({ ...newMOForm, title: e.target.value })}
                  placeholder="مثال: فستان كوتور ملكي مرصع بالزيركون"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">المقاس المستهدف:</label>
                  <select
                    value={newMOForm.targetSize}
                    onChange={(e) => setNewMOForm({ ...newMOForm, targetSize: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium"
                  >
                    <option value="36">36 (Small)</option>
                    <option value="38">38 (Medium)</option>
                    <option value="40">40 (Large)</option>
                    <option value="42">42 (X-Large)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الخياطة المسؤولة:</label>
                  <input
                    type="text"
                    value={newMOForm.assignedTailor}
                    onChange={(e) => setNewMOForm({ ...newMOForm, assignedTailor: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">أجر المصنعية المباشر ({currency}):</label>
                  <input
                    type="number"
                    value={newMOForm.laborCost}
                    onChange={(e) => setNewMOForm({ ...newMOForm, laborCost: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-amber-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">تاريخ التسليم المتوقع:</label>
                  <input
                    type="date"
                    value={newMOForm.dueDate}
                    onChange={(e) => setNewMOForm({ ...newMOForm, dueDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold transition-colors cursor-pointer shadow-xs"
                >
                  تأكيد وتوجيه أمر الشغل
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
