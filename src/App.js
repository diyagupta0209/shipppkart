import "./App.css";
import { Navbar } from "./Components/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Shop } from "./pages/shop/shop";
import { Cart } from "./pages/cart/cart";
import { Login } from "./pages/auth/login";
import { Register } from "./pages/auth/register";
import { Checkout } from "./pages/orders/checkout";
import { Orders } from "./pages/orders/orders";
import { ShopContextProvider } from "./Context/shop-context";
import { AuthProvider } from "./Context/auth-context";
import { ProtectedRoute } from "./Components/protected-route";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <ShopContextProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Shop />} />
              <Route path="/myshoppingapp" element={<Shop />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </ShopContextProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
