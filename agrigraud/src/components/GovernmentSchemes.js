import { useState } from "react";
import { motion } from "framer-motion";

// Government Schemes Data
const governmentSchemes = [
  {
    id: 1,
    name: "PM-KISAN",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    description: "Direct income support of ₹6000 per year to farmer families",
    benefits: "₹6000 per year in 3 installments",
    website: "https://pmkisan.gov.in",
    icon: "💰",
    eligibility: {
      maxLandSize: 2, // hectares
      maxIncome: 15000, // annual income limit (approx)
      farmerTypes: ["small", "marginal", "large"],
      states: null // All states
    }
  },
  {
    id: 2,
    name: "Kisan Credit Card",
    fullName: "Kisan Credit Card Scheme",
    description: "Easy credit for agricultural needs at low interest rates",
    benefits: "Credit up to ₹3 lakh at 4% interest",
    website: "https://www.pmjdy.gov.in/kcc",
    icon: "💳",
    eligibility: {
      maxLandSize: null,
      maxIncome: null,
      farmerTypes: ["small", "marginal", "large", "tenant", "share"],
      states: null
    }
  },
  {
    id: 3,
    name: "PM-Fasal Bima Yojana",
    fullName: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme to protect farmers from crop loss",
    benefits: "Low premium (2% for Kharif, 1.5% for Rabi)",
    website: "https://pmfby.gov.in",
    icon: "🌾",
    eligibility: {
      maxLandSize: null,
      maxIncome: null,
      farmerTypes: ["small", "marginal", "large", "tenant", "share"],
      states: null
    }
  },
  {
    id: 4,
    name: "PKVY",
    fullName: "Paramparagat Krishi Vikas Yojana",
    description: "Promotion of organic farming in the country",
    benefits: "₹50000 per hectare for 3 years",
    website: "https://pkvymis.gov.in",
    icon: "🌱",
    eligibility: {
      maxLandSize: null,
      maxIncome: null,
      farmerTypes: ["small", "marginal", "large", "group"],
      states: null
    }
  },
  {
    id: 5,
    name: "PM-AASHA",
    fullName: "Pradhan Mantri Annadata Aay SanraksHan Abhiyan",
    description: "Minimum Support Price for farmers produce",
    benefits: "MSP guarantee for 22 crops",
    website: "https://pmaasha.gov.in",
    icon: "📦",
    eligibility: {
      maxLandSize: null,
      maxIncome: null,
      farmerTypes: ["small", "marginal", "large", "tenant", "share"],
      states: null
    }
  }
];

// Indian States
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir"
];

// Farmer Types
const farmerTypes = [
  { value: "small", label: "Small Farmer (1-2 ha)" },
  { value: "marginal", label: "Marginal Farmer (<1 ha)" },
  { value: "large", label: "Large Farmer (>2 ha)" },
  { value: "tenant", label: "Tenant Farmer" },
  { value: "share", label: "Share Cropper" },
  { value: "group", label: "Farmer Group / FPO" }
];

export default function GovernmentSchemes({ content }) {
  const [formData, setFormData] = useState({
    landSize: "",
    annualIncome: "",
    state: "",
    farmerType: ""
  });
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showAllSchemes, setShowAllSchemes] = useState(true);

  // Check if farmer is eligible for a scheme
  const checkEligibility = (scheme) => {
    const { eligibility } = scheme;
    const landSize = parseFloat(formData.landSize) || 0;
    const annualIncome = parseFloat(formData.annualIncome) || 0;

    // Check land size eligibility
    if (eligibility.maxLandSize && landSize > eligibility.maxLandSize) {
      return false;
    }

    // Check income eligibility
    if (eligibility.maxIncome && annualIncome > eligibility.maxIncome) {
      return false;
    }

    // Check farmer type eligibility
    if (eligibility.farmerTypes && !eligibility.farmerTypes.includes(formData.farmerType)) {
      return false;
    }

    // Check state eligibility (null means all states)
    if (eligibility.states && !eligibility.states.includes(formData.state)) {
      return false;
    }

    return true;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const eligible = governmentSchemes.filter(scheme => checkEligibility(scheme));
    setEligibleSchemes(eligible);
    setShowResults(true);
    setShowAllSchemes(false);
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      landSize: "",
      annualIncome: "",
      state: "",
      farmerType: ""
    });
    setShowResults(false);
    setShowAllSchemes(true);
  };

  return (
    <section className="schemes-section">
      <div className="schemes-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="schemes-title">
            {content?.schemes?.title || "Government Schemes for Farmers"}
          </h2>
          <p className="schemes-subtitle">
            {content?.schemes?.subtitle || "Check your eligibility for government welfare schemes"}
          </p>
        </motion.div>

        {/* Eligibility Form */}
        <motion.div
          className="schemes-form-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="schemes-form">
            <div className="form-grid">
              <div className="form-group">
                <label>{content?.schemes?.landSize || "Land Size (hectares)"}</label>
                <input
                  type="number"
                  name="landSize"
                  value={formData.landSize}
                  onChange={handleChange}
                  placeholder={content?.schemes?.landPlaceholder || "e.g., 1.5"}
                  step="0.1"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>{content?.schemes?.annualIncome || "Annual Income (₹)"}</label>
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  placeholder={content?.schemes?.incomePlaceholder || "e.g., 100000"}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>{content?.schemes?.state || "State"}</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">{content?.schemes?.selectState || "Select your state"}</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{content?.schemes?.farmerType || "Farmer Type"}</label>
                <select
                  name="farmerType"
                  value={formData.farmerType}
                  onChange={handleChange}
                  required
                >
                  <option value="">{content?.schemes?.selectFarmerType || "Select farmer type"}</option>
                  {farmerTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-check-eligibility">
                {content?.schemes?.checkEligibility || "Check Eligibility"}
              </button>
              {showResults && (
                <button type="button" className="btn-reset" onClick={handleReset}>
                  {content?.schemes?.showAll || "Show All Schemes"}
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Results Section */}
        {showResults && (
          <motion.div
            className="eligible-schemes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="results-title">
              {content?.schemes?.eligibleSchemes || "Your Eligible Schemes"}
              <span className="scheme-count">({eligibleSchemes.length})</span>
            </h3>
            {eligibleSchemes.length > 0 ? (
              <div className="schemes-grid">
                {eligibleSchemes.map((scheme, index) => (
                  <motion.div
                    key={scheme.id}
                    className="scheme-card eligible"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="scheme-icon">{scheme.icon}</div>
                    <div className="scheme-content">
                      <h4>{scheme.name}</h4>
                      <p className="scheme-fullname">{scheme.fullName}</p>
                      <p className="scheme-description">{scheme.description}</p>
                      <div className="scheme-benefits">
                        <strong>{content?.schemes?.benefits || "Benefits:"}</strong> {scheme.benefits}
                      </div>
                      <a
                        href={scheme.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="scheme-link"
                      >
                        {content?.schemes?.learnMore || "Learn More"} →
                      </a>
                    </div>
                    <div className="eligible-badge">
                      ✓ {content?.schemes?.eligible || "Eligible"}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="no-schemes">
                <p>{content?.schemes?.noSchemes || "No schemes match your criteria. Try adjusting your details or check with your local agricultural department."}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* All Schemes (shown initially) */}
        {showAllSchemes && (
          <motion.div
            className="all-schemes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="results-title">
              {content?.schemes?.allSchemes || "All Government Schemes"}
            </h3>
            <div className="schemes-grid">
              {governmentSchemes.map((scheme, index) => (
                <motion.div
                  key={scheme.id}
                  className="scheme-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="scheme-icon">{scheme.icon}</div>
                  <div className="scheme-content">
                    <h4>{scheme.name}</h4>
                    <p className="scheme-fullname">{scheme.fullName}</p>
                    <p className="scheme-description">{scheme.description}</p>
                    <div className="scheme-benefits">
                      <strong>{content?.schemes?.benefits || "Benefits:"}</strong> {scheme.benefits}
                    </div>
                    <a
                      href={scheme.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="scheme-link"
                    >
                      {content?.schemes?.learnMore || "Learn More"} →
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
