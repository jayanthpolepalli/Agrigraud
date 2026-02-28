import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Signup({ content }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "farmer",
  });
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
          <h3>{content.signup.createAccount}</h3>
          <p>{content.signup.joinText}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{content.signup.fullName}</label>
            <input
              type="text"
              placeholder={content.signup.namePlaceholder}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{content.signup.email}</label>
            <input
              type="email"
              placeholder={content.signup.emailPlaceholder}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{content.signup.phone}</label>
            <input
              type="tel"
              placeholder={content.signup.phonePlaceholder}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{content.signup.iAmA}</label>
            <select
              value={formData.userType}
              onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
            >
              <option value="farmer">{content.signup.farmer}</option>
              <option value="buyer">{content.signup.buyer}</option>
              <option value="seller">{content.signup.seller}</option>
              <option value="expert">{content.signup.expert}</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{content.signup.password}</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>{content.signup.confirmPassword}</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-options">
            <label>
              <input type="checkbox" required /> {content.signup.termsText}{" "}
              <a href="#" className="auth-link">{content.signup.termsOfService}</a> {content.signup.and}{" "}
              <a href="#" className="auth-link">{content.signup.privacyPolicy}</a>
            </label>
          </div>

          <motion.button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", marginTop: "16px" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? content.signup.creating : content.signup.createAccountBtn}
          </motion.button>
        </form>

        <div className="auth-footer">
          <p>
            {content.signup.hasAccount}{" "}
            <Link to="/login" className="auth-link">{content.signup.signIn}</Link>
          </p>
        </div>

        <div className="social-login">
          <p>{content.signup.orContinue}</p>
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
