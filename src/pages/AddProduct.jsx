import React, { useState } from "react";
import axios from "axios";
import "./AddProduct.css";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", imageFile);

      Object.entries(product).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await axios.post(
        `${process.env.REACT_BASE_URL}/products/addproduct`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product Added Successfully!");
      console.log(response.data);

      setProduct({
        name: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
      });
      setImageFile(null);
      e.target.reset();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-card">
        <div className="add-product-header">
          <div className="add-product-icon">📦</div>
          <div>
            <h2>Add Product</h2>
            <p>Fill in the details below to list a new item in your inventory</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="e.g. Wireless Mouse"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Short description of the product"
              rows={3}
              value={product.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <div className="input-with-prefix">
                <span className="prefix">$</span>
                <input
                  id="price"
                  type="number"
                  name="price"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={product.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                name="quantity"
                placeholder="0"
                min="0"
                value={product.quantity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              type="text"
              name="category"
              placeholder="e.g. Electronics"
              value={product.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            <input
              id="image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Adding..." : "+ Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;