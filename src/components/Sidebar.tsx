import React from "react";
import {
  LayoutDashboard,
  Sparkles,
  Shirt,
  CalendarDays,
  ShieldAlert,
  Users,
  ShoppingCart,
  Scissors,
  Flower2,
  Car,
  Landmark,
  FileBarChart,
  MailOpen,
  Settings,
  Clock,
  QrCode
} from "lucide-react";
import { NavTab, UserRole } from "../types/wamas";

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab?: (tab: NavTab) => void;
  onTabChange?: (tab: NavTab) => void;
  currentRole?: UserRole;
  counts?: {
    availableDresses?: number;
    activeBookings?: number;
    heldCollaterals?: number;
    urgentAlterations?: number;
    pendingCleanings?: number;
  };
  badgeCounts?: {
    dresses?: number;
    bookings?: number;
    alterations?: number;
    manufacturing?: number;
    vault?: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onTabChange,
  currentRole,
  counts,
  badgeCounts,
}) => {
  const handleTabClick = (tab: NavTab) => {
    if (onTabChange) onTabChange(tab);
    if (setActiveTab) setActiveTab(tab);
  };

  const availableDressesCount =
    counts?.availableDresses ?? badgeCounts?.dresses ?? 0;
  const activeBookingsCount =
    counts?.activeBookings ?? badgeCounts?.bookings ?? 0;
  const heldCollateralsCount =
    counts?.heldCollaterals ?? badgeCounts?.vault ?? 0;
  const urgentAlterationsCount =
    counts?.urgentAlterations ?? badgeCounts?.alterations ?? 0;
  const manufacturingCount = badgeCounts?.manufacturing ?? 0;

  const menuGroups = [
    {
      group: "الرئيسية والذكاء الاصطناعي",
      items: [
        {
          id: "dashboard" as NavTab,
          label: "لوحة التحكم التنفيذية",
          icon: LayoutDashboard,
          badge: undefined,
        },
        {
          id: "ai_analyzer" as NavTab,
          label: "تحليل الفستان بالذكاء الاصطناعي",
          icon: Sparkles,
          highlight: true,
          badge: "Gemini 3.1 Pro",
        },
      ],
    },
    {
      group: "التأجير والحجوزات والأصول",
      items: [
        {
          id: "catalog" as NavTab,
          label: "كتالوج الفساتين والأصول",
          icon: Shirt,
          count: availableDressesCount,
        },
        {
          id: "bookings" as NavTab,
          label: "محرك الحجوزات والتوفر",
          icon: CalendarDays,
          count: activeBookingsCount,
        },
        {
          id: "vault" as NavTab,
          label: "خزينة الضمانات والعقود",
          icon: ShieldAlert,
          count: heldCollateralsCount,
        },
        {
          id: "brides" as NavTab,
          label: "سجل العرائس والمقاسات",
          icon: Users,
        },
      ],
    },
    {
      group: "المبيعات والورشة والتجهيز",
      items: [
        {
          id: "sales" as NavTab,
          label: "المبيعات ونقطة البيع POS",
          icon: ShoppingCart,
        },
        {
          id: "manufacturing" as NavTab,
          label: "أوامر التصنيع والخامات (BOM)",
          icon: Scissors,
          count: manufacturingCount > 0 ? manufacturingCount : undefined,
        },
        {
          id: "alterations" as NavTab,
          label: "مهام التعديل والبروفات",
          icon: Clock,
          count: urgentAlterationsCount > 0 ? urgentAlterationsCount : undefined,
          alert: urgentAlterationsCount > 0,
        },
        {
          id: "kosha" as NavTab,
          label: "الكوش وتجهيز القاعات والسيارات",
          icon: Flower2,
        },
      ],
    },
    {
      group: "المالية والمناسبات والتقارير",
      items: [
        {
          id: "accounting" as NavTab,
          label: "المحاسبة المزدوجة والخزينة",
          icon: Landmark,
        },
        {
          id: "reports" as NavTab,
          label: "التقارير وذكاء الأعمال والـ ROI",
          icon: FileBarChart,
        },
        {
          id: "invitations" as NavTab,
          label: "الدعوة الإلكترونية و RSVP",
          icon: MailOpen,
        },
        {
          id: "settings" as NavTab,
          label: "الإعدادات وسياسات المركز",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-l border-slate-200 shrink-0 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-3 select-none">
      <div className="space-y-6">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {group.group}
            </h3>
            <div className="space-y-0.5 mt-1.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  activeTab === item.id ||
                  (item.id === "catalog" && activeTab === "dresses") ||
                  (item.id === "sales" && activeTab === "pos") ||
                  (item.id === "ai_analyzer" && activeTab === "ai-analyzer") ||
                  (item.id === "kosha" && activeTab === "fleet");

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-right cursor-pointer ${
                      isActive
                        ? "bg-amber-500 text-white shadow-sm shadow-amber-500/20 font-bold"
                        : item.highlight
                        ? "bg-purple-50 text-purple-700 hover:bg-purple-100/70 border border-purple-200/50"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? "text-white"
                            : item.highlight
                            ? "text-purple-600"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-200 text-purple-900 shrink-0">
                        {item.badge}
                      </span>
                    )}

                    {item.count !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                          isActive
                            ? "bg-white/20 text-white"
                            : item.alert
                            ? "bg-rose-100 text-rose-700 font-extrabold animate-pulse"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer info & Rules summary */}
      <div className="pt-4 mt-4 border-t border-slate-100 text-slate-400 text-[11px] px-2 space-y-1">
        <div className="flex items-center justify-between text-slate-500 font-medium">
          <span>قاعدة الأمان (Buffer):</span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">48 ساعة مفروضة</span>
        </div>
        <div className="flex items-center justify-between text-slate-500 font-medium">
          <span>القيد المالي:</span>
          <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">مزدوج متوازن ⚖️</span>
        </div>
      </div>
    </aside>
  );
};

