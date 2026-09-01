import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  QrCode,
  Sparkles,
  Tag,
  DollarSign,
  Layers,
  CheckCircle2,
  RefreshCw,
  Scissors,
  Wrench,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  X
} from "lucide-react";
import { PhysicalItem, DressState } from "../types/wamas";

interface DressCatalogProps {
  dresses: PhysicalItem[];
  currency: string;
  onUpdateDressState: (dressId: string, newState: DressState, notes?: string) => void;
  onAddNewDress: (dress: PhysicalItem) => void;
  onOpenAIAnalyzer: () => void;
}

export const DressCatalog: React.FC<DressCatalogProps> = ({
  dresses,
  currency,
  onUpdateDressState,
  onAddNewDress,
  onOpenAIAnalyzer,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [selectedDressForQR, setSelectedDressForQR] = useState<PhysicalItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New dress form state
  const [newDressForm, setNewDressForm] = useState({
    name: "",
    category: "WEDDING_ROYAL" as PhysicalItem["category"],
    size: "38",
    color: "أوف وايت عاجي",
    fabric: "تُل فرنسي ودانتيل ملكي",
    rentalPrice: 1500,
    salePrice: 5000,
    securityDeposit: 750,
    acquisitionCost: 2500,
    locationInStore: "جناح A-01",
    imageUrl: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
    notes: "",
  });

  const filteredDresses = dresses.filter((dress) => {
    const matchesSearch =
      dress.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dress.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dress.fabric.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dress.color.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || dress.category === selectedCategory;

    const matchesState =
      selectedState === "ALL" || dress.state === selectedState;

    return matchesSearch && matchesCategory && matchesState;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDressForm.name) return;

    const newId = `dr-${Date.now()}`;
    const newCode = `DR-2026-${String(dresses.length + 1).padStart(3, "0")}`;

    const item: PhysicalItem = {
      id: newId,
      itemCode: newCode,
      name: newDressForm.name,
      category: newDressForm.category,
      size: newDressForm.size,
      color: newDressForm.color,
      fabric: newDressForm.fabric,
      state: "AVAILABLE",
      condition: "EXCELLENT",
      rentalPrice: Number(newDressForm.rentalPrice),
      salePrice: Number(newDressForm.salePrice),
      securityDeposit: Number(newDressForm.securityDeposit),
      acquisitionCost: Number(newDressForm.acquisitionCost),
      timesRented: 0,
      totalRevenue: 0,
      imageUrl: newDressForm.imageUrl,
      barcode: `6281002026${String(dresses.length + 1).padStart(3, "0")}`,
      branch: "الفرع الرئيسي - صالة العرض",
      locationInStore: newDressForm.locationInStore,
      notes: newDressForm.notes,
      createdAt: new Date().toISOString().split("T")[0],
    };

    onAddNewDress(item);
    setIsAddModalOpen(false);
    alert(`تم إضافة الفستان ${newCode} بنجاح! 🎉`);
  };

  const getStateBadge = (state: DressState) => {
    switch (state) {
      case "AVAILABLE":
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">🟢 متاح (Available)</span>;
      case "BOOKED":
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">🔵 محجوز (Booked)</span>;
      case "FITTING":
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">🟡 في البروفا (Fitting)</span>;
      case "DELIVERED":
        return <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-200">🟠 مُسلّم للعروس (Delivered)</span>;
      case "CLEANING":
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">🧺 بالمغسلة (Cleaning)</span>;
      case "ALTERATION":
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">✂️ في التعديل (Alteration)</span>;
      case "MAINTENANCE":
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">🔧 صيانة وترميم (Maintenance)</span>;
      case "DAMAGED":
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">❌ تالف (Damaged)</span>;
      case "SOLD":
        return <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-300">📦 مباع (Sold)</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{state}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif-luxury tracking-tight">
            كتالوج فساتين الزفاف والأصول المادية
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة دقيقة لكل قطعة برمز SKU/QR فريد، تتبع دورة الحياة (12 حالة)، وحساب العائد الاستثماري (ROI).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIAnalyzer}
            className="flex items-center gap-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
            <span>تحليل بالذكاء الاصطناعي</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة فستان جديد</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث برقم الموديل (DR-2026-...)، الاسم، نوع القماش، أو اللون..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">جميع التصنيفات</option>
            <option value="WEDDING_ROYAL">فساتين زفاف ملكية</option>
            <option value="CLASSIC_WHITE">فساتين كلاسيك وسيمبل</option>
            <option value="ENGAGEMENT">فساتين خطوبة</option>
            <option value="TRADITIONAL_KAFTAN">قفاطين وحناء تقليدية</option>
            <option value="EVENING">فساتين سهرة ومناسبات</option>
          </select>
        </div>

        {/* State Filter */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-transparent font-bold focus:outline-none cursor-pointer"
          >
            <option value="ALL">جميع الحالات التشغيلية</option>
            <option value="AVAILABLE">🟢 متاح (Available)</option>
            <option value="BOOKED">🔵 محجوز (Booked)</option>
            <option value="FITTING">🟡 في البروفا (Fitting)</option>
            <option value="DELIVERED">🟠 مُسلّم (Delivered)</option>
            <option value="CLEANING">🧺 في الغسيل (Cleaning)</option>
            <option value="ALTERATION">✂️ في التعديل (Alteration)</option>
            <option value="MAINTENANCE">🔧 صيانة (Maintenance)</option>
            <option value="DAMAGED">❌ تالف (Damaged)</option>
            <option value="SOLD">📦 مباع (Sold)</option>
          </select>
        </div>

        <span className="text-xs font-semibold text-slate-500 mr-auto">
          العدد المعروض: {filteredDresses.length} فستان
        </span>
      </div>

      {/* Dresses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDresses.map((dress) => {
          const roiPercentage = dress.acquisitionCost > 0 
            ? Math.round((dress.totalRevenue / dress.acquisitionCost) * 100)
            : 0;

          return (
            <div
              key={dress.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Image & Quick badges */}
                <div className="relative h-64 bg-slate-100 overflow-hidden">
                  <img
                    src={dress.imageUrl}
                    alt={dress.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 flex flex-col gap-1">
                    <span className="font-mono text-xs font-black bg-slate-900/80 text-white backdrop-blur-xs px-2 py-0.5 rounded shadow-sm">
                      {dress.itemCode}
                    </span>
                    {getStateBadge(dress.state)}
                  </div>

                  <button
                    onClick={() => setSelectedDressForQR(dress)}
                    className="absolute bottom-2.5 left-2.5 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-lg shadow-sm backdrop-blur-xs transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-amber-700" />
                    <span>ملصق QR</span>
                  </button>

                  <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[11px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                    مقاس: {dress.size} | {dress.color}
                  </div>
                </div>

                {/* Info body */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-serif-luxury line-clamp-1">
                      {dress.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {dress.fabric}
                    </p>
                  </div>

                  {/* Financial structure */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">سعر التأجير</span>
                      <span className="font-bold text-amber-800">{dress.rentalPrice} {currency}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">التأمين المسترد</span>
                      <span className="font-bold text-blue-700">{dress.securityDeposit} {currency}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">سعر البيع</span>
                      <span className="font-bold text-emerald-700">{dress.salePrice} {currency}</span>
                    </div>
                  </div>

                  {/* Stats & ROI */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <div>
                      مرات التأجير: <span className="font-bold text-slate-800">{dress.timesRented}</span>
                    </div>
                    <div>
                      العائد ROI:{" "}
                      <span className={`font-black ${roiPercentage >= 100 ? "text-emerald-700" : "text-amber-700"}`}>
                        {roiPercentage}%
                      </span>
                    </div>
                    <div>
                      الموقع: <span className="font-semibold text-slate-700">{dress.locationInStore}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* State Transition Actions */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                <span className="text-[11px] font-bold text-slate-500">نقل الحالة:</span>
                <div className="flex items-center gap-1">
                  {dress.state !== "AVAILABLE" && (
                    <button
                      onClick={() => onUpdateDressState(dress.id, "AVAILABLE", "تم إعادته لصالة العرض")}
                      title="تحويل لمتاح"
                      className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      إتاحة 🟢
                    </button>
                  )}
                  {dress.state !== "CLEANING" && (
                    <button
                      onClick={() => onUpdateDressState(dress.id, "CLEANING", "إرسال للمغسلة للتنظيف الجاف")}
                      title="إرسال للمغسلة"
                      className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded font-bold hover:bg-purple-100 transition-colors cursor-pointer"
                    >
                      غسيل 🧺
                    </button>
                  )}
                  {dress.state !== "ALTERATION" && (
                    <button
                      onClick={() => onUpdateDressState(dress.id, "ALTERATION", "تحويل لمشغل الخياطة والتعديل")}
                      title="تحويل للتعديل"
                      className="px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
                    >
                      خياطة ✂️
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* QR Code Printable Modal */}
      {selectedDressForQR && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-500">ملصق الباركود و QR الفستان</span>
              <button
                onClick={() => setSelectedDressForQR(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center space-y-2">
              {/* Simulated QR graphic */}
              <div className="w-36 h-36 bg-white p-2 border-2 border-slate-800 rounded-lg flex items-center justify-center shadow-inner">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>
              <div className="font-mono font-black text-sm text-slate-900 tracking-wider">
                {selectedDressForQR.itemCode}
              </div>
              <div className="text-xs font-bold text-amber-900">
                {selectedDressForQR.name}
              </div>
              <div className="text-[11px] text-slate-500">
                المقاس: {selectedDressForQR.size} | التأجير: {selectedDressForQR.rentalPrice} {currency}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                طباعة الملصق الحراري 80mm
              </button>
              <button
                onClick={() => setSelectedDressForQR(null)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Dress Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
                  إضافة فستان جديد إلى أسطول الأتيليه
                </h3>
                <p className="text-xs text-slate-500">سيتم توليد كود SKU وباركود تسلسلي فريد تلقائياً</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">اسم وموديل الفستان:</label>
                <input
                  type="text"
                  required
                  value={newDressForm.name}
                  onChange={(e) => setNewDressForm({ ...newDressForm, name: e.target.value })}
                  placeholder="مثال: فستان كوتور دوقة أكسفورد"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">التصنيف:</label>
                  <select
                    value={newDressForm.category}
                    onChange={(e) => setNewDressForm({ ...newDressForm, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium focus:outline-none"
                  >
                    <option value="WEDDING_ROYAL">فساتين زفاف ملكية</option>
                    <option value="CLASSIC_WHITE">فساتين كلاسيك وسيمبل</option>
                    <option value="ENGAGEMENT">فساتين خطوبة</option>
                    <option value="TRADITIONAL_KAFTAN">قفاطين وحناء تقليدية</option>
                    <option value="EVENING">فساتين سهرة</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">المقاس القياسي:</label>
                  <select
                    value={newDressForm.size}
                    onChange={(e) => setNewDressForm({ ...newDressForm, size: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium focus:outline-none"
                  >
                    <option value="36">36 (Small)</option>
                    <option value="38">38 (Medium)</option>
                    <option value="40">40 (Large)</option>
                    <option value="42">42 (X-Large)</option>
                    <option value="44">44 (XX-Large)</option>
                    <option value="Free Size">Free Size (رباط خلفي مرن)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">اللون:</label>
                  <input
                    type="text"
                    value={newDressForm.color}
                    onChange={(e) => setNewDressForm({ ...newDressForm, color: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الموقع في المعرض:</label>
                  <input
                    type="text"
                    value={newDressForm.locationInStore}
                    onChange={(e) => setNewDressForm({ ...newDressForm, locationInStore: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">الأقمشة وتفاصيل التطريز:</label>
                <input
                  type="text"
                  value={newDressForm.fabric}
                  onChange={(e) => setNewDressForm({ ...newDressForm, fabric: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">سعر التأجير ({currency}):</label>
                  <input
                    type="number"
                    required
                    value={newDressForm.rentalPrice}
                    onChange={(e) => setNewDressForm({ ...newDressForm, rentalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-amber-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">التأمين المسترد ({currency}):</label>
                  <input
                    type="number"
                    required
                    value={newDressForm.securityDeposit}
                    onChange={(e) => setNewDressForm({ ...newDressForm, securityDeposit: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-blue-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">سعر البيع ({currency}):</label>
                  <input
                    type="number"
                    required
                    value={newDressForm.salePrice}
                    onChange={(e) => setNewDressForm({ ...newDressForm, salePrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-emerald-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">رابط صورة الفستان:</label>
                <input
                  type="text"
                  value={newDressForm.imageUrl}
                  onChange={(e) => setNewDressForm({ ...newDressForm, imageUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors shadow-xs cursor-pointer"
                >
                  حفظ وتكويد الفستان
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
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
