    import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className="navbar">
      <h1>CrazeKart.co.in</h1>

      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#products">Products</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

<Link to="/signup">Sign Up</Link>
<Link to="/signin">Sign In</Link>
    </nav>
  );
}

export default Navbar;