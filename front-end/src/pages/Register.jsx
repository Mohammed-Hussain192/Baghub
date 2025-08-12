import React from 'react';
import { useForm } from "react-hook-form";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom'; // For navigation to login page
import '../styles/register.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios'; // Ensure axios is installed and imported
 // Updated CSS file for register page

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const navigate = useNavigate();
const onSubmit = async (data) => {
  try {
    const response = await axios.post('https://baghub-by-mohammed.onrender.com/register', {
      name: data.fullname,
      email: data.email,
      password: data.password,
    });

    if (response.data.exists) {
      toast.error("User already exists");
    } else {
     
      navigate('/home', {
      state: { toastMessage: "User registered successfully" }
    });
    }
  } catch (err) {
    toast.error("Registration failed");
    console.error(err);
  }
};
  // Watch password and confirm password for validation
  const password = watch("password", "");

  return (
    <div className="baghub-login-outer">
      <ToastContainer />
      <div className="baghub-login-container" role="main" aria-label="Registration form">
        <div className="baghub-title">Welcome to <span>BAGHUB</span></div>
        <p className="baghub-subtitle">Create your premium bag shopping account.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Name */}
          <label htmlFor="fullname" className="sr-only">Full Name</label>
          <div className="input-with-icon">
            
            <input
              id="fullname"
              type="text"
              placeholder="Full Name"
              aria-invalid={errors.fullname ? "true" : "false"}
              {...register("fullname", { 
                required: "Full name is required",
                minLength: { value: 3, message: "Min length is 3" },
                maxLength: { value: 30, message: "Max length is 30" }
              })}
            />
          </div>
          {errors.fullname && <p className="error-msg" role="alert">{errors.fullname.message}</p>}

          {/* Email */}
          
          <div className="input-with-icon">
            <input
              id="email"
              type="email"
              placeholder="Email"
              aria-invalid={errors.email ? "true" : "false"}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Email is invalid"
                }
              })}
            />
          </div>
          {errors.email && <p className="error-msg" role="alert">{errors.email.message}</p>}

          {/* Password */}
         
          <div className="input-with-icon">
        
            <input
              id="password"
              type="password"
              placeholder="Password"
              aria-invalid={errors.password ? "true" : "false"}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Min length is 8" }
              })}
            />
          </div>
          {errors.password && <p className="error-msg" role="alert">{errors.password.message}</p>}

          {/* Confirm Password */}
          <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
          <div className="input-with-icon">
            
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              {...register("confirmPassword", {
                required: "You must confirm your password",
                validate: value =>
                  value === password || "Passwords do not match"
              })}
            />
          </div>
          {errors.confirmPassword && <p className="error-msg" role="alert">{errors.confirmPassword.message}</p>}

          {/* Phone Number (optional) */}
          

          <button type="submit" className="btn-submit">Sign Up</button>
        </form>

        <div className="register-back-login">
          <p>Already have an account?{' '}
            <button 
              type="button" 
              className="btn-link-login"
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
