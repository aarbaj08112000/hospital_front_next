"use client";
import { useState, useEffect } from "react";

const StatusBadge = ({ status }) => {
  const s = { "In Stock": "bg-secondary/10 text-secondary", "Low Stock": "bg-tertiary/10 text-tertiary", "Out of Stock": "bg-error/10 text-error" };
  return <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${s[status] || "bg-surface-container"}`}>{status}</span>;
};

const MEDICINES = [
  { id: "MED-001", name: "Amoxicillin 500mg", category: "Antibiotic", manufacturer: "Cipla Ltd.", batch: "BT-20240112", expiry: "2025-06-30", qty: 1200, price: "₹12.50", status: "In Stock", desc: "Broad-spectrum penicillin antibiotic for bacterial infections." },
  { id: "MED-002", name: "Paracetamol 650mg", category: "Analgesic", manufacturer: "Sun Pharma", batch: "BT-20240215", expiry: "2025-09-15", qty: 3500, price: "₹5.00", status: "In Stock", desc: "Used for pain relief and fever reduction." },
  { id: "MED-003", name: "Metformin 500mg", category: "Antidiabetic", manufacturer: "USV Pvt. Ltd.", batch: "BT-20240310", expiry: "2025-03-01", qty: 80, price: "₹8.75", status: "Low Stock", desc: "First-line medication for type 2 diabetes management." },
  { id: "MED-004", name: "Atorvastatin 10mg", category: "Statin", manufacturer: "Dr. Reddy's", batch: "BT-20240105", expiry: "2024-12-31", qty: 0, price: "₹15.00", status: "Out of Stock", desc: "Cholesterol-lowering medication for cardiovascular protection." },
  { id: "MED-005", name: "Omeprazole 20mg", category: "PPI", manufacturer: "Lupin Ltd.", batch: "BT-20240420", expiry: "2026-01-20", qty: 950, price: "₹10.25", status: "In Stock", desc: "Proton pump inhibitor for acid reflux and ulcers." },
  { id: "MED-006", name: "Cetirizine 10mg", category: "Antihistamine", manufacturer: "Mankind Pharma", batch: "BT-20240318", expiry: "2025-11-10", qty: 45, price: "₹4.50", status: "Low Stock", desc: "Second-generation antihistamine for allergy relief." },
];

export default function PharmacyModule() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });
  const [catFilter, setCatFilter] = useState("All");

  const showToast = (type, message) => { setToast({ show: true, type, message }); setTimeout(() => setToast({ show: false, type: "success", message: "" }), 4000); };
  const goBack = () => { setSelected(null); setView("list"); };

  const categories = ["All", ...new Set(MEDICINES.map(m => m.category))];
  const filtered = catFilter === "All" ? MEDICINES : MEDICINES.filter(m => m.category === catFilter);

  const inStock = MEDICINES.filter(m => m.status === "In Stock").length;
  const lowStock = MEDICINES.filter(m => m.status === "Low Stock").length;
  const outStock = MEDICINES.filter(m => m.status === "Out of Stock").length;

  useEffect(() => {
    if ((view === "add" || view === "edit") && window.$) {
      $("#pharmacy-form").validate({
        rules: { name: "required", category: "required", manufacturer: "required", batch: "required", expiry: "required", qty: { required: true, digits: true }, price: { required: true, number: true } },
        messages: { name: "Medicine name required", category: "Select category", manufacturer: "Manufacturer required", batch: "Batch number required", expiry: "Expiry date required", qty: "Valid quantity required", price: "Valid price required" },
        errorElement: "span", errorClass: "text-error text-xs font-medium mt-1 block",
        highlight: (el) => $(el).addClass("border-error").removeClass("border-outline-variant"),
        unhighlight: (el) => $(el).removeClass("border-error").addClass("border-outline-variant"),
        submitHandler: () => { showToast("success", view === "edit" ? "Medicine updated successfully!" : "Medicine added to inventory!"); setTimeout(goBack, 1500); return false; }
      });
    }
  }, [view]);

  return (
    <div className="animate-in fade-in duration-300">
      {/* Toast */}
      <div className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border-l-4 ${toast.type === 'success' ? 'bg-primary-fixed border-primary text-on-surface' : 'bg-error-container border-error text-on-error-container'}`}>
          <span className={`material-symbols-outlined ${toast.type === 'success' ? 'text-primary' : 'text-error'}`}>{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          <div>
            <p className="font-bold text-sm leading-tight">{toast.type === 'success' ? 'Success' : 'Error'}</p>
            <p className="text-xs mt-0.5 opacity-90">{toast.message}</p>
          </div>
          <button onClick={() => setToast({...toast, show: false})} className="ml-4 text-outline hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-sm">close</span></button>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">
            {view === "list" ? "Pharmacy & Inventory" : view === "add" ? "Add Medicine" : view === "edit" ? `Edit: ${selected?.name}` : `Medicine: ${selected?.name}`}
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            {view === "list" ? "Manage medicine inventory, stock levels, and expiry tracking" : view === "view" ? `${selected?.category} — ${selected?.manufacturer}` : "Enter medicine details below"}
          </p>
        </div>
        <div className="flex gap-3">
          {view !== "list" ? (
            <button onClick={goBack} className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors text-sm font-semibold text-on-surface shadow-sm">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>Back to Inventory
            </button>
          ) : (
            <button onClick={() => { setSelected(null); setView("add"); }} className="px-4 py-2 bg-primary text-on-primary rounded-lg flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm font-semibold shadow-sm">
              <span className="material-symbols-outlined text-[20px]">add</span>Add Medicine
            </button>
          )}
        </div>
      </div>

      {/* List View */}
      {view === "list" && (<>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Medicines", val: MEDICINES.length, icon: "medication", color: "text-primary bg-primary/10" },
            { label: "In Stock", val: inStock, icon: "check_circle", color: "text-secondary bg-secondary/10" },
            { label: "Low Stock", val: lowStock, icon: "warning", color: "text-tertiary bg-tertiary/10" },
            { label: "Out of Stock", val: outStock, icon: "error", color: "text-error bg-error/10" },
          ].map((c, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm p-4 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${c.color}`}><span className="material-symbols-outlined">{c.icon}</span></div>
              <div>
                <p className="text-2xl font-bold text-on-surface">{c.val}</p>
                <p className="text-xs text-on-surface-variant font-medium">{c.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden mb-8">
          <div className="p-5 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="Search by name, batch, or ID..." type="text" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(c => (
                <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${catFilter === c ? "bg-primary text-on-primary border-primary" : "bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:bg-surface-container-low"}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/30 border-b border-outline-variant/30">
                  {["ID", "Medicine", "Category", "Batch / Expiry", "Qty", "Price", "Status", "Actions"].map(h => (
                    <th key={h} className={`px-5 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider ${h === "Actions" ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filtered.map((med, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-bold text-primary">{med.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-sm text-on-surface">{med.name}</p>
                      <p className="text-[11px] text-on-surface-variant">{med.manufacturer}</p>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-on-surface-variant">{med.category}</td>
                    <td className="px-5 py-4 text-sm">
                      <p className="font-medium text-on-surface-variant">{med.batch}</p>
                      <p className="text-[11px] text-primary font-semibold">{med.expiry}</p>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-on-surface">{med.qty}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-on-surface">{med.price}</td>
                    <td className="px-5 py-4"><StatusBadge status={med.status} /></td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <div className="relative group/edit">
                          <button onClick={() => { setSelected(med); setView("edit"); }} className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-on-surface text-surface text-[11px] font-semibold rounded whitespace-nowrap opacity-0 invisible group-hover/edit:opacity-100 group-hover/edit:visible transition-all duration-200 pointer-events-none">Edit</span>
                        </div>
                        <div className="relative group/view">
                          <button onClick={() => { setSelected(med); setView("view"); }} className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-on-surface text-surface text-[11px] font-semibold rounded whitespace-nowrap opacity-0 invisible group-hover/view:opacity-100 group-hover/view:visible transition-all duration-200 pointer-events-none">View Details</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan="8" className="px-5 py-12 text-center text-on-surface-variant text-sm">No medicines found.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-outline-variant/30 flex justify-between items-center text-sm text-on-surface-variant">
            <span>Showing {filtered.length} of {MEDICINES.length} medicines</span>
          </div>
        </div>
      </>)}

      {/* Add / Edit Form */}
      {(view === "add" || view === "edit") && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden mb-8 p-6">
          <h3 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">{view === "edit" ? "Update Medicine Details" : "Add New Medicine"}</h3>
          <form id="pharmacy-form" className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">medication</span>Medicine Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Medicine Name *</label>
                  <input type="text" name="name" defaultValue={selected?.name || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="e.g. Amoxicillin 500mg" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Category *</label>
                  <select name="category" defaultValue={selected?.category || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                    <option value="">Select Category</option>
                    {["Antibiotic", "Analgesic", "Antidiabetic", "Statin", "PPI", "Antihistamine", "Antihypertensive", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Manufacturer *</label>
                  <input type="text" name="manufacturer" defaultValue={selected?.manufacturer || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="e.g. Cipla Ltd." />
                </div>
              </div>
            </div>
            <hr className="border-outline-variant/30" />
            <div>
              <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">inventory_2</span>Stock & Pricing</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Batch No. *</label>
                  <input type="text" name="batch" defaultValue={selected?.batch || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="BT-XXXXXXXX" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Expiry Date *</label>
                  <input type="date" name="expiry" defaultValue={selected?.expiry || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Quantity *</label>
                  <input type="text" name="qty" defaultValue={selected?.qty ?? ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Unit Price (₹) *</label>
                  <input type="text" name="price" defaultValue={selected?.price?.replace("₹", "") || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="0.00" />
                </div>
              </div>
            </div>
            <hr className="border-outline-variant/30" />
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Description (Optional)</label>
              <textarea name="desc" rows="3" defaultValue={selected?.desc || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" placeholder="Usage instructions, side effects..."></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
              <button type="button" onClick={goBack} className="px-6 py-2.5 border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container transition-colors text-sm">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm shadow-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">{view === "edit" ? "update" : "save"}</span>{view === "edit" ? "Update Medicine" : "Add to Inventory"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Detail */}
      {view === "view" && selected && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[28px]">medication</span></div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">{selected.id}</h3>
                <StatusBadge status={selected.status} />
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-outline-variant/30">
              {[
                { icon: "pill", label: "Name", value: selected.name },
                { icon: "category", label: "Category", value: selected.category },
                { icon: "factory", label: "Manufacturer", value: selected.manufacturer },
                { icon: "qr_code", label: "Batch", value: selected.batch },
                { icon: "event", label: "Expiry", value: selected.expiry },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{item.icon}</span>
                  <div><p className="text-xs text-on-surface-variant">{item.label}</p><p className="text-sm font-semibold text-on-surface">{item.value}</p></div>
                </div>
              ))}
            </div>
            <button onClick={() => { setView("edit"); }} className="w-full mt-6 py-2.5 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors text-sm flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">edit</span>Edit Medicine
            </button>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 shadow-sm">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Current Stock</p>
                <p className={`text-2xl font-bold ${selected.qty > 100 ? 'text-secondary' : selected.qty > 0 ? 'text-tertiary' : 'text-error'}`}>{selected.qty} <span className="text-sm text-on-surface-variant font-medium">units</span></p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 shadow-sm">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Unit Price</p>
                <p className="text-2xl font-bold text-on-surface">{selected.price}</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 shadow-sm">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Stock Value</p>
                <p className="text-2xl font-bold text-primary">₹{(selected.qty * parseFloat(selected.price.replace("₹", ""))).toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm p-6 flex-1">
              <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-[20px] text-primary">description</span>Description</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed bg-surface-container rounded-lg p-4">{selected.desc || "No description available."}</p>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm p-6">
              <h4 className="font-bold text-on-surface mb-4">Quick Actions</h4>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => showToast("success", "Stock updated! +100 units added.")} className="px-4 py-2 bg-secondary/10 text-secondary font-semibold rounded-lg text-sm hover:bg-secondary/20 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>Restock
                </button>
                <button onClick={() => showToast("error", "Medicine flagged for disposal.")} className="px-4 py-2 bg-error/10 text-error font-semibold rounded-lg text-sm hover:bg-error/20 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">delete</span>Flag Expired
                </button>
                <button className="px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg text-sm hover:bg-primary/20 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">print</span>Print Label
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
