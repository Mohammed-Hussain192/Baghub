// OrderConfirmed.jsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "../styles/ordercon.css";
import { useNavigate } from "react-router-dom";


const OrderConfirmed = () => {
  const navigate = useNavigate();
  const checkRef = useRef(null);
  const sentencesRef = useRef([]);
  const containerRef = useRef(null);
  const confettiRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Checkmark animation
    gsap.fromTo(
      checkRef.current,
      { scale: 0, rotate: 0 },
      { scale: 1, rotate: 360, duration: 1.2, ease: "elastic.out(1, 0.5)" }
    );

    // Sentences stagger animation
    gsap.fromTo(
      sentencesRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.4,
        delay: 0.5,
        ease: "power3.out",
      }
    );

    // Floating container
    gsap.to(containerRef.current, {
      y: -10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Button animation (after sentences)
    gsap.fromTo(
      buttonRef.current,
      { y: 50, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 2.5,
        ease: "back.out(1.7)",
      }
    );

    // Confetti animation
    gsap.to(confettiRef.current.children, {
      y: 800,
      rotation: 720,
      duration: 3,
      ease: "power1.out",
      stagger: 0.05,
    });
  }, []);

  const sentences = [
    "Your order has been successfully placed.",
    "We’re packing it with love 💚.",
    "You will receive a confirmation email shortly.",
    "Thank you for shopping with us!",
  ];

  return (
    <div className="order-container" ref={containerRef}>
      {/* Confetti */}
      <div className="confetti" ref={confettiRef}>
        {[...Array(40)].map((_, i) => (
          <span key={i} className="confetti-piece"></span>
        ))}
      </div>

      {/* Checkmark */}
      <div className="check-circle" ref={checkRef}>
        ✓
      </div>

      {/* Sentences */}
      <div className="sentences">
        {sentences.map((text, index) => (
          <p
            key={index}
            ref={(el) => (sentencesRef.current[index] = el)}
            className="sentence"
          >
            {text}
          </p>
        ))}
      </div>

      {/* Button */}
      <button onClick={() => navigate("/orders")} className="orders-btn" ref={buttonRef}>
        View My Orders
      </button>
    </div>
  );
};

export default OrderConfirmed;
