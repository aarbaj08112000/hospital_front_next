-- Database Dummy Data Insertion Script
-- Run this after importing hospital.sql
USE `hospital`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. hospital_profile
INSERT INTO `hospital_profile` (`hospital_name`, `registration_number`, `email`, `phone`, `address`, `website`, `added_by`) VALUES
('MediCenter General Hospital', 'REG-MC-1001', 'contact@medicenter.com', '1-800-555-0100', '123 Health Ave, Springfield', 'www.medicenter.com', 1);

-- 2. roles
INSERT INTO `roles` (`role_name`, `description`, `added_by`) VALUES
('Admin', 'System Administrator with full access', 1),
('Doctor', 'Clinical staff with patient diagnostic rights', 1),
('Nurse', 'Clinical staff for patient care and vitals', 1),
('Receptionist', 'Front desk staff for appointments', 1),
('Pharmacist', 'Manages pharmacy inventory and dispenses medicine', 1);

-- 3. departments
INSERT INTO `departments` (`department_name`, `description`, `added_by`) VALUES
('Cardiology', 'Heart and cardiovascular system', 1),
('Pediatrics', 'Children and infant care', 1),
('Neurology', 'Brain and nervous system disorders', 1),
('Orthopedics', 'Bone and joint care', 1),
('Emergency', 'Urgent and critical care', 1);

-- 4. staff
-- Passwords should be hashed, just putting dummy hashes for now
INSERT INTO `staff` (`role_id`, `department_id`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `qualification`, `experience_years`, `added_by`) VALUES
(1, NULL, 'System', 'Admin', 'admin@medicenter.com', '555-0101', 'hash123', 'MBA', 10, 1),
(2, 1, 'Sarah', 'Jenkins', 'sarah.j@medicenter.com', '555-0102', 'hash123', 'MD Cardiology', 12, 1),
(2, 2, 'Emily', 'Watts', 'emily.w@medicenter.com', '555-0103', 'hash123', 'MD Pediatrics', 8, 1),
(3, 1, 'Alice', 'Smith', 'alice.s@medicenter.com', '555-0104', 'hash123', 'BSN', 5, 1),
(4, NULL, 'Tom', 'Davis', 'tom.d@medicenter.com', '555-0105', 'hash123', 'BA', 3, 1);

-- 5. patients
INSERT INTO `patients` (`mrn`, `first_name`, `last_name`, `dob`, `gender`, `blood_group`, `phone`, `email`, `address`, `added_by`) VALUES
('MRN-10042', 'Eleanor', 'Richards', '1960-05-15', 'Female', 'O+', '555-123-4567', 'eleanor.r@example.com', '12 Pine Street', 4),
('MRN-10043', 'James', 'Wilson', '1992-08-22', 'Male', 'A-', '555-987-6543', 'jwilson@example.com', '45 Oak Avenue', 4),
('MRN-10044', 'Sophia', 'Martinez', '1996-02-10', 'Female', 'B+', '555-456-7890', 'smartinez@example.com', '78 Maple Drive', 4),
('MRN-10045', 'William', 'Taylor', '1979-11-30', 'Male', 'AB+', '555-234-5678', 'wtaylor99@example.com', '90 Cedar Lane', 4),
('MRN-10046', 'Maria', 'Garcia', '1985-04-05', 'Female', 'O-', '555-876-5432', 'maria.g@example.com', '34 Birch Road', 4);

-- 6. wards
INSERT INTO `wards` (`ward_name`, `ward_type`, `capacity`, `department_id`, `added_by`) VALUES
('Ward A - General', 'General', 20, NULL, 1),
('Cardiac ICU', 'ICU', 10, 1, 1),
('Pediatric Ward', 'General', 15, 2, 1),
('Neuro ICU', 'ICU', 8, 3, 1),
('Ortho Rehab', 'General', 12, 4, 1);

-- 7. beds
INSERT INTO `beds` (`ward_id`, `bed_number`, `is_occupied`, `added_by`) VALUES
(1, 'A-01', 0, 1),
(1, 'A-02', 1, 1),
(2, 'CICU-01', 1, 1),
(3, 'PED-01', 0, 1),
(4, 'NICU-01', 0, 1);

-- 8. pharmacy_inventory
INSERT INTO `pharmacy_inventory` (`item_name`, `item_category`, `batch_number`, `expiry_date`, `stock_quantity`, `unit_price`, `added_by`) VALUES
('Paracetamol 500mg', 'Medicine', 'BATCH-101', '2027-12-31', 5000, 0.50, 5),
('Amoxicillin 250mg', 'Medicine', 'BATCH-102', '2026-10-15', 2000, 1.20, 5),
('Surgical Masks', 'Consumable', 'BATCH-103', '2028-01-01', 10000, 0.10, 5),
('Ibuprofen 400mg', 'Medicine', 'BATCH-104', '2027-05-20', 3000, 0.75, 5),
('Sterile Syringes 5ml', 'Consumable', 'BATCH-105', '2029-06-30', 5000, 0.25, 5);

-- 9. laboratory_tests
INSERT INTO `laboratory_tests` (`test_name`, `normal_range`, `unit`, `cost`, `added_by`) VALUES
('Complete Blood Count (CBC)', 'Varies', 'cells/mcL', 50.00, 1),
('Lipid Panel', '< 200', 'mg/dL', 85.00, 1),
('HbA1c', '4.0 - 5.6', '%', 60.00, 1),
('Thyroid Profile (TSH)', '0.4 - 4.0', 'mIU/L', 75.00, 1),
('Liver Function Test (LFT)', 'Varies', 'U/L', 90.00, 1);

-- 10. appointments
INSERT INTO `appointments` (`patient_id`, `doctor_id`, `department_id`, `appointment_date`, `appointment_time`, `appointment_type`, `appointment_status`, `added_by`) VALUES
(1, 2, 1, '2026-07-15', '09:00:00', 'Follow-up', 'Completed', 4),
(2, 2, 5, '2026-07-13', '14:30:00', 'Urgent', 'Completed', 4),
(3, 3, 2, '2026-07-16', '11:15:00', 'Consultation', 'Scheduled', 4),
(4, 2, 1, '2026-07-14', '10:00:00', 'Follow-up', 'Cancelled', 4),
(5, 3, 2, '2026-07-15', '15:45:00', 'Consultation', 'Scheduled', 4);

-- 11. consultations
INSERT INTO `consultations` (`appointment_id`, `patient_id`, `doctor_id`, `consultation_date`, `symptoms`, `diagnosis`, `bp_systolic`, `bp_diastolic`, `added_by`) VALUES
(1, 1, 2, '2026-07-15 09:15:00', 'Mild chest discomfort', 'Stable Angina', 130, 85, 2),
(2, 2, 2, '2026-07-13 14:40:00', 'Severe chest pain', 'Acute Myocardial Infarction', 150, 95, 2),
(3, 3, 3, '2026-07-16 11:20:00', 'Fever, cough', 'Viral Infection', 110, 70, 3),
(4, 4, 2, '2026-07-14 10:10:00', 'Shortness of breath', 'Arrhythmia', 125, 80, 2),
(5, 5, 3, '2026-07-15 15:50:00', 'Fatigue, weight gain', 'Hypothyroidism', 118, 75, 3);

-- 12. prescriptions
INSERT INTO `prescriptions` (`consultation_id`, `patient_id`, `doctor_id`, `prescription_date`, `added_by`) VALUES
(1, 1, 2, '2026-07-15 09:30:00', 2),
(2, 2, 2, '2026-07-13 15:00:00', 2),
(3, 3, 3, '2026-07-16 11:35:00', 3),
(4, 4, 2, '2026-07-14 10:20:00', 2),
(5, 5, 3, '2026-07-15 16:00:00', 3);

-- 13. prescription_items
INSERT INTO `prescription_items` (`prescription_id`, `medicine_name`, `dosage`, `frequency`, `duration_days`, `added_by`) VALUES
(1, 'Aspirin', '75mg', 'Once a day', 30, 2),
(2, 'Atorvastatin', '40mg', 'Once a day at night', 30, 2),
(3, 'Paracetamol', '500mg', 'Twice a day', 5, 3),
(4, 'Metoprolol', '50mg', 'Twice a day', 30, 2),
(5, 'Levothyroxine', '50mcg', 'Once a day morning', 90, 3);

-- 14. lab_orders
INSERT INTO `lab_orders` (`patient_id`, `doctor_id`, `consultation_id`, `order_date`, `order_status`, `added_by`) VALUES
(1, 2, 1, '2026-07-15 09:35:00', 'Completed', 2),
(2, 2, 2, '2026-07-13 15:05:00', 'Completed', 2),
(3, 3, 3, '2026-07-16 11:40:00', 'Pending', 3),
(4, 2, 4, '2026-07-14 10:25:00', 'Completed', 2),
(5, 3, 5, '2026-07-15 16:05:00', 'Pending', 3);

-- 15. lab_results
INSERT INTO `lab_results` (`lab_order_id`, `test_id`, `result_value`, `is_abnormal`, `completed_date`, `added_by`) VALUES
(1, 2, '180 mg/dL', 0, '2026-07-15 14:00:00', 1),
(2, 1, '12.5', 1, '2026-07-13 18:00:00', 1),
(2, 2, '250 mg/dL', 1, '2026-07-13 18:05:00', 1),
(4, 1, '14.0', 0, '2026-07-14 15:00:00', 1),
(4, 5, '45 U/L', 0, '2026-07-14 15:15:00', 1);

-- 16. inpatient_admissions
INSERT INTO `inpatient_admissions` (`patient_id`, `bed_id`, `attending_doctor_id`, `admission_date`, `admission_status`, `added_by`) VALUES
(1, 2, 2, '2026-07-10 08:00:00', 'Discharged', 4),
(2, 3, 2, '2026-07-13 15:30:00', 'Admitted', 4),
(3, 4, 3, '2026-07-12 10:00:00', 'Discharged', 4),
(4, 1, 2, '2026-07-11 09:00:00', 'Admitted', 4),
(5, 5, 3, '2026-07-14 11:00:00', 'Admitted', 4);

-- 17. billing_invoices
INSERT INTO `billing_invoices` (`invoice_number`, `patient_id`, `invoice_date`, `total_amount`, `net_amount`, `payment_status`, `added_by`) VALUES
('INV-10001', 1, '2026-07-15 10:00:00', 150.00, 150.00, 'Paid', 4),
('INV-10002', 2, '2026-07-13 16:00:00', 500.00, 500.00, 'Pending', 4),
('INV-10003', 3, '2026-07-16 12:00:00', 100.00, 100.00, 'Paid', 4),
('INV-10004', 4, '2026-07-14 11:00:00', 250.00, 250.00, 'Pending', 4),
('INV-10005', 5, '2026-07-15 16:30:00', 120.00, 120.00, 'Paid', 4);

-- 18. billing_items
INSERT INTO `billing_items` (`invoice_id`, `item_description`, `quantity`, `unit_price`, `total_price`, `reference_type`, `added_by`) VALUES
(1, 'Cardiology Consultation', 1, 150.00, 150.00, 'Consultation', 4),
(2, 'Emergency Room Charge', 1, 300.00, 300.00, 'Consultation', 4),
(2, 'Lipid Panel Lab Test', 1, 85.00, 85.00, 'Lab', 4),
(2, 'CBC Lab Test', 1, 50.00, 50.00, 'Lab', 4),
(3, 'Pediatrics Consultation', 1, 100.00, 100.00, 'Consultation', 4);

SET FOREIGN_KEY_CHECKS = 1;
