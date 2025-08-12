import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Login.css'; // Assuming your styles are defined
import Cookies from 'js-cookie';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();

  // Show toast if redirected with message
  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
    }
  }, [location.state]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('https://baghub-by-mohammed.onrender.com/login', {
        email: data.email,
        password: data.password
      });

      if (response.data.success) {
        Cookies.set('email', response.data.email, { expires: 7 });
        // Store user data in cookies
        const token = Cookies.get('email');
        console.log(token); // "abc123"

        navigate('/home', {
          state: { toastMessage: 'Login successful' }
        });
      } else {
        toast.error('Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      toast.error('Login failed');
    }
  };

  return (
    <div className="baghub-login-outer">
      <ToastContainer />
      <div className="baghub-login-container" role="main">
        <h1 className="baghub-title">
          Welcome back to <span>BAGHUB</span>
        </h1>
        <p className="baghub-subtitle">
          Your premium bag shopping experience awaits.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div className="input-with-icon">
            <input
              type="email"
              placeholder="Email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
          </div>
          {errors.email && (
            <p className="error-msg">{errors.email.message}</p>
          )}

          {/* Password */}
          <div className="input-with-icon">
            <input
              type="password"
              placeholder="Password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
          </div>
          {errors.password && (
            <p className="error-msg">{errors.password.message}</p>
          )}
          <Link to='/forgetpassword'>Frogot password ?</Link>

          {/* Submit */}
          <button type="submit" className="btn-submit">
            Sign In
          </button>
        </form>

        {/* Redirect to Register */}
        <div className="register-prompt">
          <p>Don't have an account?</p>
          <button
            className="btn-register"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
