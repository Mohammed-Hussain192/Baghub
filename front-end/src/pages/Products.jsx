import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Product from '../components/Product';
import '../styles/Product.css'; // CSS file for ProductList page
import Navbar from '../components/Navbar';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/get');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="baghub-productlist-outer">
      <Navbar />
      <div className="baghub-hero-banner">
        <div className="baghub-hero-content">
          <h1 className="baghub-hero-title">Welcome to BAGHUB</h1>
          <p className="baghub-hero-intro">
            Explore the finest curated bags—crafted for style & made to last.<br />
            Discover your new favorite from our premium collection.
          </p>
          <ul className="baghub-highlight-list">
            <li>✔️ Free Shipping on All Orders</li>
            <li>✔️ 7-Day Easy Returns</li>
            <li>✔️ Exclusive Brands & Limited Editions</li>
          </ul>
        </div>
      </div>

      <h1 className="baghub-title">Explore BAGHUB Collections</h1>

      <div className="baghub-products-grid">
        {products.map((product) => (
          <Product
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            images={product.images}
            category={product.category}
            keywords={product.keywords}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
