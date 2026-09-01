import React, { useState } from "react";
import {
  Mail,
  Send,
  QrCode,
  Users,
  CheckCircle2,
  XCircle,
  Copy,
  Sparkles,
  MapPin,
  Calendar,
  Share2,
  Heart
} from "lucide-react";
import { Customer } from "../types/wamas";

interface EventExperienceProps {
  customers: Customer[];
}

interface GuestRSVP {
  id: string;
  guestName: string;
  phone: string;
  status: "ATTENDING" | "DECLINED" | "PENDING";
  companions: number;
  tableNumber: string;
  checkedIn: boolean;
}

export const EventExperience: React.FC<EventExperienceProps> = ({ customers }) => {
  const [brideName, setBrideName] = useState("سارة المنصوري");
  const [groomName, setGroomName] = useState("عبدالله الشمري");
  const [weddingDate, setWeddingDate] = useState("2026-09-20");
  const [venueName, setVenueName] = useState("قاعة ريكسوس الملكية للمؤتمرات والأفراح");
  const [invitationText, setInvitationText] = useState(
    "تتشرف عائلتا المنصوري والشمري بدعوتكم لحضور حفل زفاف نجليهما، وتكتمل بهجتنا بتشريفكم ومشاركتكم فرحتنا."
  );

  const [guests, setGuests] = useState<GuestRSVP[]>([
    { id: "g1", guestName: "د. هدى المريخي", phone: "0501112233", status: "ATTENDING", companions: 2, tableNumber: "طاولة VIP 1", checkedIn: true },
    { id: "g2", guestName: "الأستاذ فهد العتيبي", phone: "0554445566", status: "ATTENDING", companions: 1, tableNumber: "طاولة عائلة العريس 2", checkedIn: false },
    { id: "g3", guestName: "نورة القحطاني", phone: "0567778899", status: "PENDING", companions: 0, tableNumber: "طاولة الصديقات 4", checkedIn: false },
    { id: "g4", guestName: "محمد الهاشمي", phone: "0590001122", status: "DECLINED", companions: 0, tableNumber: "-", checkedIn: false },
  ]);

  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");
  const [newGuestTable, setNewGuestTable] = useState("طاولة الصديقات 3");

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName) return;

    setGuests([
      ...guests,
      {
        id: `g-${Date.now()}`,
        guestName: newGuestName,
        phone: newGuestPhone || "05xxxxxxxx",
        status: "PENDING",
        companions: 1,
        tableNumber: newGuestTable,
        checkedIn: false,
      },
    ]);
    setNewGuestName("");
    setNewGuestPhone("");
  };

  const toggleCheckIn = (id: string) => {
    setGuests(
      guests.map((g) => (g.id === id ? { ...g, checkedIn: !g.checkedIn } : g))
    );
  };

  const attendingCount = guests.filter((g) => g.status === "ATTENDING").length;
  const checkedInCount = guests.filter((g) => g.checkedIn).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif-luxury tracking-tight">
            بطاقات الدعوة الرقمية الفاخرة وإدارة الحضور وتوزيع الطاولات (E-Invitation & RSVP)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            تصميم بطاقات زفاف رقمية تفاعلية، تتبع تأكيد الحضور (RSVP)، ومسح QR الدخول عند بوابة القاعة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert("تم نسخ رابط بطاقة الدعوة التفاعلية لمشاركتها عبر الواتساب! 💌✨");
            }}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>مشاركة رابط الدعوة</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Card Preview on Left (5 Cols), RSVP & Tables on Right (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Luxury Card Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-b from-amber-50 via-white to-amber-50 border-2 border-amber-300/80 rounded-2xl p-6 shadow-md text-center space-y-5 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-amber-300 text-2xl font-serif">⚜️</div>
            <div className="absolute bottom-2 left-2 text-amber-300 text-2xl font-serif">⚜️</div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-800 tracking-widest uppercase">
                بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
              </span>
              <div className="text-xs text-slate-400 font-serif">دعوة زفاف خاصة</div>
            </div>

            <div className="space-y-2 my-4">
              <div className="text-xl font-bold text-amber-900 font-serif-luxury">
                {brideName} & {groomName}
              </div>
              <div className="w-12 h-0.5 bg-amber-400 mx-auto" />
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium px-4">
              "{invitationText}"
            </p>

            <div className="bg-white/80 border border-amber-200/60 p-3 rounded-xl space-y-2 text-xs text-slate-700">
              <div className="flex items-center justify-center gap-2 font-bold text-purple-900">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>{weddingDate}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-600">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>{venueName}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs inline-flex flex-col items-center">
                <QrCode className="w-20 h-20 text-slate-800" />
                <span className="text-[10px] font-mono text-slate-500 mt-1">QR كود الدخول للبوابة</span>
              </div>
            </div>
          </div>
        </div>

        {/* Guest List, RSVP Stats & Gate Scanner */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">إجمالي المدعوين:</span>
              <span className="text-base font-black text-slate-900">{guests.length}</span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              <span className="text-emerald-700 block text-[10px]">أكدوا الحضور:</span>
              <span className="text-base font-black text-emerald-800">{attendingCount} ضيف</span>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
              <span className="text-purple-700 block text-[10px]">تم الدخول للقاعة:</span>
              <span className="text-base font-black text-purple-900">{checkedInCount} / {attendingCount}</span>
            </div>
          </div>

          {/* Quick Add Guest Form */}
          <form onSubmit={handleAddGuest} className="flex gap-2 text-xs">
            <input
              type="text"
              required
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              placeholder="اسم الضيف / العائلة..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
            />
            <input
              type="text"
              value={newGuestTable}
              onChange={(e) => setNewGuestTable(e.target.value)}
              placeholder="رقم الطاولة..."
              className="w-32 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors"
            >
              إضافة
            </button>
          </form>

          {/* Guests Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                <tr>
                  <th className="p-2.5">اسم الضيف</th>
                  <th className="p-2.5">الطاولة المخصصة</th>
                  <th className="p-2.5">حالة الـ RSVP</th>
                  <th className="p-2.5">دخول البوابة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {guests.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/70">
                    <td className="p-2.5 font-bold text-slate-900">{g.guestName}</td>
                    <td className="p-2.5 text-slate-600 font-semibold">{g.tableNumber}</td>
                    <td className="p-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          g.status === "ATTENDING"
                            ? "bg-emerald-100 text-emerald-800"
                            : g.status === "DECLINED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {g.status === "ATTENDING" ? "سأحضر ✓" : g.status === "DECLINED" ? "معتذر ✕" : "قيد الانتظار"}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <button
                        onClick={() => toggleCheckIn(g.id)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                          g.checkedIn
                            ? "bg-purple-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {g.checkedIn ? "تم الدخول 🟢" : "مسح الدخول 🚪"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
