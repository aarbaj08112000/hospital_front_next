"use client";
import { useState, useEffect } from "react";

export default function DashboardMain() {
  const [occupancy, setOccupancy] = useState(84.2);

  useEffect(() => {
    const interval = setInterval(() => {
      const noise = (Math.random() - 0.5) * 1.5;
      setOccupancy((prev) => Math.min(100, Math.max(0, prev + noise)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-in fade-in duration-300">
      {/* Welcome Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Hospital Overview</h2>
          <p className="text-sm text-on-surface-variant mt-1">System performance and facility metrics for Today</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors text-sm font-semibold text-on-surface shadow-sm">
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            Last 24 Hours
          </button>
          <button className="px-4 py-2 bg-primary text-on-primary rounded-lg flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm font-semibold shadow-sm">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export Data
          </button>
        </div>
      </div>

      {/* High-Level Analytics Cards (Bento Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Appointments */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">event_available</span>
            </div>
            <span className="text-primary bg-primary/10 px-2.5 py-1 rounded-md text-xs font-semibold">+12% &uarr;</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Today's Appointments</p>
            <p className="text-2xl font-bold text-on-surface mt-0.5">148</p>
          </div>
          <p className="text-xs text-on-surface-variant pt-2 border-t border-outline-variant/30 flex items-center gap-2 mt-auto">
            <span className="w-2 h-2 rounded-full bg-error"></span> 32 Pending confirmation
          </p>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">bed</span>
            </div>
            <span className="text-secondary bg-secondary/10 px-2.5 py-1 rounded-md text-xs font-semibold">Optimal</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Occupancy Rate</p>
            <p className="text-2xl font-bold text-on-surface mt-0.5">{occupancy.toFixed(1)}%</p>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-auto mb-1">
            <div className="bg-secondary h-full transition-all duration-1000 ease-in-out" style={{ width: `${occupancy}%` }}></div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-error/10 text-error rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
            <span className="text-error bg-error/10 px-2.5 py-1 rounded-md text-xs font-semibold">-2.4% &darr;</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Daily Revenue</p>
            <p className="text-2xl font-bold text-on-surface mt-0.5">$54.2k</p>
          </div>
          <p className="text-xs text-on-surface-variant pt-2 border-t border-outline-variant/30 flex items-center justify-between mt-auto">
            <span>Target: $60.0k</span>
            <span className="w-20 h-1.5 bg-surface-container rounded-full"><span className="block h-full bg-error rounded-full w-[90%]"></span></span>
          </p>
        </div>

        {/* Staff on Duty */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-tertiary/10 text-tertiary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
            <span className="text-tertiary bg-tertiary/10 px-2.5 py-1 rounded-md text-xs font-semibold">Online</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Staff On Duty</p>
            <p className="text-2xl font-bold text-on-surface mt-0.5">312</p>
          </div>
          <p className="text-xs text-on-surface-variant pt-2 border-t border-outline-variant/30 flex items-center gap-2 mt-auto">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span> 42 Doctors, 120 Nurses
          </p>
        </div>
      </div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Activity Chart (Large) */}
        <div className="xl:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
            <h3 className="text-lg font-bold text-on-surface">Hospital Activity Trend</h3>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-xs font-medium text-on-surface-variant"><span className="w-3 h-3 rounded bg-primary"></span> Admissions</span>
              <span className="flex items-center gap-2 text-xs font-medium text-on-surface-variant"><span className="w-3 h-3 rounded bg-secondary"></span> Discharges</span>
            </div>
          </div>
          <div className="flex-1 p-6 relative min-h-[350px] flex items-center justify-center">
            {/* CSS background for grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
            {/* Decorative Chart SVG */}
            <svg className="w-full h-64 overflow-visible z-10" viewBox="0 0 800 200" preserveAspectRatio="none">
              {/* Admissions Line */}
              <path d="M0,150 Q100,140 200,80 T400,100 T600,60 T800,90" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M0,150 Q100,140 200,80 T400,100 T600,60 T800,90 L800,200 L0,200 Z" fill="url(#grad1)" opacity="0.15"></path>
              {/* Discharges Line */}
              <path d="M0,180 Q100,170 200,140 T400,150 T600,110 T800,130" fill="none" stroke="var(--color-secondary)" strokeDasharray="6,6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <defs>
                <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "var(--color-primary)", stopOpacity: 1 }}></stop>
                  <stop offset="100%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0 }}></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Recent Notifications / Alerts */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
            <h3 className="text-lg font-bold text-on-surface">System Alerts</h3>
            <span className="w-6 h-6 rounded-full bg-error/10 text-error text-xs flex items-center justify-center font-bold">3</span>
          </div>
          <div className="flex-1 p-5 space-y-3 overflow-y-auto max-h-[400px] custom-scrollbar bg-surface-container-low/30">
            <div className="flex gap-4 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">emergency</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-on-surface">Critical Supply Low</p>
                <p className="text-xs text-on-surface-variant mt-1">O- Blood type reserves below 15% threshold.</p>
                <span className="text-[10px] font-semibold text-error/80 uppercase mt-2 block">2 Mins Ago</span>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">meeting_room</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-on-surface">Surgery Rescheduled</p>
                <p className="text-xs text-on-surface-variant mt-1">OR-03 maintenance extended by 1 hour.</p>
                <span className="text-[10px] font-semibold text-primary/80 uppercase mt-2 block">15 Mins Ago</span>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-on-surface">Staffing Fulfilled</p>
                <p className="text-xs text-on-surface-variant mt-1">Night shift roster completed for Wards A-D.</p>
                <span className="text-[10px] font-semibold text-tertiary/80 uppercase mt-2 block">45 Mins Ago</span>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-outline-variant/30 bg-surface-container-lowest">
            <button className="w-full py-2 text-primary text-sm font-semibold text-center hover:bg-primary/5 rounded-lg transition-colors">
              Review All Alerts
            </button>
          </div>
        </div>
      </div>

      {/* Recent Admissions Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
          <h3 className="text-lg font-bold text-on-surface">Recent Admissions</h3>
          <select className="text-sm border border-outline-variant/50 rounded-lg bg-surface-container-lowest px-3 py-1.5 outline-none font-medium text-on-surface hover:border-primary focus:border-primary transition-colors cursor-pointer shadow-sm">
            <option>All Wards</option>
            <option>Intensive Care</option>
            <option>Pediatrics</option>
            <option>Emergency Room</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/30 border-b border-outline-variant/30">
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Ward</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {[
                { name: "Jane Doe", initials: "JD", id: "#PT-99201", age: "F, 42 yrs", ward: "Ward 4B - Room 12", doc: "Dr. Sarah Jenkins", status: "Critical", statusColor: "text-error bg-error/10", time: "08:45 AM" },
                { name: "Michael Smith", initials: "MS", id: "#PT-99188", age: "M, 29 yrs", ward: "ER - Bay 02", doc: "Dr. Robert Chen", status: "Stable", statusColor: "text-tertiary bg-tertiary/10", time: "10:12 AM" },
                { name: "Lily Anderson", initials: "LA", id: "#PT-99215", age: "F, 08 yrs", ward: "Peds - Room 08", doc: "Dr. Emily Watts", status: "Monitoring", statusColor: "text-primary bg-primary/10", time: "11:30 AM" }
              ].map((pt, i) => (
                <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-sm font-bold border border-outline-variant/30">
                      {pt.initials}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface">{pt.name}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{pt.age}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{pt.id}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-on-surface">{pt.ward}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface">{pt.doc}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${pt.statusColor}`}>
                      {pt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">{pt.time}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary font-semibold text-sm px-4 py-1.5 border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-outline-variant/30 flex justify-center bg-surface-container-lowest">
          <button className="text-sm font-semibold text-primary px-6 py-2 rounded-lg hover:bg-primary/5 transition-colors">
            Load More Records
          </button>
        </div>
      </div>
    </div>
  );
}
