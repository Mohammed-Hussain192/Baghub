import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import '../styles/Order.css';
import SimpleNavbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function Order() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const email = Cookies.get('email');
        if (!email) {
          console.error('No email cookie found');
          return;
        }

        const response = await axios.get('https://baghub-by-mohammed.onrender.com/order', {
          params: { email }
        });

        setOrders(response.data.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  const handleTrack = (orderId) => {
    navigate(`/track/${orderId}`);
  };

  return (
    <>
      <SimpleNavbar />
      <section className="baghub-products-section">
        <h1 className="baghub-section-title">Your Orders</h1>
        <div className="baghub-products-grid">
          {orders.length > 0 ? (
            orders.map((order) => {
              const product = order.product || {};
              return (
                <article key={order._id} className="baghub-product-card">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/280x160?text=No+Image'}
                    alt={product.name || 'Product'}
                    className="baghub-product-image"
                    loading="lazy"
                  />
                  <h2 className="baghub-product-name">{product.name}</h2>
                  <p className="baghub-product-price">
                    ₹{(product.price || 0).toLocaleString()}
                  </p>
                  <p className="baghub-product-date">
                    <strong>Order Date:</strong>{' '}
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                  <p className="baghub-product-status">
                    <strong>Status:</strong> {order.status || 'Unknown'}
                  </p>
                  <button
                    className="baghub-track-btn"
                    onClick={() => handleTrack(order.orderId)}
                  >
                    Track Details
                  </button>
                </article>
              );
            })
          ) : (
            <p className="baghub-no-results">No orders found.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Order;
