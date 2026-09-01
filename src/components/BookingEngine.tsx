import React, { useState } from "react";
import {
  CalendarDays,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  Plus,
  ArrowRight,
  Sparkles,
  Info,
  Calendar as CalendarIcon
} from "lucide-react";
import { PhysicalItem, Booking, Customer, CollateralRecord } from "../types/wamas";

interface BookingEngineProps {
  dresses: PhysicalItem[];
  bookings: Booking[];
  customers: Customer[];
  currency: string;
  onAddBooking: (booking: Booking) => void;
}

export const BookingEngine: React.FC<BookingEngineProps> = ({
  dresses,
  bookings,
  customers,
  currency,
  onAddBooking,
}) => {
  // Availability Tester State
  const [testDressId, setTestDressId] = useState<string>(dresses[0]?.id || "");
  const [testStartDate, setTestStartDate] = useState<string>("2026-09-10");
  const [testEndDate, setTestEndDate] = useState<string>("2026-09-14");
  const [availabilityResult, setAvailabilityResult] = useState<{
    available: boolean;
    conflictingBooking?: Booking;
    reason?: string;
  } | null>(null);

  // New Booking Wizard Modal State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || "");
  const [selectedDressId, setSelectedDressId] = useState<string>(dresses[0]?.id || "");
  const [eventDate, setEventDate] = useState<string>("2026-09-25");
  const [fittingDate, setFittingDate] = useState<string>("2026-09-20");
  const [deliveryDate, setDeliveryDate] = useState<string>("2026-09-23");
  const [returnDate, setReturnDate] = useState<string>("2026-09-27");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [advancePaid, setAdvancePaid] = useState<number>(500);
  const [securityDepositType, setSecurityDepositType] = useState<"CASH" | "GOLD" | "IDENTITY_DOC">("CASH");
  const [collateralDescription, setCollateralDescription] = useState<string>("مبلغ تأمين نقدي مسترد");

  // Conflict Checking Function (enforcing 48-Hour Buffer)
  const checkConflict = (dressId: string, startStr: string, endStr: string): { available: boolean; conflictingBooking?: Booking; reason?: string } => {
    const dress = dresses.find((d) => d.id === dressId);
    if (!dress) return { available: false, reason: "الفستان غير موجود" };

    if (dress.state === "SOLD" || dress.state === "DAMAGED" || dress.state === "OUT_OF_SERVICE") {
      return {
        available: false,
        reason: `الفستان غير متاح للتأجير حالياً (الحالة: ${dress.state})`,
      };
    }

    const reqStart = new Date(startStr).getTime();
    const reqEnd = new Date(endStr).getTime();

    // 48 hours in milliseconds (Buffer period)
    const BUFFER_MS = 48 * 60 * 60 * 1000;

    for (const b of bookings) {
      if (b.itemId === dressId && b.status !== "CANCELLED" && b.status !== "COMPLETED") {
        const bStart = new Date(b.deliveryDate || b.eventDate).getTime() - BUFFER_MS;
        const bEnd = new Date(b.returnDate).getTime() + BUFFER_MS;

        // Check overlap
        if (reqStart < bEnd && reqEnd + BUFFER_MS > bStart) {
          return {
            available: false,
            conflictingBooking: b,
            reason: `يوجد تعارض مع الحجز رقم ${b.bookingNumber} للعروس (${b.customerName}) مع فترة عزل الأمان (48 ساعة غسيل وصيانة)`,
          };
        }
      }
    }

    return { available: true };
  };

  const handleTestAvailability = () => {
    const result = checkConflict(testDressId, testStartDate, testEndDate);
    setAvailabilityResult(result);
  };

  const handleCreateBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c) => c.id === selectedCustomerId);
    const dress = dresses.find((d) => d.id === selectedDressId);

    if (!customer || !dress) {
      alert("يرجى اختيار العروس والفستان بشكل صحيح");
      return;
    }

    // Validate conflict
    const conflict = checkConflict(dress.id, deliveryDate, returnDate);
    if (!conflict.available) {
      alert(`عفواً! تم رفض الحجز لعدم التوفر:\n${conflict.reason}`);
      return;
    }

    // Minimum Advance rule (BR-02: minimum 25%)
    const netRentalPrice = Math.max(0, dress.rentalPrice - discountAmount);
    const minAdvance = Math.round(netRentalPrice * 0.25);
    if (advancePaid < minAdvance) {
      alert(`تنبيه مالي (القاعدة BR-02): يجب دفع عربون تثبيت لا يقل عن 25% من قيمة الإيجار (الحد الأدنى المطلوب: ${minAdvance} ${currency})`);
      return;
    }

    const bookingNum = `BK-2026-${String(bookings.length + 1).padStart(3, "0")}`;
    const contractNum = `CNT-2026-${String(bookings.length + 85).padStart(3, "0")}`;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingNumber: bookingNum,
      customerId: customer.id,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      itemId: dress.id,
      itemName: dress.name,
      itemCode: dress.itemCode,
      eventDate: eventDate,
      fittingDate: fittingDate,
      deliveryDate: deliveryDate,
      returnDate: returnDate,
      bufferStartDate: fittingDate,
      bufferEndDate: returnDate,
      rentalPrice: dress.rentalPrice,
      discount: discountAmount,
      tax: 0,
      totalPrice: netRentalPrice,
      depositPaid: advancePaid,
      securityDepositAmount: dress.securityDeposit,
      remainingBalance: Math.max(0, netRentalPrice - advancePaid),
      status: "CONFIRMED",
      contractSigned: true,
      contractNumber: contractNum,
      accessoriesIncluded: ["طرحة مطرزة", "تاج ملكي", "جيبون فستان"],
      notes: `تم استلام عربون ${advancePaid} ${currency} وضمان (${securityDepositType})`,
      createdAt: new Date().toISOString().split("T")[0],
    };

    onAddBooking(newBooking);
    setIsWizardOpen(false);
    alert(`تم تأكيد الحجز ${bookingNum} وإصدار العقد رقم ${contractNum} بنجاح! 👰✨`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif-luxury tracking-tight">
            محرك الحجوزات الذكي ومنع التعارض الزمني
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            فحص فوري للتواريخ مع تطبيق قاعدة الأمان الإجبارية (48 ساعة Buffer للغسيل والكي والتعديل).
          </p>
        </div>

        <button
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء حجز وعقد جديد</span>
        </button>
      </div>

      {/* Interactive Availability Sandbox */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-serif-luxury">
                فاحص التوفر والتعارض اللحظي (Anti-Overlap Conflict Engine)
              </h2>
              <p className="text-[11px] text-indigo-200">
                اختبر إمكانية حجز أي فستان في فترة محددة للتأكد من خلوه من أي حجز مسبق أو فترة غسيل
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-full">
            قاعدة BR-01 مفعلة 🛡️
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-indigo-200 font-semibold block mb-1">اختر الفستان:</label>
            <select
              value={testDressId}
              onChange={(e) => setTestDressId(e.target.value)}
              className="w-full bg-slate-800/90 border border-indigo-800/70 text-white rounded-lg p-2.5 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {dresses.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.itemCode} - {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-indigo-200 font-semibold block mb-1">تاريخ بداية التأجير / التسليم:</label>
            <input
              type="date"
              value={testStartDate}
              onChange={(e) => setTestStartDate(e.target.value)}
              className="w-full bg-slate-800/90 border border-indigo-800/70 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
            </input>
          </div>

          <div>
            <label className="text-indigo-200 font-semibold block mb-1">تاريخ نهاية التأجير / الإرجاع:</label>
            <input
              type="date"
              value={testEndDate}
              onChange={(e) => setTestEndDate(e.target.value)}
              className="w-full bg-slate-800/90 border border-indigo-800/70 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
            </input>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleTestAvailability}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-5 py-2.5 rounded-lg shadow-sm transition-all transform hover:scale-[1.01] cursor-pointer"
          >
            فحص إمكانية الحجز الآن 🔍
          </button>

          {availabilityResult && (
            <div className="flex-1 max-w-lg mr-4">
              {availabilityResult.available ? (
                <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 p-2.5 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold">الفستان متاح تماماً في هذه الفترة وجاهز لإبرام العقد! 🟢</span>
                </div>
              ) : (
                <div className="bg-rose-500/20 border border-rose-400/40 text-rose-200 p-2.5 rounded-lg text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-tight">{availabilityResult.reason}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Active Bookings List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-amber-600" />
            <span>سجل الحجوزات والعقود النشطة ({bookings.length})</span>
          </h2>
          <span className="text-xs text-slate-500">يتم احتساب الغسيل والصيانة تلقائياً</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
              <tr>
                <th className="p-3">رقم الحجز</th>
                <th className="p-3">العروس</th>
                <th className="p-3">رقم الفستان</th>
                <th className="p-3">تاريخ الزفاف</th>
                <th className="p-3">الاستلام ← الإرجاع</th>
                <th className="p-3">فترة الأمان (Buffer)</th>
                <th className="p-3">الإجمالي / العربون</th>
                <th className="p-3">المتبقي</th>
                <th className="p-3">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900">{b.bookingNumber}</td>
                  <td className="p-3 font-bold text-slate-900">{b.customerName}</td>
                  <td className="p-3">
                    <span className="font-semibold text-amber-800">{b.itemCode}</span>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{b.itemName}</div>
                  </td>
                  <td className="p-3 font-bold text-purple-700">{b.eventDate}</td>
                  <td className="p-3 text-slate-600 font-mono">
                    {b.deliveryDate} ← {b.returnDate}
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                      +48 ساعة معزول
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-slate-900">{b.totalPrice}</span> /{" "}
                    <span className="text-emerald-700 font-bold">{b.depositPaid} {currency}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-rose-600">{b.remainingBalance} {currency}</span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        b.status === "CONFIRMED"
                          ? "bg-blue-100 text-blue-800"
                          : b.status === "DELIVERED"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {b.status === "CONFIRMED" ? "مؤكد بعربون" : b.status === "DELIVERED" ? "مُسلّم للعروس" : "مكتمل"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Booking Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
                  إبرام عقد حجز وتأجير فستان زفاف
                </h3>
                <p className="text-xs text-slate-500">
                  تطبيق القواعد الذهبية: التحقق من التوفر، العربون (≥25%)، وضمان الأمانات
                </p>
              </div>
              <button
                onClick={() => setIsWizardOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBookingSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">العروس المستأجرة:</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} - {c.phone} (زفاف: {c.weddingDate})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">الفستان المطلوب:</label>
                  <select
                    value={selectedDressId}
                    onChange={(e) => setSelectedDressId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-amber-900 focus:outline-none"
                  >
                    {dresses.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.itemCode} - {d.name} ({d.rentalPrice} {currency})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">تاريخ البروفة:</label>
                  <input
                    type="date"
                    required
                    value={fittingDate}
                    onChange={(e) => setFittingDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">تاريخ الاستلام:</label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-purple-900 block mb-1">تاريخ الزفاف:</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-white border border-purple-200 rounded-lg p-2 focus:outline-none font-bold text-purple-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">تاريخ الإرجاع:</label>
                  <input
                    type="date"
                    required
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Financials & Deposit */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الخصم المطبق ({currency}):</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">عربون التثبيت المدفوع ({currency}):</label>
                  <input
                    type="number"
                    required
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-emerald-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">نوع الضمان / التأمين:</label>
                  <select
                    value={securityDepositType}
                    onChange={(e) => setSecurityDepositType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium focus:outline-none"
                  >
                    <option value="CASH">تأمين نقدي مسترد</option>
                    <option value="GOLD">أمانة عينية (ذهب)</option>
                    <option value="IDENTITY_DOC">إثبات شخصية (بطاقة/جواز)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">تفاصيل الضمان / الأمانة المودعة:</label>
                <input
                  type="text"
                  value={collateralDescription}
                  onChange={(e) => setCollateralDescription(e.target.value)}
                  placeholder="مثال: سوار ذهب عيار 21 وزن 15 جرام / بطاقة هوية وطنية"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>تأكيد سياسة العقد الرسمية (BR-01 & BR-03):</span>
                </div>
                <p>
                  يتم قفل الفستان في التقويم وتخصيص 48 ساعة بعد الإرجاع للغسيل والكي. لا يتم تسليم الفستان نهائياً إلا بعد استيفاء سداد المتبقي وتأكيد حفظ الأمانة في الخزينة.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors shadow-xs cursor-pointer"
                >
                  تأكيد الحجز وتوليد العقد الرسمي
                </button>
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(false)}
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
