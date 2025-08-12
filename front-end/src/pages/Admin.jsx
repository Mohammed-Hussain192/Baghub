import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import "../styles/admin.css"; // We will style it in Baghub theme

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch products + orders
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/admin/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:4000/admin/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // Load product data into form for editing
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    reset(product); // Prefill the form
  };

  // Update product
  const onSubmitProduct = async (data) => {
    try {
      const res = await axios.put(
        `http://localhost:4000/admin/products/${selectedProduct.id}`,
        data
      );
      if (res.data.success) {
        alert("Product updated successfully!");
        fetchProducts();
        setSelectedProduct(null);
      } else {
        alert("Failed to update product.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating product.");
    }
  };

  // Update order status
  const handleStatusChange = async (orderId, status) => {
    try {
     
const res = await axios.put(
  `http://localhost:4000/admin/orders/${orderId}`,
  { status, email: Cookies.get("email") }
);
      if (res.data.success) {
        alert("Order status updated!");
        fetchOrders();
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating order status.");
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      {/* Products Section */}
      <section className="admin-section">
        <h2>Products</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price (₹)</th>
              <th>Stock</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td><img src={p.images?.[0]} alt={p.name} className="admin-thumb" /></td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEditProduct(p)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Product Edit Form */}
        {selectedProduct && (
          <div className="product-form">
            <h3>Edit Product: {selectedProduct.name}</h3>
            <form onSubmit={handleSubmit(onSubmitProduct)}>
              <input type="text" placeholder="Name" {...register("name", { required: true })} />
              {errors.name && <span className="error">Name is required</span>}

              <input type="number" placeholder="Price" {...register("price", { required: true })} />
              {errors.price && <span className="error">Price is required</span>}

              <input type="number" placeholder="Stock" {...register("stock", { required: true })} />
              {errors.stock && <span className="error">Stock is required</span>}

              <input type="text" placeholder="Image URL" {...register("image")} />

              <textarea placeholder="Description" {...register("description")}></textarea>

              <button type="submit" className="btn-save">Save</button>
              <button type="button" className="btn-cancel" onClick={() => setSelectedProduct(null)}>Cancel</button>
            </form>
          </div>
        )}
      </section>

      {/* Orders Section */}
      <section className="admin-section">
        <h2>Orders</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Product</th>
              <th>Price (₹)</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.name} ({o.email})</td>
                <td>{o.productname}</td>
                <td>{o.price}</td>
                <td>{o.status}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  >
                    <option value="Placed">Placed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="OutForDelivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Returned">Returned</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;
