"use client";
import { useState, useEffect } from "react";

export default function PatientsModule() {
  const [activeView, setActiveView] = useState("list"); // 'list', 'add', 'edit', 'view'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "success", message: "" }), 4000);
  };

  const handleEdit = (pt) => {
    setSelectedPatient(pt);
    setActiveView("edit");
  };

  const handleView = (pt) => {
    setSelectedPatient(pt);
    setActiveView("view");
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
    setActiveView("list");
  };

  useEffect(() => {
    // Initialize jQuery Validation when in 'add' or 'edit' view
    if ((activeView === "add" || activeView === "edit") && window.$) {
      $("#patient-registration-form").validate({
        rules: {
          firstName: "required",
          lastName: "required",
          dob: "required",
          gender: "required",
          phone: { required: true, minlength: 10, digits: true },
          email: { required: true, email: true },
          address: "required",
          emergencyContact: "required",
          emergencyPhone: { required: true, minlength: 10, digits: true },
          bloodGroup: "required"
        },
        messages: {
          firstName: "Please enter first name",
          lastName: "Please enter last name",
          dob: "Date of birth is required",
          gender: "Please select a gender",
          phone: "Please enter a valid 10-digit phone number",
          email: "Please enter a valid email address",
          address: "Please enter address",
          emergencyContact: "Emergency contact name is required",
          emergencyPhone: "Valid emergency phone is required",
          bloodGroup: "Please select blood group"
        },
        errorElement: "span",
        errorClass: "text-error text-xs font-medium mt-1 block",
        highlight: function (element) {
          $(element).addClass("border-error focus:border-error focus:ring-error").removeClass("border-outline-variant focus:border-primary focus:ring-primary");
        },
        unhighlight: function (element) {
          $(element).removeClass("border-error focus:border-error focus:ring-error").addClass("border-outline-variant focus:border-primary focus:ring-primary");
        },
        submitHandler: function (form) {
          const isEdit = activeView === "edit";
          showToast("success", isEdit ? "Patient record updated successfully!" : "Patient registered successfully! Generating MRN...");
          setTimeout(() => {
            handleBackToList();
          }, 1500);
          return false; // Prevent actual submission
        }
      });
    }
  }, [activeView]);

  return (
    <div className="animate-in fade-in duration-300">

      {/* Toast Notification */}
      <div className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border-l-4 ${toast.type === 'success' ? 'bg-primary-fixed border-primary text-on-surface' : 'bg-error-container border-error text-on-error-container'}`}>
          <span className={`material-symbols-outlined ${toast.type === 'success' ? 'text-primary' : 'text-error'}`}>
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <div>
            <p className="font-bold text-sm leading-tight">{toast.type === 'success' ? 'Success' : 'Error'}</p>
            <p className="text-xs mt-0.5 opacity-90">{toast.message}</p>
          </div>
          <button onClick={() => setToast({...toast, show: false})} className="ml-4 text-outline hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>

      {/* Header section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">
            {activeView === 'list' ? 'Patient Management' : 
             activeView === 'add' ? 'New Patient Registration' :
             activeView === 'edit' ? `Edit Record: ${selectedPatient?.id}` : 
             `Patient Chart: ${selectedPatient?.name}`}
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            {activeView === 'list' ? 'Manage patient records, registrations, and history' : 'Fill in the details below accurately'}
          </p>
        </div>
        <div className="flex gap-3">
          {activeView !== "list" ? (
            <button 
              onClick={handleBackToList}
              className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors text-sm font-semibold text-on-surface shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              Back to Directory
            </button>
          ) : (
            <>
              <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors text-sm font-semibold text-on-surface shadow-sm">
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                Filter
              </button>
              <button 
                onClick={() => { setSelectedPatient(null); setActiveView("add"); }}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm font-semibold shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                New Patient
              </button>
            </>
          )}
        </div>
      </div>

      {activeView === "list" && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input 
                className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" 
                placeholder="Search by MRN, Name, or Phone..." 
                type="text" 
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/30 border-b border-outline-variant/30">
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">MRN (ID)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Demographics</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Last Visit</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {[
                  { id: "MRN-10042", name: "Eleanor Richards", firstName: "Eleanor", lastName: "Richards", age: "64", gender: "Female", bg: "O+", phone: "(555) 123-4567", email: "eleanor.r@example.com", visit: "12 Oct 2023" },
                  { id: "MRN-10043", name: "James Wilson", firstName: "James", lastName: "Wilson", age: "32", gender: "Male", bg: "A-", phone: "(555) 987-6543", email: "jwilson@example.com", visit: "05 Nov 2023" },
                  { id: "MRN-10044", name: "Sophia Martinez", firstName: "Sophia", lastName: "Martinez", age: "28", gender: "Female", bg: "B+", phone: "(555) 456-7890", email: "smartinez@example.com", visit: "Today" },
                  { id: "MRN-10045", name: "William Taylor", firstName: "William", lastName: "Taylor", age: "45", gender: "Male", bg: "AB+", phone: "(555) 234-5678", email: "wtaylor99@example.com", visit: "Yesterday" }
                ].map((pt, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-primary">{pt.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-sm text-on-surface">{pt.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-on-surface-variant font-medium">{pt.age} yrs, {pt.gender.charAt(0)}</span>
                        <span className="px-2 py-0.5 rounded bg-error/10 text-error text-[10px] font-bold">{pt.bg}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{pt.phone}</td>
                    <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{pt.visit}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <div className="relative group/edit">
                        <button onClick={() => handleEdit(pt)} className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-on-surface text-surface text-[11px] font-semibold rounded whitespace-nowrap opacity-0 invisible group-hover/edit:opacity-100 group-hover/edit:visible transition-all duration-200 pointer-events-none">Edit</span>
                      </div>
                      <div className="relative group/view">
                        <button onClick={() => handleView(pt)} className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10">
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-on-surface text-surface text-[11px] font-semibold rounded whitespace-nowrap opacity-0 invisible group-hover/view:opacity-100 group-hover/view:visible transition-all duration-200 pointer-events-none">View Profile</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest text-sm text-on-surface-variant">
            <span>Showing 1 to 4 of 420 entries</span>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-low disabled:opacity-50" disabled>Prev</button>
              <button className="px-3 py-1 border border-primary bg-primary text-on-primary rounded">1</button>
              <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-low">2</button>
              <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-low">3</button>
              <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-low">Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Shared form for Add and Edit */}
      {(activeView === "add" || activeView === "edit") && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden mb-8 p-6">
          <h3 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">
            {activeView === "edit" ? "Update Patient Details" : "Enter Patient Details"}
          </h3>
          
          <form id="patient-registration-form" className="space-y-6">
            {/* Personal Details */}
            <div>
              <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">person</span>
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">First Name *</label>
                  <input type="text" name="firstName" defaultValue={selectedPatient?.firstName || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Enter first name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Last Name *</label>
                  <input type="text" name="lastName" defaultValue={selectedPatient?.lastName || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Enter last name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Date of Birth *</label>
                  <input type="date" name="dob" defaultValue={activeView === "edit" ? "1980-05-15" : ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Gender *</label>
                  <select name="gender" defaultValue={selectedPatient?.gender?.toLowerCase() || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Blood Group *</label>
                  <select name="bloodGroup" defaultValue={selectedPatient?.bg || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-outline-variant/30" />

            {/* Contact Details */}
            <div>
              <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">contact_phone</span>
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Phone Number *</label>
                  <input type="text" name="phone" defaultValue={selectedPatient?.phone?.replace(/\D/g, "") || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="10-digit mobile number" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Email Address *</label>
                  <input type="email" name="email" defaultValue={selectedPatient?.email || ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="patient@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Residential Address *</label>
                  <textarea name="address" defaultValue={activeView === "edit" ? "123 Main St, Springfield" : ""} rows="3" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" placeholder="Enter full address"></textarea>
                </div>
              </div>
            </div>

            <hr className="border-outline-variant/30" />

            {/* Emergency Contact */}
            <div>
              <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">emergency</span>
                Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Contact Name *</label>
                  <input type="text" name="emergencyContact" defaultValue={activeView === "edit" ? "John Doe" : ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Relative/Friend name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Relationship</label>
                  <input type="text" name="emergencyRelation" defaultValue={activeView === "edit" ? "Spouse" : ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="e.g. Spouse, Parent" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Emergency Phone *</label>
                  <input type="text" name="emergencyPhone" defaultValue={activeView === "edit" ? "5551239999" : ""} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="10-digit mobile number" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
              <button 
                type="button" 
                onClick={handleBackToList}
                className="px-6 py-2.5 border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm shadow-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">{activeView === "edit" ? "update" : "save"}</span>
                {activeView === "edit" ? "Update Details" : "Register Patient"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Detail Profile Section */}
      {activeView === "view" && selectedPatient && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Sidebar */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm p-6 flex flex-col items-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-bold mb-4">
              {selectedPatient.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-on-surface text-center">{selectedPatient.name}</h3>
            <p className="text-sm font-medium text-primary mt-1">{selectedPatient.id}</p>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-semibold">{selectedPatient.age} yrs</span>
              <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-semibold">{selectedPatient.gender}</span>
              <span className="px-3 py-1 bg-error/10 text-error rounded-full text-xs font-bold">{selectedPatient.bg}</span>
            </div>
            
            <div className="w-full mt-6 space-y-4 pt-6 border-t border-outline-variant/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">phone</span>
                <div>
                  <p className="text-xs text-on-surface-variant">Phone Number</p>
                  <p className="text-sm font-semibold">{selectedPatient.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">email</span>
                <div>
                  <p className="text-xs text-on-surface-variant">Email</p>
                  <p className="text-sm font-semibold">{selectedPatient.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">home</span>
                <div>
                  <p className="text-xs text-on-surface-variant">Address</p>
                  <p className="text-sm font-semibold">123 Main St, Springfield</p>
                </div>
              </div>
            </div>

            <button onClick={() => setActiveView("edit")} className="w-full mt-6 py-2.5 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors text-sm flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit Profile
            </button>
          </div>

          {/* Clinical Info & History */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Vitals & Status */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 shadow-sm">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Blood Pressure</p>
                <p className="text-2xl font-bold text-on-surface">120/80 <span className="text-sm text-on-surface-variant font-medium">mmHg</span></p>
                <p className="text-xs text-secondary mt-1 font-semibold">Normal</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 shadow-sm">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Heart Rate</p>
                <p className="text-2xl font-bold text-on-surface">72 <span className="text-sm text-on-surface-variant font-medium">bpm</span></p>
                <p className="text-xs text-secondary mt-1 font-semibold">Normal</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 shadow-sm">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Weight</p>
                <p className="text-2xl font-bold text-on-surface">68 <span className="text-sm text-on-surface-variant font-medium">kg</span></p>
                <p className="text-xs text-on-surface-variant mt-1">Measured {selectedPatient.visit}</p>
              </div>
            </div>

            {/* Past Visits Table */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden flex-1">
              <div className="p-5 border-b border-outline-variant/30 bg-surface-container-lowest flex justify-between items-center">
                <h4 className="font-bold text-on-surface">Recent Encounters</h4>
                <button className="text-primary text-sm font-semibold hover:underline">View All</button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/30 border-b border-outline-variant/30">
                    <th className="px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase">Date</th>
                    <th className="px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase">Provider</th>
                    <th className="px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase">Reason</th>
                    <th className="px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  <tr className="hover:bg-surface-container-low/50">
                    <td className="px-5 py-3 text-sm font-medium">{selectedPatient.visit}</td>
                    <td className="px-5 py-3 text-sm">Dr. Sarah Jenkins</td>
                    <td className="px-5 py-3 text-sm text-on-surface-variant">General Checkup</td>
                    <td className="px-5 py-3 text-right">
                      <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded">Completed</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50">
                    <td className="px-5 py-3 text-sm font-medium">15 Aug 2023</td>
                    <td className="px-5 py-3 text-sm">Dr. Robert Chen</td>
                    <td className="px-5 py-3 text-sm text-on-surface-variant">Lab Results Review</td>
                    <td className="px-5 py-3 text-right">
                      <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded">Completed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
