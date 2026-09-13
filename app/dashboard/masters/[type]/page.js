"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

// Mock configuration and data for each master type
const MASTER_CONFIG = {
  "departments": {
    title: "Department Master", icon: "apartment",
    fields: [{ name: "name", label: "Department Name", required: true }, { name: "code", label: "Code", required: true }],
    data: [{ id: 1, name: "Cardiology", code: "CARD", status: "Active" }, { id: 2, name: "Emergency", code: "EMER", status: "Active" }]
  },
  "staff-roles": {
    title: "Staff Roles Master", icon: "badge",
    fields: [{ name: "name", label: "Role Name", required: true }, { name: "level", label: "Access Level", required: true }],
    data: [{ id: 1, name: "Doctor", level: "High", status: "Active" }, { id: 2, name: "Nurse", level: "Medium", status: "Active" }]
  },
  "specialties": {
    title: "Specialties Master", icon: "psychiatry",
    fields: [{ name: "name", label: "Specialty", required: true }],
    data: [{ id: 1, name: "Cardiologist", status: "Active" }, { id: 2, name: "Neurologist", status: "Active" }]
  },
  "appointment-types": {
    title: "Appointment Types Master", icon: "book_online",
    fields: [{ name: "name", label: "Type Name", required: true }, { name: "duration", label: "Default Duration (mins)", required: true }],
    data: [{ id: 1, name: "Consultation", duration: "30", status: "Active" }, { id: 2, name: "Follow-up", duration: "15", status: "Active" }]
  },
  "lab-tests": {
    title: "Lab Tests Master", icon: "biotech",
    fields: [{ name: "name", label: "Test Name", required: true }, { name: "category", label: "Category", required: true }],
    data: [{ id: 1, name: "Complete Blood Count (CBC)", category: "Hematology", status: "Active" }]
  },
  "test-categories": {
    title: "Test Categories Master", icon: "category",
    fields: [{ name: "name", label: "Category Name", required: true }],
    data: [{ id: 1, name: "Hematology", status: "Active" }, { id: 2, name: "Biochemistry", status: "Active" }]
  },
  "pharmacy-categories": {
    title: "Pharmacy Categories Master", icon: "medication",
    fields: [{ name: "name", label: "Category Name", required: true }],
    data: [{ id: 1, name: "Antibiotic", status: "Active" }, { id: 2, name: "Analgesic", status: "Active" }]
  },
  "manufacturers": {
    title: "Manufacturers Master", icon: "factory",
    fields: [{ name: "name", label: "Manufacturer Name", required: true }, { name: "contact", label: "Contact Info", required: false }],
    data: [{ id: 1, name: "Cipla Ltd.", contact: "contact@cipla.com", status: "Active" }]
  },
  "ward-names": {
    title: "Ward Names Master", icon: "bed",
    fields: [{ name: "name", label: "Ward Name", required: true }, { name: "type", label: "Ward Type", required: true }],
    data: [{ id: 1, name: "General Ward A", type: "General", status: "Active" }]
  },
  "service-rates": {
    title: "Service Rate Card Master", icon: "payments",
    fields: [{ name: "name", label: "Service Name", required: true }, { name: "rate", label: "Default Rate (₹)", required: true }],
    data: [{ id: 1, name: "OPD Consultation", rate: "800", status: "Active" }]
  }
};

export default function MasterTemplate() {
  const params = useParams();
  const router = useRouter();
  const type = params.type;
  
  const config = MASTER_CONFIG[type];
  
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const formRef = useRef(null);

  // Initialize data on mount based on config
  useEffect(() => {
    if (config) {
      setRecords(config.data);
      setIsDrawerOpen(false);
      setSelected(null);
    }
  }, [type, config]);

  const showToastMsg = (t, msg) => { setToast({ show: true, type: t, message: msg }); setTimeout(() => setToast({ show: false, type: "success", message: "" }), 4000); };
  
  const openDrawer = (record = null) => {
    setSelected(record);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelected(null);
  };

  // Setup jQuery Validation when drawer opens
  useEffect(() => {
    if (isDrawerOpen && window.$ && config) {
      const rules = {};
      const messages = {};
      config.fields.forEach(f => {
        if (f.required) {
          rules[f.name] = "required";
          messages[f.name] = `${f.label} is required`;
        }
      });
      rules.status = "required";
      messages.status = "Status is required";

      // Small timeout to ensure DOM element exists before attaching validation
      setTimeout(() => {
        $("#master-form").validate({
          rules, messages,
          errorElement: "span", errorClass: "text-error text-xs font-medium mt-1 block",
          highlight: (el) => $(el).addClass("border-error").removeClass("border-outline-variant"),
          unhighlight: (el) => $(el).removeClass("border-error").addClass("border-outline-variant"),
          submitHandler: (form) => { 
            // Mock saving logic
            showToastMsg("success", selected ? "Record updated successfully!" : "Record added successfully!"); 
            setTimeout(closeDrawer, 500); 
            return false; 
          }
        });
      }, 100);
    }
  }, [isDrawerOpen, config, selected]);

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">search_off</span>
        <h2 className="text-2xl font-bold text-on-surface">Master Not Found</h2>
        <p className="text-on-surface-variant mt-2">The requested master data configuration does not exist.</p>
        <button onClick={() => router.push('/dashboard')} className="mt-6 px-4 py-2 bg-primary text-on-primary rounded-lg font-bold">Go to Dashboard</button>
      </div>
    );
  }

  const filteredRecords = records.filter(r => 
    Object.values(r).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (id) => {
    // Mock delete logic
    setRecords(records.filter(r => r.id !== id));
    setShowDeleteModal(null);
    showToastMsg("success", "Record deleted successfully!");
  };

  return (
    <div className="animate-in fade-in duration-300 relative h-full">
      {/* Toast */}
      <div className={`fixed top-6 right-6 z-[90] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border-l-4 ${toast.type === 'success' ? 'bg-primary-fixed border-primary text-on-surface' : 'bg-error-container border-error text-on-error-container'}`}>
          <span className={`material-symbols-outlined ${toast.type === 'success' ? 'text-primary' : 'text-error'}`}>{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          <div><p className="font-bold text-sm">{toast.type === 'success' ? 'Success' : 'Error'}</p><p className="text-xs mt-0.5 opacity-90">{toast.message}</p></div>
          <button onClick={() => setToast({...toast, show: false})} className="ml-4 text-outline hover:text-on-surface"><span className="material-symbols-outlined text-sm">close</span></button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-on-surface mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-error">warning</span>Confirm Deletion</h3>
            <p className="text-sm text-on-surface-variant mb-6">Are you sure you want to delete this record? This action cannot be undone and may affect related module data.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(null)} className="px-4 py-2 border border-outline-variant text-sm font-bold rounded-lg hover:bg-surface-container transition-colors">Cancel</button>
              <button onClick={() => handleDelete(showDeleteModal)} className="px-4 py-2 bg-error text-on-error text-sm font-bold rounded-lg hover:bg-error/90 transition-colors shadow-sm">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Right-Side Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] transition-opacity" 
          onClick={closeDrawer}
        ></div>
      )}

      {/* Right-Side Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-surface-container-lowest shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">{selected ? "edit" : "add_circle"}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">{selected ? "Edit Record" : "Add New Record"}</h2>
              <p className="text-xs text-on-surface-variant">{config.title}</p>
            </div>
          </div>
          <button onClick={closeDrawer} className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {isDrawerOpen && (
            <form id="master-form" ref={formRef} className="space-y-6">
              <div className="flex flex-col gap-5">
                {config.fields.map(f => (
                  <div key={f.name}>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">{f.label} {f.required && "*"}</label>
                    <input 
                      name={f.name} 
                      defaultValue={selected ? selected[f.name] : ""}
                      className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                      placeholder={`Enter ${f.label.toLowerCase()}`} 
                    />
                  </div>
                ))}
                
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Status *</label>
                  <select name="status" defaultValue={selected ? selected.status : "Active"} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="p-6 border-t border-outline-variant/30 bg-surface-container-low/30 flex justify-end gap-3 shrink-0">
          <button type="button" onClick={closeDrawer} className="px-6 py-2.5 border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container transition-colors text-sm">Cancel</button>
          {/* External button triggers form submit */}
          <button type="button" onClick={() => window.$('#master-form').submit()} className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">{selected ? "update" : "save"}</span>
            {selected ? "Update Record" : "Save Record"}
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined text-[28px]">{config.icon}</span></div>
          <div>
            <h2 className="text-3xl font-bold text-on-surface tracking-tight">{config.title}</h2>
            <p className="text-sm text-on-surface-variant mt-1">Manage {config.title.toLowerCase()} list and statuses.</p>
          </div>
        </div>
        <button onClick={() => openDrawer()} className="px-4 py-2 bg-primary text-on-primary rounded-lg flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm font-semibold shadow-sm"><span className="material-symbols-outlined text-[20px]">add</span>Add New</button>
      </div>

      {/* List View */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden mb-8">
        <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center gap-3 bg-surface-container-low/10">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholder={`Search ${config.title.toLowerCase()}...`} type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="text-sm font-semibold text-on-surface-variant">{filteredRecords.length} Records</div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-surface-container-low/30 border-b border-outline-variant/30">
                <th className="px-5 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-16">ID</th>
                {config.fields.map(f => (
                  <th key={f.name} className="px-5 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{f.label}</th>
                ))}
                <th className="px-5 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filteredRecords.map((r, i) => (
                <tr key={r.id || i} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-bold text-on-surface-variant">{i + 1}</td>
                  {config.fields.map(f => (
                    <td key={f.name} className="px-5 py-4 text-sm font-semibold text-on-surface">{r[f.name]}</td>
                  ))}
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${r.status === 'Active' ? 'bg-tertiary/10 text-tertiary' : 'bg-error/10 text-error'}`}>{r.status}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openDrawer(r)} className="w-8 h-8 rounded hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                      <button onClick={() => setShowDeleteModal(r.id)} className="w-8 h-8 rounded hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr><td colSpan={config.fields.length + 3} className="px-5 py-12 text-center text-on-surface-variant text-sm">No records found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Basic Pagination Mock */}
        <div className="p-4 border-t border-outline-variant/30 flex justify-between items-center text-sm text-on-surface-variant">
          <span>Showing {filteredRecords.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-low disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-primary bg-primary text-on-primary rounded">1</button>
            <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-low disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
