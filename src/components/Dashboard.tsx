import React from "react";
import {
  TrendingUp,
  DollarSign,
  Shirt,
  CalendarCheck2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  PackageCheck,
  UserCheck
} from "lucide-react";
import { PhysicalItem, Booking, Customer, CollateralRecord, ManufacturingOrder } from "../types/wamas";

interface DashboardProps {
  dresses: PhysicalItem[];
  bookings: Booking[];
  customers: Customer[];
  collaterals: CollateralRecord[];
  manufacturingOrders: ManufacturingOrder[];
  currency: string;
  onNavigate: (tab: any) => void;
  onOpenAIModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  dresses,
  bookings,
  customers,
  collaterals,
  manufacturingOrders,
  currency,
  onNavigate,
  onOpenAIModal,
}) => {
  // Calculations
  const totalRentalRevenue = bookings.reduce((sum, b) => sum + (b.depositPaid || 0), 0);
  const totalOutstandingBalance = bookings.reduce((sum, b) => sum + (b.remainingBalance || 0), 0);
  const totalSecurityHeld = collaterals
    .filter((c) => c.status === "HELD_IN_VAULT")
    .reduce((sum, c) => sum + (c.cashAmount || c.estimatedValue || 0), 0);

  const availableCount = dresses.filter((d) => d.state === "AVAILABLE").length;
  const bookedCount = dresses.filter((d) => d.state === "BOOKED").length;
  const fittingCount = dresses.filter((d) => d.state === "FITTING").length;
  const deliveredCount = dresses.filter((d) => d.state === "DELIVERED").length;
  const cleaningCount = dresses.filter((d) => d.state === "CLEANING").length;
  const alterationCount = dresses.filter((d) => d.state === "ALTERATION").length;

  const urgentBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "DELIVERED"
  );

  return (
    <div className="space-y-6">
      {/* Top Banner with AI Callout */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-amber-100 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              لوحة التحكم والمؤشرات اللحظية
            </span>
            <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
              محدث الآن 🟢
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif-luxury tracking-tight">
            مرحباً بك في نظام إدارة وتأجير فساتين الأعراس (WAMAS ERP)
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm max-w-xl">
            إدارة مركزية للفساتين، الحجوزات المانعة للتعارض الزمني، الخزينة والضمانات، وأوامر التصنيع والخياطة.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2">
          <button
            onClick={onOpenAIModal}
            className="flex items-center gap-2 bg-white text-amber-900 hover:bg-amber-50 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
            <span>فحص الفستان بالذكاء الاصطناعي</span>
          </button>

          <button
            onClick={() => onNavigate("bookings")}
            className="flex items-center gap-2 bg-amber-500/30 hover:bg-amber-500/40 text-white border border-white/20 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <CalendarCheck2 className="w-4 h-4" />
            <span>إنشاء حجز جديد</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي التحصيل الفعلي</span>
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-serif-luxury">
              {totalRentalRevenue.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500 mr-1.5">{currency}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>محصل من عقود التأجير والعرابين</span>
          </div>
        </div>

        {/* Outstanding Receivables */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">متبقي الذمم والديون</span>
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-serif-luxury">
              {totalOutstandingBalance.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500 mr-1.5">{currency}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-600 font-bold">
            <span>تُستحق وتُسدد قبل التسليم</span>
          </div>
        </div>

        {/* Security Vault Held */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">أمانات الخزينة المحتجزة</span>
            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-serif-luxury">
              {totalSecurityHeld.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500 mr-1.5">{currency}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-purple-700 font-semibold">
            <span>{collaterals.filter((c) => c.status === "HELD_IN_VAULT").length} أمانة (ذهب / نقد / وثائق)</span>
          </div>
        </div>

        {/* Active Dress Fleet */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">جاهزية أسطول الفساتين</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Shirt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-serif-luxury">
              {availableCount} <span className="text-sm font-normal text-slate-400">/ {dresses.length}</span>
            </span>
            <span className="text-xs font-bold text-slate-500 mr-1.5">متاح حالياً</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>جاهز للحجز الفوري والتجربة</span>
          </div>
        </div>
      </div>

      {/* Dress 12-State Lifecycle Breakdown Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shirt className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-800">
              توزيع حالات فساتين الزفاف (12-State Lifecycle Matrix)
            </h2>
          </div>
          <button
            onClick={() => onNavigate("dresses")}
            className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>استعراض الكتالوج الكامل</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-center">
            <span className="text-emerald-800 font-bold text-xs block">🟢 متاح (Available)</span>
            <span className="text-lg font-black text-emerald-900">{availableCount}</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-center">
            <span className="text-blue-800 font-bold text-xs block">🔵 محجوز (Booked)</span>
            <span className="text-lg font-black text-blue-900">{bookedCount}</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-center">
            <span className="text-amber-800 font-bold text-xs block">🟡 في البروفا (Fitting)</span>
            <span className="text-lg font-black text-amber-900">{fittingCount}</span>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 text-center">
            <span className="text-orange-800 font-bold text-xs block">🟠 مُسلّم (Delivered)</span>
            <span className="text-lg font-black text-orange-900">{deliveredCount}</span>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5 text-center">
            <span className="text-purple-800 font-bold text-xs block">🧺 بالمغسلة (Cleaning)</span>
            <span className="text-lg font-black text-purple-900">{cleaningCount}</span>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-center">
            <span className="text-rose-800 font-bold text-xs block">✂️ تعديل (Alteration)</span>
            <span className="text-lg font-black text-rose-900">{alterationCount}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Bookings & Top Performing Dresses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Table Column (8 Cols): Upcoming Bookings & Delivery Schedule */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck2 className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-800">
                جدول التسليمات والبروفات المؤكدة (مع تطبيق هامش الـ 48 ساعة)
              </h2>
            </div>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {urgentBookings.length} حجوزات نشطة
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                <tr>
                  <th className="p-3">رقم الحجز</th>
                  <th className="p-3">اسم العروس</th>
                  <th className="p-3">الفستان المحجوز</th>
                  <th className="p-3">موعد البروفة</th>
                  <th className="p-3">تاريخ الزفاف</th>
                  <th className="p-3">الدفعة / المتبقي</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {urgentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">{b.bookingNumber}</td>
                    <td className="p-3 font-bold text-slate-900">{b.customerName}</td>
                    <td className="p-3">
                      <span className="font-semibold text-amber-800">{b.itemCode}</span> - {b.itemName}
                    </td>
                    <td className="p-3 text-slate-600">{b.fittingDate}</td>
                    <td className="p-3 font-bold text-purple-700">{b.eventDate}</td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-bold">{b.depositPaid}</span> /{" "}
                      <span className="text-rose-600">{b.remainingBalance} {currency}</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === "CONFIRMED"
                            ? "bg-blue-100 text-blue-800"
                            : b.status === "DELIVERED"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {b.status === "CONFIRMED" ? "مؤكد بعربون" : b.status === "DELIVERED" ? "تم التسليم" : "مكتمل"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onNavigate("vault")}
                        className="text-xs font-bold text-amber-700 hover:text-amber-900 px-2 py-1 bg-amber-50 rounded border border-amber-200 transition-colors cursor-pointer"
                      >
                        العقد والأمانات
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (4 Cols): Top Dresses & Atelier Orders */}
        <div className="lg:col-span-4 space-y-4">
          {/* Top Revenue Dresses */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>الفساتين الأعلى عائداً استثمارياً (Top ROI)</span>
            </h2>
            <div className="space-y-3">
              {dresses.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 hover:border-amber-200 transition-colors"
                >
                  <img
                    src={d.imageUrl}
                    alt={d.name}
                    className="w-12 h-12 rounded-lg object-cover object-top border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1 text-xs">
                    <h3 className="font-bold text-slate-900 truncate">{d.name}</h3>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>تأجير: {d.timesRented} مرات</span>
                      <span className="font-black text-emerald-700">
                        {d.totalRevenue.toLocaleString()} {currency}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Atelier Manufacturing Orders */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-purple-600" />
                <span>أوامر تصنيع المشغل (MO)</span>
              </div>
              <button
                onClick={() => onNavigate("manufacturing")}
                className="text-[11px] text-purple-700 font-bold hover:underline cursor-pointer"
              >
                المشغل
              </button>
            </h2>

            {manufacturingOrders.slice(0, 2).map((mo) => (
              <div key={mo.id} className="p-3 bg-purple-50/40 border border-purple-100 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-950">{mo.orderNumber}</span>
                  <span className="bg-purple-200 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded">
                    مرحلة الخياطة والشك
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-1">{mo.title}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-purple-100/80">
                  <span>المعلمة: {mo.assignedTailor}</span>
                  <span className="font-bold text-purple-800">التكلفة: {mo.totalCost} {currency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
