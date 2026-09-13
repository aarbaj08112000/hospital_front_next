"use client";
import { useState, useEffect } from "react";

const TESTS = [
  { id: "LAB-5001", patient: "Eleanor Richards", mrn: "MRN-10042", test: "Complete Blood Count (CBC)", category: "Hematology", doctor: "Dr. Sarah Jenkins", date: "12 Jul 2026", status: "Completed", result: "Normal", notes: "All values within reference range. WBC: 7.2, RBC: 4.8, Hemoglobin: 14.2 g/dL, Platelets: 250,000" },
  { id: "LAB-5002", patient: "James Wilson", mrn: "MRN-10043", test: "Lipid Panel", category: "Biochemistry", doctor: "Dr. Robert Chen", date: "13 Jul 2026", status: "Processing", result: "", notes: "" },
  { id: "LAB-5003", patient: "Sophia Martinez", mrn: "MRN-10044", test: "Liver Function Test (LFT)", category: "Biochemistry", doctor: "Dr. Emily Watts", date: "13 Jul 2026", status: "Completed", result: "Abnormal", notes: "ALT elevated at 78 U/L (normal: 7-56). AST: 42 U/L. Bilirubin: 1.8 mg/dL. Recommend follow-up hepatology consult." },
  { id: "LAB-5004", patient: "William Taylor", mrn: "MRN-10045", test: "Urinalysis", category: "Clinical Pathology", doctor: "Dr. Sarah Jenkins", date: "13 Jul 2026", status: "Pending", result: "", notes: "" },
  { id: "LAB-5005", patient: "Maria Garcia", mrn: "MRN-10046", test: "Thyroid Panel (TSH, T3, T4)", category: "Endocrinology", doctor: "Dr. Robert Chen", date: "11 Jul 2026", status: "Completed", result: "Normal", notes: "TSH: 2.5 mIU/L, Free T4: 1.2 ng/dL, Free T3: 3.1 pg/mL. All within normal limits." },
  { id: "LAB-5006", patient: "David Kim", mrn: "MRN-10047", test: "Blood Glucose (Fasting)", category: "Biochemistry", doctor: "Dr. Emily Watts", date: "12 Jul 2026", status: "Completed", result: "Abnormal", notes: "Fasting glucose: 142 mg/dL (normal: 70-100). HbA1c: 7.1%. Indicates poorly controlled diabetes. Adjust medication." }
];

export default function LaboratoryModule() {
  const [activeView, setActiveView] = useState("list");
  const [selectedTest, setSelectedTest] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const showToast = (type, message) => { setToast({ show: true, type, message }); setTimeout(() => setToast({ show: false, type: "success", message: "" }), 4000); };
  const handleView = (t) => { setSelectedTest(t); setActiveView("view"); };
  const handleBack = () => { setSelectedTest(null); setActiveView("list"); };

  const filtered = TESTS.filter(t => {
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    const matchSearch = !searchTerm || t.patient.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.test.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  useEffect(() => {
    if (activeView === "add" && window.$) {
      $("#lab-form").validate({
        rules: { patientName: "required", mrn: "required", testName: "required", category: "required", doctor: "required", priority: "required" },
        messages: { patientName: "Patient name is required", mrn: "MRN is required", testName: "Select a test", category: "Select category", doctor: "Assign a doctor", priority: "Select priority" },
        errorElement: "span", errorClass: "text-error text-xs font-medium mt-1 block",
        highlight: (el) => $(el).addClass("border-error").removeClass("border-outline-variant"),
        unhighlight: (el) => $(el).removeClass("border-error").addClass("border-outline-variant"),
        submitHandler: () => { showToast("success", "Lab test request submitted successfully!"); setTimeout(handleBack, 1500); return false; }
      });
    }
  }, [activeView]);

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
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">
            {activeView === "list" ? "Laboratory Diagnostics" : activeView === "add" ? "New Test Request" : `Test Result: ${selectedTest?.id}`}
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            {activeView === "list" ? "Manage test requests, track samples, and publish results." : activeView === "add" ? "Fill in the test request details below." : `${selectedTest?.test} for ${selectedTest?.patient}`}
          </p>
        </div>
        <div className="flex gap-3">
          {activeView !== "list" ? (
            <button onClick={handleBack} className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors text-sm font-semibold text-on-surface shadow-sm">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>Back to List
            </button>
          ) : (
            <button onClick={() => setActiveView("add")} className="px-4 py-2 bg-primary text-on-primary rounded-lg flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm font-semibold shadow-sm">
              <span className="material-symbols-outlined text-[20px]">add</span>Request Test
            </button>
          )}
        </div>
      </div>

      {/* LIST VIEW */}
      {activeView === "list" && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="Search by ID, patient, or test..." type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", "Pending", "Processing", "Completed"].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${statusFilter === s ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/30 border-b border-outline-variant/30">
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Test ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Test Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Result</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-primary">{t.id}</td>
                    <td className="px-6 py-4"><p className="font-bold text-sm text-on-surface">{t.patient}</p><p className="text-xs text-on-surface-variant">{t.mrn}</p></td>
                    <td className="px-6 py-4 text-sm font-medium text-on-surface">{t.test}</td>
                    <td className="px-6 py-4"><span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">{t.category}</span></td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{t.doctor}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${t.status === 'Completed' ? 'bg-tertiary/10 text-tertiary' : t.status === 'Processing' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{t.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      {t.result ? <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${t.result === 'Normal' ? 'bg-tertiary/10 text-tertiary' : 'bg-error/10 text-error'}`}>{t.result}</span> : <span className="text-xs text-outline">—</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative group/view inline-block">
                        <button onClick={() => handleView(t)} className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-on-surface text-surface text-[11px] font-semibold rounded whitespace-nowrap opacity-0 invisible group-hover/view:opacity-100 group-hover/view:visible transition-all duration-200 pointer-events-none">View Details</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan="8" className="px-6 py-10 text-center text-on-surface-variant text-sm">No tests found matching your criteria.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-outline-variant/30 flex justify-between items-center text-sm text-on-surface-variant"><span>Showing {filtered.length} of {TESTS.length} results</span></div>
        </div>
      )}

      {/* VIEW */}
      {activeView === "view" && selectedTest && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant/30 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined">biotech</span></div>
              <div><h3 className="text-xl font-bold text-on-surface">{selectedTest.test}</h3><p className="text-sm text-on-surface-variant">{selectedTest.id} • {selectedTest.date}</p></div>
              <span className={`ml-auto px-3 py-1 rounded-lg text-xs font-bold ${selectedTest.status === 'Completed' ? 'bg-tertiary/10 text-tertiary' : selectedTest.status === 'Processing' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{selectedTest.status}</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[["Patient", selectedTest.patient], ["MRN", selectedTest.mrn], ["Doctor", selectedTest.doctor], ["Category", selectedTest.category]].map(([l, v]) => (
                  <div key={l} className="bg-surface-container-low rounded-xl p-4"><p className="text-xs text-on-surface-variant font-medium mb-1">{l}</p><p className="text-sm font-bold text-on-surface">{v}</p></div>
                ))}
              </div>
              {selectedTest.result && (
                <div className={`p-5 rounded-xl border ${selectedTest.result === 'Normal' ? 'bg-tertiary/5 border-tertiary/20' : 'bg-error/5 border-error/20'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`material-symbols-outlined ${selectedTest.result === 'Normal' ? 'text-tertiary' : 'text-error'}`}>{selectedTest.result === 'Normal' ? 'check_circle' : 'warning'}</span>
                    <h4 className={`text-lg font-bold ${selectedTest.result === 'Normal' ? 'text-tertiary' : 'text-error'}`}>Result: {selectedTest.result}</h4>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{selectedTest.notes}</p>
                </div>
              )}
              {!selectedTest.result && (
                <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">hourglass_top</span>
                  <p className="text-sm font-bold text-on-surface">Results Pending</p>
                  <p className="text-xs text-on-surface-variant mt-1">This test is currently being processed. Results will appear here once available.</p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm p-6">
              <h4 className="font-bold text-on-surface mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[20px]">timeline</span>Status Timeline</h4>
              <div className="space-y-4">
                {["Requested", "Sample Collected", "Processing", "Completed"].map((step, i) => {
                  const statusMap = { "Pending": 0, "Processing": 2, "Completed": 3 };
                  const current = statusMap[selectedTest.status] ?? 0;
                  const done = i <= current;
                  return (
                    <div key={step} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${done ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-outline'}`}>
                        {done ? <span className="material-symbols-outlined text-[14px]">check</span> : <span className="text-[10px] font-bold">{i + 1}</span>}
                      </div>
                      <div><p className={`text-sm font-semibold ${done ? 'text-on-surface' : 'text-outline'}`}>{step}</p></div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm p-6">
              <h4 className="font-bold text-on-surface mb-4">Quick Actions</h4>
              <div className="space-y-2">
                <button onClick={() => showToast("success", "Report sent to doctor.")} className="w-full py-2.5 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[18px]">send</span>Send to Doctor</button>
                <button onClick={() => showToast("success", "PDF report downloaded.")} className="w-full py-2.5 bg-surface-container text-on-surface text-sm font-bold rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[18px]">download</span>Download PDF</button>
                <button onClick={() => showToast("success", "Report printed.")} className="w-full py-2.5 bg-surface-container text-on-surface text-sm font-bold rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[18px]">print</span>Print Report</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD FORM */}
      {activeView === "add" && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined">add_circle</span></div>
            <div><h3 className="text-lg font-bold text-on-surface">New Laboratory Test Request</h3><p className="text-xs text-on-surface-variant">All fields marked with * are mandatory.</p></div>
          </div>
          <form id="lab-form" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Patient Name *</label>
                <input name="patientName" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Enter patient name" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">MRN *</label>
                <input name="mrn" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="e.g. MRN-10042" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Test Name *</label>
                <select name="testName" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                  <option value="">Select Test</option>
                  <option>Complete Blood Count (CBC)</option>
                  <option>Lipid Panel</option>
                  <option>Liver Function Test (LFT)</option>
                  <option>Kidney Function Test (KFT)</option>
                  <option>Thyroid Panel (TSH, T3, T4)</option>
                  <option>Urinalysis</option>
                  <option>Blood Glucose (Fasting)</option>
                  <option>HbA1c</option>
                  <option>Electrolytes Panel</option>
                  <option>Coagulation Profile</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Category *</label>
                <select name="category" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                  <option value="">Select Category</option>
                  <option>Hematology</option>
                  <option>Biochemistry</option>
                  <option>Clinical Pathology</option>
                  <option>Endocrinology</option>
                  <option>Microbiology</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Requesting Doctor *</label>
                <select name="doctor" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                  <option value="">Select Doctor</option>
                  <option>Dr. Sarah Jenkins</option>
                  <option>Dr. Robert Chen</option>
                  <option>Dr. Emily Watts</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Priority *</label>
                <select name="priority" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                  <option value="">Select Priority</option>
                  <option>Routine</option>
                  <option>Urgent</option>
                  <option>STAT (Emergency)</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Clinical Notes (Optional)</label>
              <textarea name="notes" rows="3" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" placeholder="e.g. Patient presenting with fatigue and jaundice..."></textarea>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-outline-variant/30">
              <button type="button" onClick={handleBack} className="px-6 py-2.5 border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container transition-colors text-sm">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm shadow-sm flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">send</span>Submit Request</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
