# 🎓 Student LMS - Modern GPA Calculator

A comprehensive Student Learning Management System with advanced GPA/SGPA calculation, user authentication, data persistence, and beautiful UI/UX built with Next.js 14.

![Student LMS Preview](https://img.shields.io/badge/Version-1.0.0-blue) ![Next.js](https://img.shields.io/badge/Next.js-14.2-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## ✨ Features

### 🔥 **Core Features**
- **🧮 Smart CGPA Calculator** - Calculate Cumulative GPA with advanced analytics
- **📊 SGPA Calculator** - Semester-wise GPA calculation with detailed breakdown
- **🔐 Multi-Provider Authentication** - Google, GitHub, and Email/Password login
- **💾 Data Persistence** - MongoDB Atlas for secure data storage
- **📱 Responsive Design** - Mobile-first approach with stunning UI/UX
- **🎨 Animated Interface** - Framer Motion animations and particle backgrounds

### 🚀 **Advanced Features**
- **👤 User Dashboard** - Personalized analytics and progress tracking
- **🏆 Performance Classification** - Automatic grade classification system
- **🎯 Real-time Calculations** - Instant GPA computation with visual feedback
- **💾 Auto-save Functionality** - Secure cloud storage of all calculations
- **🌙 Glass Morphism UI** - Modern design with backdrop blur effects

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (free tier available)

### 📦 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   
   Update `.env.local` file with your credentials:
   ```env
   # Database - Get from MongoDB Atlas (free tier)
   MONGODB_URI=your_mongodb_connection_string_here
   
   # NextAuth.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   
   # OAuth (optional)
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎯 Usage Guide

### For Students
1. **Sign Up/Login** - Use email or social providers
2. **Calculate CGPA** - Enter semester credits and grade points
3. **Calculate SGPA** - Add subjects with credits and grades
4. **Dashboard** - View your academic progress and analytics
5. **Save Results** - All calculations are automatically saved

## 🎨 UI/UX Features

- **🌈 Gradient Backgrounds** - Beautiful purple-blue gradients
- **✨ Particle Animation** - Interactive particle background
- **🔍 Glass Morphism** - Modern translucent card designs
- **🎭 Smooth Animations** - Page transitions and hover effects
- **📱 Mobile Responsive** - Optimized for all device sizes

## 🚀 Deployment

### Quick Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Manoj-Kumar-BV/GPA_Calculator)

### Manual Deployment
1. **Push to GitHub** (this repository)
2. **Connect to Vercel** and import your GitHub repo
3. **Add Environment Variables** in Vercel dashboard:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
4. **Deploy** - Vercel handles the rest automatically!

📚 **Complete deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step instructions.

## �️ Roadmap

### 🤖 **Coming Soon**
- [ ] AI-powered grade predictions
- [ ] Advanced analytics dashboard
- [ ] Goal setting and tracking
- [ ] Performance insights

### 📊 **Future Features**
- [ ] Course management
- [ ] Assignment tracking
- [ ] Collaboration tools
- [ ] Export reports

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Made with ❤️ by [Manoj Kumar BV](https://github.com/Manoj-Kumar-BV)**

**🌟 Star this repo if you found it helpful!**

</div>
