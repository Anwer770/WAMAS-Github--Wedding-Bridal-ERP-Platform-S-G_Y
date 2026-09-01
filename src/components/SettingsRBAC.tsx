import React, { useState } from "react";
import {
  Settings,
  Shield,
  Building,
  DollarSign,
  Clock,
  Save,
  CheckCircle2,
  Users,
  Layers
} from "lucide-react";
import { UserRole } from "../types/wamas";

interface SettingsRBACProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

export const SettingsRBAC: React.FC<SettingsRBACProps> = ({
  currentRole,
  onRoleChange,
  currency,
  onCurrencyChange,
}) => {
  const [storeName, setStoreName] = useState("الأسطورة لبيع وتأجير فساتين الزفاف ومستلزمات الأعراس");
  const [storePhone, setStorePhone] = useState("777788929 - 783935986");
  const [storeAddress, setStoreAddress] = useState("القاعدة – شارع الثورة الخلفي – بجوار صيدلية النور");
  const [bufferHours, setBufferHours] = useState(48);
  const [minAdvancePercent, setMinAdvancePercent] = useState(25);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif-luxury tracking-tight">
            إعدادات النظام وسياسات التشغيل والصلاحيات (Settings & Governance)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ضبط سياسات الحجز، فترات الأمان (Buffer)، العملة، وهوية المتجر المطبوعة على العقود والإيصالات.
          </p>
        </div>

        {isSaved && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>تم حفظ التغييرات بنجاح!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Identity Settings */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-amber-600" />
            <span>بيانات المتجر الرسمية (تظهر بالعقود والفواتير)</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">اسم الأتيليه / المؤسسة:</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">أرقام الهواتف وخدمة العملاء:</label>
              <input
                type="text"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">العنوان التفصيلي للفرع الرئيسي:</label>
              <input
                type="text"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">العملة الأساسية للنظام:</label>
              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-amber-900 focus:outline-none"
              >
                <option value="ر.س">ريال سعودي (ر.س)</option>
                <option value="ر.ي">ريال يمني (ر.ي)</option>
                <option value="د.إ">درهم إماراتي (د.إ)</option>
                <option value="$">دولار أمريكي ($)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Business Rules & Buffer Governance */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="w-4 h-4 text-purple-600" />
            <span>سياسات الحجز وفترة الأمان الإجبارية</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                فترة الأمان وعزل الفستان بعد الإرجاع (Buffer Time):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="24"
                  max="96"
                  value={bufferHours}
                  onChange={(e) => setBufferHours(Number(e.target.value))}
                  className="w-24 bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-center"
                />
                <span className="text-slate-600 font-bold">ساعة (مخصصة للغسيل والكي والتعديل)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                يطبق محرك الحجوزات هذه الفترة تلقائياً لمنع تأجير الفستان قبل إتمام دورة التنظيف.
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">الحد الأدنى لعربون التثبيت:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="50"
                  value={minAdvancePercent}
                  onChange={(e) => setMinAdvancePercent(Number(e.target.value))}
                  className="w-24 bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-center"
                />
                <span className="text-slate-600 font-bold">% من قيمة العقد الإجمالية</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
              <span className="font-bold block">الصلاحيات النشطة للمستخدم:</span>
              <p>
                أنت تعمل حالياً بدور: <strong>{currentRole}</strong>. يمكنك التبديل بين الأدوار من القائمة العلوية لتجربة تجربة الكاشير، مسؤولة الخياطة، أو المدير المالي.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>حفظ واعتماد الإعدادات التشغيلية</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
