import { useState } from "react";
import { motion } from "framer-motion";

const marketData = [
  { crop: "Paddy", market: "Madhya Pradesh", price: "₹2,200/quintal", change: "+3.2%" },
  { crop: "Wheat", market: "Punjab", price: "₹2,150/quintal", change: "+1.8%" },
  { crop: "Cotton", market: "Gujarat", price: "₹6,500/quintal", change: "-2.1%" },
  { crop: "Soybean", market: "Maharashtra", price: "₹4,800/quintal", change: "+5.4%" },
  { crop: "Maize", market: "Karnataka", price: "₹1,900/quintal", change: "+0.5%" },
  { crop: "Groundnut", market: "Telangana", price: "₹5,200/quintal", change: "+2.3%" },
];

export default function MarketSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(null);

  const filteredData = marketData.filter((item) =>
    item.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="interactive-section" style={{ background: "#fff" }}>
      <h2 className="section-title">📈 Live Market Prices</h2>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <input
            type="text"
            placeholder="Search for crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "16px 24px",
              fontSize: "1rem",
              border: "2px solid #e5e7eb",
              borderRadius: "30px",
              outline: "none",
              marginBottom: "32px",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#15803d";
              e.target.style.boxShadow = "0 0 0 3px rgba(21, 128, 61, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.boxShadow = "none";
            }}
          />
        </motion.div>

        <div style={{ display: "grid", gap: "16px" }}>
          {filteredData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedCrop(item)}
              style={{
                background: "#fff",
                padding: "20px 24px",
                borderRadius: "16px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                border: selectedCrop === item ? "2px solid #15803d" : "2px solid transparent",
              }}
            >
              <div>
                <h4 style={{ color: "#111827", marginBottom: "4px" }}>{item.crop}</h4>
                <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>{item.market}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "1.25rem", fontWeight: "700", color: "#15803d" }}>
                  {item.price}
                </p>
                <span
                  style={{
                    color: item.change.startsWith("+") ? "#15803d" : "#dc2626",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                  }}
                >
                  {item.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <p style={{ textAlign: "center", color: "#6b7280", padding: "40px" }}>
            No crops found matching "{searchTerm}"
          </p>
        )}
      </div>
    </section>
  );
}
