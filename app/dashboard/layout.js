"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMastersOpen, setIsMastersOpen] = useState(false);

  useEffect(() => {
    // Auto-close on mobile initially
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!pathname.startsWith('/dashboard/masters')) {
      setIsMastersOpen(false);
    } else {
      setIsMastersOpen(true);
    }
  }, [pathname]);

  const navItems = [
    { name: "Dashboard", icon: "dashboard", href: "/dashboard" },
    { name: "Patient Records", icon: "personal_video", href: "/dashboard/patients" },
    { name: "Appointments", icon: "calendar_today", href: "/dashboard/appointments" },
    { name: "Laboratory", icon: "biotech", href: "/dashboard/laboratory" },
    { name: "Pharmacy", icon: "medical_services", href: "/dashboard/pharmacy" },
    { name: "Wards", icon: "bed", href: "/dashboard/wards" },
    { name: "Billing", icon: "payments", href: "/dashboard/billing" },
    { name: "Staff Directory", icon: "groups", href: "/dashboard/staff" },
    { name: "Role Access", icon: "admin_panel_settings", href: "/dashboard/roles" },
    { name: "Documentation", icon: "menu_book", href: "/dashboard/documentation" },
    { name: "API Documentation", icon: "api", href: "/dashboard/api-documentation" },
  ];

  return (
    <div className="min-h-screen bg-surface-bright flex overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* SideNavBar */}
      <aside className={`bg-surface-container-low dark:bg-surface-container-lowest h-screen w-64 fixed left-0 top-0 border-r border-outline-variant flex flex-col py-6 z-50 transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary truncate">MediCenter</h1>
            <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider">General Hospital</p>
          </div>
        </div>
        
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
            return (
              <Link key={item.name} href={item.href} onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded transition-colors duration-200 ${isActive ? 'text-primary font-bold border-r-4 border-primary bg-secondary-container/30' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="px-3 pt-4 border-t border-outline-variant mt-auto overflow-y-auto max-h-[40vh] custom-scrollbar flex-shrink-0">
          <div className="mb-2">
            <button 
              onClick={() => setIsMastersOpen(!isMastersOpen)} 
              className="w-full flex items-center justify-between px-3 py-3 rounded text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">database</span>
                <span className="text-sm font-semibold">Master Data</span>
              </div>
              <span className={`material-symbols-outlined transition-transform duration-200 ${isMastersOpen ? "rotate-180" : ""}`}>expand_more</span>
            </button>
            {isMastersOpen && (
              <div className="ml-9 mt-1 space-y-1">
                <Link href="/dashboard/masters/departments" className="block py-2 text-xs text-on-surface-variant hover:text-primary transition-colors">Departments</Link>
                <Link href="/dashboard/masters/staff-roles" className="block py-2 text-xs text-on-surface-variant hover:text-primary transition-colors">Staff Roles</Link>
                <Link href="/dashboard/masters/specialties" className="block py-2 text-xs text-on-surface-variant hover:text-primary transition-colors">Specialties</Link>
                <Link href="/dashboard/masters/appointment-types" className="block py-2 text-xs text-on-surface-variant hover:text-primary transition-colors">Appointment Types</Link>
                <Link href="/dashboard/masters/lab-tests" className="block py-2 text-xs text-on-surface-variant hover:text-primary transition-colors">Lab Tests</Link>
                <Link href="/dashboard/masters/test-categories" className="block py-2 text-xs text-on-surface-variant hover:text-primary transition-colors">Test Categories</Link>
                <Link href="/dashboard/masters/pharmacy-categories" className="block py-2 text-xs text-on-surface-variant hover:text-primary transition-colors">Pharmacy Categories</Link>
                <Link href="/dashboard/masters/manufacturers" className="block py-2 text-xs text-on-surface-variant hover:text-primary transition-colors">Manufacturers</Link>
                <Link href="/dashboard/masters/ward-names" className="block py-2 text-xs text-on-surface-variant hover:text-primary transition-colors">Ward Names</Link>
                <Link href="/dashboard/masters/service-rates" className="block py-2 text-xs text-on-surface-variant hover:text-primary transition-colors">Service Rate Card</Link>
              </div>
            )}
          </div>
          
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-3 rounded text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm">Settings</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-3 rounded text-error hover:bg-error/10 transition-colors duration-200 mt-1">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-bold">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className={`flex-1 flex flex-col w-full min-h-screen transition-[margin] duration-300 ease-in-out ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}>
        {/* TopNavBar */}
        <header className="bg-surface-container-lowest text-primary border-b border-outline-variant flex justify-between items-center h-16 px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center flex-1 gap-4">
            <button className="text-on-surface-variant p-2 -ml-2 rounded-lg hover:bg-surface-container transition-colors" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="relative w-full max-w-xl hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="Search patients, doctors, or records..." type="text" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-all hidden sm:flex">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="h-8 w-[1px] bg-outline-variant mx-1 lg:mx-2 hidden sm:block"></div>
            <div className="relative">
              <div 
                className="flex items-center gap-3 pl-1 lg:pl-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold text-on-surface leading-none">Dr. Smith</p>
                  <p className="text-xs font-medium text-on-surface-variant mt-1">Cardiology</p>
                </div>
                <div className="w-9 h-9 rounded-full border border-outline-variant bg-primary-fixed flex items-center justify-center text-primary font-bold overflow-hidden shrink-0 text-sm">
                  DS
                </div>
              </div>
              
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-outline-variant/30 mb-1 lg:hidden">
                    <p className="text-sm font-bold text-on-surface">Dr. Smith</p>
                    <p className="text-xs font-medium text-on-surface-variant">Cardiology</p>
                  </div>
                  <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                    <span className="material-symbols-outlined text-[18px]">person</span> My Profile
                  </Link>
                  <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                    <span className="material-symbols-outlined text-[18px]">settings</span> Settings
                  </Link>
                  <div className="h-[1px] bg-outline-variant/30 my-1"></div>
                  <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-error hover:bg-error/10 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                    <span className="material-symbols-outlined text-[18px]">logout</span> Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
