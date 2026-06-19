import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Productdetails.css";

function Productdetails() {
  const { id } = useParams();
  console.log("Product ID from URL:", id);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await axios.get(
        `${process.env.REACT_BASE_URL}/products/getProduct/${id}`
      );
      // Handles either { product: {...} } or the product object directly
      setProduct(response.data.product || response.data);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="details-container">
        <div className="details-skeleton">
          <div className="skeleton-image-large" />
          <div className="details-skeleton-info">
            <div className="skeleton-line skeleton-title-large" />
            <div className="skeleton-line skeleton-text" />
            <div className="skeleton-line skeleton-text" />
            <div className="skeleton-line skeleton-price-large" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="details-container">
        <div className="state-message">
          <h2>Couldn't load this product</h2>
          <p>It may have been removed, or the server isn't reachable.</p>
          <div className="details-actions-row">
            <button className="btn btn-outline" onClick={fetchProduct}>
              Retry
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/products")}>
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const outOfStock = Number(product.quantity) <= 0;
  const lowStock = !outOfStock && Number(product.quantity) <= 5;

  return (
    <div className="details-container">
      <button className="back-link" onClick={() => navigate("/products")}>
        ← Back to Products
      </button>

      <div className="details-card">
        <div className="details-image-wrap">
          <img
            src={
              product.image ||
              "https://via.placeholder.com/500x400?text=No+Image"
            }
            alt={product.name}
            className="details-image"
          />
          <span className="category-pill">{product.category}</span>
          {outOfStock && <div className="stock-overlay">Out of stock</div>}
        </div>

        <div className="details-info">
          <h1 className="details-name">{product.name}</h1>

          <div className="price-row">
            <span className="price price-large">
              <span className="rupee">₹</span>
              {Number(product.price).toLocaleString("en-IN")}
            </span>
            {lowStock && (
              <span className="stock-badge low">
                Only {product.quantity} left
              </span>
            )}
            {!outOfStock && !lowStock && (
              <span className="stock-badge in">In stock</span>
            )}
            {outOfStock && <span className="stock-badge out">Out of stock</span>}
          </div>

          <p className="details-description">{product.description}</p>

          <div className="details-meta">
            <div className="meta-row">
              <span className="meta-label">Category</span>
              <span className="meta-value">{product.category}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Quantity available</span>
              <span className="meta-value">{product.quantity}</span>
            </div>
            {product._id && (
              <div className="meta-row">
                <span className="meta-label">Product ID</span>
                <span className="meta-value meta-id">{product._id}</span>
              </div>
            )}
          </div>

          <button className="btn btn-large" disabled={outOfStock}>
            {outOfStock ? "Notify me" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Productdetails;