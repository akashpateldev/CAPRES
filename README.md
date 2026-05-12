# CAPRES (Centralized Academic Project Repository & Evaluation System)

A centralized platform for academic project submission, evaluation, and innovation tracking. Developed for college department-level management of B.Tech final-year projects.

🏆 **Winner – Startup Bootcamp 2026 (FTBI, NIT Rourkela)**

## 🚀 Overview

CAPRES supports secure submission, faculty evaluation, group projects, and archived learning using registration-number-based identity and role-based authentication.

### Key Features
- **Secure Submission**: Registration-number-based identity.
- **Faculty Evaluation**: Role-based authentication and management.
- **Group Projects**: Collaboration features for students.
- **Archived Learning**: Repository of past projects for reference.

## 🛠️ Technology Stack

- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Backend**: [Supabase](https://supabase.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)

## 🏗️ Project Structure

- `src/`: Source code
  - `components/`: Reusable UI components
  - `lib/`: Utility functions and configurations
  - `pages/`: Page components
  - `hooks/`: Custom React hooks
- `supabase/`: Supabase migrations and configurations
- `public/`: Static assets

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/akashpateldev/CAPRES.git
   cd CAPRES
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```sh
   npm run dev
   ```

## 🌐 Deployment

The project can be easily deployed via any Vite-compatible hosting service like Vercel, Netlify, or AWS Amplify.

## 📄 License

This project is licensed under the MIT License.
