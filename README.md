# Indian Army Civilian Staff Management System

A fully responsive, role-based management system for Indian Army civilian staff. Built with HTML5, CSS3, and Vanilla JavaScript. Uses LocalStorage for data persistence (no backend).

## Features

- **Role-based Dashboards**: Soldier, Lieutenant, Colonel, Accountant, Admin
- **Leave Management**: Hierarchical approval (Soldier → Lieutenant → Colonel)
- **Transfer Management**: Request, approve, and track transfers across battalions
- **Salary Tracking**: Month-wise records with PDF report generation
- **Notifications**: Leave approvals, transfers, salary updates
- **Admin Panel**: User management, block/unblock, reset passwords, system logs
- **RBAC**: Restrict UI and prevent unauthorized URL access

## Project Structure

```
army-civilian-staff-management/
├── index.html              # Landing page
├── login.html              # Login with OTP
├── register.html           # 3-step registration
├── forgot-password.html
├── pages/
│   ├── soldier-dashboard.html
│   ├── lieutenant-dashboard.html
│   ├── colonel-dashboard.html
│   ├── accountant-dashboard.html
│   ├── admin-dashboard.html
│   └── notification-view.html
├── css/
│   └── style.css
├── js/
│   ├── data.js             # LocalStorage layer
│   ├── auth.js             # Authentication & RBAC
│   ├── app.js              # Common dashboard logic
│   ├── modals.js           # Shared modals
│   ├── soldier.js
│   ├── lieutenant.js
│   ├── colonel.js
│   ├── accountant.js
│   └── admin.js
└── assets/
```

## How to Run

1. Open `index.html` in a browser, or use a local server:
   ```bash
   npx serve .
   ```
2. Navigate to the landing page and click Login or Register.

## Default Credentials (Simulation)

| Role      | Service ID | Password | Mobile/Email          |
|-----------|------------|----------|------------------------|
| Admin     | ADM001     | admin123 | 9999999999             |
| Colonel   | COL001     | col123   | 9876543210             |
| Lieutenant| LIE001     | lie123   | 9876543211             |
| Soldier   | SOL001     | sol123   | 9876543212             |
| Accountant| ACC001     | acc123   | 9876543213             |

**OTP for Login:** `123456` (simulated)

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- LocalStorage for data
- jsPDF (CDN) for PDF generation

## Theme

Army green, olive, and beige color scheme with a professional defense-themed design.
