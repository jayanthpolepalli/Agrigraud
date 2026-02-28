import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ setLang, content }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { name: content.navbar.home, path: "/" },
    { name: content.navbar.marketplace, path: "/marketplace" },
    { name: content.navbar.recommendations, path: "/recommendations" },
    { name: content.navbar.weather, path: "/weather" },
  ];

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <Link to="/" className="logo">AgriGraud</Link>

      <ul className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
        {navItems.map((item) => (
          <motion.li
            key={item.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={location.pathname === item.path ? "active" : ""}
          >
            <Link to={item.path} className="nav-link">{item.name}</Link>
          </motion.li>
        ))}
        <motion.li
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={location.pathname === "/login" ? "active" : ""}
        >
          <Link to="/login" className="nav-link">{content.navbar.login}</Link>
        </motion.li>
        <motion.li
          className="btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/signup" className="nav-link btn-link">{content.navbar.signUp}</Link>
        </motion.li>
      </ul>

      <div className="navbar-right">
        <select
          className="language-select"
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="en">EN</option>
          <option value="hi">HI</option>
          <option value="te">TE</option>
        </select>

        <div
          className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}
