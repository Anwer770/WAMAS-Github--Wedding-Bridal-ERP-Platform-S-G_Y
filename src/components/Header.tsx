import React, { useState } from "react";
import { Sparkles, Bell, Shield, MapPin, Store, UserCheck, DollarSign } from "lucide-react";
import { UserRole, NavTab, CashSession } from "../types/wamas";

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole?: (role: UserRole) => void;
  onRoleChange?: (role: UserRole) => void;
  activeBranch?: string;
  setActiveBranch?: (branch: string) => void;
  currency: string;
  setCurrency?: (currency: string) => void;
  onCurrencyChange?: (currency: string) => void;
  onOpenAIModal: () => void;
  activeTab?: NavTab;
  cashSession?: CashSession;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  onRoleChange,
  activeBranch: propActiveBranch,
  setActiveBranch: propSetActiveBranch,
  currency,
  setCurrency,
  onCurrencyChange,
  onOpenAIModal,
}) => {
  const [internalBranch, setInternalBranch] = useState("الفرع الرئيسي - صالة العرض");
  const activeBranch = propActiveBranch || internalBranch;
  const setActiveBranch = propSetActiveBranch || setInternalBranch;

  const handleRoleChange = (role: UserRole) => {
    if (onRoleChange) onRoleChange(role);
    if (setCurrentRole) setCurrentRole(role);
  };

  const handleCurrencyChange = (curr: string) => {
    if (onCurrencyChange) onCurrencyChange(curr);
    if (setCurrency) setCurrency(curr);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand and Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <span className="font-serif-luxury text-xl font-bold italic">W</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">WAMAS ERP</span>
                <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                  الأسطورة لمستلزمات الأعراس
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                منظومة إدارة وتأجير وبيع وتصنيع فساتين الأعراس والمحاسبة المالية
              </p>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Image Analyzer Direct Trigger Button */}
            <button
              onClick={onOpenAIModal}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg shadow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
              <span className="hidden sm:inline">فحص الفستان بالذكاء الاصطناعي (Gemini 3.1 Pro)</span>
              <span className="sm:hidden">فحص AI</span>
            </button>

            {/* Currency Selector */}
            <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs">
              <span className="px-1 text-slate-500"><DollarSign className="w-3.5 h-3.5 inline" /></span>
              {(["ر.س", "ر.ي", "$"] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => handleCurrencyChange(curr)}
                  className={`px-2 py-1 rounded font-medium transition-colors ${
                    currency === curr
                      ? "bg-white text-amber-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Branch Selector */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <select
                value={activeBranch}
                onChange={(e) => setActiveBranch(e.target.value)}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="الفرع الرئيسي - صالة العرض">الفرع الرئيسي - صالة العرض</option>
                <option value="فرع الرياض / صنعاء - النخيل">فرع النخيل - VIP</option>
                <option value="مشغل الخياطة المركزي">مشغل الخياطة والتطريز</option>
              </select>
            </div>

            {/* Role Simulator */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs text-amber-900">
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <select
                value={currentRole}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="bg-transparent font-bold focus:outline-none cursor-pointer"
              >
                <option value="SUPER_ADMIN">👑 المالك / Super Admin</option>
                <option value="ADMIN">🛡️ المدير العام / Admin</option>
                <option value="BRANCH_MANAGER">🏢 مدير الفرع</option>
                <option value="ACCOUNTANT">💰 المحاسب المالي</option>
                <option value="CASHIER">🧾 الكاشير / الصندوق</option>
                <option value="RECEPTIONIST">👗 موظفة الاستقبال</option>
                <option value="TAILOR">✂️ الخياطة / المشغل</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
