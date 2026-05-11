# Zafaran — Premium Online Food Ordering

A complete, fully functional prototype for an Online Food Ordering Web Application built with modern web technologies.

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom luxury warm palette)
- **State Management:** Zustand (with localStorage persistence)
- **Internationalization:** next-intl (English & Arabic with RTL/LTR support)
- **Authentication:** NextAuth.js v5 (Credentials + Google OAuth)
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 🚀 Features

1. **Bilingual Support (EN/AR):** Full RTL support with mirrored layouts and dynamic routing (`/en` and `/ar`).
2. **Interactive Menu:** Filterable categories, staggered animations, and quick-view modals.
3. **Smart Cart:** Slide-in drawer with persistent state, real-time total calculations, and delivery fee rules.
4. **Authentication:** Secure credential login with bcrypt hashing and Google OAuth support.
5. **Checkout Flow:** Validated multi-step form supporting both Online Payment and Cash on Delivery.
6. **Live Order Tracking:** Animated 4-stage order status tracker.
7. **Admin Dashboard:** Passcode-protected dashboard to manage menu items (CRUD) and update active order statuses.

## 📦 Prerequisites
- Node.js (v18.17+)
- npm or yarn

## ⚙️ Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   A `.env.local` file is already created. Make sure to update the Google OAuth keys if you want to test social login:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-change-in-production-32chars
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ADMIN_PASSCODE=admin123
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```

4. **Open the Application:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Google OAuth Setup
To enable "Continue with Google":
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and configure the OAuth consent screen.
3. Create OAuth client ID credentials (Web application).
4. Add `http://localhost:3000` to Authorized JavaScript origins.
5. Add `http://localhost:3000/api/auth/callback/google` to Authorized redirect URIs.
6. Copy the Client ID and Client Secret into your `.env.local`.

## 🛠️ Admin Access
Navigate to `/admin` (e.g., `http://localhost:3000/en/admin`).
Use the passcode defined in `.env.local`:
- **Default Passcode:** `admin123`

## 🌐 Switching Languages
Use the **"EN / AR"** toggle in the top navigation bar. This will instantly change the UI text and seamlessly flip the layout direction (LTR ↔ RTL).
