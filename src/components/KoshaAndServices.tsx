import React, { useState } from "react";
import {
  Sparkles,
  Car,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  MapPin,
  ShieldCheck,
  Fuel,
  UserCheck
} from "lucide-react";
import { KoshaProject, FleetVehicle } from "../types/wamas";

interface KoshaAndServicesProps {
  koshaProjects: KoshaProject[];
  fleet: FleetVehicle[];
  currency: string;
  onUpdateKoshaStatus: (projectId: string, status: KoshaProject["status"]) => void;
  onUpdateVehicleStatus: (vehicleId: string, status: FleetVehicle["status"]) => void;
}

export const KoshaAndServices: React.FC<KoshaAndServicesProps> = ({
  koshaProjects,
  fleet,
  currency,
  onUpdateKoshaStatus,
  onUpdateVehicleStatus,
}) => {
  const [activeTab, setActiveTab] = useState<"kosha" | "fleet">("kosha");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif-luxury tracking-tight">
            مشاريع الكوش والديكور وأسطول سيارات الزفاف الملكية
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة تجهيز قاعات الأفراح، باقات الورد والإضاءة، وتنسيق حركة سيارات الليموزين الفاخرة مع السائقين.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab("kosha")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "kosha" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            مشاريع الكوش والقاعات ({koshaProjects.length})
          </button>
          <button
            onClick={() => setActiveTab("fleet")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "fleet" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            أسطول السيارات الفاخرة ({fleet.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Kosha Projects */}
      {activeTab === "kosha" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {koshaProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {project.projectCode}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      project.status === "DISMANTLED"
                        ? "bg-slate-100 text-slate-700"
                        : project.status === "ACTIVE_EVENT"
                        ? "bg-purple-100 text-purple-800 animate-pulse"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {project.status === "ACTIVE_EVENT"
                      ? "قيد الحفل الآن 🎉"
                      : project.status === "SETUP_IN_PROGRESS"
                      ? "قيد التركيب بالقاعة 🛠️"
                      : "تم الفك والاسترجاع ✓"}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base font-serif-luxury">{project.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{project.venueName} - {project.hallName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">تاريخ الحفل:</span>
                    <span className="font-bold text-purple-900">{project.eventDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">بدء التركيب:</span>
                    <span className="font-semibold text-slate-800">{project.setupStartTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">سعر المشروع:</span>
                    <span className="font-bold text-amber-900">{project.totalPrice} {currency}</span>
                  </div>
                </div>

                {/* Milestones / Checklist */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold text-slate-700">مراحل التنفيذ الميداني:</span>
                  <div className="space-y-1">
                    {project.milestones.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between text-xs p-1.5 bg-slate-50 rounded border border-slate-100"
                      >
                        <span className="font-medium text-slate-800 flex items-center gap-1.5">
                          {m.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{m.title}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{m.scheduledTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Update Button */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                {project.status === "SETUP_IN_PROGRESS" && (
                  <button
                    onClick={() => onUpdateKoshaStatus(project.id, "ACTIVE_EVENT")}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    تسليم القاعة للعروس والبدء 🎉
                  </button>
                )}
                {project.status === "ACTIVE_EVENT" && (
                  <button
                    onClick={() => onUpdateKoshaStatus(project.id, "DISMANTLED")}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    إتمام الفك وإرجاع الديكورات للمستودع 📦
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Luxury Fleet */}
      {activeTab === "fleet" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {fleet.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-slate-100 relative">
                  <img
                    src={car.imageUrl}
                    alt={car.model}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${
                      car.status === "AVAILABLE"
                        ? "bg-emerald-600 text-white"
                        : car.status === "DISPATCHED"
                        ? "bg-orange-600 text-white"
                        : "bg-purple-600 text-white"
                    }`}
                  >
                    {car.status === "AVAILABLE"
                      ? "متاحة للحجز 🟢"
                      : car.status === "DISPATCHED"
                      ? "في الزفة مع العروس 🚗💨"
                      : "في مغسلة وتزيين الورود 🌸"}
                  </span>

                  <span className="absolute bottom-2.5 left-2.5 bg-black/70 text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                    {car.plateNumber}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm font-serif-luxury">{car.model}</h3>
                  <div className="text-xs text-slate-500">
                    السائق المعتمد: <span className="font-bold text-slate-800">{car.driverName}</span> ({car.driverPhone})
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-400">سعر المشوار / الزفة:</span>
                    <span className="font-black text-amber-900">{car.rentalPricePerTrip} {currency}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">تحديث الحالة:</span>
                <div className="flex gap-1">
                  {car.status !== "AVAILABLE" && (
                    <button
                      onClick={() => onUpdateVehicleStatus(car.id, "AVAILABLE")}
                      className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded hover:bg-emerald-200 transition-colors"
                    >
                      إتاحة 🟢
                    </button>
                  )}
                  {car.status !== "DISPATCHED" && (
                    <button
                      onClick={() => onUpdateVehicleStatus(car.id, "DISPATCHED")}
                      className="px-2 py-1 bg-orange-100 text-orange-800 font-bold rounded hover:bg-orange-200 transition-colors"
                    >
                      انطلاق للزفة 🚗
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
