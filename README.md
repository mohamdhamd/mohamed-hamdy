# 🌙 Mohamed Hamdy — Celestial Engineering Portfolio & Workstation

> **Accounting Graduate (86%) · Financial Analyst & CMA Modeling · Data Analyst & BI · Full-Stack Developer**

---

## 🌟 Overview | نظرة عامة
A high-performance, celestial-themed personal portfolio and engineering workstation designed with a bespoke midnight astronomical aesthetic. Built for **Mohamed Hamdy** showcasing expertise spanning **Financial Accounting & CMA Management**, **Power BI & Data Analysis**, and **Full-Stack MERN Architecture**.

---

## 🚀 Key Features | أبرز المميزات

- **🌙 Real-Time Celestial Moon & Hijri Engine:**
  - Real mathematical astronomical moon phase calculations with live illumination percentage.
  - Interactive lunar cycle scrubber allowing users to travel through the month.
  - Cairo real-time synchronization with availability badge.
  
- **📊 Domain-Specific Project Studios:**
  - **Full-Stack Studio:** Desktop & iPhone mobile viewport frame toggle, tech stack inspectors, and live project portals.
  - **Data Analysis & BI Studio:** Dynamic SVG growth visualizer with bar/line toggle, live KPI telemetry, and analytical insights.
  - **CMA Financial Workstation:** Interactive Cost-Volume-Profit (CVP) sensitivity calculator with dynamic sliders, break-even unit/revenue calculations, and margin of safety meters.

- **📄 Dynamic Multi-Track CV Engine:**
  - Selectable CV versions customized by specialization (Financial Accounting / Odoo ERP, Data Analysis / Power BI, Full-Stack Web Development, Comprehensive CMA).
  - Clean PDF/Print export and dynamic backend management.

- **🌐 Complete Bilingual Support (Arabic / English):**
  - Fully localized RTL and LTR typography with Cairo and Space Grotesk fonts.
  
- **🎵 Atmospheric Web Audio:**
  - Synthesized subtle sound effects for clicks, sliders, and modal transitions using Web Audio API.

- **🛡️ Secure Admin Control Panel:**
  - Full CRUD operations for projects, certificates, messages, site settings, and CV tracks backed by MongoDB Atlas and JWT authentication.

---

## 🛠️ Tech Stack | التقنيات المستخدمة

- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite, Lucide Icons
- **Backend:** Node.js, Express REST API, Mongoose ORM, JWT, Bcrypt
- **Database:** MongoDB Atlas (Cloud)
- **Deployment:** Vercel (Frontend & Serverless), Render / Railway (Backend Service)

---

## ⚡ Quick Start | التشغيل المحلي

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/mohamdhamd/mohamed-hamdy.git
cd mohamed-hamdy

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment Variables
Create `.env` inside `server/` with:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Run Locally
```bash
# Start frontend dev server
npm run dev

# In a separate terminal, start backend server
npm run server
```

---

## ☁️ Deployment on Vercel | خطوات الرفع على Vercel

1. Push this repository to GitHub:
   ```bash
   git remote add origin https://github.com/mohamdhamd/mohamed-hamdy.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import the repository `mohamdhamd/mohamed-hamdy`.
4. Vercel automatically detects **Vite** and uses:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. (Optional) If hosting the backend on Render/Railway, add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-api.onrender.com`
6. Click **Deploy**! 🚀

