
import { useEffect } from "react"
import { RouterProvider } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { DeliveryAddressProvider } from "./context/DeliveryAddressContext"
import { router } from "./routes/Routes"
import AOS from 'aos';
import 'aos/dist/aos.css';
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import ProfilePage from "./pages/ProfilePage"
import CheckoutPage from "./pages/CheckoutPage"
import OrderTrackingPage from "./pages/OrderTrackingPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"
import Navbar from "./components/Home/Header/Navbar"
import Footer from "./components/Footer/Footer"
import Home from "./components/Home/Home"
import About from "./components/About/AboutPage"
import Portfolio from "./components/Portfolio/Portfolio"
import Clients from "./components/Clients/Clients"
import Blog from "./components/Blog/Blog"
import Contact from "./components/Contact/Contact"
import OrderList from "./components/Order/OrderList"

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />
  }

  return children
}

export default function App() {
  // Auth is now handled by AuthProvider and RTK Query
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <AuthProvider>
      <DeliveryAddressProvider>
        <RouterProvider router={router} />
      </DeliveryAddressProvider>
    </AuthProvider>
  )
}
