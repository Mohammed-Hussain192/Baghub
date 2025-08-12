import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";
import SimpleNavbar from "../components/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  const userEmail = Cookies.get("email");

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await axios.get("https://baghub-by-mohammed.onrender.com/cart", {
          params: { email: userEmail },
        });

        if (response.data.orders && Array.isArray(response.data.orders)) {
          setCartItems(response.data.orders);
        } else {
          console.error("Invalid cart response format:", response.data);
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userEmail]);

  const handleRemoveFromCart = async (productId) => {
    if (!userEmail) {
      alert("Please log in to remove items from cart.");
      return;
    }

    setRemovingId(productId);

    try {
      const response = await axios.delete(
        "https://baghub-by-mohammed.onrender.com/cart/remove",
        {
          data: { email: userEmail, id: productId },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== productId)
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("Something went wrong.");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="cart-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!cartItems.length) {
    return <div>

     <SimpleNavbar/>
      <div className="cart-empty">Your cart is empty.</div>;
    </div>
  }

  return (
    
    
    <div className="cart-container">
      <SimpleNavbar/>
    <ToastContainer />
     
      <h2 className="cart-title">Your Cart</h2>

      <div className="cart-grid">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="cart-item"
            onClick={() => navigate(`/product/${item.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(`/product/${item.id}`);
              }
            }}
          >
            <img
              src={
                item.images && item.images.length
                  ? item.images[0]
                  : "https://dummyimage.com/300x200"
              }
              alt={item.name || "Product Image"}
              onError={(e) => {
                e.target.src = "https://dummyimage.com/300x200";
              }}
            />

            <div className="cart-item-body">
              <h4>{item.name}</h4>
              <p>₹{item.price}</p>
              <small>
                Added on:{" "}
                {item.addedAt
                  ? new Date(item.addedAt).toLocaleString()
                  : "N/A"}
              </small>
            </div>

            <div className="cart-item-footer">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromCart(item.id);
                }}
                disabled={removingId === item.id}
                className="cart-remove-btn"
                aria-label={`Remove ${item.name} from cart`}
              >
                {removingId === item.id ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default Cart;
