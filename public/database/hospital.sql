-- Hospital Management System (HMS) Database Schema
-- Generated based on system modules: Patients, Appointments, Staff, Wards, Billing, Pharmacy, Lab, etc.

CREATE DATABASE IF NOT EXISTS `hospital`;
USE `hospital`;

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 1. roles
-- --------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. departments
-- --------------------------------------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `department_name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. staff
-- --------------------------------------------------------
DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_id` INT NOT NULL,
  `department_id` INT DEFAULT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `qualification` VARCHAR(255),
  `experience_years` INT,
  `address` TEXT,
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. patients
-- --------------------------------------------------------
DROP TABLE IF EXISTS `patients`;
CREATE TABLE `patients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `mrn` VARCHAR(50) UNIQUE NOT NULL COMMENT 'Medical Record Number',
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `dob` DATE NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `blood_group` VARCHAR(5),
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150),
  `address` TEXT NOT NULL,
  `emergency_contact_name` VARCHAR(100),
  `emergency_contact_relation` VARCHAR(50),
  `emergency_contact_phone` VARCHAR(20),
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. appointments
-- --------------------------------------------------------
DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `patient_id` INT NOT NULL,
  `doctor_id` INT NOT NULL,
  `department_id` INT NOT NULL,
  `appointment_date` DATE NOT NULL,
  `appointment_time` TIME NOT NULL,
  `appointment_type` VARCHAR(50) DEFAULT 'Consultation' COMMENT 'Consultation, Follow-up, Urgent',
  `appointment_status` VARCHAR(50) DEFAULT 'Scheduled' COMMENT 'Scheduled, Completed, Cancelled',
  `notes` TEXT,
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`doctor_id`) REFERENCES `staff`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. consultations (Clinical EHR)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `consultations`;
CREATE TABLE `consultations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `appointment_id` INT DEFAULT NULL,
  `patient_id` INT NOT NULL,
  `doctor_id` INT NOT NULL,
  `consultation_date` DATETIME NOT NULL,
  `symptoms` TEXT,
  `diagnosis` TEXT,
  `clinical_notes` TEXT,
  `bp_systolic` INT,
  `bp_diastolic` INT,
  `heart_rate` INT,
  `weight` DECIMAL(5,2),
  `temperature` DECIMAL(4,1),
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`doctor_id`) REFERENCES `staff`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. prescriptions
-- --------------------------------------------------------
DROP TABLE IF EXISTS `prescriptions`;
CREATE TABLE `prescriptions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `consultation_id` INT NOT NULL,
  `patient_id` INT NOT NULL,
  `doctor_id` INT NOT NULL,
  `prescription_date` DATETIME NOT NULL,
  `notes` TEXT,
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  FOREIGN KEY (`consultation_id`) REFERENCES `consultations`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`doctor_id`) REFERENCES `staff`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 8. prescription_items
-- --------------------------------------------------------
DROP TABLE IF EXISTS `prescription_items`;
CREATE TABLE `prescription_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `prescription_id` INT NOT NULL,
  `medicine_name` VARCHAR(255) NOT NULL,
  `dosage` VARCHAR(100) NOT NULL,
  `frequency` VARCHAR(100) NOT NULL,
  `duration_days` INT NOT NULL,
  `instructions` TEXT,
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. laboratory_tests (Master Test List)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `laboratory_tests`;
CREATE TABLE `laboratory_tests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `test_name` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `normal_range` VARCHAR(100),
  `unit` VARCHAR(50),
  `cost` DECIMAL(10,2) NOT NULL,
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 10. lab_orders
-- --------------------------------------------------------
DROP TABLE IF EXISTS `lab_orders`;
CREATE TABLE `lab_orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `patient_id` INT NOT NULL,
  `doctor_id` INT NOT NULL,
  `consultation_id` INT DEFAULT NULL,
  `order_date` DATETIME NOT NULL,
  `order_status` VARCHAR(50) DEFAULT 'Pending' COMMENT 'Pending, Completed, Cancelled',
  `clinical_notes` TEXT,
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`doctor_id`) REFERENCES `staff`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`consultation_id`) REFERENCES `consultations`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 11. lab_results
-- --------------------------------------------------------
DROP TABLE IF EXISTS `lab_results`;
CREATE TABLE `lab_results` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lab_order_id` INT NOT NULL,
  `test_id` INT NOT NULL,
  `result_value` VARCHAR(255),
  `is_abnormal` BOOLEAN DEFAULT FALSE,
  `technician_id` INT DEFAULT NULL,
  `remarks` TEXT,
  `completed_date` DATETIME,
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  FOREIGN KEY (`lab_order_id`) REFERENCES `lab_orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`test_id`) REFERENCES `laboratory_tests`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`technician_id`) REFERENCES `staff`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 12. wards
-- --------------------------------------------------------
DROP TABLE IF EXISTS `wards`;
CREATE TABLE `wards` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ward_name` VARCHAR(100) NOT NULL,
  `ward_type` VARCHAR(50) NOT NULL COMMENT 'General, ICU, Maternity, etc.',
  `capacity` INT NOT NULL,
  `department_id` INT DEFAULT NULL,
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 13. beds
-- --------------------------------------------------------
DROP TABLE IF EXISTS `beds`;
CREATE TABLE `beds` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ward_id` INT NOT NULL,
  `bed_number` VARCHAR(50) NOT NULL,
  `is_occupied` BOOLEAN DEFAULT FALSE,
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  FOREIGN KEY (`ward_id`) REFERENCES `wards`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 14. inpatient_admissions
-- --------------------------------------------------------
DROP TABLE IF EXISTS `inpatient_admissions`;
CREATE TABLE `inpatient_admissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `patient_id` INT NOT NULL,
  `bed_id` INT NOT NULL,
  `attending_doctor_id` INT NOT NULL,
  `admission_date` DATETIME NOT NULL,
  `discharge_date` DATETIME DEFAULT NULL,
  `admission_reason` TEXT,
  `discharge_summary` TEXT,
  `admission_status` VARCHAR(50) DEFAULT 'Admitted' COMMENT 'Admitted, Discharged, Transferred',
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`bed_id`) REFERENCES `beds`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`attending_doctor_id`) REFERENCES `staff`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 15. pharmacy_inventory
-- --------------------------------------------------------
DROP TABLE IF EXISTS `pharmacy_inventory`;
CREATE TABLE `pharmacy_inventory` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `item_name` VARCHAR(255) NOT NULL,
  `item_category` VARCHAR(100) COMMENT 'Medicine, Consumable, Surgical',
  `batch_number` VARCHAR(100),
  `expiry_date` DATE NOT NULL,
  `stock_quantity` INT NOT NULL,
  `unit_price` DECIMAL(10,2) NOT NULL,
  `supplier_name` VARCHAR(255),
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 16. billing_invoices
-- --------------------------------------------------------
DROP TABLE IF EXISTS `billing_invoices`;
CREATE TABLE `billing_invoices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_number` VARCHAR(100) UNIQUE NOT NULL,
  `patient_id` INT NOT NULL,
  `invoice_date` DATETIME NOT NULL,
  `total_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `discount_amount` DECIMAL(12,2) DEFAULT 0.00,
  `net_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `paid_amount` DECIMAL(12,2) DEFAULT 0.00,
  `payment_status` VARCHAR(50) DEFAULT 'Pending' COMMENT 'Pending, Partial, Paid',
  `payment_method` VARCHAR(50) COMMENT 'Cash, Card, Insurance, etc.',
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 17. billing_items
-- --------------------------------------------------------
DROP TABLE IF EXISTS `billing_items`;
CREATE TABLE `billing_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` INT NOT NULL,
  `item_description` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10,2) NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `reference_type` VARCHAR(50) COMMENT 'Consultation, Pharmacy, Lab, Ward',
  `reference_id` INT COMMENT 'ID of the related record',
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  FOREIGN KEY (`invoice_id`) REFERENCES `billing_invoices`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 18. hospital_profile (Settings)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `hospital_profile`;
CREATE TABLE `hospital_profile` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `hospital_name` VARCHAR(255) NOT NULL,
  `registration_number` VARCHAR(100),
  `email` VARCHAR(150),
  `phone` VARCHAR(50),
  `address` TEXT,
  `logo_url` VARCHAR(255),
  `website` VARCHAR(255),
  `added_by` INT DEFAULT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT DEFAULT NULL,
  `updated_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` ENUM('0', '1') DEFAULT '0',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- INDEXES
-- --------------------------------------------------------
CREATE INDEX idx_patients_mrn ON patients(mrn);
CREATE INDEX idx_staff_email ON staff(email);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_invoices_number ON billing_invoices(invoice_number);

SET FOREIGN_KEY_CHECKS = 1;
