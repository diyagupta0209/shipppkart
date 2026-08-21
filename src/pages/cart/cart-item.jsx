import React, { useContext, useState } from "react";
import { ShopContext } from "../../Context/shop-context";

export const CartItem = (props) => {
    const { product, quantity } = props.data;
    const { addToCart, removeFromCart, updateCartItemCount } = useContext(ShopContext);
    const [error, setError] = useState("");

    const run = async (action) => {
        try {
            setError("");
            await action();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="cartItem">
            <img src={product.imageUrl} alt={product.name} />
            <div className="description">
                <p>
                    <b>{product.name}</b>
                </p>
                <p>${product.price}</p>
                <div className="countHandler">
                    <button onClick={() => run(() => removeFromCart(product.id))}> - </button>
                    <input
                        value={quantity}
                        onChange={(e) => run(() => updateCartItemCount(Number(e.target.value) || 0, product.id))}
                    />
                    <button onClick={() => run(() => addToCart(product.id))}> + </button>
                </div>
                {error && <p className="product-error">{error}</p>}
            </div>
        </div>
    );
};
