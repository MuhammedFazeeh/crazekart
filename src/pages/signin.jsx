import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Signin.css";

// Configure this once — point it at your backend signin endpoint
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Where to send the user after a successful sign in, and how long to
// show the success message before redirecting (ms).
const POST_SIGNIN_REDIRECT = "/";
const REDIRECT_DELAY_MS = 1500;

export default function SigninPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Auto-redirect once sign in succeeds
  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => {
      navigate(POST_SIGNIN_REDIRECT);
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [submitted, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    if (serverError) setServerError("");
  };

  const validate = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    setServerError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        email: form.email,
        password: form.password,
      });

      // Optional: store token / user data returned by the API
     localStorage.setItem("token", response.data.token);
     navigate('/products');

      setSubmitted(true);
    } catch (err) {
      if (err.response) {
        // Server responded with an error status (e.g. 400, 401)
        const message =
          err.response.data?.message ||
          "Invalid email or password. Please try again.";

        // If backend returns field-specific errors, map them
        if (err.response.data?.errors) {
          setErrors(err.response.data.errors);
        } else {
          setServerError(message);
        }
      } else if (err.request) {
        // Request made but no response received
        setServerError("No response from server. Check your connection.");
      } else {
        setServerError("Unexpected error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(forgotEmail)) {
      setForgotError("Enter a valid email address.");
      return;
    }

    setForgotLoading(true);
    setForgotError("");

    try {
      await axios.post(`${API_BASE_URL}/forgot-password`, {
        email: forgotEmail,
      });
      setForgotSent(true);
    } catch (err) {
      if (err.response) {
        setForgotError(
          err.response.data?.message || "Something went wrong. Please try again."
        );
      } else if (err.request) {
        setForgotError("No response from server. Check your connection.");
      } else {
        setForgotError("Unexpected error. Please try again.");
      }
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="signin-page">
      {/* Left brand panel */}
      <div className="signin-brand">
        <div className="signin-brand-glow" />
        <div className="signin-brand-top">
          <div className="signin-logo">◆</div>
          <span className="signin-logo-text">CrazeKart</span>
        </div>

        <div className="signin-brand-mid">
          <p className="signin-headline">Welcome back. Let's pick up where you left off.</p>
          <p className="signin-subtext">
            Sign in to access your orders, saved products, and account settings.
          </p>
        </div>

        <div className="signin-brand-bottom">
          <span>CrazeKart.co.in</span>
          <span className="signin-divider" />
          <span>© 2026</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="signin-form-wrap">
        <div className="signin-form-inner">
          {/* Back to home */}
          <Link to="/" className="back-home-link">
            <span aria-hidden="true">←</span> Back to home
          </Link>

          {/* Mobile logo */}
          <div className="signin-logo-mobile">
            <div className="signin-logo">◆</div>
            <span className="signin-logo-text dark">CrazeKart</span>
          </div>

          {/* ── Forgot Password flow ── */}
          {forgotMode ? (
            forgotSent ? (
              <div className="signin-success">
                <div className="signin-success-icon">✓</div>
                <h1 className="signin-title">Check your inbox</h1>
                <p className="signin-success-text">
                  We've sent a password reset link to{" "}
                  <span className="signin-success-email">{forgotEmail}</span>.
                  Follow the link to reset your password.
                </p>
                <button
                  className="signin-back-link"
                  onClick={() => {
                    setForgotMode(false);
                    setForgotSent(false);
                    setForgotEmail("");
                  }}
                >
                  ← Back to Sign In
                </button>
              </div>
            ) : (
              <>
                <h1 className="signin-title">Forgot password?</h1>
                <p className="signin-switch">
                  Enter your account email and we'll send you a reset link.
                </p>

                {forgotError && (
                  <div className="form-error-banner">{forgotError}</div>
                )}

                <form onSubmit={handleForgot} className="signin-form" noValidate>
                  <div className="form-group">
                    <label htmlFor="forgot-email">Email address</label>
                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        if (forgotError) setForgotError("");
                      }}
                      placeholder="you@example.com"
                      className={forgotError ? "error" : ""}
                      disabled={forgotLoading}
                    />
                    {forgotError && <p className="field-error">{forgotError}</p>}
                  </div>

                  <button type="submit" className="submit-btn" disabled={forgotLoading}>
                    {forgotLoading ? "Sending..." : "Send reset link"}{" "}
                    {!forgotLoading && <span aria-hidden="true">→</span>}
                  </button>

                  <button
                    type="button"
                    className="signin-back-link"
                    onClick={() => {
                      setForgotMode(false);
                      setForgotError("");
                      setForgotEmail("");
                    }}
                  >
                    ← Back to Sign In
                  </button>
                </form>
              </>
            )

          /* ── Sign In success ── */
          ) : submitted ? (
            <div className="signin-success">
              <div className="signin-success-icon">✓</div>
              <h1 className="signin-title">You're signed in!</h1>
              <p className="signin-success-text">
                Welcome back. Redirecting you to your account…
              </p>
            </div>

          /* ── Sign In form ── */
          ) : (
            <>
              <h1 className="signin-title">Sign in</h1>
              <p className="signin-switch">
                Don't have an account? <a href="/signup">Create one</a>
              </p>

              {serverError && (
                <div className="form-error-banner">{serverError}</div>
              )}

              <form onSubmit={handleSubmit} className="signin-form" noValidate>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={errors.email ? "error" : ""}
                    disabled={loading}
                  />
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <div className="password-label-row">
                    <label htmlFor="password">Password</label>
                    <button
                      type="button"
                      className="forgot-link"
                      onClick={() => setForgotMode(true)}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="password-field">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Your password"
                      className={errors.password ? "error" : ""}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="toggle-password"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && <p className="field-error">{errors.password}</p>}
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}{" "}
                  {!loading && <span aria-hidden="true">→</span>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}