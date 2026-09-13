"use client";
import { useState, useEffect } from "react";

const INVOICES = [
  { id: "INV-7001", patient: "Eleanor Richards", mrn: "MRN-10042", date: "12 Jul 2026", due: "26 Jul 2026", items: [{ desc: "Consultation – Cardiology", qty: 1, rate: 1500 }, { desc: "ECG Test", qty: 1, rate: 800 }, { desc: "Blood Panel (CBC)", qty: 1, rate: 650 }], status: "Paid", method: "Credit Card" },
  { id: "INV-7002", patient: "James Wilson", mrn: "MRN-10043", date: "13 Jul 2026", due: "27 Jul 2026", items: [{ desc: "ER Admission", qty: 1, rate: 5000 }, { desc: "X-Ray – Chest", qty: 2, rate: 1200 }, { desc: "Medication – Paracetamol", qty: 10, rate: 5 }], status: "Pending", method: "" },
  { id: "INV-7003", patient: "Sophia Martinez", mrn: "MRN-10044", date: "10 Jul 2026", due: "10 Jul 2026", items: [{ desc: "OPD Consultation", qty: 1, rate: 800 }, { desc: "Liver Function Test", qty: 1, rate: 950 }], status: "Overdue", method: "" },
  { id: "INV-7004", patient: "William Taylor", mrn: "MRN-10045", date: "13 Jul 2026", due: "27 Jul 2026", items: [{ desc: "Ward Stay – General (3 days)", qty: 3, rate: 2000 }, { desc: "Nursing Care", qty: 3, rate: 500 }, { desc: "Medication Package", qty: 1, rate: 1800 }], status: "Draft", method: "" },
  { id: "INV-7005", patient: "Maria Garcia", mrn: "MRN-10046", date: "11 Jul 2026", due: "25 Jul 2026", items: [{ desc: "Thyroid Panel", qty: 1, rate: 1100 }, { desc: "Consultation – Endocrinology", qty: 1, rate: 1200 }], status: "Paid", method: "UPI" },
];

const calcTotal = (items) => items.reduce((s, i) => s + i.qty * i.rate, 0);

export default function BillingModule() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const showToast = (type, message) => { setToast({ show: true, type, message }); setTimeout(() => setToast({ show: false, type: "success", message: "" }), 4000); };
  const goBack = () => { setSelected(null); setView("list"); };

  const filtered = statusFilter === "All" ? INVOICES : INVOICES.filter(i => i.status === statusFilter);
  const totalRevenue = INVOICES.filter(i => i.status === "Paid").reduce((s, i) => s + calcTotal(i.items), 0);
  const totalPending = INVOICES.filter(i => i.status === "Pending").reduce((s, i) => s + calcTotal(i.items), 0);
  const totalOverdue = INVOICES.filter(i => i.status === "Overdue").reduce((s, i) => s + calcTotal(i.items), 0);

  useEffect(() => {
    if (view === "add" && window.$) {
      $("#billing-form").validate({
        rules: { patient: "required", mrn: "required", dueDate: "required", itemDesc: "required", itemQty: { required: true, digits: true, min: 1 }, itemRate: { required: true, number: true, min: 1 } },
        messages: { patient: "Patient name required", mrn: "MRN required", dueDate: "Due date required", itemDesc: "Item description required", itemQty: "Valid quantity required", itemRate: "Valid rate required" },
        errorElement: "span", errorClass: "text-error text-xs font-medium mt-1 block",
        highlight: (el) => $(el).addClass("border-error").removeClass("border-outline-variant"),
        unhighlight: (el) => $(el).removeClass("border-error").addClass("border-outline-variant"),
        submitHandler: () => { showToast("success", "Invoice created successfully!"); setTimeout(goBack, 1500); return false; }
      });
    }
  }, [view]);

  const statusColors = { Paid: "bg-tertiary/10 text-tertiary", Pending: "bg-primary/10 text-primary", Overdue: "bg-error/10 text-error", Draft: "bg-secondary/10 text-secondary" };

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
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">{view === "list" ? "Billing & Payments" : view === "add" ? "Create Invoice" : `Invoice: ${selected?.id}`}</h2>
          <p className="text-sm text-on-surface-variant mt-1">{view === "list" ? "Manage patient invoices and track revenue." : view === "add" ? "Fill in invoice details below." : `${selected?.patient} — ${selected?.date}`}</p>
        </div>
        <div className="flex gap-3">
          {view !== "list" ? (
            <button onClick={goBack} className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors text-sm font-semibold text-on-surface shadow-sm"><span className="material-symbols-outlined text-[20px]">arrow_back</span>Back to Invoices</button>
          ) : (
            <button onClick={() => setView("add")} className="px-4 py-2 bg-primary text-on-primary rounded-lg flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm font-semibold shadow-sm"><span className="material-symbols-outlined text-[20px]">add</span>New Invoice</button>
          )}
        </div>
      </div>

      {/* LIST */}
      {view === "list" && (<>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[{ label: "Total Collected", val: `₹${totalRevenue.toLocaleString()}`, icon: "account_balance", color: "text-tertiary bg-tertiary/10" }, { label: "Pending", val: `₹${totalPending.toLocaleString()}`, icon: "schedule", color: "text-primary bg-primary/10" }, { label: "Overdue", val: `₹${totalOverdue.toLocaleString()}`, icon: "warning", color: "text-error bg-error/10" }].map((c, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.color}`}><span className="material-symbols-outlined">{c.icon}</span></div>
              <div><p className="text-2xl font-bold text-on-surface">{c.val}</p><p className="text-xs text-on-surface-variant font-medium">{c.label}</p></div>
            </div>
          ))}
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden mb-8">
          <div className="p-5 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="Search invoices..." type="text" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", "Paid", "Pending", "Overdue", "Draft"].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${statusFilter === s ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-surface-container-low/30 border-b border-outline-variant/30">
                {["Invoice", "Patient", "Date", "Amount", "Status", "Actions"].map(h => <th key={h} className={`px-5 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider ${h === "Actions" ? "text-right" : ""}`}>{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-bold text-primary">{inv.id}</td>
                    <td className="px-5 py-4"><p className="font-bold text-sm text-on-surface">{inv.patient}</p><p className="text-xs text-on-surface-variant">{inv.mrn}</p></td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant">{inv.date}</td>
                    <td className="px-5 py-4 text-sm font-bold text-on-surface">₹{calcTotal(inv.items).toLocaleString()}</td>
                    <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-md text-xs font-bold ${statusColors[inv.status]}`}>{inv.status}</span></td>
                    <td className="px-5 py-4 text-right">
                      <div className="relative group/view inline-block">
                        <button onClick={() => { setSelected(inv); setView("view"); }} className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-on-surface text-surface text-[11px] font-semibold rounded whitespace-nowrap opacity-0 invisible group-hover/view:opacity-100 group-hover/view:visible transition-all duration-200 pointer-events-none">View Invoice</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>)}

      {/* VIEW */}
      {view === "view" && selected && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined">receipt_long</span></div>
                <div><h3 className="text-xl font-bold text-on-surface">{selected.id}</h3><p className="text-sm text-on-surface-variant">{selected.patient} • {selected.mrn}</p></div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${statusColors[selected.status]}`}>{selected.status}</span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[["Invoice Date", selected.date], ["Due Date", selected.due], ["Payment", selected.method || "Unpaid"], ["Total", `₹${calcTotal(selected.items).toLocaleString()}`]].map(([l, v]) => (
                  <div key={l} className="bg-surface-container-low rounded-xl p-3"><p className="text-xs text-on-surface-variant font-medium mb-1">{l}</p><p className="text-sm font-bold text-on-surface">{v}</p></div>
                ))}
              </div>
              <h4 className="font-bold text-on-surface mb-3">Line Items</h4>
              <table className="w-full text-left border-collapse">
                <thead><tr className="border-b border-outline-variant/30"><th className="py-2 text-xs font-semibold text-on-surface-variant">Description</th><th className="py-2 text-xs font-semibold text-on-surface-variant text-center">Qty</th><th className="py-2 text-xs font-semibold text-on-surface-variant text-right">Rate</th><th className="py-2 text-xs font-semibold text-on-surface-variant text-right">Amount</th></tr></thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {selected.items.map((item, i) => (
                    <tr key={i}><td className="py-3 text-sm text-on-surface">{item.desc}</td><td className="py-3 text-sm text-on-surface-variant text-center">{item.qty}</td><td className="py-3 text-sm text-on-surface-variant text-right">₹{item.rate.toLocaleString()}</td><td className="py-3 text-sm font-bold text-on-surface text-right">₹{(item.qty * item.rate).toLocaleString()}</td></tr>
                  ))}
                </tbody>
                <tfoot><tr className="border-t-2 border-outline-variant/40"><td colSpan="3" className="py-3 text-sm font-bold text-on-surface text-right">Grand Total</td><td className="py-3 text-lg font-bold text-primary text-right">₹{calcTotal(selected.items).toLocaleString()}</td></tr></tfoot>
              </table>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm p-6">
              <h4 className="font-bold text-on-surface mb-4">Quick Actions</h4>
              <div className="space-y-2">
                {selected.status !== "Paid" && <button onClick={() => showToast("success", "Payment recorded successfully!")} className="w-full py-2.5 bg-tertiary/10 text-tertiary text-sm font-bold rounded-lg hover:bg-tertiary/20 transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[18px]">payments</span>Record Payment</button>}
                <button onClick={() => showToast("success", "PDF downloaded.")} className="w-full py-2.5 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[18px]">download</span>Download PDF</button>
                <button onClick={() => showToast("success", "Invoice printed.")} className="w-full py-2.5 bg-surface-container text-on-surface text-sm font-bold rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[18px]">print</span>Print Invoice</button>
                {selected.status === "Overdue" && <button onClick={() => showToast("success", "Reminder sent to patient.")} className="w-full py-2.5 bg-error/10 text-error text-sm font-bold rounded-lg hover:bg-error/20 transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[18px]">notifications</span>Send Reminder</button>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD FORM */}
      {view === "add" && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden p-6">
          <h3 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">Create New Invoice</h3>
          <form id="billing-form" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Patient Name *</label><input name="patient" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Enter patient name" /></div>
              <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">MRN *</label><input name="mrn" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="MRN-XXXXX" /></div>
              <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Due Date *</label><input type="date" name="dueDate" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
            </div>
            <hr className="border-outline-variant/30" />
            <h4 className="text-sm font-bold text-primary flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">list</span>Invoice Line Item</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Description *</label><input name="itemDesc" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="e.g. Consultation" /></div>
              <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Quantity *</label><input name="itemQty" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="1" /></div>
              <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Rate (₹) *</label><input name="itemRate" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="0.00" /></div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
              <button type="button" onClick={goBack} className="px-6 py-2.5 border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container transition-colors text-sm">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm shadow-sm flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">save</span>Create Invoice</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
