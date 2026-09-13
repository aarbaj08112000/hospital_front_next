"use client";
import { useState, useEffect } from "react";

const APPOINTMENTS = [
  { id: "APT-1001", patient: "Eleanor Richards", mrn: "MRN-10042", doctor: "Dr. Sarah Jenkins", dept: "Cardiology", date: "2026-07-15", time: "09:00 AM", status: "Scheduled", type: "Follow-up", notes: "Routine checkup post procedure." },
  { id: "APT-1002", patient: "James Wilson", mrn: "MRN-10043", doctor: "Dr. Robert Chen", dept: "Emergency", date: "2026-07-13", time: "02:30 PM", status: "Completed", type: "Urgent", notes: "Patient reported chest pain." },
  { id: "APT-1003", patient: "Sophia Martinez", mrn: "MRN-10044", doctor: "Dr. Emily Watts", dept: "Pediatrics", date: "2026-07-16", time: "11:15 AM", status: "Scheduled", type: "Consultation", notes: "First visit, vaccination inquiry." },
  { id: "APT-1004", patient: "William Taylor", mrn: "MRN-10045", doctor: "Dr. Sarah Jenkins", dept: "Cardiology", date: "2026-07-14", time: "10:00 AM", status: "Cancelled", type: "Follow-up", notes: "Patient rescheduled due to travel." },
  { id: "APT-1005", patient: "Maria Garcia", mrn: "MRN-10046", doctor: "Dr. Emily Watts", dept: "Endocrinology", date: "2026-07-15", time: "03:45 PM", status: "Scheduled", type: "Consultation", notes: "Thyroid test review." },
];

export default function AppointmentsModule() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const showToast = (type, message) => { setToast({ show: true, type, message }); setTimeout(() => setToast({ show: false, type: "success", message: "" }), 4000); };
  const goBack = () => { setSelected(null); setView("list"); };

  const filtered = statusFilter === "All" ? APPOINTMENTS : APPOINTMENTS.filter(a => a.status === statusFilter);

  const statusColors = { Scheduled: "bg-primary/10 text-primary", Completed: "bg-tertiary/10 text-tertiary", Cancelled: "bg-error/10 text-error" };
  const typeIcons = { "Follow-up": "replay", "Urgent": "emergency", "Consultation": "forum" };

  useEffect(() => {
    if ((view === "add" || view === "edit") && window.$) {
      $("#appointment-form").validate({
        rules: { patientName: "required", mrn: "required", doctor: "required", dept: "required", date: "required", time: "required", type: "required" },
        messages: { patientName: "Patient name required", mrn: "MRN required", doctor: "Select a doctor", dept: "Select a department", date: "Select date", time: "Select time", type: "Select type" },
        errorElement: "span", errorClass: "text-error text-xs font-medium mt-1 block",
        highlight: (el) => $(el).addClass("border-error").removeClass("border-outline-variant"),
        unhighlight: (el) => $(el).removeClass("border-error").addClass("border-outline-variant"),
        submitHandler: () => { showToast("success", view === "edit" ? "Appointment updated!" : "Appointment scheduled successfully!"); setTimeout(goBack, 1500); return false; }
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
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">{view === "list" ? "Appointments" : view === "add" ? "Book Appointment" : `View Appointment: ${selected?.id}`}</h2>
          <p className="text-sm text-on-surface-variant mt-1">{view === "list" ? "Schedule and manage outpatient consultations." : view === "add" ? "Fill in details to book a new slot." : `${selected?.patient} with ${selected?.doctor}`}</p>
        </div>
        <div className="flex gap-3">
          {view !== "list" ? (
            <button onClick={goBack} className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors text-sm font-semibold text-on-surface shadow-sm"><span className="material-symbols-outlined text-[20px]">arrow_back</span>Back to Calendar</button>
          ) : (
            <button onClick={() => { setSelected(null); setView("add"); }} className="px-4 py-2 bg-primary text-on-primary rounded-lg flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm font-semibold shadow-sm"><span className="material-symbols-outlined text-[20px]">add</span>New Appointment</button>
          )}
        </div>
      </div>

      {/* List View */}
      {view === "list" && (<>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Today's Appts", val: 24, icon: "today", color: "text-primary bg-primary/10" },
            { label: "Scheduled", val: APPOINTMENTS.filter(a=>a.status==="Scheduled").length, icon: "event", color: "text-secondary bg-secondary/10" },
            { label: "Completed", val: APPOINTMENTS.filter(a=>a.status==="Completed").length, icon: "fact_check", color: "text-tertiary bg-tertiary/10" },
            { label: "Cancelled", val: APPOINTMENTS.filter(a=>a.status==="Cancelled").length, icon: "event_busy", color: "text-error bg-error/10" },
          ].map((c, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm p-4 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${c.color}`}><span className="material-symbols-outlined">{c.icon}</span></div>
              <div><p className="text-2xl font-bold text-on-surface">{c.val}</p><p className="text-xs text-on-surface-variant font-medium">{c.label}</p></div>
            </div>
          ))}
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden mb-8">
          <div className="p-5 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="Search patient, doctor, or ID..." type="text" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", "Scheduled", "Completed", "Cancelled"].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${statusFilter === s ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-surface-container-low/30 border-b border-outline-variant/30">
                {["ID", "Patient", "Doctor", "Date & Time", "Type", "Status", "Actions"].map(h => <th key={h} className={`px-5 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider ${h === "Actions" ? "text-right" : ""}`}>{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filtered.map(apt => (
                  <tr key={apt.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-bold text-primary">{apt.id}</td>
                    <td className="px-5 py-4"><p className="font-bold text-sm text-on-surface">{apt.patient}</p><p className="text-[11px] text-on-surface-variant">{apt.mrn}</p></td>
                    <td className="px-5 py-4"><p className="font-medium text-sm text-on-surface">{apt.doctor}</p><p className="text-[11px] text-on-surface-variant">{apt.dept}</p></td>
                    <td className="px-5 py-4"><p className="text-sm font-medium text-on-surface">{apt.date}</p><p className="text-[11px] font-bold text-primary">{apt.time}</p></td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant flex items-center gap-1 mt-2.5"><span className="material-symbols-outlined text-[16px]">{typeIcons[apt.type]}</span>{apt.type}</td>
                    <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-md text-xs font-bold ${statusColors[apt.status]}`}>{apt.status}</span></td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <div className="relative group/edit">
                          <button onClick={() => { setSelected(apt); setView("edit"); }} className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-on-surface text-surface text-[11px] font-semibold rounded whitespace-nowrap opacity-0 invisible group-hover/edit:opacity-100 group-hover/edit:visible transition-all duration-200 pointer-events-none">Edit</span>
                        </div>
                        <div className="relative group/view">
                          <button onClick={() => { setSelected(apt); setView("view"); }} className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-on-surface text-surface text-[11px] font-semibold rounded whitespace-nowrap opacity-0 invisible group-hover/view:opacity-100 group-hover/view:visible transition-all duration-200 pointer-events-none">View Details</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan="7" className="px-5 py-12 text-center text-on-surface-variant text-sm">No appointments found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </>)}

      {/* Add / Edit Form */}
      {(view === "add" || view === "edit") && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden p-6 mb-8">
          <h3 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">{view === "edit" ? "Update Appointment" : "Book New Appointment"}</h3>
          <form id="appointment-form" className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">person</span>Patient Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Patient Name *</label><input name="patientName" defaultValue={selected?.patient || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Enter patient name" /></div>
                <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">MRN *</label><input name="mrn" defaultValue={selected?.mrn || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="MRN-XXXXX" /></div>
              </div>
            </div>
            <hr className="border-outline-variant/30" />
            <div>
              <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">event</span>Schedule Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Doctor *</label>
                  <select name="doctor" defaultValue={selected?.doctor || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                    <option value="">Select Doctor</option><option>Dr. Sarah Jenkins</option><option>Dr. Robert Chen</option><option>Dr. Emily Watts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Department *</label>
                  <select name="dept" defaultValue={selected?.dept || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                    <option value="">Select Department</option><option>Cardiology</option><option>Emergency</option><option>Pediatrics</option><option>Endocrinology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Appointment Type *</label>
                  <select name="type" defaultValue={selected?.type || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                    <option value="">Select Type</option><option>Consultation</option><option>Follow-up</option><option>Urgent</option>
                  </select>
                </div>
                <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Date *</label><input type="date" name="date" defaultValue={selected?.date || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Time *</label><input type="time" name="time" defaultValue={selected?.time ? selected.time.split(' ')[0] : ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
              </div>
            </div>
            <hr className="border-outline-variant/30" />
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Notes / Reason for Visit</label>
              <textarea name="notes" rows="3" defaultValue={selected?.notes || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" placeholder="Enter reason or additional notes..."></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
              <button type="button" onClick={goBack} className="px-6 py-2.5 border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container transition-colors text-sm">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm shadow-sm flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">save</span>{view === "edit" ? "Update Appointment" : "Confirm Booking"}</button>
            </div>
          </form>
        </div>
      )}

      {/* View Detail */}
      {view === "view" && selected && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[28px]">event</span></div>
              <div><h3 className="text-lg font-bold text-on-surface">{selected.id}</h3><span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold mt-1 ${statusColors[selected.status]}`}>{selected.status}</span></div>
            </div>
            <div className="space-y-4 pt-4 border-t border-outline-variant/30">
              {[
                { icon: "person", label: "Patient", value: `${selected.patient} (${selected.mrn})` },
                { icon: "stethoscope", label: "Doctor", value: selected.doctor },
                { icon: "apartment", label: "Department", value: selected.dept },
                { icon: "calendar_today", label: "Date & Time", value: `${selected.date} at ${selected.time}` },
                { icon: typeIcons[selected.type], label: "Type", value: selected.type },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3"><span className="material-symbols-outlined text-on-surface-variant text-[20px]">{item.icon}</span><div><p className="text-xs text-on-surface-variant">{item.label}</p><p className="text-sm font-semibold text-on-surface">{item.value}</p></div></div>
              ))}
            </div>
            {selected.status === "Scheduled" && (
              <div className="mt-6 flex flex-col gap-2">
                <button onClick={() => { setView("edit"); }} className="w-full py-2.5 bg-surface-container text-on-surface font-bold rounded-lg hover:bg-surface-container-high transition-colors text-sm flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[18px]">edit</span>Edit Details</button>
                <button onClick={() => showToast("success", "Status updated to Completed.")} className="w-full py-2.5 bg-tertiary/10 text-tertiary font-bold rounded-lg hover:bg-tertiary/20 transition-colors text-sm flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[18px]">check_circle</span>Mark as Completed</button>
                <button onClick={() => showToast("error", "Appointment cancelled.")} className="w-full py-2.5 bg-error/10 text-error font-bold rounded-lg hover:bg-error/20 transition-colors text-sm flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[18px]">cancel</span>Cancel Appointment</button>
              </div>
            )}
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm p-6">
              <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-[20px] text-primary">notes</span>Notes & Reason</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed bg-surface-container rounded-lg p-4">{selected.notes || "No notes provided."}</p>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm p-6">
              <h4 className="font-bold text-on-surface mb-4">Patient History Snippet</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center"><span className="material-symbols-outlined text-[16px] text-on-surface-variant">history</span></div>
                  <div><p className="text-sm font-semibold text-on-surface">Previous Visit</p><p className="text-xs text-on-surface-variant">2 months ago for Routine checkup.</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center"><span className="material-symbols-outlined text-[16px] text-on-surface-variant">medication</span></div>
                  <div><p className="text-sm font-semibold text-on-surface">Active Prescriptions</p><p className="text-xs text-on-surface-variant">Amoxicillin 500mg, Paracetamol 650mg.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
