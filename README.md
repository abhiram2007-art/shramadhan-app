# AgriWise AI 🌾🤖
> "Every Farmer Deserves the Right Decision, Not Just the Right Price."

**AgriWise AI** is a state-of-the-art, full-stack, production-quality agricultural decision intelligence platform designed for hackathons. By shifting the paradigm from static market price trackers to predictive, context-aware AI decision support, AgriWise AI equips smallholder farmers with actionable guidance on when to sell, whom to sell to, how to share transit logistics, and which government programs to claim.

---

## 🎨 Design Language: "Emerald Harvest"
AgriWise AI implements an exquisite **Emerald Harvest** visual theme, custom-engineered for maximum contrast and eye safety under field conditions:
*   **Aesthetic Frame**: Glassmorphic slate canvases accented with deep organic emerald overlays.
*   **Responsive Precision**: Fluent mobile-first fluid grids, custom animated pickup trace paths, and high-contrast, tactile touch targets (min 44px) for field ease.
*   **Typography Pairings**: Pair "Inter" body text with "Space Grotesk" displays and "JetBrains Mono" status boards.

---

## 🚀 Key Architectural Pillars

### 1. 🧠 AI Decision Suite (Explainable Advisor)
*   **AI Sourcing Decision Engine**: Parses 9 distinct real-time variables (storage capacity, storm risks, transport fees, diesel prices, market queues, and broker reputations) to suggest **HOLD**, **SELL TODAY**, or **NEGOTIATE** strategies.
*   **AI Price Forecasting**: Custom-engineered Recharts timelines displaying APMC commodity trajectories and 7-day projected price slopes.
*   **AI Fair Deal Estimator**: Mediator-side trade tool that evaluates custom contract buy prices against APMC yard baselines, outputting a clear Fairness Score (0-100%) and counter-offers.

### 2. 🚛 Smart Logistics Pooling
*   **Shared Cargo Routing**: Pools nearby harvest yields in the same district, suggesting shared trucks, combined payloads, fuel liters conserved, and net profit improvements.
*   **Live SVG Route Tracer**: Animated, lightweight vector trace path visualizing route dispatches (e.g., *Bapatla ➔ Eluru ➔ Guntur APMC*).

### 3. 📸 Crop Diagnostics & Growth Timeline
*   **Dual Capture Mechanics**: Supports file upload or live camera captures using device `getUserMedia` streams.
*   **Timeline Metrics**: Automatically records, schedules, and displays historical snapshots with diagnostic health scores and checklist directives.

### 4. 🏢 Secure Sourcing Agreements
*   **Licensed Mediators**: Enables verified agents to dispatch custom purchase contracts directly to farmers.
*   **Real-time Acceptance Rails**: Farmers review, accept, or decline mediator-drafted bids on their command center in real-time.

### 5. 🏛️ Adaptive Subsidies & Multi-Language Support
*   **Tailored Schemes**: Recommends AP state and central programs (PM-KISAN, PMFBY, AP Micro-Irrigation) matching the farmer's registered land profile.
*   **Instant Localization**: Toggles the entire application workspace between **English**, **Hindi**, and **Telugu** instantly, persisting preferences to cloud firestores and localStorage.

---

## 🛠️ Stack Configuration

*   **Frontend Client**: React 19 + Tailwind CSS + Framer Motion + Recharts + Lucide Icons.
*   **Backend Server**: Node.js + Express.js + Vite Dev Server middleware.
*   **Durable Cloud Storage**: Google Firebase Auth + Cloud Firestore.
*   **AI Foundation Model**: Google Gemini API via `@google/genai` (Server-side proxy).

---

## ⚡ Quick Start

### 1. Setup Environment
Define your secrets in `.env`:
```env
GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
```

### 2. Local Installation
```bash
# Install core dependencies
npm install

# Launch Full-Stack Hot-Reload Workspace
npm run dev
```
The full-stack application will boot on `http://localhost:3000`.

### 3. Production Compilation & Launch
```bash
# Compile and bundle both the server and static assets
npm run build

# Start the optimized container node server
npm run start
```

---

## 🔒 Firebase Configuration Security
Sourcing transactions, growth logs, and notifications are securely guarded under custom `firestore.rules` conforming to top-tier enterprise standards:
1.  **Strict Profile Owners**: Users can only modify profiles matching their auth UID.
2.  **Trade Integrity**: Transaction write rules ensure mediators cannot modify farmer statuses or unauthorized contract fields.
3.  **Read Transparency**: Prevents unauthorized listing leaks.

---

*Formulated with care to empower Indian farmers.* 🌾
