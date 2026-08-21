import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/shop-context";
import { useAuth } from "../../Context/auth-context";

export const Product = (props) => {
    const { _id, name, price, imageUrl, stock } = props.data;
    const { addToCart, quantityFor } = useContext(ShopContext);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const cartItemAmount = quantityFor(_id);

    const handleAdd = async () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        try {
            await addToCart(_id);
            setMessage("");
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
       <div className="product">
        <img src={imageUrl} alt={name} />
        <div className="description">
            <p>
                <b>{name}</b>
            </p>
            <p>${price}</p>
            <p className="stock">In stock: {stock}</p>
        </div>
        <button className="addToCartBttn" onClick={handleAdd} disabled={stock < 1}>
            {stock < 1 ? "Out of stock" : `Add To Cart${cartItemAmount > 0 ? ` (${cartItemAmount})` : ""}`}
        </button>
        {message && <p className="product-error">{message}</p>}
        </div>
    );
};
