import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Forgetpassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerOtp, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors } } = useForm();

  const [message, setMessage] = useState("");
  const [sotp, setsotp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpStage, setOtpStage] = useState(false);
  const [emailStored, setEmailStored] = useState("");

  // Step 1: Send OTP
  const onSubmit = async (data) => {
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/forgetpass", { email: data.email });
      if (res.data.success) {
        setMessage("OTP sent to your email if it exists in our system.");
        setEmailStored(data.email);
        setsotp(res.data.otp); // storing OTP (not secure — backend verification is better)
        setOtpStage(true);
      } else {
        setError(res.data.error || "Failed to send OTP.");
      }
    } catch (err) {
      setError("Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const onOtpSubmit = async (data) => {
    setError("");
    setMessage("");

    try {
      if (sotp === data.otp) {
        setMessage("OTP verified successfully! Redirecting to reset password...");
        setTimeout(() => {
          navigate(`/change/pass/${emailStored}`);
        }, 2000);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Server error during OTP verification.");
    }
  };

  return (
    <div className="forgot-container">
      <h2 className="forgot-title">Forgot Password</h2>

      {/* Step 1: Email Form */}
      <form className="forgot-form" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your registered email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address"
            }
          })}
          disabled={loading || otpStage}
        />
        {errors.email && <p className="forgot-message error">{errors.email.message}</p>}

        {!otpStage && (
          <button type="submit" disabled={loading} className="forgot-submit">
            {loading ? "Sending..." : "Send OTP"}
          </button>
        )}
      </form>

      {/* Step 2: OTP Form */}
      {otpStage && (
        <form className="forgot-form" onSubmit={handleOtpSubmit(onOtpSubmit)}>
          <label htmlFor="otp">Enter OTP</label>
          <input
            id="otp"
            type="text"
            placeholder="Enter the OTP sent to your email"
            {...registerOtp("otp", {
              required: "OTP is required",
              pattern: {
                value: /^[0-9]{4,6}$/,
                message: "OTP must be 4-6 digits"
              }
            })}
          />
          {otpErrors.otp && <p className="forgot-message error">{otpErrors.otp.message}</p>}

          <button type="submit" className="forgot-submit">Verify OTP</button>
        </form>
      )}

      {/* Messages */}
      {message && <p className="forgot-message success">{message}</p>}
      {error && <p className="forgot-message error">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
