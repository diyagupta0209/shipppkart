import "./App.css";
import { Navbar } from "./Components/navbar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Shop } from './pages/shop/shop';
import { Cart } from './pages/cart/cart';
import { ShopContextProvider } from "./Context/shop-context";


function App() {
  return (
  <div className="App">
    <ShopContextProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/myshoppingapp" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
    </ShopContextProvider>
  </div>
  );
}

export default App;