# 📊 KASIR PINTAR - SMART BEVERAGE POINT OF SALE (POS) SYSTEM

Kasir Pintar is a high-performance, responsive, and full-stack Point of Sale (POS) application meticulously designed for beverage shops, small cafes, and retail micro-businesses. Built with modern architectural standards, this system provides seamless real-time monitoring, state-of-the-art security mechanisms, and a flawless user experience across both desktop and mobile layouts.

---
## 🚀 KEY FEATURES

### 1. 📈 INTERACTIVE BUSINESS DASHBOARD
   * Dynamic Analytics: Built with native CSS and Tailwind SVG vector components to map daily business performance and transaction curves seamlessly without heavy external charting libraries.
   * Instant Financial KPIs: Quick-glance indicators tracking Total Revenue, Invoice Counts, and Average Basket Value per Customer calculated dynamically.
   * Recent Activity Feed: Displays the last 5 transactions in real-time, detailing localized timestamp entries and identified serving personnel logs.

### 2. 🛒 ADVANCED POS CASHIER TERMINAL
   * Flexible Split-Pane UX: Features a draggable responsive split layout on desktop displays, allowing cashiers to expand or shrink the shopping cart interface on the fly.
   * Mobile Floating Cart: Optimized handheld view providing an immersive micro-cart floating panel complete with animated item count badges.
   * Intelligent Stock Safeguards: Instantaneous checking of stock parameters, rendering unavailable menu slots visually disabled and blocking out dead-stock entries from carts.

### 3. 📦 MENU & PRODUCT MANAGEMENT (CRUD)
   * Complete Product Controls: Seamless item creation, category distribution, pricing structures, and real-time stock toggling interfaces.
   * Robust Media Upload Pipeline: Features a native file stream framework processing menu photography inputs directly into localized directories.
   * Automated Asset Cleanup: Backend hooks dynamically scrub and prune old physical images out of the server storage disk (fs.unlinkSync) whenever a product is updated or deleted.

### 4. 📉 FINANCIAL ACCOUNTING & EXPORT ENGINE
   * Periodic Filtering Suite: Categorize transactions dynamically across predefined financial durations: Today, This Week, This Month, This Year, or All-Time Historical Logs.
   * Client-Side PDF Compiler: Integrated with a client-side execution framework (html2pdf.js) to generate pixel-perfect corporate audit sheets on request.
   * Scoped Printing Overrides: Programmed layout visibility blocks hiding app headers and navigation sidebars cleanly during exports, enforcing dedicated printing layout configurations.

### 5. 🔒 PROFESSIONAL ACCOUNT SECURITY & LIVE ACTION CONTROL
   * Identity Updates: Secure dashboard enabling registered operators to alter names, update handles, and revise system access credentials natively.
   * Bcrypt Password Isolation: Employs industry-standard cryptographic blowfish hashing matrices to securely isolate raw string values inside database storage layers.
   * Tokenized Verification Pipeline: Implements stateless validation gates using JSON Web Tokens (JWT) protecting core route access channels.
   * Auto-Kick Countermeasure: Embedded connection watcher scripts automatically detect if an active account is altered or purged by an admin, executing immediate terminal logout procedures (401 Unauthorized) across unauthorized running sessions.

### 6. ⚡ UNDER-THE-HOOD ENGINEERING HIGHLIGHTS
   * Background Polling Composable (useProdukData): Abstracts fetch tasks into structured lifecycle timers executing background server updates every 5 seconds without blocking UI state loaders.
   * Debounced Search Hook (useSearch): Implements text query delay mechanisms limiting rapid keystroke inputs to run single clean backend operations precisely after typing pauses.

---
## 🛠️ TECHNOLOGY STACK

### Frontend Architecture:
   * Framework: Nuxt 3 (Vue 3 Meta-Framework)
   * State Management: Pinia (Modular Global Store Layer)
   * Styling & UI: Tailwind CSS (Utility-First Matrix)
   * PDF Utility: html2pdf.js & html2canvas

#### Backend Core:
   * Runtime Environment: Node.js
   * Application Framework: Express.js (Strict Model-View-Controller Structure)
   * Database Driver: Mongoose (Object Data Modeling for MongoDB)
   * Authentication: JSON Web Tokens (jsonwebtoken) & bcryptjs

### Database:
   * Engine: MongoDB (Document-Oriented NoSQL Database)

---
## 📋 SYSTEM PREREQUISITES

Ensure you have the following environments operational on your local server machine:
   * Node.js: v18.x or v20.x (LTS recommended)
   * Package Manager: npm (v9.x or later)
   * Database Management: MongoDB Community Server v6.x/v7.x or an active MongoDB Atlas Connection URI Cluster.

---
## ⚙️ INSTALLATION & DEPLOYMENT GUIDE

Follow these precise steps to deploy both core codebases on your local workspace:

### 1. Repository Setup
   Clone the development structure onto your local working path:
   ```bash
   git clone https://github.com/devannoap31/kasir-minuman.git
   ```
   ```bash
   cd kasir-minuman
   ```

### 2. Backend Infrastructure Initialization
   Navigate into the dedicated API service folder, isolate configuration keys, and boot the server:
   
   ```bash
   cd kasir-backend
   ```
   ```bash
   npm install
   ```
   ```
   Configure environment keys (.env file configuration)
   Create a .env file inside the kasir-backend folder and provide the following variables:
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/db_kasir
   JWT_SECRET=RAHASIA_NEGARA
   ```
   
   ```bash
   npm start
   ```
   
   * Your API environment will run live at: http://localhost:5000

### 3. Frontend Interface Setup
   Launch a parallel terminal directory path to activate the presentation layer application:
   
   cd kasir-frontend
   npm install
   npm run dev
   
   * Your point of sale user interface will be served instantly at: http://localhost:3000

------------------------------------------------------------------------
📂 ARCHITECTURE FRAMEWORK BLUEPRINT
------------------------------------------------------------------------

The overall program workspace uses a strict structural distribution ensuring cleaner cross-team readability:

kasir-minuman/
├── kasir-backend/          # Backend Server Core API
│   ├── controllers/        # Control Blocks processing incoming Request matrices (MVC)
│   ├── models/             # Schema definitions specifying strict MongoDB entity rules
│   ├── routes/             # Path Channels parsing targeted operational routes
│   └── server.js           # Main gateway establishing Express initializations
└── kasir-frontend/         # Presentation Layer client interface (Nuxt 3)
    └── app/
        ├── components/     # Reusable UI Atoms (e.g., SearchBar.vue, CardMenu.vue)
        ├── composables/    # Abstracted Logic Hooks (e.g., useProdukData.js, useSearch.js)
        ├── layouts/        # Root viewport wireframes (default.vue)
        ├── pages/          # Routing entry screens (index.vue, transaksi.vue, rekap.vue)
        └── stores/         # Pinia operational state layers (auth.js)

------------------------------------------------------------------------
👤 PROJECT MAINTAINER & CREDITS
------------------------------------------------------------------------

* Lead Software Engineer: Devanno Andhika Putra
* Affiliation: Politeknik Indonusa Surakarta (POLINUS)  
* Academic Program: Software Engineering Technology (Sarjana Terapan Sistem Informasi)

------------------------------------------------------------------------
Developed with passion for clean software design patterns. 💻☕
========================================================================