import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import "../styles/BuyNow.css";

const BuyNow = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const userEmail = Cookies.get("email");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // Fetch product + user data
  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [productRes, userRes] = await Promise.all([
          axios.get(`http://localhost:4000/product/${productId}`),
          axios.get(`http://localhost:4000/user`, {
            params: { email: userEmail }
          })
        ]);

        setProduct(productRes.data);

        // Pre-fill important fields from user profile
        if (userRes.data) {
          setValue("fullName", userRes.data.name || "");
          setValue("phone", userRes.data.phone || "");
          setValue("address", userRes.data.address || "");
          setValue("pin", userRes.data.pin || "");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, userEmail, navigate, setValue]);

  // Handle order confirmation
  const onSubmit = async (data) => {
    
    try {
      const res = await axios.post("http://localhost:4000/book-my-order", {
        email: userEmail,
        productId,
        ...data
      });

      if (res.data.success) {
        alert("Order confirmed with Cash on Delivery!");
        navigate("/orderconfirmed");
      } else {
        alert("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Error confirming order");
    }
  };

  if (loading) {
    return (
      <div className="buynow-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="buynow-empty">Product not found.</div>;
  }

  return (
    <div className="buynow-container">
      <h2 className="buynow-title">Confirm Your Order</h2>

      <div className="buynow-card">
        {/* Product Details */}
        <div className="product-section">
          <img
            src={product.images?.[0] || "https://dummyimage.com/300x200"}
            alt={product.name}
          />
          <div className="product-info">
            <h4>{product.name}</h4>
            <p className="price">₹{product.price}</p>
            {product.description && <p className="desc">{product.description}</p>}
          </div>
        </div>

        {/* Order Form */}
        <form className="order-form" onSubmit={handleSubmit(onSubmit)}>
          <h3>Delivery Details</h3>

          <input
            type="text"
            placeholder="Full Name"
            {...register("fullName", { required: "Full Name is required" })}
          />
          {errors.fullName && <span className="error">{errors.fullName.message}</span>}

          <input
            type="tel"
            placeholder="Phone Number"
            {...register("phone", { required: "Phone number is required" })}
          />
          {errors.phone && <span className="error">{errors.phone.message}</span>}

          <textarea
            placeholder="Full Address"
            {...register("address", { required: "Address is required" })}
          />
          {errors.address && <span className="error">{errors.address.message}</span>}

          <input
            type="number"
            placeholder="Pin Code"
            {...register("pin", { required: "Pin code is required" })}
          />
          {errors.pin && <span className="error">{errors.pin.message}</span>}

          {/* Payment Method Section */}
          <h3>Payment Method</h3>
          <div className="payment-options">
            <label className="payment-option active">
              <input
                type="radio"
                value="COD"
                defaultChecked
                {...register("paymentMethod", { required: true })}
              />
              Cash on Delivery (Available)
            </label>
            <label className="payment-option disabled">
              <input
                type="radio"
                disabled
              />
              UPI / Online Payment (Currently unavailable)
            </label>
            <label className="payment-option disabled">
              <input
                type="radio"
                disabled
              />
              Debit / Credit Card (Currently unavailable)
            </label>
          </div>

          <button type="submit" className="confirm-btn">
            Confirm Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyNow;
