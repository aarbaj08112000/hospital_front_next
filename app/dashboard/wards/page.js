"use client";
import { useState, useEffect } from "react";

const WARDS = [
  { id: "W-1", name: "General Ward A", floor: "1st Floor", type: "General", beds: 20 },
  { id: "W-2", name: "General Ward B", floor: "1st Floor", type: "General", beds: 20 },
  { id: "W-3", name: "ICU Primary", floor: "2nd Floor", type: "ICU", beds: 10 },
  { id: "W-4", name: "Maternity", floor: "3rd Floor", type: "Specialized", beds: 15 },
  { id: "W-5", name: "Pediatrics", floor: "2nd Floor", type: "General", beds: 12 },
];

const BEDS = Array.from({ length: 77 }).map((_, i) => {
  const ward = WARDS[i % 5];
  const statuses = ["Available", "Occupied", "Occupied", "Cleaning", "Maintenance"];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  return {
    id: `${ward.id}-B${Math.floor(i/5) + 1}`,
    ward: ward.name,
    type: ward.type,
    status: status,
    patient: status === "Occupied" ? `Patient ${i}` : null,
    admitted: status === "Occupied" ? "2026-07-10" : null,
  };
});

export default function WardsModule() {
  const [view, setView] = useState("grid");
  const [selectedWard, setSelectedWard] = useState("All");
  const [selectedBed, setSelectedBed] = useState(null);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const showToast = (type, message) => { setToast({ show: true, type, message }); setTimeout(() => setToast({ show: false, type: "success", message: "" }), 4000); };
  
  const filteredBeds = selectedWard === "All" ? BEDS : BEDS.filter(b => b.ward === selectedWard);
  
  const stats = {
    total: BEDS.length,
    occupied: BEDS.filter(b => b.status === "Occupied").length,
    available: BEDS.filter(b => b.status === "Available").length,
    maintenance: BEDS.filter(b => b.status === "Cleaning" || b.status === "Maintenance").length
  };

  const statusColors = { Available: "bg-tertiary text-on-tertiary", Occupied: "bg-primary text-on-primary", Cleaning: "bg-secondary text-on-secondary", Maintenance: "bg-error text-on-error" };
  const badgeColors = { Available: "bg-tertiary/10 text-tertiary", Occupied: "bg-primary/10 text-primary", Cleaning: "bg-secondary/10 text-secondary", Maintenance: "bg-error/10 text-error" };

  useEffect(() => {
    if (view === "allocate" && window.$) {
      $("#allocation-form").validate({
        rules: { patientId: "required", reason: "required", expectedStay: { required: true, digits: true } },
        messages: { patientId: "Select patient", reason: "Admission reason required", expectedStay: "Valid days required" },
        errorElement: "span", errorClass: "text-error text-xs font-medium mt-1 block",
        highlight: (el) => $(el).addClass("border-error").removeClass("border-outline-variant"),
        unhighlight: (el) => $(el).removeClass("border-error").addClass("border-outline-variant"),
        submitHandler: () => { showToast("success", `Patient allocated to ${selectedBed?.id} successfully!`); setTimeout(() => setView("grid"), 1500); return false; }
      });
    }
  }, [view]);

  return (
    <div className="animate-in fade-in duration-300">
      {/* Toast */}
      <div className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border-l-4 ${toast.type === 'success' ? 'bg-primary-fixed border-primary text-on-surface' : 'bg-error-container border-error text-on-error-container'}`}>
          <span className={`material-symbols-outlined ${toast.type === 'success' ? 'text-primary' : 'text-error'}`}>{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          <div><p className="font-bold text-sm">{toast.type === 'success' ? 'Success' : 'Error'}</p><p className="text-xs mt-0.5 opacity-90">{toast.message}</p></div>
          <button onClick={() => setToast({...toast, show: false})} className="ml-4 text-outline hover:text-on-surface"><span className="material-symbols-outlined text-sm">close</span></button>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">{view === "allocate" ? "Bed Allocation" : "Wards & Beds"}</h2>
          <p className="text-sm text-on-surface-variant mt-1">{view === "allocate" ? `Assigning patient to ${selectedBed?.id}` : "Manage hospital occupancy and track bed availability."}</p>
        </div>
        <div className="flex gap-3">
          {view === "allocate" ? (
             <button onClick={() => setView("grid")} className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors text-sm font-semibold text-on-surface shadow-sm"><span className="material-symbols-outlined text-[20px]">arrow_back</span>Cancel Allocation</button>
          ) : (
            <div className="flex gap-1 bg-surface-container p-1 rounded-xl">
              <button onClick={() => setView("grid")} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${view === 'grid' ? 'bg-surface-container-lowest shadow-sm' : 'text-on-surface-variant'}`}><span className="material-symbols-outlined text-[18px]">grid_view</span> Grid</button>
              <button onClick={() => setView("list")} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${view === 'list' ? 'bg-surface-container-lowest shadow-sm' : 'text-on-surface-variant'}`}><span className="material-symbols-outlined text-[18px]">table_rows</span> List</button>
            </div>
          )}
        </div>
      </div>

      {(view === "grid" || view === "list") && (<>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Capacity", val: stats.total, color: "text-on-surface bg-surface-container-high" },
            { label: "Available", val: stats.available, color: "text-tertiary bg-tertiary/10" },
            { label: "Occupied", val: stats.occupied, color: "text-primary bg-primary/10" },
            { label: "Unavailable", val: stats.maintenance, color: "text-error bg-error/10" },
          ].map((c, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm p-5 text-center">
              <p className={`text-3xl font-black mb-1 ${c.color.split(' ')[0]}`}>{c.val}</p>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden mb-8">
          <div className="p-4 border-b border-outline-variant/30 flex gap-2 overflow-x-auto">
            <button onClick={() => setSelectedWard("All")} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${selectedWard === "All" ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}>All Wards</button>
            {WARDS.map(w => (
              <button key={w.id} onClick={() => setSelectedWard(w.name)} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${selectedWard === w.name ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}>{w.name}</button>
            ))}
          </div>

          {view === "grid" && (
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredBeds.map(bed => (
                <div key={bed.id} className="relative group cursor-pointer" onClick={() => { if(bed.status === "Available") { setSelectedBed(bed); setView("allocate"); } }}>
                  <div className={`h-24 rounded-xl flex flex-col items-center justify-center p-3 transition-transform group-hover:-translate-y-1 ${statusColors[bed.status]} shadow-sm`}>
                    <span className="material-symbols-outlined text-[28px] mb-2">{bed.status === "Occupied" ? "bed" : bed.status === "Cleaning" ? "cleaning_services" : bed.status === "Maintenance" ? "build" : "single_bed"}</span>
                    <span className="text-sm font-bold">{bed.id}</span>
                  </div>
                  {bed.status === "Available" && (
                    <div className="absolute inset-0 bg-black/60 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm">Allocate +</div>
                  )}
                  {bed.status === "Occupied" && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>
          )}

          {view === "list" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-surface-container-low/30 border-b border-outline-variant/30">
                  {["Bed ID", "Ward", "Type", "Status", "Patient", "Actions"].map(h => <th key={h} className={`px-5 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider ${h === "Actions" ? "text-right" : ""}`}>{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {filteredBeds.map(bed => (
                    <tr key={bed.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-5 py-4 text-sm font-bold text-on-surface">{bed.id}</td>
                      <td className="px-5 py-4 text-sm font-medium text-on-surface-variant">{bed.ward}</td>
                      <td className="px-5 py-4 text-sm text-on-surface-variant">{bed.type}</td>
                      <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-md text-xs font-bold ${badgeColors[bed.status]}`}>{bed.status}</span></td>
                      <td className="px-5 py-4 text-sm font-bold text-on-surface">{bed.patient || "—"}</td>
                      <td className="px-5 py-4 text-right">
                        {bed.status === "Available" ? (
                          <button onClick={() => { setSelectedBed(bed); setView("allocate"); }} className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded hover:bg-primary/20 transition-colors">Allocate</button>
                        ) : bed.status === "Occupied" ? (
                          <button onClick={() => showToast("success", "Discharge initiated.")} className="px-3 py-1.5 bg-tertiary/10 text-tertiary text-xs font-bold rounded hover:bg-tertiary/20 transition-colors">Discharge</button>
                        ) : (
                          <button onClick={() => showToast("success", "Status reset to Available.")} className="px-3 py-1.5 border border-outline-variant text-on-surface-variant text-xs font-bold rounded hover:bg-surface-container transition-colors">Reset</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>)}

      {/* ALLOCATE FORM */}
      {view === "allocate" && selectedBed && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-outline-variant/30">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-[28px]">single_bed</span></div>
            <div><h3 className="text-xl font-bold text-on-surface">Bed {selectedBed.id}</h3><p className="text-sm text-on-surface-variant">{selectedBed.ward} • {selectedBed.type}</p></div>
          </div>
          <form id="allocation-form" className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Select Patient *</label>
              <select name="patientId" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                <option value="">-- Choose Admitted Patient --</option>
                <option value="MRN-10042">Eleanor Richards (MRN-10042)</option>
                <option value="MRN-10045">William Taylor (MRN-10045)</option>
                <option value="MRN-10049">Lucas Brown (MRN-10049)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Reason for Admission *</label>
              <input name="reason" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="e.g. Post-surgery observation" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Expected Stay (Days) *</label>
                <input name="expectedStay" type="number" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="e.g. 3" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Dietary Requirements</label>
                <select className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                  <option value="Normal">Normal</option><option value="Diabetic">Diabetic</option><option value="Low Sodium">Low Sodium</option><option value="Liquid">Liquid</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant/30 mt-6">
              <button type="button" onClick={() => setView("grid")} className="px-6 py-2.5 border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container transition-colors text-sm">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm shadow-sm flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">how_to_reg</span>Confirm Allocation</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
