import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/confirm.css"; // Optional CSS file

const ResetPassword = () => {
  const { email } = useParams(); // Get email from URL
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("https://baghub-by-mohammed.onrender.com/reset-password", {
        email: email,
        newPassword: data.newPassword
      });

      if (res.data.success) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(res.data.error || "Failed to reset password.");
      }
    } catch (err) {
      setError("Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <h2 className="reset-title">Reset Your Password</h2>

      <form className="reset-form" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="">Email</label>
        <input type="text" name="" id="" value={email} />
        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          placeholder="Enter new password"
          {...register("newPassword", {
            required: "New password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" }
          })}
        />
        {errors.newPassword && <p className="reset-message error">{errors.newPassword.message}</p>}

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          {...register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value) => value === watch("newPassword") || "Passwords do not match"
          })}
        />
        {errors.confirmPassword && <p className="reset-message error">{errors.confirmPassword.message}</p>}

        <button type="submit" className="reset-submit" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>

      {message && <p className="reset-message success">{message}</p>}
      {error && <p className="reset-message error">{error}</p>}
    </div>
  );
};

export default ResetPassword;
