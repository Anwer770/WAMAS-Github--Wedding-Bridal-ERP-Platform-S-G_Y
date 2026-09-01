import React, { useState } from "react";
import {
  Shield,
  FileText,
  Printer,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  DollarSign,
  Lock,
  Unlock,
  Eye,
  RotateCcw,
  Sparkles,
  Signature
} from "lucide-react";
import { Booking, CollateralRecord, PhysicalItem } from "../types/wamas";

interface RentalVaultProps {
  bookings: Booking[];
  collaterals: CollateralRecord[];
  dresses: PhysicalItem[];
  currency: string;
  onDeliverBooking: (bookingId: string) => void;
  onReturnBooking: (bookingId: string, damageDeduction: number, lateFee: number, notes: string) => void;
}

export const RentalVault: React.FC<RentalVaultProps> = ({
  bookings,
  collaterals,
  dresses,
  currency,
  onDeliverBooking,
  onReturnBooking,
}) => {
  const [activeTab, setActiveTab] = useState<"contracts" | "vault" | "returns">("contracts");
  const [selectedBookingForPrint, setSelectedBookingForPrint] = useState<Booking | null>(bookings[0] || null);
  const [returnModalBooking, setReturnModalBooking] = useState<Booking | null>(null);

  // Return assessment form
  const [damageFee, setDamageFee] = useState<number>(0);
  const [lateFee, setLateFee] = useState<number>(0);
  const [returnNotes, setReturnNotes] = useState<string>("الفستان بحالة ممتازة وكامل الملحقات");

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnModalBooking) return;

    onReturnBooking(returnModalBooking.id, damageFee, lateFee, returnNotes);
    setReturnModalBooking(null);
    alert("تم تسجيل إرجاع الفستان وفحص القطعة وتسوية الضمان بنجاح! 🧼🧺");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif-luxury tracking-tight">
            خزينة الضمانات والأمانات العينية وعقود التأجير الرسمية
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة عقود الإيجار، فحص التسليم والاستلام، وحفظ الضمانات (ذهب، أسلحة، وثائق، ونقد) في الخزينة.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab("contracts")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "contracts" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            عقود التأجير ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("vault")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "vault" ? "bg-white text-purple-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            خزينة الأمانات ({collaterals.length})
          </button>
        </div>
      </div>

      {/* View 1: Contracts List & Delivery/Return Actions */}
      {activeTab === "contracts" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Contracts List (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>عقود التأجير التشغيلية</span>
              </h2>
              <span className="text-xs text-slate-500">تطبيق شروط التسليم والاسترجاع</span>
            </div>

            <div className="divide-y divide-slate-100">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-4 hover:bg-slate-50/70 transition-colors space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                          {booking.contractNumber}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{booking.customerName}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        الفستان: <span className="font-bold text-amber-800">{booking.itemCode}</span> ({booking.itemName})
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        booking.status === "CONFIRMED"
                          ? "bg-blue-100 text-blue-800"
                          : booking.status === "DELIVERED"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {booking.status === "CONFIRMED" ? "بانتظار التسليم" : booking.status === "DELIVERED" ? "مُسلّم للعروس" : "مكتمل"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">الاستلام:</span>
                      <span className="font-semibold text-slate-800">{booking.deliveryDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">الإرجاع المتفق:</span>
                      <span className="font-semibold text-slate-800">{booking.returnDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">الرصيد المتبقي:</span>
                      <span className={`font-bold ${booking.remainingBalance > 0 ? "text-rose-600" : "text-emerald-700"}`}>
                        {booking.remainingBalance} {currency}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setSelectedBookingForPrint(booking)}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>معاينة وطباعة العقد A4</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {booking.status === "CONFIRMED" && (
                        <button
                          onClick={() => {
                            if (booking.remainingBalance > 0) {
                              alert(`تنبيه (القاعدة RN-20): لا يمكن تسليم الفستان قبل سداد المتبقي (${booking.remainingBalance} ${currency})`);
                              return;
                            }
                            onDeliverBooking(booking.id);
                            alert("تم تسجيل تسليم الفستان للعروس وتحديث عداد الإرجاع! 🟠");
                          }}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          إتمام التسليم للعروس (Check-out)
                        </button>
                      )}

                      {booking.status === "DELIVERED" && (
                        <button
                          onClick={() => setReturnModalBooking(booking)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>استرجاع وفحص وتسوية الأمانة</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Printable Official A4 Contract Preview (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            {selectedBookingForPrint ? (
              <div className="border border-slate-300 p-5 rounded-xl bg-slate-50/50 space-y-4 text-xs font-serif shadow-xs">
                {/* Contract Header */}
                <div className="text-center border-b-2 border-slate-800 pb-3">
                  <div className="text-amber-800 font-bold text-xs">الأسطورة لبيع وتأجير مستلزمات الأفراح</div>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5">
                    عقد إيجار فستان زفاف ومستلزمات أعراس رسمية
                  </h3>
                  <div className="text-[10px] text-slate-500 mt-1">
                    القاعدة – شارع الثورة الخلفي | هاتف: 777788929 – 783935986
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-mono mt-2 font-bold text-slate-700">
                    <span>رقم العقد: {selectedBookingForPrint.contractNumber}</span>
                    <span>رقم الحجز: {selectedBookingForPrint.bookingNumber}</span>
                  </div>
                </div>

                {/* Parties info */}
                <div className="space-y-1.5 text-[11px] bg-white p-2.5 rounded border border-slate-200">
                  <p><strong>المستأجرة (العروس):</strong> {selectedBookingForPrint.customerName}</p>
                  <p><strong>رقم الهاتف:</strong> {selectedBookingForPrint.customerPhone}</p>
                  <p><strong>تاريخ حفل الزفاف:</strong> {selectedBookingForPrint.eventDate}</p>
                </div>

                {/* Items & Financials */}
                <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1 text-[11px]">
                  <div className="font-bold text-slate-900">الأصناف والملحقات المؤجرة:</div>
                  <p className="text-slate-700">👗 {selectedBookingForPrint.itemCode} - {selectedBookingForPrint.itemName}</p>
                  <p className="text-slate-500">الملحقات: {selectedBookingForPrint.accessoriesIncluded.join(" ، ")}</p>
                  <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between font-bold">
                    <span>إجمالي الإيجار: {selectedBookingForPrint.totalPrice} {currency}</span>
                    <span>التأمين المحتجز: {selectedBookingForPrint.securityDepositAmount} {currency}</span>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-2 text-[10px] bg-amber-50/60 p-2 rounded border border-amber-200">
                  <div><strong>تاريخ التسليم:</strong> {selectedBookingForPrint.deliveryDate}</div>
                  <div><strong>تاريخ الإرجاع:</strong> {selectedBookingForPrint.returnDate}</div>
                </div>

                {/* Legal Terms snapshot */}
                <div className="text-[9px] text-slate-600 space-y-1 bg-white p-2 rounded border border-slate-200 leading-relaxed">
                  <p>• يلتزم المستأجر بإعادة الفستان في الموعد المحدد وبنفس الحالة دون أي قص أو تغيير خارجي.</p>
                  <p>• غرامة التأخير اليومية 15% من قيمة الإيجار اليومي وتخصم مباشرة من مبلغ التأمين.</p>
                  <p>• في حال التلف أو الحرق يتحمل المستأجر قيمة الإصلاح أو التعويض الكامل.</p>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-center text-[10px]">
                  <div>
                    <span className="block font-bold text-slate-700">توقيع المستأجرة:</span>
                    <div className="h-8 border-b border-dashed border-slate-400 mt-2 flex items-center justify-center text-slate-400 italic">
                      سارة المنصوري ✓
                    </div>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-700">ختم وتوقيع الأتيليه:</span>
                    <div className="h-8 border-b border-dashed border-slate-400 mt-2 flex items-center justify-center text-amber-800 font-bold">
                      الأسطورة للأعراس ⚜️
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="w-full py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة العقد الرسمي (نسخة A4)</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                اختر عقداً من القائمة للمعاينة والطباعة
              </div>
            )}
          </div>
        </div>
      )}

      {/* View 2: Collateral & Security Vault */}
      {activeTab === "vault" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-5 rounded-xl shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm font-serif-luxury">خزينة الأمانات والضمانات العينية المشفرة</h3>
                <p className="text-xs text-purple-200">
                  جميع الأمانات العينية والوثائق الشخصية تسجل برقم إيصال ومكان حفظ بالخزنة ولا تُحرر إلا بعد الفحص
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-purple-200 font-semibold">إجمالي الأمانات المودعة</div>
              <div className="text-lg font-black text-amber-300">
                {collaterals.filter((c) => c.status === "HELD_IN_VAULT").length} أمانات نشطة 🔒
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collaterals.map((col) => (
              <div
                key={col.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {col.receiptVoucherNo}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        col.status === "HELD_IN_VAULT"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {col.status === "HELD_IN_VAULT" ? "محفوظ بالخزينة 🔒" : "تم الإفراج والإرجاع 🟢"}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs">
                    {col.type === "GOLD" ? "👑 أمانة ذهب عيني" : col.type === "IDENTITY_DOC" ? "🪪 وثيقة شخصية" : "💵 تأمين نقدي"}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{col.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                  <div className="flex justify-between">
                    <span>موقع التخزين:</span>
                    <span className="font-bold text-slate-800">{col.vaultLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>القيمة التقديرية:</span>
                    <span className="font-black text-amber-800">
                      {col.estimatedValue > 0 ? `${col.estimatedValue} ${currency}` : "وثيقة رسمية"}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 text-left pt-1">
                    تاريخ الإيداع: {col.receivedAt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Return & Damage Settlement Modal */}
      {returnModalBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
                  استرجاع وفحص الفستان وتسوية الأمانة
                </h3>
                <p className="text-xs text-slate-500">
                  الحجز: {returnModalBooking.bookingNumber} | العروس: {returnModalBooking.customerName}
                </p>
              </div>
              <button onClick={() => setReturnModalBooking(null)} className="text-slate-400 hover:text-slate-600 p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReturn} className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>الفستان:</span>
                  <span className="text-amber-800">{returnModalBooking.itemCode} - {returnModalBooking.itemName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>مبلغ التأمين المحتجز:</span>
                  <span className="font-bold text-blue-700">{returnModalBooking.securityDepositAmount} {currency}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">غرامة التأخير (إن وجدت):</label>
                  <input
                    type="number"
                    value={lateFee}
                    onChange={(e) => setLateFee(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-rose-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">خصم تلفيات أو تنظيف إضافي:</label>
                  <input
                    type="number"
                    value={damageFee}
                    onChange={(e) => setDamageFee(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-rose-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">تقرير الفحص الفني والملاحظات:</label>
                <textarea
                  rows={2}
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-xs font-bold text-emerald-900">
                <span>المبلغ المسترد للعروس:</span>
                <span className="text-base font-black">
                  {Math.max(0, returnModalBooking.securityDepositAmount - damageFee - lateFee)} {currency}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors cursor-pointer shadow-xs"
                >
                  اعتماد الفحص واسترجاع الفستان للمغسلة
                </button>
                <button
                  type="button"
                  onClick={() => setReturnModalBooking(null)}
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
