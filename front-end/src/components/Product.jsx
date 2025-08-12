import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/P.css'; // Ensure this CSS file is created for styling
import { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Assuming you are using js-cookie for cookie management

function Product(props) {
  const navigate = useNavigate();
  const { id, name, description, images, category, keywords, price } = props;

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (e) => {
  e.stopPropagation();

  const email = Cookies.get("email"); // assuming you've already set this cookie

  if (!email) {
    alert("Please login to add to cart.");
    return;
  }

  try {
    const response = await axios.get(`https://baghub-by-mohammed.onrender.com/addtocart/${id}`, {
      params: { email }
    });

    console.log("Response:", response.data);
    if (response.data.success) {
      
      toast.success("Product added to cart successfully!"); // Redirect to cart page after adding
    } else {
       toast.info("Product already in cart.");
    }
  } catch (error) {
       toast.error("Something went wrong. Please try again.");
  }
};


  return (
    <div className="baghub-product-card" onClick={handleClick} role="button" tabIndex={0} onKeyPress={e => { if(e.key === 'Enter') handleClick(); }}>
      <div className="baghub-product-img-wrapper">
        <img src={images[0]} alt={name} className="baghub-product-img" />
       
      </div>
      <h3 className="baghub-product-title">{name}</h3>
      <p className="baghub-product-description">{description}</p>
      <p className="baghub-product-price">₹{price}</p>
      <button className="baghub-product-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

export default Product;
