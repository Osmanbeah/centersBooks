# 📚 Educational Centers Books & Activation Codes Management Hub

A specialized, role-based platform designed for managing B2B book & platform activation code distributions to educational centers, tracking field assistant drop-offs, and calculating net owner revenue after deducting center commission cuts.

---

## 🌟 Key Features

### 1. 👑 Admin Financial Command Dashboard (`/admin`)
- **Independent Revenue Streams**: Clear financial separation between **Books** and **Activation Codes**.
- **Real-Time Settlement Ledger**:
  - **Books Net Due**: `Books Handed × (Book Selling Price - Center Commission Cut)`
  - **Codes Net Due**: `Codes Handed × (Code Selling Price - Center Commission Cut)`
  - **Total Owner Profit**: `Books Net Due + Codes Net Due`
  - **Unpaid Balance**: Track outstanding balances per center in real time.
- **Custom Center Pricing & Cuts**: Configure student selling prices and custom commission cuts per educational center.
- **Payment Verification Lightbox**: Inspect uploaded payment screenshots (InstaPay & Vodafone Cash) with zoom, pan, rotate, and one-click verification.
- **CSV Financial Export**: Export full settlement statements with Excel-compatible UTF-8 BOM encoding.

### 2. 🚚 Field Deliveries & Assistant Activity Tracker (`/admin-deliveries`)
- **Full Audit Trail**: See who delivered what, which educational center, handover date, and batch notes.
- **Assistant Performance Breakdown**: Overview of total trips, books handed, and codes handed per assistant.
- **Multi-Filter Toolbar**: Filter by assistant, educational center, item type (Books vs Codes), and live search.

### 3. 👨‍💼 Field Assistant Portal (`/assistant`)
- **Smart Delivery Logging**:
  - Choose delivery type: **Books Only**, **Codes Only**, or **Both (Books & Codes)**.
  - Dynamically displays required quantity input fields.
- **Payment Collection Logging**:
  - Select payment target: **Books Money**, **Codes Money**, or **Split / Both**.
  - Direct photo file upload from mobile camera/gallery or computer (JPG, PNG, WEBP).
- **Strict Privacy Firewall**: Zero financial figures (no prices, commission cuts, or margins) are displayed to assistants.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **Backend / Database**: Supabase PostgreSQL (Schema included in `supabase_schema.sql`)
- **State Management**: React Context API with LocalStorage persistence

---

## 🚀 Getting Started

### 1. Installation
```bash
git clone https://github.com/Osmanbeah/books-and-codes-management.git
cd books-and-codes-management
npm install
```

### 2. Run Locally
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

---

## 🗄️ Database Schema
The database architecture with Row-Level Security (RLS) policies is available in [`supabase_schema.sql`](./supabase_schema.sql).
