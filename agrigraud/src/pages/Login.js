import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Login({ content }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <h2 className="logo">AgriGraud</h2>
          <h3>{content.login.welcomeBack}</h3>
          <p>{content.login.signInText}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{content.login.email}</label>
            <input
              type="email"
              placeholder={content.login.emailPlaceholder}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{content.login.password}</label>
            <input
              type="password"
              placeholder={content.login.passwordPlaceholder}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="form-options">
            <label>
              <input type="checkbox" /> {content.login.rememberMe}
            </label>
            <a href="#" className="forgot-link">{content.login.forgotPassword}</a>
          </div>

          <motion.button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", marginTop: "16px" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? content.login.signingIn : content.login.signIn}
          </motion.button>
        </form>

        <div className="auth-footer">
          <p>
            {content.login.noAccount}{" "}
            <Link to="/signup" className="auth-link">{content.login.signUp}</Link>
          </p>
        </div>

        <div className="social-login">
          <p>{content.login.orContinue}</p>
          <div className="social-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔵 Google
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📘 Facebook
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
