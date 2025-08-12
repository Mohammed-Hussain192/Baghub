import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import '../styles/Detail.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Detail = () => {
    const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState('Add to Cart');
  const [addingToCart, setAddingToCart] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
 

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      customer: '',
      rating: 5,
      comment: ''
    }
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/product/${id}`);
        const data = response.data;
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkCartStatus = async () => {
      try {
        const email = Cookies.get("email");
        if (!email) return;

        const res = await axios.get(`http://localhost:4000/check/${id}`, {
          params: { email },
        });

        if (res.data.success) {
          setStatus('View Cart');
        } else {
          setStatus('Add to Cart');
        }
      } catch (error) {
        console.error('Error checking cart:', error);
      }
    };

    checkCartStatus();
  }, [id]);

  const handleAddToCart = async () => {
    const email = Cookies.get("email");

    if (!email) {
      alert("Please log in to add to cart.");
      return;
    }

    setAddingToCart(true);

    try {
      const res = await axios.get(`http://localhost:4000/addtocart/${id}`, {
        params: { email },
      });

      if (res.data.success) {
        setStatus('View Cart');
        toast.success("Product added to cart successfully!");
      } else {
        toast.error("Product already in cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleCartButtonClick = () => {
    if (status === 'View Cart') {
      navigate('/cart');
    } else {
      handleAddToCart();
    }
  };
  const handleBuyNow = () => {
    navigate(`/buynow/${id}`);
    // You can redirect to checkout here
  };

  const onSubmitReview = async (data) => {
    setSubmittingReview(true);

    try {
      const res = await axios.post(`http://localhost:4000/product/${id}/review`, data);

      if (res.data.success) {
        toast.success("Review submitted successfully!");

        setProduct(prev => ({
          ...prev,
          reviews: [...(prev.reviews || []), data]
        }));

        reset();
      } else {
        toast.error("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Something went wrong while submitting review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main className="baghub-detail-container" aria-live="polite">
        {product ? (
          <div className="baghub-detail-grid">
            {/* Left: Product Images */}
            <section className="baghub-detail-images-section">
              <img
                src={selectedImage}
                alt={`${product.name} (selected)`}
                className="baghub-detail-image-main"
                loading="lazy"
              />
              <div className="baghub-detail-image-thumbnails">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`thumbnail-btn ${selectedImage === img ? 'selected' : ''}`}
                    onClick={() => setSelectedImage(img)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="baghub-detail-thumbnail"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </section>

            {/* Right: Product Info */}
            <section className="baghub-detail-info-section">
              <h1 className="baghub-detail-title">{product.name}</h1>
              <p className="baghub-detail-category">
                <strong>Category:</strong> {product.category}
              </p>
              <p className="baghub-detail-description">{product.description}</p>
              <p className="baghub-detail-price">₹{product.price.toLocaleString()}</p>

              {/* Action Buttons */}
              <div className="baghub-action-buttons">
                <button
                  className="baghub-btn-buy"
                  onClick={handleBuyNow}
                  aria-label="Buy Now"
                  type="button"
                >
                  Buy Now
                </button>
                <button
                  className="baghub-btn-cart"
                  onClick={handleCartButtonClick}
                  disabled={addingToCart}
                  aria-label={status}
                  type="button"
                >
                  {addingToCart ? 'Adding...' : status}
                </button>
              </div>

              {/* Keywords */}
              <p className="baghub-detail-keywords">
                <strong>Tags:</strong> {product.keywords?.join(', ') || 'N/A'}
              </p>

              {/* Reviews */}
              <section className="baghub-reviews-section">
                <h2>Customer Reviews</h2>
                {product.reviews?.length > 0 ? (
                  <ul className="baghub-reviews-list">
                    {product.reviews.map((review, idx) => {
                      if (typeof review === 'string') {
                        return (
                          <li key={idx} className="baghub-review-item">
                            <p className="baghub-review-comment">"{review}"</p>
                          </li>
                        );
                      } else {
                        return (
                          <li key={idx} className="baghub-review-item">
                            <div className="baghub-review-header">
                              <span className="baghub-reviewer-name">{review.customer}</span>
                              <span className="baghub-review-rating">{review.rating}/5</span>
                            </div>
                            <p className="baghub-review-comment">"{review.comment}"</p>
                          </li>
                        );
                      }
                    })}
                  </ul>
                ) : (
                  <p className="baghub-no-reviews">No reviews yet. Be the first to review!</p>
                )}

                {/* Review Form */}
                <form className="baghub-review-form" onSubmit={handleSubmit(onSubmitReview)} noValidate>
                  <h3>Write a Review</h3>

                  <label htmlFor="customer">Name:</label>
                  <input
                    id="customer"
                    {...register("customer", { required: "Name is required" })}
                    aria-invalid={errors.customer ? "true" : "false"}
                    type="text"
                    placeholder="Your name"
                  />
                  {errors.customer && <span role="alert" className="error-message">{errors.customer.message}</span>}

                  <label htmlFor="rating">Rating:</label>
                  <select
                    id="rating"
                    {...register("rating", {
                      required: "Rating is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Minimum rating is 1" },
                      max: { value: 5, message: "Maximum rating is 5" }
                    })}
                    defaultValue={5}
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  {errors.rating && <span role="alert" className="error-message">{errors.rating.message}</span>}

                  <label htmlFor="comment">Comment:</label>
                  <textarea
                    id="comment"
                    {...register("comment", { required: "Comment is required" })}
                    placeholder="Write your review here..."
                    rows={4}
                  />
                  {errors.comment && <span role="alert" className="error-message">{errors.comment.message}</span>}

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="baghub-btn-submit-review"
                    aria-busy={submittingReview}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </section>
            </section>
          </div>
        ) : (
          <div className="baghub-loading">Loading product details...</div>
        )}
      </main>
    </>
  );
};

export default Detail;
