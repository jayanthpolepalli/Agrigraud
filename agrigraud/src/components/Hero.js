import TypingText from "./TypingText";
import LiveWeather from "./LiveWeather";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero({ content }) {
  return (
    <section className="hero">
      <div className="hero-left">
        <TypingText text={content.quote} />
        <p className="subtitle">{content.subtitle}</p>
        <div className="hero-buttons">
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>{content.hero.getStarted}</Link>
          </motion.button>
          <motion.button
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/marketplace" style={{ textDecoration: "none" }}>{content.hero.learnMore}</Link>
          </motion.button>
        </div>
      </div>
      <div className="hero-right">
        <LiveWeather />
      </div>
    </section>
  );
}
