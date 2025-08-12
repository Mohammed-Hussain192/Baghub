import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Product from '../components/Product';
import Navbar from '../components/Navbar';
import '../styles/collection.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CollectionPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('popularity');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // You could get categories from server or products dynamically
  const categories = ['All', 'Handbags', 'Backpacks', 'Clutches', 'Wallets'];

  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://baghub-by-mohammed.onrender.com/get');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Filter and sort products whenever search, sort, category or products update
  useEffect(() => {
    let filtered = [...products];

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(
        (prod) => prod.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(
        (prod) =>
          prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prod.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    switch (sortCriteria) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'popularity':
      default:
        // Assuming 'popularity' is default order or could be by some popularity param if available
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, sortCriteria, categoryFilter]);

  return (
    <>
    <Navbar/>
    <div className="baghub-productlist-outer">
     <ToastContainer />
      

      <div className="baghub-hero-banner baghub-collection-hero">
        <div className="baghub-hero-content">
          <h1 className="baghub-hero-title">Our Exclusive Collections</h1>
          <p className="baghub-hero-intro">
            Handpicked bags for every style and occasion. Browse our finest range of
            handbags, backpacks, clutches, wallets, and more.
          </p>
        </div>
      </div>

      {/* Collection description */}
      

     

      <h2 className="baghub-title" style={{ marginTop: '38px' }}>
        Bags Matching Your Style
      </h2>

      <div className="baghub-products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
          ))
        ) : (
          <p className="baghub-no-results">No matching bags found.</p>
        )}
      </div>
    </div>
    </>
  );
}

export default CollectionPage;
