import React, { useContext } from "react";
import { ShopContext } from "../../Context/shop-context";
import { Product } from "./product";
import "./shop.css";

export const Shop = () => {
  const { products, loading, error } = useContext(ShopContext);

  return (
    <div className="shop">
      <section className="hero">
        <div>
          <p className="eyebrow">ShipKart marketplace</p>
          <h1>Find everyday essentials and flagship gadgets in one place.</h1>
          <p>Browse products, add them to your cart, and check out with a saved account.</p>
        </div>
      </section>
      {loading && <p className="status-copy">Loading catalog...</p>}
      {error && <p className="status-copy error">{error}</p>}
      <div className="products">
        {products.map((product) => (
          <Product key={product._id} data={product} />
        ))}
      </div>
    </div>
  );
};
