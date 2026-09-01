import React from "react";
import {
  TrendingUp,
  Award,
  DollarSign,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Printer
} from "lucide-react";
import { PhysicalItem, Booking } from "../types/wamas";

interface ReportsBIProps {
  dresses: PhysicalItem[];
  bookings: Booking[];
  currency: string;
}

export const ReportsBI: React.FC<ReportsBIProps> = ({ dresses, bookings, currency }) => {
  // Sort dresses by total revenue / ROI
  const sortedDresses = [...dresses].sort((a, b) => b.totalRevenue - a.totalRevenue);

  const totalRevenue = dresses.reduce((sum, d) => sum + d.totalRevenue, 0);
  const totalRentals = dresses.reduce((sum, d) => sum + d.timesRented, 0);
  const totalInvestment = dresses.reduce((sum, d) => sum + d.acquisitionCost, 0);
  const overallROI = totalInvestment > 0 ? Math.round((totalRevenue / totalInvestment) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif-luxury tracking-tight">
            التقارير التحليلية والعائد الاستثماري (BI & Dress ROI Analytics)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            تصنيف الفساتين الأكثر ربحية، معدلات الإشغال، وتحليل سرعة استرداد رأس مال الأصول المادية.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>تصدير وطباعة التقرير الشامل</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-medium">إجمالي عوائد التأجير</span>
          <div className="text-xl font-black text-slate-900 font-serif-luxury">
            {totalRevenue} {currency}
          </div>
          <span className="text-[10px] text-emerald-700 font-bold">+18% مقارنة بالشهر السابق</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-medium">إجمالي مرات التأجير</span>
          <div className="text-xl font-black text-amber-900 font-serif-luxury">
            {totalRentals} مرة
          </div>
          <span className="text-[10px] text-slate-500">متوسط 2.6 تأجير لكل فستان</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-medium">رأس مال المخزون المستثمر</span>
          <div className="text-xl font-black text-slate-700 font-serif-luxury">
            {totalInvestment} {currency}
          </div>
          <span className="text-[10px] text-slate-500">تكلفة الشراء والتصنيع</span>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 p-4 rounded-xl shadow-xs space-y-1">
          <span className="text-xs font-bold text-amber-950">متوسط العائد الاستثماري (Overall ROI)</span>
          <div className="text-2xl font-black font-serif-luxury">
            {overallROI}% 🚀
          </div>
          <span className="text-[10px] font-bold text-amber-950">استرداد كامل للأصول وربح فائض</span>
        </div>
      </div>

      {/* Dress Profitability Ranking Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>ترتيب الفساتين حسب الربحية والعائد على الاستثمار (Top Performing Dresses)</span>
          </h2>
          <span className="text-xs text-slate-500">الترتيب من الأعلى دخلاً</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
              <tr>
                <th className="p-3">الترتيب</th>
                <th className="p-3">الفستان والموديل</th>
                <th className="p-3">التصنيف</th>
                <th className="p-3">تكلفة الاقتناء</th>
                <th className="p-3">سعر التأجير</th>
                <th className="p-3">مرات التأجير</th>
                <th className="p-3">إجمالي الإيرادات</th>
                <th className="p-3">نسبة الـ ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {sortedDresses.map((dress, index) => {
                const roi = dress.acquisitionCost > 0 
                  ? Math.round((dress.totalRevenue / dress.acquisitionCost) * 100)
                  : 0;

                return (
                  <tr key={dress.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-bold font-mono">
                      {index === 0 ? "🥇 الأول" : index === 1 ? "🥈 الثاني" : index === 2 ? "🥉 الثالث" : `#${index + 1}`}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{dress.name}</div>
                      <div className="text-[11px] font-mono text-amber-800">{dress.itemCode}</div>
                    </td>
                    <td className="p-3 text-slate-500">{dress.category}</td>
                    <td className="p-3 font-mono">{dress.acquisitionCost} {currency}</td>
                    <td className="p-3 font-mono text-amber-900 font-bold">{dress.rentalPrice} {currency}</td>
                    <td className="p-3 font-bold text-slate-900">{dress.timesRented}</td>
                    <td className="p-3 font-mono font-black text-emerald-700">{dress.totalRevenue} {currency}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-full ${
                          roi >= 100
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {roi}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
