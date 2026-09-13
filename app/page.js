"use client";
import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("doctor");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });
  const formRef = useRef(null);
  const forgotPasswordRef = useRef(null);
  const router = useRouter();

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 4000);
  };

  useEffect(() => {
    // We need to wait for jQuery and jQuery Validation to load
    const initValidation = () => {
      if (window.$ && window.$.validator && formRef.current) {
        $(formRef.current).validate({
          errorClass: "text-error text-xs mt-1 block font-medium",
          validClass: "border-primary",
          errorElement: "span",
          highlight: function (element, errorClass, validClass) {
            $(element).addClass("border-error focus:ring-error focus:border-error").removeClass("border-outline-variant focus:ring-primary focus:border-primary");
          },
          unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass("border-error focus:ring-error focus:border-error").addClass("border-outline-variant focus:ring-primary focus:border-primary");
          },
          errorPlacement: function (error, element) {
            if (element.parent('.relative').length) {
              error.insertAfter(element.parent('.relative'));
            } else {
              error.insertAfter(element);
            }
          },
          rules: {
            email: {
              required: true,
              minlength: 3
            },
            password: {
              required: true,
              minlength: 6
            }
          },
          messages: {
            email: {
              required: "Please enter your Email or Staff ID",
              minlength: "ID must consist of at least 3 characters"
            },
            password: {
              required: "Please provide a password",
              minlength: "Your password must be at least 6 characters long"
            }
          },
          submitHandler: function (form) {
            setLoading(true);
            const emailValue = form.email.value;
            
            // Simulate network request
            setTimeout(() => {
              setLoading(false);
              // Simulated success/error logic based on email for demonstration
              if (emailValue.includes("error")) {
                showToast("error", "Invalid credentials. Please try again.");
              } else {
                showToast("success", `Successfully logged in as ${role.charAt(0).toUpperCase() + role.slice(1)}! Routing to dashboard...`);
                // Add a slight delay so the user sees the toast before navigating
                setTimeout(() => {
                  router.push("/dashboard");
                }, 1000);
              }
            }, 1500);
            
            return false; // Prevent default form submission
          }
        });
      }
    };

    // Attempt initialization (in case scripts load fast or are already cached)
    const checkJquery = setInterval(() => {
      if (window.$ && window.$.validator) {
        initValidation();
        clearInterval(checkJquery);
      }
    }, 100);

    return () => clearInterval(checkJquery);
  }, [role]);

  // Standard React onSubmit as fallback if jQuery isn't loaded
  const handleReactSubmit = (e) => {
    e.preventDefault();
    if (window.$ && window.$.validator && $(formRef.current).valid()) {
      // Handled by submitHandler
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowForgotPassword(false);
      showToast("success", "Password reset link sent to your email!");
    }, 1500);
  };

  return (
    <>
      
      {/* Toast Notification */}
      <div className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border-l-4 ${toast.type === 'success' ? 'bg-primary-fixed border-primary text-on-surface' : 'bg-error-container border-error text-on-error-container'}`}>
          <span className={`material-symbols-outlined ${toast.type === 'success' ? 'text-primary' : 'text-error'}`}>
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <div>
            <p className="font-bold text-sm leading-tight">{toast.type === 'success' ? 'Success' : 'Authentication Failed'}</p>
            <p className="text-xs mt-0.5 opacity-90">{toast.message}</p>
          </div>
          <button onClick={() => setToast({...toast, show: false})} className="ml-4 text-outline hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 min-h-screen">
        <div className="glass-card rounded-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden shadow-2xl">
          {/* Left Branding Panel */}
          <div className="md:w-5/12 bg-primary text-on-primary p-8 md:p-12 flex flex-col justify-between relative overflow-hidden hidden md:flex">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-tertiary/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

            <div className="relative z-10 flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <span className="material-symbols-outlined text-3xl">medical_services</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">MediCenter</h1>
                <p className="text-[10px] font-medium uppercase tracking-widest text-primary-fixed">General Hospital</p>
              </div>
            </div>

            <div className="relative z-10 mb-8">
              <h2 className="text-3xl font-bold leading-tight mb-4">Empowering <br />Healthcare Teams.</h2>
              <p className="text-primary-fixed text-sm leading-relaxed">
                Access patient records, manage appointments, and collaborate seamlessly to provide the highest standard of care.
              </p>
            </div>

            <div className="relative z-10 text-xs text-primary-fixed/80">
              &copy; 2026 MediCenter Systems.<br />All rights reserved.
            </div>
          </div>

          {/* Right Login Panel */}
          <div className="md:w-7/12 p-8 md:p-12 bg-surface-container-lowest flex flex-col justify-center text-on-surface">
            
            <div className="flex items-center gap-3 mb-8 md:hidden">
              <div className="w-10 h-10 bg-primary text-on-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined">medical_services</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary tracking-tight">MediCenter</h1>
              </div>
            </div>

            {!showForgotPassword ? (
              <>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">Welcome Back</h3>
                  <p className="text-on-surface-variant text-sm">Please sign in to access your dashboard.</p>
                </div>

                <form ref={formRef} onSubmit={handleReactSubmit} className="space-y-5" noValidate>
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">Login As</label>
                    <div className="grid grid-cols-3 gap-3">
                      <label 
                        className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-colors ${role === 'doctor' ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant bg-surface hover:bg-surface-container'}`}
                      >
                        <input type="radio" name="role" value="doctor" className="sr-only" checked={role === 'doctor'} onChange={() => setRole('doctor')} />
                        <span className={`material-symbols-outlined ${role === 'doctor' ? 'text-primary' : 'text-on-surface-variant'}`}>stethoscope</span>
                        <span className={`text-xs font-semibold ${role === 'doctor' ? 'text-primary' : 'text-on-surface-variant'}`}>Doctor</span>
                      </label>
                      <label 
                        className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-colors ${role === 'nurse' ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant bg-surface hover:bg-surface-container'}`}
                      >
                        <input type="radio" name="role" value="nurse" className="sr-only" checked={role === 'nurse'} onChange={() => setRole('nurse')} />
                        <span className={`material-symbols-outlined ${role === 'nurse' ? 'text-primary' : 'text-on-surface-variant'}`}>monitor_heart</span>
                        <span className={`text-xs font-semibold ${role === 'nurse' ? 'text-primary' : 'text-on-surface-variant'}`}>Nurse/Staff</span>
                      </label>
                      <label 
                        className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-colors ${role === 'admin' ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant bg-surface hover:bg-surface-container'}`}
                      >
                        <input type="radio" name="role" value="admin" className="sr-only" checked={role === 'admin'} onChange={() => setRole('admin')} />
                        <span className={`material-symbols-outlined ${role === 'admin' ? 'text-primary' : 'text-on-surface-variant'}`}>admin_panel_settings</span>
                        <span className={`text-xs font-semibold ${role === 'admin' ? 'text-primary' : 'text-on-surface-variant'}`}>Admin</span>
                      </label>
                    </div>
                  </div>

                  {/* Username/Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email or Staff ID</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
                      </div>
                      <input type="text" id="email" name="email" required
                        className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg text-sm bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" 
                        placeholder="Enter your email or ID" />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">lock</span>
                      </div>
                      <input type={showPassword ? "text" : "password"} id="password" name="password" required
                        className="block w-full pl-10 pr-10 py-2.5 border border-outline-variant rounded-lg text-sm bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" 
                        placeholder="••••••••" />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px] hover:text-primary transition-colors">
                          {showPassword ? 'visibility' : 'visibility_off'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input id="remember-me" name="remember-me" type="checkbox" 
                        className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded cursor-pointer" />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-on-surface-variant cursor-pointer">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <button type="button" onClick={() => setShowForgotPassword(true)} className="font-medium text-primary hover:text-primary-container hover:underline transition-colors">
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button type="submit" disabled={loading}
                      className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                      {loading ? (
                        <><span className="material-symbols-outlined animate-spin text-sm mr-2">progress_activity</span> Signing in...</>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 text-center text-sm text-on-surface-variant">
                  <p>Having trouble signing in? <a href="#" className="text-primary hover:underline font-medium">Contact IT Support</a></p>
                </div>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <button onClick={() => setShowForgotPassword(false)} className="flex items-center text-sm text-on-surface-variant hover:text-primary transition-colors mb-6 group">
                    <span className="material-symbols-outlined text-lg mr-1 transform group-hover:-translate-x-1 transition-transform">arrow_back</span> Back to login
                  </button>
                  <h3 className="text-2xl font-bold mb-2">Reset Password</h3>
                  <p className="text-on-surface-variant text-sm">Enter your email address and we'll send you a link to reset your password.</p>
                </div>

                <form ref={forgotPasswordRef} onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">mail</span>
                      </div>
                      <input type="email" id="reset-email" name="resetEmail" required
                        className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg text-sm bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" 
                        placeholder="name@medicenter.com" />
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                    {loading ? (
                      <><span className="material-symbols-outlined animate-spin text-sm mr-2">progress_activity</span> Sending link...</>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>
                
                <div className="mt-8 text-center text-sm text-on-surface-variant">
                  <p>Need further assistance? <a href="#" className="text-primary hover:underline font-medium">Contact IT Support</a></p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
