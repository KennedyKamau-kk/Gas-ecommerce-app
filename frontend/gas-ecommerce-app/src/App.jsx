import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
     <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Navbar />
          <AppRoutes />
        </BrowserRouter>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App
