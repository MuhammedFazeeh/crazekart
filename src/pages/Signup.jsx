import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

// Configure this once — point it at your backend signup endpoint
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Where to send the user after a successful signup, and how long to
// show the success message before redirecting (ms).
const POST_SIGNUP_REDIRECT = "/";
const REDIRECT_DELAY_MS = 1500;

export default function SignupPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Auto-redirect once signup succeeds
  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => {
      navigate(POST_SIGNUP_REDIRECT);
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
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
    if (form.password.length < 8) next.password = "Use at least 8 characters.";
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
      const nameParts = form.name.trim().split(" ");
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" "),
        email: form.email,
        password: form.password,
      });

      console.log(response);

      // Optional: store token / user data returned by the API
      localStorage.setItem("token", response.data.token);
      navigate('/products');

      setSubmitted(true);
    } catch (err) {
      if (err.response) {
        // Server responded with an error status (e.g. 400, 409)
        const message =
          err.response.data?.message ||
          "Something went wrong. Please try again.";

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

  const passwordStrength = Math.min(
    4,
    [
      form.password.length >= 8,
      /[A-Z]/.test(form.password),
      /[0-9]/.test(form.password),
      /[^A-Za-z0-9]/.test(form.password),
    ].filter(Boolean).length
  );

  const strengthClass =
    passwordStrength <= 1 ? "weak" : passwordStrength <= 2 ? "medium" : "strong";

  return (
    <div className="signup-page">
      {/* Left panel — brand side */}
      <div className="signup-brand">
        <div className="signup-brand-glow" />
        <div className="signup-brand-top">
          <div className="signup-logo">◆</div>
          <span className="signup-logo-text">Crazekart.co.in</span>
        </div>

        <div className="signup-brand-mid">
          <p className="signup-headline">Build something worth signing in for.</p>
          <p className="signup-subtext">
            Create an account to save your work, sync across devices, and pick up
            right where you left off.
          </p>
        </div>

        <div className="signup-brand-bottom">
          <span>Trusted by independent makers</span>
          <span className="signup-divider" />
          <span>est. 2024</span>
        </div>
      </div>

      {/* Right panel — form side */}
      <div className="signup-form-wrap">
        <div className="signup-form-inner">
          <div className="signup-logo-mobile">
            <div className="signup-logo">◆</div>
            <span className="signup-logo-text dark">CrazeKart</span>
          </div>

          {submitted ? (
            <div className="signup-success">
              <div className="signup-success-icon">✓</div>
              <h1 className="signup-title">You're in.</h1>
              <p className="signup-success-text">
                We've sent a confirmation link to{" "}
                <span className="signup-success-email">{form.email}</span>. Follow it
                to activate your account.
              </p>
              <p className="signup-success-text">Redirecting you now…</p>
            </div>
          ) : (
            <>
              <h1 className="signup-title">Create your account</h1>
              <p className="signup-switch">
                Already have one? <a href="/signin">Sign in instead</a>
              </p>

              {serverError && (
                <div className="form-error-banner">{serverError}</div>
              )}

              <form onSubmit={handleSubmit} className="signup-form" noValidate>
                <div className="form-group">
                  <label htmlFor="name">Full name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jordan Avery"
                    className={errors.name ? "error" : ""}
                    disabled={loading}
                  />
                  {errors.name && <p className="field-error">{errors.name}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jordan@example.com"
                    className={errors.email ? "error" : ""}
                    disabled={loading}
                  />
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-field">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
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

                  {form.password && (
                    <div className="strength-bar">
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className={`strength-segment ${
                            i < passwordStrength ? strengthClass : ""
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  {errors.password && (
                    <p className="field-error">{errors.password}</p>
                  )}
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Creating account..." : "Create account"}{" "}
                  {!loading && <span aria-hidden="true">→</span>}
                </button>

                <p className="terms-text">
                  By signing up, you agree to our <a href="#">Terms</a> and{" "}
                  <a href="#">Privacy Policy</a>.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}