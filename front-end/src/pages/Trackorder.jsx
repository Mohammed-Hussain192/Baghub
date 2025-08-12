import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "../styles/track.css"; // Timeline + order card styles
import SimpleNavbar from "../components/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TrackOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`https://baghub-by-mohammed.onrender.com/order/track/${orderId}`, {
          params: { email: Cookies.get("email") },
        });
        setOrder(res.data.orders || null);
        setProducts(res.data.pdata || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, [orderId]);

  const statuses = ["Placed", "Shipped", "OutForDelivery", "Delivered", "Returned", "Cancelled"];

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await axios.post(`https://baghub-by-mohammed.onrender.com/order/cancel/${orderId}`, {
        email: Cookies.get("email"),
      });
      if (res.data.success) {
        
       
        toast.success("Order cancelled successfully."); // refresh page
      } else {
        toast.error("Failed to cancel order.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error cancelling order.");
    }
  };

  const handleReturnOrder = async () => {
    const data = prompt("the reason for return ")
    console.log(data)
    if (!window.confirm("Are you sure you want to return this order?")) return;
    try {
      const res = await axios.post(`https://baghub-by-mohammed.onrender.com/order/return/${orderId}`, {
        email: Cookies.get("email"),
      });
      if (res.data.success) {
        toast.success("Return request submitted successfully.");
        setTimeout(() => {
            navigate(0); // reload current page
            }, 3000);// refresh
      } else {
        toast.error("Failed to request return.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error requesting return.");
    }
  };

  return (
    <>
    <SimpleNavbar/>
    <ToastContainer />
    <div className="track-container">
      {order ? (
        <>
          {/* Order card */}
          <div className="order-card">
            <div className="order-image">
              <img
                src={products.images?.[0] || "https://dummyimage.com/300x200"}
                alt={order.productname}
              />
            </div>
            <div className="order-details">
              <h2>Order #{order.id}</h2>
              <p><b>Product:</b> {order.productname}</p>
              <p><b>Buyer:</b> {order.name} ({order.email})</p>
              <p><b>Price:</b> ₹{order.price}</p>
              <p><b>Order Date:</b> {order.orderDate}</p>
              <p><b>Delivery Date:</b> {order.Deliverable}</p>
              <p><b>Status:</b> {order.status}</p>

              {/* Conditional Action Buttons */}
              <div className="order-actions">
                {order.status === "Delivered" && (
                  <button className="btn-return" onClick={handleReturnOrder}>
                    Return Order
                  </button>
                )}
                {["Placed", "Shipped", "OutForDelivery"].includes(order.status) && (
                  <button className="btn-cancel" onClick={handleCancelOrder}>
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline">
            {statuses.map((status, index) => {
              const isActive = statuses.indexOf(order.status) >= index;
              return (
                <div
                  key={status}
                  className={`timeline-step ${isActive ? "active" : ""}`}
                >
                  <div className="circle">{index + 1}</div>
                  <p className="label">{status.replace(/([a-z])([A-Z])/g, "$1 $2")}</p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
    
    </>
  );
}
