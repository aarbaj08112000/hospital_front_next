"use client";
import { useState, useEffect } from "react";

const MODULES_LIST = ["Dashboard", "Patient Records", "Appointments", "Laboratory", "Pharmacy", "Wards", "Billing", "Staff Directory", "Settings", "Role Access", "Documentation"];

const INITIAL_ROLES = [
  { id: "ROLE-001", name: "Administrator", users: 5, description: "Full system access including security and settings.", isSystem: true, permissions: MODULES_LIST.reduce((acc, mod) => ({ ...acc, [mod]: { add: true, read: true, write: true, delete: true } }), {}) },
  { id: "ROLE-002", name: "Doctor", users: 45, description: "Access to clinical modules, patients, and lab results.", isSystem: false, permissions: MODULES_LIST.reduce((acc, mod) => ({ ...acc, [mod]: { add: ["Patient Records", "Laboratory", "Appointments"].includes(mod), read: ["Patient Records", "Appointments", "Laboratory", "Wards", "Pharmacy"].includes(mod), write: ["Patient Records", "Laboratory", "Appointments"].includes(mod), delete: false } }), {}) },
  { id: "ROLE-003", name: "Nurse", users: 120, description: "Access to patient care, wards, and basic pharmacy stock.", isSystem: false, permissions: MODULES_LIST.reduce((acc, mod) => ({ ...acc, [mod]: { add: false, read: ["Patient Records", "Wards", "Pharmacy"].includes(mod), write: ["Wards"].includes(mod), delete: false } }), {}) },
  { id: "ROLE-004", name: "Receptionist", users: 15, description: "Front desk operations and appointment scheduling.", isSystem: false, permissions: MODULES_LIST.reduce((acc, mod) => ({ ...acc, [mod]: { add: ["Appointments", "Patient Records"].includes(mod), read: ["Appointments", "Patient Records"].includes(mod), write: ["Appointments", "Patient Records"].includes(mod), delete: false } }), {}) },
];

export default function RolesModule() {
  const [view, setView] = useState("list");
  const [selectedRole, setSelectedRole] = useState(null);
  const [tempPermissions, setTempPermissions] = useState({});
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const showToast = (type, message) => { setToast({ show: true, type, message }); setTimeout(() => setToast({ show: false, type: "success", message: "" }), 4000); };
  const goBack = () => { setSelectedRole(null); setView("list"); };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setTempPermissions(JSON.parse(JSON.stringify(role.permissions)));
    setView("edit");
  };

  const handleToggle = (mod, type) => {
    setTempPermissions(prev => ({
      ...prev,
      [mod]: { ...prev[mod], [type]: !prev[mod]?.[type] }
    }));
  };

  const handleSave = () => {
    showToast("success", "Role permissions updated successfully!");
    setTimeout(goBack, 1500);
  };

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
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">{view === "list" ? "Role & Access Management" : `Edit Permissions: ${selectedRole?.name}`}</h2>
          <p className="text-sm text-on-surface-variant mt-1">{view === "list" ? "Define roles and manage module permissions for hospital staff." : "Configure module-level access (Read, Write, Delete)."}</p>
        </div>
        <div className="flex gap-3">
          {view !== "list" ? (
            <button onClick={goBack} className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors text-sm font-semibold text-on-surface shadow-sm"><span className="material-symbols-outlined text-[20px]">arrow_back</span>Back to Roles</button>
          ) : (
            <button onClick={() => showToast("error", "Add role feature requires backend integration.")} className="px-4 py-2 bg-primary text-on-primary rounded-lg flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm font-semibold shadow-sm"><span className="material-symbols-outlined text-[20px]">add</span>Create New Role</button>
          )}
        </div>
      </div>

      {/* List View */}
      {view === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {INITIAL_ROLES.map((role) => (
            <div key={role.id} className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[24px]">shield</span></div>
                {role.isSystem && <span className="px-2 py-0.5 bg-error/10 text-error text-[10px] font-bold rounded">System Default</span>}
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-1">{role.name}</h3>
              <p className="text-xs font-semibold text-primary mb-4 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">group</span>{role.users} Active Users</p>
              <p className="text-sm text-on-surface-variant mb-6 flex-1 leading-relaxed">{role.description}</p>
              <button onClick={() => handleEdit(role)} className="w-full py-2 border border-primary text-primary text-sm font-bold rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">settings</span>Manage Access
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Permissions View */}
      {view === "edit" && selectedRole && (
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-[28px]">verified_user</span></div>
            <div><h3 className="text-xl font-bold text-on-surface">{selectedRole.name} Permissions</h3><p className="text-sm text-on-surface-variant">Toggle access switches to grant or revoke privileges.</p></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/30 border-b border-outline-variant/30">
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Module</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-center w-28">Add</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-center w-28">Read Access</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-center w-28">Edit</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-center w-28">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {MODULES_LIST.map(mod => {
                  const perm = tempPermissions[mod] || { add: false, read: false, write: false, delete: false };
                  return (
                    <tr key={mod} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-on-surface">{mod}</td>
                      {["add", "read", "write", "delete"].map(type => (
                        <td key={type} className="px-6 py-4 text-center">
                          <button onClick={() => handleToggle(mod, type)} disabled={selectedRole.isSystem} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${perm[type] ? 'bg-primary' : 'bg-surface-container-high'} ${selectedRole.isSystem ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${perm[type] ? 'translate-x-4' : 'translate-x-1'}`} />
                          </button>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-outline-variant/30 flex justify-end gap-3 bg-surface-container-low/20">
            <button onClick={goBack} className="px-6 py-2.5 border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container transition-colors text-sm">Cancel</button>
            <button onClick={handleSave} disabled={selectedRole.isSystem} className={`px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg transition-colors text-sm shadow-sm flex items-center gap-2 ${selectedRole.isSystem ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-container hover:text-on-primary-container'}`}>
              <span className="material-symbols-outlined text-[18px]">save</span>Save Configuration
            </button>
          </div>
          {selectedRole.isSystem && <div className="px-6 pb-6"><p className="text-xs text-error font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">warning</span>System default roles cannot be modified.</p></div>}
        </div>
      )}
    </div>
  );
}
