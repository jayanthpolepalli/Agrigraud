import { motion } from "framer-motion";

const featureIcons = {
  market: "📊",
  crop: "🌾",
  weather: "🌤️",
};

export default function Features({ text, featuresText }) {
  const features = Object.entries(text);

  return (
    <section className="features">
      {features.map(([key, item], index) => (
        <motion.div
          key={index}
          className="feature-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          whileHover={{ scale: 1.03 }}
        >
          <span className="feature-icon">{featureIcons[key]}</span>
          <h3>{item}</h3>
          <p>{featuresText.smartService}</p>
          <span className="cta">{featuresText.explore}</span>
        </motion.div>
      ))}
    </section>
  );
}
