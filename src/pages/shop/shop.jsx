import React, { useContext } from "react";
import { ShopContext } from "../../Context/shop-context";
import { Product } from "./product";
import "./shop.css";

export const Shop = () => {
    const { products, loading, error } = useContext(ShopContext);

    return (
        <div className="shop">
            <div className="shopTitle">
                <h1>SHIPKART</h1>
                <p>Browse products, add them to your cart, and place an order.</p>
            </div>
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
