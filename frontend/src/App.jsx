import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Auth & Theme
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Layouts
import SellerLayout from './components/layout/SellerLayout'
import StudentLayout from './components/layout/StudentLayout'
import AdminLayout from './components/layout/AdminLayout'

// Public pages
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

// Seller pages
import SellerDashboard from './pages/seller/Dashboard'
import SellerProducts from './pages/seller/Products'
import SellerOrders from './pages/seller/Orders'
import SellerProfile from './pages/seller/Profile'

// Student pages
import StudentHome from './pages/student/Home'
import StudentOrders from './pages/student/Orders'
import StudentProfile from './pages/student/Profile'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminSellers from './pages/admin/Sellers'
import AdminOrders from './pages/admin/Orders'
import AdminAnalytics from './pages/admin/Analytics'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* ── Public ───────────────────────────── */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* ── Seller (protected) ───────────────── */}
            <Route
              path="/seller"
              element={
                <ProtectedRoute role="seller">
                  <SellerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/seller/dashboard" replace />} />
              <Route path="dashboard" element={<SellerDashboard />} />
              <Route path="products" element={<SellerProducts />} />
              <Route path="orders" element={<SellerOrders />} />
              <Route path="profile" element={<SellerProfile />} />
            </Route>

            {/* ── Student (protected) ──────────────── */}
            <Route
              path="/student"
              element={
                <ProtectedRoute role="student">
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/student/home" replace />} />
              <Route path="home" element={<StudentHome />} />
              <Route path="orders" element={<StudentOrders />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>

            {/* ── Admin (protected) ────────────────── */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="sellers" element={<AdminSellers />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>

            {/* ── Catch-all ───────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
