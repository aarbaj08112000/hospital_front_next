"use client";
import { useState } from "react";

const DOCS_DATA = {
  overview: {
    title: "Project Overview", icon: "home",
    content: "The MediCenter Hospital Management System is an enterprise-grade web application designed to streamline hospital operations. Built with Next.js 14 and Tailwind CSS v4, it provides a unified interface for staff to manage everything from patient records and appointments to pharmacy inventory and billing."
  },
  dashboard: {
    title: "Dashboard", icon: "dashboard",
    content: "The Dashboard serves as the central hub, providing a high-level overview of hospital operations. It features real-time metrics including total patients, available beds, today's appointments, and revenue. Interactive charts visualize patient trends, while an alerts panel surfaces critical notifications."
  },
  patients: {
    title: "Patient Records", icon: "personal_video",
    content: "A comprehensive Electronic Health Record (EHR) system. Allows staff to register new patients, generate unique MRNs (Medical Record Numbers), and view detailed profiles including demographics, medical history, active prescriptions, and past visits."
  },
  appointments: {
    title: "Appointments", icon: "calendar_today",
    content: "Manage outpatient consultations with ease. Features include booking new slots, assigning doctors and departments, categorizing visit types (Urgent, Follow-up, Consultation), and tracking status (Scheduled, Completed, Cancelled)."
  },
  laboratory: {
    title: "Laboratory", icon: "biotech",
    content: "Handles diagnostic test requests and results tracking. Staff can order tests (e.g., CBC, Lipid Panel), assign priorities, track sample processing status, and publish results with flagged abnormalities for doctor review."
  },
  pharmacy: {
    title: "Pharmacy", icon: "vaccines",
    content: "Full inventory management for hospital medicines. Tracks stock levels, unit prices, batch numbers, and expiry dates. Automated badges flag Low Stock or Out of Stock items to ensure timely procurement."
  },
  wards: {
    title: "Wards & Beds", icon: "bed",
    content: "Visualizes inpatient occupancy. Provides a grid view of all beds across different wards (ICU, Maternity, General). Staff can allocate beds to patients, initiate discharges, and flag beds for cleaning or maintenance."
  },
  billing: {
    title: "Billing & Payments", icon: "payments",
    content: "Financial module for generating and managing patient invoices. Supports itemized billing for consultations, ward stays, and pharmacy packages. Tracks revenue and categorizes invoices as Paid, Pending, Overdue, or Draft."
  },
  staff: {
    title: "Staff Directory", icon: "badge",
    content: "Human resources module managing hospital personnel. Displays profiles for Doctors, Nurses, Admins, and Technicians. Tracks contact info, department assignments, shift timings, leave balances, and active/inactive status."
  },
  settings: {
    title: "Settings", icon: "settings",
    content: "System configuration center. Users can update their personal profiles, administrators can modify core hospital details (address, emergency lines), manage notification preferences, and enforce security protocols like 2FA."
  },
  roles: {
    title: "Role Access", icon: "shield",
    content: "Security module governing System Access Control (RBAC). Administrators can define roles and use a granular permission matrix to toggle Read, Write, and Delete access for every single module in the application."
  },
  masters: {
    title: "Master Data", icon: "database",
    content: "Centralized management of reusable predefined lists used across the hospital system. Administrators can configure dropdown options dynamically, such as Departments, Lab Tests, Pharmacy Categories, and Staff Roles, without needing code changes. Includes a unified off-canvas drawer UI for Add/Edit operations."
  }
};

export default function DocumentationModule() {
  const [activeSection, setActiveSection] = useState("overview");

  const currentDoc = DOCS_DATA[activeSection];

  return (
    <div className="animate-in fade-in duration-300 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-on-surface">System Documentation</h2>
        <p className="text-sm text-on-surface-variant mt-1">Complete user manual and module-wise architectural descriptions.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24">
          <nav className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-2 shadow-sm flex flex-col gap-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {Object.entries(DOCS_DATA).map(([id, data]) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-semibold text-left ${activeSection === id ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
              >
                <span className="material-symbols-outlined text-[20px]">{data.icon}</span>
                {data.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm p-8 md:p-12 min-h-[60vh] w-full">
          <div className="flex items-center gap-4 mb-6 border-b border-outline-variant/30 pb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-4xl">{currentDoc.icon}</span>
            </div>
            <h3 className="text-3xl font-bold text-on-surface">{currentDoc.title}</h3>
          </div>
          
          <div className="prose prose-sm md:prose-base max-w-none prose-headings:text-on-surface prose-p:text-on-surface-variant prose-strong:text-on-surface prose-ul:text-on-surface-variant">
            <p className="text-lg leading-relaxed">{currentDoc.content}</p>
            
            {activeSection !== "overview" && (
              <div className="mt-8 p-6 bg-surface-container rounded-xl border border-outline-variant/30">
                <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">verified</span>Key Capabilities</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[16px] text-tertiary mt-0.5">check_circle</span> Create, Read, Update, and Delete operations standard across all grids.</li>
                  <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[16px] text-tertiary mt-0.5">check_circle</span> Real-time form validation via jQuery Validation plugin.</li>
                  <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[16px] text-tertiary mt-0.5">check_circle</span> Interactive toast notifications for user feedback.</li>
                  <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[16px] text-tertiary mt-0.5">check_circle</span> Fully responsive layouts adapting to mobile and desktop viewports.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
