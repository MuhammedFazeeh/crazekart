function Products() {
  const products = [
    {
      id: 1,
      name: "Laptop",
      price: "₹50,000",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    },
    {
      id: 2,
      name: "Smartphone",
      price: "₹25,000",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    },
    {
      id: 3,
      name: "Headphones",
      price: "₹2,000",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    },
  ];

  return (
    <section className="products">
      <h2>Featured Products</h2>

      <div className="product-grid">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;