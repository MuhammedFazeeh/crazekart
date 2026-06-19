import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "100px", margin: 0 }}>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>

      <Link
        to="/"
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          background: "#000",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "8px",
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;