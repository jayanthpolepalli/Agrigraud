import React, { useState } from "react";
import { motion } from "framer-motion";

const pesticidesData = [
  {
    id: 1,
    name: "Imidacloprid",
    crop: "Rice",
    pestType: "Brown Planthopper, Whitefly",
    effect: "Systemic insecticide - disrupts nervous system, causes paralysis and death",
    activeIngredient: "Imidacloprid 17.8% SL"
  },
  {
    id: 2,
    name: "Chlorpyrifos",
    crop: "Cotton",
    pestType: "Bollworm, Aphids",
    effect: "Contact and stomach poison - inhibits acetylcholinesterase",
    activeIngredient: "Chlorpyrifos 20% EC"
  },
  {
    id: 3,
    name: "Carbendazim",
    crop: "Wheat",
    pestType: "Rust, Powdery Mildew",
    effect: "Systemic fungicide - inhibits fungal cell division",
    activeIngredient: "Carbendazim 50% WP"
  },
  {
    id: 4,
    name: "Mancozeb",
    crop: "Potato",
    pestType: "Late Blight, Early Blight",
    effect: "Multi-site fungicide - protects plant surface",
    activeIngredient: "Mancozeb 75% WP"
  },
  {
    id: 5,
    name: "Propiconazole",
    crop: "Sugarcane",
    pestType: "Red Rot, Smut",
    effect: "Systemic fungicide - inhibits ergosterol synthesis",
    activeIngredient: "Propiconazole 25% EC"
  },
  {
    id: 6,
    name: "Cypermethrin",
    crop: "Vegetables",
    pestType: "Fruit Borers, Caterpillars",
    effect: "Contact insecticide - fast knockdown effect",
    activeIngredient: "Cypermethrin 25% EC"
  },
  {
    id: 7,
    name: "Fipronil",
    crop: "Groundnut",
    pestType: "Termites, Pod Borers",
    effect: "Soil insecticide - disrupts GABA receptors",
    activeIngredient: "Fipronil 5% SC"
  },
  {
    id: 8,
    name: "Carbofuran",
    crop: "Maize",
    pestType: "Stem Borers, Rootworms",
    effect: "Systemic carbamate - reversible cholinesterase inhibitor",
    activeIngredient: "Carbofuran 3% CG"
  },
  {
    id: 9,
    name: "Monocrotophos",
    crop: "Tomato",
    pestType: "Fruit Borer, Leaf Miners",
    effect: "Systemic insecticide - broad spectrum control",
    activeIngredient: "Monocrotophos 36% SL"
  },
  {
    id: 10,
    name: "Azoxystrobin",
    crop: "Apple",
    pestType: "Scab, Powdery Mildew",
    effect: "Systemic fungicide - inhibits mitochondrial respiration",
    activeIngredient: "Azoxystrobin 23% SC"
  },
  {
    id: 11,
    name: "Bordeaux Mixture",
    crop: "Grapes",
    pestType: "Downy Mildew, Anthracnose",
    effect: "Protective fungicide - copper based",
    activeIngredient: "Copper Sulphate + Lime"
  },
  {
    id: 12,
    name: "Neem Oil",
    crop: "Pulses",
    pestType: "Aphids, Jassids, Thrips",
    effect: "Natural insecticide - antifeedant and growth regulator",
    activeIngredient: "Azadirachtin 0.03%"
  },
  {
    id: 13,
    name: "Thiamethoxam",
    crop: "Tea",
    pestType: "Tea Mosquito Bug, Thrips",
    effect: "Systemic insecticide - nicotinic acetylcholine receptor agonist",
    activeIngredient: "Thiamethoxam 25% WG"
  },
  {
    id: 14,
    name: "Metalaxyl",
    crop: "Sunflower",
    pestType: "Downy Mildew",
    effect: "Systemic fungicide - inhibits protein synthesis in fungi",
    activeIngredient: "Metalaxyl 35% WS"
  },
  {
    id: 15,
    name: "Lambda Cyhalothrin",
    crop: "Mustard",
    pestType: "Aphids, Painted Bug",
    effect: "Synthetic pyrethroid - contact and stomach action",
    activeIngredient: "Lambda Cyhalothrin 5% EC"
  },
  {
    id: 16,
    name: "Tebuconazole",
    crop: "Soybean",
    pestType: "Rust, Powdery Mildew",
    effect: "Triazole fungicide - ergosterol biosynthesis inhibitor",
    activeIngredient: "Tebuconazole 25% WG"
  },
  {
    id: 17,
    name: "Diazinon",
    crop: "Onion",
    pestType: "Thrips, Maggot",
    effect: "Broad spectrum organophosphate - contact and stomach poison",
    activeIngredient: "Diazinon 10% EC"
  },
  {
    id: 18,
    name: "Tricyclazole",
    crop: "Coffee",
    pestType: "Coffee Leaf Rust",
    effect: "Systemic fungicide - inhibits melanin biosynthesis",
    activeIngredient: "Tricyclazole 75% WP"
  },
  {
    id: 19,
    name: "Spinosad",
    crop: "Chilli",
    pestType: "Fruit Borer, Thrips",
    effect: "Naturalyte insecticide - activates nicotinic receptors",
    activeIngredient: "Spinosad 48% SC"
  },
  {
    id: 20,
    name: "Hexaconazole",
    crop: "Pomegranate",
    pestType: "Blight, Fruit Rot",
    effect: "Triazole fungicide - prevents fungal growth",
    activeIngredient: "Hexaconazole 5% SC"
  }
];

export default function PesticidePage({ content }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPesticides = pesticidesData.filter((pesticide) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      pesticide.name.toLowerCase().includes(searchLower) ||
      pesticide.crop.toLowerCase().includes(searchLower) ||
      pesticide.pestType.toLowerCase().includes(searchLower) ||
      pesticide.effect.toLowerCase().includes(searchLower) ||
      pesticide.activeIngredient.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="pesticide-page">
      <div className="pesticide-header">
        <h1>{content?.pesticide?.title || "Pesticide Guide"}</h1>
        <p>{content?.pesticide?.subtitle || "Find the right pesticide for your crops"}</p>
      </div>

      <div className="pesticide-search">
        <input
          type="text"
          placeholder={content?.pesticide?.searchPlaceholder || "Search by pesticide name, crop, or pest..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="pesticide-grid">
        {filteredPesticides.length > 0 ? (
          filteredPesticides.map((pesticide) => (
            <motion.div
              key={pesticide.id}
              className="pesticide-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="pesticide-icon">🧪</div>
              <h3>{pesticide.name}</h3>
              
              <div className="pesticide-details">
                <div className="detail-row">
                  <span className="label">{content?.pesticide?.crop || "Crop"}:</span>
                  <span className="value">{pesticide.crop}</span>
                </div>
                <div className="detail-row">
                  <span className="label">{content?.pesticide?.pestType || "Pest Type"}:</span>
                  <span className="value">{pesticide.pestType}</span>
                </div>
                <div className="detail-row">
                  <span className="label">{content?.pesticide?.effect || "Effect"}:</span>
                  <span className="value">{pesticide.effect}</span>
                </div>
                <div className="detail-row">
                  <span className="label">{content?.pesticide?.activeIngredient || "Active Ingredient"}:</span>
                  <span className="value">{pesticide.activeIngredient}</span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="no-results">
            <p>{content?.pesticide?.noResults || "No pesticides found matching"} "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
