import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [confirmingDeleteAll, setConfirmingDeleteAll] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setError(false);
      const response = await axios.get(
        "http://localhost:5000/api/products/getAllProducts"
      );
      setProducts(response.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const token = localStorage.getItem("token");

  // ---------- Delete flow ----------
  const requestDelete = (product) => {
    setProductToDelete(product);
  };

  const cancelDelete = () => {
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const productId = productToDelete._id;

    try {
      setDeletingId(productId);
      await axios.delete(
        `http://localhost:5000/api/products/deleteProduct/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Couldn't delete the product. Try again.");
    } finally {
      setDeletingId(null);
      setProductToDelete(null);
    }
  };

  // ---------- Delete All flow ----------
  const requestDeleteAll = () => {
    setConfirmingDeleteAll(true);
  };

  const cancelDeleteAll = () => {
    setConfirmingDeleteAll(false);
  };

  const confirmDeleteAll = async () => {
    try {
      setDeletingAll(true);
      await axios.delete(
        "http://localhost:5000/api/products/deleteAllProducts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts([]);
    } catch (err) {
      console.error("Error deleting all products:", err);
      alert("Couldn't delete all products. Try again.");
    } finally {
      setDeletingAll(false);
      setConfirmingDeleteAll(false);
    }
  };

  // ---------- Edit flow ----------
  const requestEdit = (product) => {
    setProductToEdit(product);
    setEditForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      quantity: product.quantity ?? "",
      category: product.category || "",
    });
  };

  const cancelEdit = () => {
    setProductToEdit(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const confirmEdit = async (e) => {
    e.preventDefault();
    if (!productToEdit) return;

    try {
      setSavingEdit(true);
      const response = await axios.put(
        `http://localhost:5000/api/products/updateProduct/${productToEdit._id}`,
        {
          name: editForm.name,
          description: editForm.description,
          price: Number(editForm.price),
          quantity: Number(editForm.quantity),
          category: editForm.category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedProduct = response.data.product || {
        ...productToEdit,
        ...editForm,
        price: Number(editForm.price),
        quantity: Number(editForm.quantity),
      };

      setProducts((prev) =>
        prev.map((p) => (p._id === productToEdit._id ? updatedProduct : p))
      );
      setProductToEdit(null);
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Couldn't save changes. Try again.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Skeleton loading state — mirrors the real grid so the page doesn't jump
  if (loading) {
    return (
      <div className="container">
        <div className="page-header">
          <h1 className="title">All Products</h1>
          <p className="subtitle">Browse our full catalogue</p>
        </div>
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="product-card skeleton" key={i}>
              <div className="skeleton-image" />
              <div className="product-info">
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line skeleton-text" />
                <div className="skeleton-line skeleton-price" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="state-message">
          <h2>Couldn't load products</h2>
          <p>Check that the server is running, then try again.</p>
          <button className="btn btn-outline" onClick={fetchProducts}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="container">
        <div className="state-message">
          <h2>No products yet</h2>
          <p>New arrivals will show up here as soon as they're added.</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="container">
      <div className="page-header">
        <h1 className="title">All Products</h1>
        <p className="subtitle">
          {products.length} item{products.length !== 1 ? "s" : ""} in the
          catalogue
        </p>
        <button className="btn btn-delete-all" onClick={requestDeleteAll}>
          Delete All
        </button>
      </div>

      <div className="product-grid">
        {products.map((product) => {
          const outOfStock = Number(product.quantity) <= 0;
          const lowStock =
            !outOfStock && Number(product.quantity) <= 5;
          const isDeleting = deletingId === product._id;

          return (
            <div className="product-card" key={product._id}
            onClick={()=> navigate(`/Products/${product._id}`)} style={{cursor:"pointer"}} >        
                <div className="product-image-wrap">
                <img
                  src={
                    product.image ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={product.name}
                  className="product-image"
                  loading="lazy"
                />
                <span className="category-pill">{product.category}</span>
                {outOfStock && (
                  <div className="stock-overlay">Out of stock</div>
                )}
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>

                <div className="price-row">
                  <span className="price">
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
                </div>

                <button className="btn" disabled={outOfStock}>
                  {outOfStock ? "Notify me" : "Add to cart"}
                </button>

                <div className="admin-actions">
                  <button
                    className="btn btn-edit"
                     onClick={(e) => {
      e.stopPropagation();
      requestEdit(product);
    }}
    >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                     onClick={(e) => {
      e.stopPropagation();
      requestDelete(product);
    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete confirmation modal */}
      {productToDelete && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Delete product?</h3>
            <p className="modal-text">
              This will permanently remove{" "}
              <strong>{productToDelete.name}</strong> from the catalogue.
              This can't be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-cancel"
                onClick={cancelDelete}
                disabled={deletingId === productToDelete._id}
              >
                Cancel
              </button>
              <button
                className="btn btn-confirm-delete"
                onClick={confirmDelete}
                disabled={deletingId === productToDelete._id}
              >
                {deletingId === productToDelete._id ? "Deleting…" : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete all confirmation modal */}
      {confirmingDeleteAll && (
        <div className="modal-overlay" onClick={cancelDeleteAll}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Delete all products?</h3>
            <p className="modal-text">
              This will permanently remove <strong>all {products.length}</strong>{" "}
              products from the catalogue. This can't be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-cancel"
                onClick={cancelDeleteAll}
                disabled={deletingAll}
              >
                Cancel
              </button>
              <button
                className="btn btn-confirm-delete"
                onClick={confirmDeleteAll}
                disabled={deletingAll}
              >
                {deletingAll ? "Deleting…" : "Delete All"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {productToEdit && (
        <div className="modal-overlay" onClick={cancelEdit}>
          <div
            className="modal-box modal-box-form"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="modal-title">Edit product</h3>
            <form onSubmit={confirmEdit}>
              <label className="form-label">
                Name
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="form-input"
                  required
                />
              </label>

              <label className="form-label">
                Description
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="form-input form-textarea"
                  rows={3}
                  required
                />
              </label>

              <div className="form-row">
                <label className="form-label">
                  Price (₹)
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    className="form-input"
                    min="0"
                    step="0.01"
                    required
                  />
                </label>

                <label className="form-label">
                  Quantity
                  <input
                    type="number"
                    name="quantity"
                    value={editForm.quantity}
                    onChange={handleEditChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </label>
              </div>

              <label className="form-label">
                Category
                <input
                  type="text"
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="form-input"
                  required
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={cancelEdit}
                  disabled={savingEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-confirm-edit"
                  disabled={savingEdit}
                >
                  {savingEdit ? "Saving…" : "OK"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>

  );
}

export default Products;