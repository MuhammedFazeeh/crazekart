import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setProfileOpen(false);
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <h1>CrazeKart.co.in</h1>
        </Link>
      </div>

      {/* Normal Navigation */}
      <div className="navbar-center">
        <Link
                  to="/products"
                  className="dropdown-item"
                  onClick={() => setProfileOpen(false)}
                >
                  Products
                </Link>
        <Link
                  to="/addproduct"
                  className="dropdown-item"
                  onClick={() => setProfileOpen(false)}
                >
                  AddProduct
                </Link>
      </div>

      {/* Avatar + Dropdown */}
      <div className="profile-menu" ref={profileRef}>
        <button
          className="profile-icon-btn"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          👤
        </button>

        {profileOpen && (
          <div className="profile-dropdown">
            {isLoggedIn ? (
              <>
                

                

                <button
                  className="dropdown-item logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="dropdown-item"
                  onClick={() => setProfileOpen(false)}
                >
                  Sign Up
                </Link>

                <Link
                  to="/signin"
                  className="dropdown-item"
                  onClick={() => setProfileOpen(false)}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;