"use client";
import { useState, useEffect } from "react";

export default function SettingsModule() {
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showToast = (type, message) => { setToast({ show: true, type, message }); setTimeout(() => setToast({ show: false, type: "success", message: "" }), 4000); };

  const tabs = [
    { id: "profile", label: "My Profile", icon: "person" },
    { id: "hospital", label: "Hospital Details", icon: "local_hospital" },
    { id: "notifications", label: "Notifications", icon: "notifications" },
    { id: "security", label: "Security", icon: "lock" },
  ];

  useEffect(() => {
    if (window.$) {
      if (activeTab === "profile") {
        $("#profile-form").validate({
          rules: { displayName: "required", email: { required: true, email: true }, phone: { required: true, minlength: 10 }, specialty: "required" },
          messages: { displayName: "Name is required", email: "Valid email required", phone: "Valid phone required", specialty: "Specialty required" },
          errorElement: "span", errorClass: "text-error text-xs font-medium mt-1 block",
          highlight: (el) => $(el).addClass("border-error").removeClass("border-outline-variant"),
          unhighlight: (el) => $(el).removeClass("border-error").addClass("border-outline-variant"),
          submitHandler: () => { showToast("success", "Profile updated successfully!"); return false; }
        });
      }
      if (activeTab === "hospital") {
        $("#hospital-form").validate({
          rules: { hospitalName: "required", address: "required", adminEmail: { required: true, email: true }, emergencyLine: "required" },
          messages: { hospitalName: "Hospital name required", address: "Address required", adminEmail: "Valid email required", emergencyLine: "Emergency line required" },
          errorElement: "span", errorClass: "text-error text-xs font-medium mt-1 block",
          highlight: (el) => $(el).addClass("border-error").removeClass("border-outline-variant"),
          unhighlight: (el) => $(el).removeClass("border-error").addClass("border-outline-variant"),
          submitHandler: () => { showToast("success", "Hospital details updated!"); return false; }
        });
      }
      if (activeTab === "security") {
        $("#security-form").validate({
          rules: { currentPassword: "required", newPassword: { required: true, minlength: 8 }, confirmPassword: { required: true, equalTo: "[name='newPassword']" } },
          messages: { currentPassword: "Current password required", newPassword: "Minimum 8 characters", confirmPassword: "Passwords must match" },
          errorElement: "span", errorClass: "text-error text-xs font-medium mt-1 block",
          highlight: (el) => $(el).addClass("border-error").removeClass("border-outline-variant"),
          unhighlight: (el) => $(el).removeClass("border-error").addClass("border-outline-variant"),
          errorPlacement: function (error, element) {
            if (element.parent('.relative').length) {
              error.insertAfter(element.parent('.relative'));
            } else {
              error.insertAfter(element);
            }
          },
          submitHandler: () => { showToast("success", "Password changed successfully!"); return false; }
        });
      }
    }
  }, [activeTab]);

  const Toggle = ({ label, desc, defaultOn = false }) => {
    const [on, setOn] = useState(defaultOn);
    return (
      <div className="flex items-center justify-between py-4 border-b border-outline-variant/20 last:border-0">
        <div><p className="text-sm font-semibold text-on-surface">{label}</p><p className="text-xs text-on-surface-variant mt-0.5">{desc}</p></div>
        <button onClick={() => setOn(!on)} className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-surface-container-high'}`}>
          <span className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : ''}`}></span>
        </button>
      </div>
    );
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-on-surface tracking-tight">System Settings</h2>
        <p className="text-sm text-on-surface-variant mt-1">Configure your profile, hospital details, and system preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <aside className="w-full lg:w-56 shrink-0">
          <nav className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-2 shadow-sm flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-semibold whitespace-nowrap ${activeTab === t.id ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                <span className="material-symbols-outlined text-[20px]">{t.icon}</span>{t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm p-6 md:p-8">

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-6 pb-4 border-b border-outline-variant/30 flex items-center gap-2"><span className="material-symbols-outlined text-primary">person</span>Personal Information</h3>
              <form id="profile-form" className="space-y-5">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold border-2 border-primary/20">DS</div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Dr. Smith</p>
                    <p className="text-xs text-on-surface-variant">Cardiology Department</p>
                    <button type="button" className="mt-2 text-xs font-semibold text-primary hover:underline">Change Photo</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Display Name *</label><input name="displayName" defaultValue="Dr. Smith" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                  <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Email *</label><input name="email" type="email" defaultValue="dr.smith@medicenter.com" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                  <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Phone *</label><input name="phone" defaultValue="5551234567" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                  <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Specialty *</label><input name="specialty" defaultValue="Cardiology" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                </div>
                <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Bio</label><textarea rows="3" defaultValue="Senior Cardiologist with 15+ years of clinical experience." className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"></textarea></div>
                <div className="flex justify-end pt-4 border-t border-outline-variant/30">
                  <button type="submit" className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm shadow-sm flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">save</span>Save Changes</button>
                </div>
              </form>
            </div>
          )}

          {/* Hospital Tab */}
          {activeTab === "hospital" && (
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-6 pb-4 border-b border-outline-variant/30 flex items-center gap-2"><span className="material-symbols-outlined text-primary">local_hospital</span>Hospital Information</h3>
              <form id="hospital-form" className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Hospital Name *</label><input name="hospitalName" defaultValue="MediCenter General Hospital" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                  <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Tax / Registration ID</label><input defaultValue="HOSP-REG-2024-001" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                  <div className="md:col-span-2"><label className="block text-xs font-semibold text-on-surface-variant mb-1">Address *</label><input name="address" defaultValue="123 Medical Drive, Health City, HC 45001" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                  <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Admin Email *</label><input name="adminEmail" type="email" defaultValue="admin@medicenter.com" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                  <div><label className="block text-xs font-semibold text-on-surface-variant mb-1">Emergency Hotline *</label><input name="emergencyLine" defaultValue="1800-MED-HELP" className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                </div>
                <div className="flex justify-end pt-4 border-t border-outline-variant/30">
                  <button type="submit" className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm shadow-sm flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">save</span>Update Details</button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-6 pb-4 border-b border-outline-variant/30 flex items-center gap-2"><span className="material-symbols-outlined text-primary">notifications</span>Notification Preferences</h3>
              <div className="space-y-1">
                <Toggle label="Email Notifications" desc="Receive appointment reminders and system alerts via email." defaultOn={true} />
                <Toggle label="SMS Notifications" desc="Get text messages for critical alerts and emergencies." defaultOn={false} />
                <Toggle label="New Patient Alerts" desc="Notify when a new patient is registered in the system." defaultOn={true} />
                <Toggle label="Lab Result Alerts" desc="Notify when lab test results are available." defaultOn={true} />
                <Toggle label="Billing Reminders" desc="Receive reminders for overdue invoices." defaultOn={false} />
                <Toggle label="Staff Schedule Changes" desc="Notify when shift assignments are updated." defaultOn={true} />
              </div>
              <div className="flex justify-end pt-6">
                <button onClick={() => showToast("success", "Notification preferences saved!")} className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm shadow-sm flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">save</span>Save Preferences</button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-6 pb-4 border-b border-outline-variant/30 flex items-center gap-2"><span className="material-symbols-outlined text-primary">lock</span>Account Security</h3>
              <form id="security-form" className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Current Password *</label>
                    <div className="relative">
                      <input name="currentPassword" type={showCurrentPassword ? "text" : "password"} className="w-full px-4 py-2.5 pr-10 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Enter current password" />
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">{showCurrentPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">New Password *</label>
                    <div className="relative">
                      <input name="newPassword" type={showNewPassword ? "text" : "password"} className="w-full px-4 py-2.5 pr-10 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Minimum 8 characters" />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">{showNewPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Confirm Password *</label>
                    <div className="relative">
                      <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} className="w-full px-4 py-2.5 pr-10 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Re-enter new password" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-outline-variant/30">
                  <button type="submit" className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm shadow-sm flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">lock</span>Change Password</button>
                </div>
              </form>
              <div className="mt-8 p-5 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <div><h4 className="text-sm font-bold text-on-surface">Two-Factor Authentication (2FA)</h4><p className="text-xs text-on-surface-variant mt-0.5">Add an extra layer of security to your account.</p></div>
                  <button onClick={() => showToast("success", "2FA setup initiated.")} className="px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg text-sm hover:bg-primary/20 transition-colors">Enable 2FA</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
