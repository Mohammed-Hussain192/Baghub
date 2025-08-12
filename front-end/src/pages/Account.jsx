import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../styles/Account.css";
import SimpleNavbar from "../components/Navbar";

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userEmail = Cookies.get("email");

  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const res = await axios.get("https://baghub-by-mohammed.onrender.com/user", {
          params: { email: userEmail },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userEmail, navigate]);

  const handleLogout = () => {
    Cookies.remove("email");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="account-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="account-empty">
        Could not load your account details.
      </div>
    );
  }

  return (
    <>
    <SimpleNavbar/>
    <div className="account-container">
        
      <h2 className="account-title">My Account</h2>

      <div className="account-card">
        <div className="account-details">
          <h4>{user.name}</h4>
          <p>Email: {user.email}</p>
          {user.phone && <p>Phone: {user.phone}</p>}
          
        </div>

        <div className="account-actions">
          <button
            className="account-btn primary"
            onClick={() => navigate("/orders")}
          >
            My Orders
          </button>
          <button
            className="account-btn secondary"
            onClick={() => navigate("/cart")}
          >
            Cart
          </button>
          <button className="account-btn danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Account;
