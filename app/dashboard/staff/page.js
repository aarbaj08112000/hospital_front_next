"use client";
import { useState, useEffect } from "react";

const STAFF = [
  { id: "EMP-101", name: "Dr. Sarah Jenkins", role: "Doctor", dept: "Cardiology", phone: "(555) 111-2233", email: "s.jenkins@medicenter.com", status: "Active", joined: "15 Mar 2020", shift: "Day (8AM-4PM)", leave: 12 },
  { id: "EMP-102", name: "Dr. Robert Chen", role: "Doctor", dept: "Emergency", phone: "(555) 222-3344", email: "r.chen@medicenter.com", status: "Active", joined: "02 Jan 2019", shift: "Night (8PM-4AM)", leave: 8 },
  { id: "EMP-103", name: "Dr. Emily Watts", role: "Doctor", dept: "Pediatrics", phone: "(555) 333-4455", email: "e.watts@medicenter.com", status: "On Leave", joined: "10 Aug 2021", shift: "Day (8AM-4PM)", leave: 3 },
  { id: "EMP-104", name: "Maria Santos", role: "Nurse", dept: "ICU", phone: "(555) 444-5566", email: "m.santos@medicenter.com", status: "Active", joined: "20 Jun 2022", shift: "Day (8AM-4PM)", leave: 15 },
  { id: "EMP-105", name: "John Mitchell", role: "Nurse", dept: "General Ward", phone: "(555) 555-6677", email: "j.mitchell@medicenter.com", status: "Active", joined: "05 Sep 2021", shift: "Night (8PM-4AM)", leave: 10 },
  { id: "EMP-106", name: "Priya Sharma", role: "Admin", dept: "Reception", phone: "(555) 666-7788", email: "p.sharma@medicenter.com", status: "Active", joined: "12 Feb 2023", shift: "Day (9AM-5PM)", leave: 18 },
  { id: "EMP-107", name: "David Kim", role: "Technician", dept: "Laboratory", phone: "(555) 777-8899", email: "d.kim@medicenter.com", status: "Active", joined: "01 Nov 2022", shift: "Day (8AM-4PM)", leave: 14 },
  { id: "EMP-108", name: "Lisa Anderson", role: "Admin", dept: "Billing", phone: "(555) 888-9900", email: "l.anderson@medicenter.com", status: "Inactive", joined: "18 Apr 2020", shift: "—", leave: 0 },
];

export default function StaffModule() {
  const [view, setView] = useState("list");
  const [viewMode, setViewMode] = useState("grid");
  const [selected, setSelected] = useState(null);
  const [roleFilter, setRoleFilter] = useState("All");
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const showToast = (type, message) => { setToast({ show: true, type, message }); setTimeout(() => setToast({ show: false, type: "success", message: "" }), 4000); };
  const goBack = () => { setSelected(null); setView("list"); };

  const filtered = roleFilter === "All" ? STAFF : STAFF.filter(s => s.role === roleFilter);
  const statusColors = { Active: "bg-tertiary/10 text-tertiary", "On Leave": "bg-primary/10 text-primary", Inactive: "bg-error/10 text-error" };
  const roleIcons = { Doctor: "stethoscope", Nurse: "medical_information", Admin: "badge", Technician: "biotech" };

  useEffect(() => {
    if (view === "add" && window.$) {
      $("#staff-form").validate({
        rules: { fullName: "required", role: "required", dept: "required", phone: { required: true, minlength: 10 }, email: { required: true, email: true }, joinDate: "required" },
        messages: { fullName: "Full name required", role: "Select role", dept: "Department required", phone: "Valid phone required", email: "Valid email required", joinDate: "Join date required" },
        errorElement: "span", errorClass: "text-error text-xs font-medium mt-1 block",
        highlight: (el) => $(el).addClass("border-error").removeClass("border-outline-variant"),
        unhighlight: (el) => $(el).removeClass("border-error").addClass("border-outline-variant"),
        submitHandler: () => { showToast("success", "Staff member added successfully!"); setTimeout(goBack, 1500); return false; }
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
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">{view === "list" ? "Staff Directory" : view === "add" ? "Add Staff Member" : `Profile: ${selected?.name}`}</h2>
          <p className="text-sm text-on-surface-variant mt-1">{view === "list" ? "Manage hospital personnel, doctors, and nurses." : view === "add" ? "Fill in staff member details below." : `${selected?.role} — ${selected?.dept}`}</p>
        </div>
        <div className="flex gap-3">
          {view !== "list" ? (
            <button onClick={goBack} className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors text-sm font-semibold text-on-surface shadow-sm"><span className="material-symbols-outlined text-[20px]">arrow_back</span>Back to Directory</button>
          ) : (<>
            <div className="flex gap-1 bg-surface-container p-1 rounded-xl">
              <button onClick={() => setViewMode("grid")} className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 ${viewMode === 'grid' ? 'bg-surface-container-lowest shadow-sm' : 'text-on-surface-variant'}`}><span className="material-symbols-outlined text-[18px]">grid_view</span></button>
              <button onClick={() => setViewMode("list")} className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 ${viewMode === 'list' ? 'bg-surface-container-lowest shadow-sm' : 'text-on-surface-variant'}`}><span className="material-symbols-outlined text-[18px]">table_rows</span></button>
            </div>
            <button onClick={() => setView("add")} className="px-4 py-2 bg-primary text-on-primary rounded-lg flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm font-semibold shadow-sm"><span className="material-symbols-outlined text-[20px]">person_add</span>Add Staff</button>
          </>)}
        </div>
      </div>

      {/* List View */}
      {view === "list" && (<>
        <div className="flex gap-2 flex-wrap mb-6">
          {["All", "Doctor", "Nurse", "Admin", "Technician"].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${roleFilter === r ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>{r}{r !== "All" ? "s" : ""}</button>
          ))}
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(s => (
              <div key={s.id} onClick={() => { setSelected(s); setView("view"); }} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm p-6 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold border-2 border-primary/20">{s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-on-surface truncate">{s.name}</h3>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">{roleIcons[s.role]}</span>{s.role}</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-on-surface-variant">
                  <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">apartment</span>{s.dept}</p>
                  <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">mail</span>{s.email}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/30 flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusColors[s.status]}`}>{s.status}</span>
                  <span className="text-xs text-primary font-semibold group-hover:underline">View Profile →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === "list" && (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-surface-container-low/30 border-b border-outline-variant/30">
                  {["ID", "Name", "Role", "Department", "Contact", "Status", "Actions"].map(h => <th key={h} className={`px-5 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider ${h === "Actions" ? "text-right" : ""}`}>{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {filtered.map(s => (
                    <tr key={s.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-5 py-4 text-sm font-bold text-primary">{s.id}</td>
                      <td className="px-5 py-4 font-bold text-sm text-on-surface">{s.name}</td>
                      <td className="px-5 py-4 text-sm text-on-surface-variant">{s.role}</td>
                      <td className="px-5 py-4 text-sm text-on-surface-variant">{s.dept}</td>
                      <td className="px-5 py-4"><p className="text-sm text-on-surface-variant">{s.phone}</p><p className="text-xs text-primary">{s.email}</p></td>
                      <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-md text-xs font-bold ${statusColors[s.status]}`}>{s.status}</span></td>
                      <td className="px-5 py-4 text-right">
                        <div className="relative group/view inline-block">
                          <button onClick={() => { setSelected(s); setView("view"); }} className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-on-surface text-surface text-[11px] font-semibold rounded whitespace-nowrap opacity-0 invisible group-hover/view:opacity-100 group-hover/view:visible transition-all duration-200 pointer-events-none">View Profile</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>)}

      {/* VIEW */}
      {view === "view" && selected && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold border-2 border-primary/20 mx-auto mb-3">{selected.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
              <h3 className="text-lg font-bold text-on-surface">{selected.name}</h3>
              <p className="text-sm text-on-surface-variant">{selected.role} — {selected.dept}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-xs font-bold ${statusColors[selected.status]}`}>{selected.status}</span>
            </div>
            <div className="space-y-3 pt-4 border-t border-outline-variant/30">
              {[["badge", "ID", selected.id], ["phone", "Phone", selected.phone], ["mail", "Email", selected.email], ["event", "Joined", selected.joined], ["schedule", "Shift", selected.shift]].map(([icon, label, val]) => (
                <div key={label} className="flex items-center gap-3"><span className="material-symbols-outlined text-on-surface-variant text-[20px]">{icon}</span><div><p className="text-xs text-on-surface-variant">{label}</p><p className="text-sm font-semibold text-on-surface">{val}</p></div></div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm p-5">
                <p className="text-xs text-on-surface-variant font-medium mb-1">Leave Balance</p>
                <p className="text-2xl font-bold text-primary">{selected.leave} <span className="text-sm font-medium text-on-surface-variant">days remaining</span></p>
              </div>
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm p-5">
                <p className="text-xs text-on-surface-variant font-medium mb-1">Current Shift</p>
                <p className="text-2xl font-bold text-on-surface">{selected.shift}</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm p-6">
              <h4 className="font-bold text-on-surface mb-4">Quick Actions</h4>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => showToast("success", "Message sent.")} className="px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg text-sm hover:bg-primary/20 transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">mail</span>Send Message</button>
                <button onClick={() => showToast("success", "Shift updated.")} className="px-4 py-2 bg-secondary/10 text-secondary font-semibold rounded-lg text-sm hover:bg-secondary/20 transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">schedule</span>Update Shift</button>
                <button onClick={() => showToast("success", "Leave approved.")} className="px-4 py-2 bg-tertiary/10 text-tertiary font-semibold rounded-lg text-sm hover:bg-tertiary/20 transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">event_available</span>Approve Leave</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD FORM */}
      {view === "add" && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden p-6">
          <h3 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">Add New Staff Member</h3>
          <form id="staff-form" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Full Name *</label><input name="fullName" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Enter full name" /></div>
              <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Role *</label><select name="role" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"><option value="">Select Role</option><option>Doctor</option><option>Nurse</option><option>Admin</option><option>Technician</option></select></div>
              <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Department *</label><input name="dept" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="e.g. Cardiology" /></div>
              <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Phone *</label><input name="phone" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="(555) 000-0000" /></div>
              <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Email *</label><input name="email" type="email" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="name@medicenter.com" /></div>
              <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Join Date *</label><input name="joinDate" type="date" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
              <button type="button" onClick={goBack} className="px-6 py-2.5 border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container transition-colors text-sm">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm shadow-sm flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">person_add</span>Add Staff</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
