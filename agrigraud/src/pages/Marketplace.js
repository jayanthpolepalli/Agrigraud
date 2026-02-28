import { useState, useEffect } from "react";

// Sample seller data with images
const SELLERS = [
  {
    id: 1,
    name: "Green Valley Farms",
    location: "Maharashtra, India",
    rating: 4.8,
    products: ["Organic Tomatoes", "Green Chilies", "Spinach"],
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop",
    verified: true,
    responseTime: "< 1 hour"
  },
  {
    id: 2,
    name: "Sunrise Agri Solutions",
    location: "Punjab, India",
    rating: 4.6,
    products: ["Wheat", "Rice", "Mustard Seeds"],
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
    verified: true,
    responseTime: "< 2 hours"
  },
  {
    id: 3,
    name: "Farm Fresh Direct",
    location: "Karnataka, India",
    rating: 4.9,
    products: ["Mangoes", "Bananas", "Papaya"],
    image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400&h=300&fit=crop",
    verified: true,
    responseTime: "< 30 mins"
  },
  {
    id: 4,
    name: "Organic Harvest Co.",
    location: "Tamil Nadu, India",
    rating: 4.7,
    products: ["Turmeric", "Black Pepper", "Cardamom"],
    image: "https://images.unsplash.com/photo-1595855709915-bd98974a31d2?w=400&h=300&fit=crop",
    verified: false,
    responseTime: "< 3 hours"
  },
  {
    id: 5,
    name: "Kisan Connect",
    location: "Uttar Pradesh, India",
    rating: 4.5,
    products: ["Potatoes", "Onions", "Garlic"],
    image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop",
    verified: true,
    responseTime: "< 2 hours"
  },
  {
    id: 6,
    name: "Agro India Trading",
    location: "Gujarat, India",
    rating: 4.4,
    products: ["Groundnut", "Cotton", "Castor"],
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop",
    verified: true,
    responseTime: "< 4 hours"
  },
  {
    id: 7,
    name: "Desi Farms Organic",
    location: "Rajasthan, India",
    rating: 4.8,
    products: ["Moong Beans", "Chickpeas", "Fenugreek"],
    image: "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=400&h=300&fit=crop",
    verified: true,
    responseTime: "< 1 hour"
  },
  {
    id: 8,
    name: "Coastal Growers Assoc.",
    location: "Kerala, India",
    rating: 4.6,
    products: ["Black Rice", "Coconut", "Pepper"],
    image: "https://images.unsplash.com/photo-1518133841950-ae0616e6cb30?w=400&h=300&fit=crop",
    verified: false,
    responseTime: "< 2 hours"
  }
];

// Animated Card Component
function SellerCard({ seller, index }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div 
      className={`seller-card ${isVisible ? 'visible' : ''}`}
      style={{
        transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="seller-image-container">
        <img 
          src={seller.image} 
          alt={seller.name} 
          className="seller-image"
          style={{
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.4s ease',
          }}
        />
        <div className="seller-overlay">
          <span className="view-profile">View Profile →</span>
        </div>
        {seller.verified && (
          <div className="verified-badge">✓ Verified</div>
        )}
      </div>

      {/* Seller Info */}
      <div className="seller-info">
        <div className="seller-header">
          <h3 className="seller-name">{seller.name}</h3>
          <div className="rating-container">
            <span className="star">⭐</span>
            <span className="rating">{seller.rating}</span>
          </div>
        </div>
        
        <div className="seller-location">
          📍 {seller.location}
        </div>

        <div className="response-time">
          🕐 Responds in {seller.responseTime}
        </div>

        {/* Products Tags */}
        <div className="products-section">
          <span className="products-label">Products:</span>
          <div className="products-tags">
            {seller.products.map((product, idx) => (
              <span 
                key={idx} 
                className="product-tag"
                style={{
                  animationDelay: `${idx * 0.1}s`,
                }}
              >
                {product}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="seller-actions">
          <button className="btn-contact">
            📞 Contact Seller
          </button>
          <button className="btn-products">
            View Products
          </button>
        </div>
      </div>
    </div>
  );
}

// Category Filter Component
function CategoryFilter({ categories, activeCategory, setActiveCategory }) {
  return (
    <div className="category-filter">
      <button 
        className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
        onClick={() => setActiveCategory('all')}
      >
        All Sellers
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`category-btn ${activeCategory === category ? 'active' : ''}`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

// Search Component
function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="🔍 Search sellers by name, location or products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>
  );
}

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const categories = ["Vegetables", "Fruits", "Grains", "Spices", "Organic"];

  // Filter and sort sellers
  const filteredSellers = SELLERS.filter(seller => {
    const matchesSearch = 
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || 
      seller.products.some(p => activeCategory === 'Vegetables' && ['Tomatoes', 'Green Chilies', 'Spinach', 'Potatoes', 'Onions', 'Garlic'].some(i => p.includes(i))) ||
      activeCategory === 'Fruits' && seller.products.some(p => ['Mangoes', 'Bananas', 'Papaya', 'Coconut'].some(i => p.includes(i))) ||
      activeCategory === 'Grains' && seller.products.some(p => ['Wheat', 'Rice', 'Moong', 'Chickpeas'].some(i => p.includes(i))) ||
      activeCategory === 'Spices' && seller.products.some(p => ['Turmeric', 'Pepper', 'Cardamom', 'Mustard'].some(i => p.includes(i))) ||
      activeCategory === 'Organic' && seller.name.toLowerCase().includes('organic');
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🌾 Agricultural Marketplace</h1>
        <p style={styles.heroSubtitle}>Connect directly with verified farmers and suppliers across India</p>
        
        {/* Search Bar */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>500+</span>
            <span style={styles.statLabel}>Verified Sellers</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>50+</span>
            <span style={styles.statLabel}>Categories</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>10K+</span>
            <span style={styles.statLabel}>Products</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div style={styles.filterSection}>
        <CategoryFilter 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
        
        <div style={styles.sortSection}>
          <label style={styles.sortLabel}>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.sortSelect}
          >
            <option value="rating">Highest Rated</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div style={styles.resultsInfo}>
        Found <strong>{filteredSellers.length}</strong> sellers
      </div>

      {/* Sellers Grid */}
      <div style={styles.grid}>
        {filteredSellers.map((seller, index) => (
          <SellerCard key={seller.id} seller={seller} index={index} />
        ))}
      </div>

      {/* Empty State */}
      {filteredSellers.length === 0 && (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>🔍</span>
          <h3>No sellers found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      {/* CSS Styles */}
      <style>{`
        .seller-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          opacity: 0;
          transform: translateY(30px);
        }
        
        .seller-card.visible {
          animation: fadeInUp 0.5s ease forwards;
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .seller-image-container {
          position: relative;
          height: 180px;
          overflow: hidden;
        }
        
        .seller-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .seller-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(46, 125, 50, 0.8), rgba(27, 94, 32, 0.9));
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .seller-card:hover .seller-overlay {
          opacity: 1;
        }
        
        .view-profile {
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
        }
        
        .verified-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, #4caf50, #2e7d32);
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .seller-info {
          padding: 20px;
        }
        
        .seller-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .seller-name {
          margin: 0;
          font-size: 1.2rem;
          color: #1a1a1a;
        }
        
        .rating-container {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #fff3e0;
          padding: 4px 10px;
          border-radius: 20px;
        }
        
        .star {
          font-size: 0.9rem;
        }
        
        .rating {
          font-weight: 700;
          color: #e65100;
        }
        
        .seller-location, .response-time {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 6px;
        }
        
        .products-section {
          margin-top: 12px;
        }
        
        .products-label {
          font-size: 0.85rem;
          color: #888;
          font-weight: 600;
        }
        
        .products-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;
        }
        
        .product-tag {
          background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
          color: #2e7d32;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          animation: tagFadeIn 0.3s ease forwards;
          opacity: 0;
        }
        
        @keyframes tagFadeIn {
          to { opacity: 1; }
        }
        
        .seller-actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }
        
        .btn-contact, .btn-products {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-contact {
          background: linear-gradient(135deg, #2e7d32, #1b5e20);
          color: white;
        }
        
        .btn-contact:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(46, 125, 50, 0.4);
        }
        
        .btn-products {
          background: #fff;
          color: #2e7d32;
          border: 2px solid #2e7d32;
        }
        
        .btn-products:hover {
          background: #e8f5e9;
        }
        
        .category-filter {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .category-btn {
          padding: 10px 20px;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 25px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .category-btn:hover {
          border-color: #2e7d32;
          color: #2e7d32;
        }
        
        .category-btn.active {
          background: linear-gradient(135deg, #2e7d32, #1b5e20);
          color: white;
          border-color: #2e7d32;
        }
        
        .search-input {
          width: 100%;
          max-width: 500px;
          padding: 16px 24px;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          outline: none;
        }
        
        .search-input:focus {
          box-shadow: 0 4px 25px rgba(46, 125, 50, 0.3);
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f9fa",
    paddingBottom: "40px",
  },
  hero: {
    background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%)",
    padding: "50px 20px 40px",
    textAlign: "center",
    color: "white",
  },
  heroTitle: {
    fontSize: "2.5rem",
    margin: "0 0 10px",
    fontWeight: "700",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    margin: "0 0 30px",
    opacity: 0.9,
  },
  stats: {
    display: "flex",
    justifyContent: "center",
    gap: "50px",
    marginTop: "30px",
    flexWrap: "wrap",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statNumber: {
    fontSize: "2rem",
    fontWeight: "700",
  },
  statLabel: {
    fontSize: "0.9rem",
    opacity: 0.9,
  },
  filterSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    background: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    flexWrap: "wrap",
    gap: "15px",
  },
  sortSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  sortLabel: {
    fontWeight: "500",
    color: "#555",
  },
  sortSelect: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  resultsInfo: {
    padding: "20px 40px",
    color: "#666",
    fontSize: "0.95rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "25px",
    padding: "0 40px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#666",
  },
  emptyIcon: {
    fontSize: "4rem",
    display: "block",
    marginBottom: "20px",
  },
};
