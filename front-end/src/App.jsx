import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Product from './pages/Products';
import Detail from './components/Detail';
import Base from './pages/Base';
import AuthForm from './pages/Login';
import Register from './pages/Register';
import CollectionPage from './pages/Collection';
import HomePage from './pages/Home';
import ProtectedRoute from './services/Middlewares';
import CartPage from './pages/Cart';
import Order from './pages/Order';
import './App.css'; // Assuming you have some global styles
import Account from './pages/Account';
import BuyNow from './pages/Buynow';
import OrderConfirmed3D from './pages/Orderconfirmed';
import TrackOrderPage from './pages/Trackorder';
import AdminDashboard from './pages/Admin';
import ForgotPassword from './pages/Forgetpassword';
import ResetPassword from './pages/Confimpass';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Base />} />
      <Route path="/login" element={<AuthForm />} />
      <Route path="/register" element={<Register />} />
      <Route path='/admin' element={<AdminDashboard/>} />
      <Route path='/forgetpassword' element={<ForgotPassword/>}/>
      <Route path='/change/pass/:email' element={<ResetPassword/>}/>


      <Route element={<ProtectedRoute/>}>
      
        <Route path="/products" element={<Product />} />
        <Route path="/product/:id" element={<Detail />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/collections" element={<CollectionPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/account" element={<Account />} />
        <Route path="/buynow/:productId" element={<BuyNow />} />
        <Route path="/orderconfirmed" element={<OrderConfirmed3D />} />
        <Route path="/track/:orderId" element={<TrackOrderPage />} />
        

      </Route>
    </Routes>
  );
};

export default App;
