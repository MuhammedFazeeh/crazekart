import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import About from "./components/about";
import Contact from "./components/contact";
import Signup from "./pages/Signup";
import Signin from "./pages/signin";
import "./App.css";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Home from "./pages/Home";
import Productdetails from "./pages/Productdetails";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";





function App() {
  

  return (
    <>
    <Navbar />
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/signin" element={<Signin />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />

  {/* Public Routes */}
  <Route path="/products" element={
      <ProtectedRoute>
        <Products />
      </ProtectedRoute>
    } />
  <Route path="/Products/:id"  element={
      <ProtectedRoute>
        <Productdetails />
      </ProtectedRoute>
    } />

  {/* Protected Routes */}
  <Route
    path="/addproduct"
    element={
      <ProtectedRoute>
        <AddProduct />
      </ProtectedRoute>
    }
  />

  <Route path="*" element={<NotFound />} />
</Routes>
    </>
  );
}

export default App;