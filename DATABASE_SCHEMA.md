# Smart Waste Management System - Database Schema

## Overview
Relational database design for the Smart Waste Management System with MySQL.

---

## Table: Users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| first_name | VARCHAR(100) | NOT NULL | User first name |
| last_name | VARCHAR(100) | NOT NULL | User last name |
| email | VARCHAR(150) | UNIQUE, NOT NULL | User email address |
| phone | VARCHAR(20) | NOT NULL | Phone number |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| user_type | ENUM | NOT NULL | 'citizen', 'driver', 'admin' |
| address | TEXT | NULL | User address |
| latitude | DECIMAL(10,8) | NULL | Location latitude |
| longitude | DECIMAL(11,8) | NULL | Location longitude |
| profile_photo | VARCHAR(255) | NULL | Profile image URL |
| is_active | BOOLEAN | DEFAULT: true | Account status |
| created_at | TIMESTAMP | DEFAULT: CURRENT_TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | DEFAULT: CURRENT_TIMESTAMP ON UPDATE | Last update date |

---

## Table: Drivers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| driver_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique driver identifier |
| user_id | INT | FOREIGN KEY (Users.user_id), NOT NULL | Reference to user |
| license_number | VARCHAR(50) | UNIQUE, NOT NULL | Driver license number |
| vehicle_type | VARCHAR(100) | NOT NULL | Type of vehicle (truck, van, etc.) |
| vehicle_plate | VARCHAR(20) | NOT NULL | Vehicle license plate |
| capacity | INT | NOT NULL | Waste capacity in kg/liters |
| current_load | INT | DEFAULT: 0 | Current waste load |
| status | ENUM | DEFAULT: 'available' | 'available', 'on_duty', 'on_break', 'offline' |
| current_latitude | DECIMAL(10,8) | NULL | Current location latitude |
| current_longitude | DECIMAL(11,8) | NULL | Current location longitude |
| total_collections | INT | DEFAULT: 0 | Total collections completed |
| rating | DECIMAL(3,2) | DEFAULT: 5.0 | Driver rating (1-5) |
| is_verified | BOOLEAN | DEFAULT: false | License verification status |
| created_at | TIMESTAMP | DEFAULT: CURRENT_TIMESTAMP | Record creation date |
| updated_at | TIMESTAMP | DEFAULT: CURRENT_TIMESTAMP ON UPDATE | Last update date |

---

## Table: Waste_Categories

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| category_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique category identifier |
| category_name | VARCHAR(100) | NOT NULL | Category name |
| description | TEXT | NULL | Category description |
| icon | VARCHAR(255) | NULL | Icon/image URL |
| color | VARCHAR(7) | NULL | Color code (hex) |
| is_active | BOOLEAN | DEFAULT: true | Category status |
| created_at | TIMESTAMP | DEFAULT: CURRENT_TIMESTAMP | Creation date |

---

## Table: Waste_Reports

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| report_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique report identifier |
| user_id | INT | FOREIGN KEY (Users.user_id), NOT NULL | Reference to citizen |
| category_id | INT | FOREIGN KEY (Waste_Categories.category_id), NOT NULL | Waste category |
| title | VARCHAR(200) | NOT NULL | Report title |
| description | TEXT | NOT NULL | Detailed description |
| latitude | DECIMAL(10,8) | NOT NULL | Waste location latitude |
| longitude | DECIMAL(11,8) | NOT NULL | Waste location longitude |
| address | TEXT | NOT NULL | Waste location address |
| status | ENUM | DEFAULT: 'pending' | 'pending', 'assigned', 'collected', 'cancelled' |
| priority | ENUM | DEFAULT: 'normal' | 'low', 'normal', 'high', 'urgent' |
| image_url | VARCHAR(255) | NULL | Photo of waste |
| quantity | VARCHAR(100) | NULL | Estimated quantity |
| estimated_weight | INT | NULL | Estimated weight in kg |
| created_at | TIMESTAMP | DEFAULT: CURRENT_TIMESTAMP | Report date |
| updated_at | TIMESTAMP | DEFAULT: CURRENT_TIMESTAMP ON UPDATE | Last update |

---

## Table: Collections

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| collection_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique collection identifier |
| report_id | INT | FOREIGN KEY (Waste_Reports.report_id), NOT NULL | Reference to report |
| driver_id | INT | FOREIGN KEY (Drivers.driver_id), NOT NULL | Reference to driver |
| user_id | INT | FOREIGN KEY (Users.user_id), NOT NULL | Reference to citizen |
| assigned_at | TIMESTAMP | DEFAULT: CURRENT_TIMESTAMP | Assignment time |
| pickup_time | DATETIME | NULL | Scheduled pickup time |
| completed_at | DATETIME | NULL | Collection completion time |
| status | ENUM | DEFAULT: 'pending' | 'pending', 'accepted', 'in_progress', 'completed', 'cancelled' |
| actual_weight | INT | NULL | Actual collected weight in kg |
| collection_notes | TEXT | NULL | Additional notes |
| completion_latitude | DECIMAL(10,8) | NULL | Collection location latitude |
| completion_longitude | DECIMAL(11,8) | NULL | Collection location longitude |
| proof_image_url | VARCHAR(255) | NULL | Photo proof of collection |
| created_at | TIMESTAMP | DEFAULT: CURRENT_TIMESTAMP | Record creation |

---

## Table: Payments

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| payment_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique payment identifier |
| user_id | INT | FOREIGN KEY (Users.user_id), NOT NULL | Reference to citizen |
| collection_id | INT | FOREIGN KEY (Collections.collection_id), NULL | Reference to collection |
| amount | DECIMAL(10,2) | NOT NULL | Payment amount |
| currency | VARCHAR(3) | DEFAULT: 'USD' | Currency code |
| payment_method | ENUM | NOT NULL | 'cash', 'credit_card', 'debit_card', 'mobile_money', 'wallet' |
| status | ENUM | DEFAULT: 'pending' | 'pending', 'completed', 'failed', 'refunded' |
| transaction_id | VARCHAR(100) | NULL | Payment gateway transaction ID |
| payment_date | TIMESTAMP | DEFAULT: CURRENT_TIMESTAMP | Payment date |
| reference_number | VARCHAR(50) | UNIQUE | Payment reference |

---

## Table: Notifications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| notification_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique notification ID |
| user_id | INT | FOREIGN KEY (Users.user_id), NOT NULL | Recipient user |
| title | VARCHAR(200) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification message |
| type | ENUM | NOT NULL | 'info', 'warning', 'success', 'error', 'collection_update' |
| related_report_id | INT | FOREIGN KEY (Waste_Reports.report_id), NULL | Related waste report |
| related_collection_id | INT | FOREIGN KEY (Collections.collection_id), NULL | Related collection |
| is_read | BOOLEAN | DEFAULT: false | Read status |
| created_at | TIMESTAMP | DEFAULT: CURRENT_TIMESTAMP | Creation time |
| read_at | TIMESTAMP | NULL | Read time |

---

## Table: Feedback

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| feedback_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique feedback ID |
| user_id | INT | FOREIGN KEY (Users.user_id), NOT NULL | Feedback author |
| collection_id | INT | FOREIGN KEY (Collections.collection_id), NULL | Related collection |
| rating | INT | NOT NULL | Rating (1-5 stars) |
| comment | TEXT | NOT NULL | Feedback comment |
| category | VARCHAR(100) | NULL | Feedback category |
| is_complaint | BOOLEAN | DEFAULT: false | Complaint flag |
| status | ENUM | DEFAULT: 'open' | 'open', 'in_review', 'resolved', 'closed' |
| response | TEXT | NULL | Admin response |
| created_at | TIMESTAMP | DEFAULT: CURRENT_TIMESTAMP | Submission date |
| updated_at | TIMESTAMP | DEFAULT: CURRENT_TIMESTAMP ON UPDATE | Last update |

---

## Table: Analytics

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| analytics_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique analytics ID |
| date | DATE | NOT NULL | Analytics date |
| total_reports | INT | DEFAULT: 0 | Total waste reports |
| reports_collected | INT | DEFAULT: 0 | Reports collected |
| total_weight_collected | INT | DEFAULT: 0 | Total weight in kg |
| active_drivers | INT | DEFAULT: 0 | Active drivers |
| total_users | INT | DEFAULT: 0 | Total registered users |
| payments_processed | INT | DEFAULT: 0 | Payments processed |
| average_response_time | INT | NULL | Average response time (minutes) |
| created_at | TIMESTAMP | DEFAULT: CURRENT_TIMESTAMP | Record date |

---

## Indexes

```sql
CREATE INDEX idx_user_type ON Users(user_type);
CREATE INDEX idx_waste_status ON Waste_Reports(status);
CREATE INDEX idx_waste_category ON Waste_Reports(category_id);
CREATE INDEX idx_collection_driver ON Collections(driver_id);
CREATE INDEX idx_collection_status ON Collections(status);
CREATE INDEX idx_driver_status ON Drivers(status);
CREATE INDEX idx_payment_status ON Payments(status);
CREATE INDEX idx_notification_user ON Notifications(user_id);
CREATE INDEX idx_notification_read ON Notifications(is_read);
CREATE INDEX idx_feedback_status ON Feedback(status);
CREATE INDEX idx_analytics_date ON Analytics(date);
```

---

## Entity Relationships

```
Users (1) ------ (many) Waste_Reports
Users (1) ------ (many) Collections
Users (1) ------ (many) Payments
Users (1) ------ (many) Notifications
Users (1) ------ (many) Feedback
Users (1) ------ (many) Drivers

Drivers (1) ------ (many) Collections
Waste_Categories (1) ------ (many) Waste_Reports
Waste_Reports (1) ------ (many) Collections
Collections (1) ------ (many) Payments
Collections (1) ------ (many) Feedback
```

---

## Key Features

1. **User Management**: Supports three user types (citizen, driver, admin)
2. **Location Tracking**: GPS coordinates for waste locations and driver positions
3. **Status Tracking**: Real-time status updates for waste reports and collections
4. **Payment Processing**: Multiple payment methods and status tracking
5. **Notifications**: Push notifications for various events
6. **Feedback System**: Ratings and complaints management
7. **Analytics**: Daily statistics for monitoring system performance
8. **Audit Trail**: Timestamps for all records for accountability

---

## SQL Creation Scripts

```sql
-- Create all tables with proper relationships and constraints
-- See implementation files for complete SQL statements
```
