document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
    loadQuotes();
    loadPrices();
});

// --- 1. Live Weather (Using Open-Meteo API) ---
async function fetchWeather() {
    const weatherContainer = document.getElementById('weather-data');
    // Coordinates for Hyderabad/Telangana (Center of RithuBandhu initiative)
    const lat = 17.3850;
    const lng = 78.4867;

    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
        const data = await response.json();
        
        const temp = data.current_weather.temperature;
        const wind = data.current_weather.windspeed;
        
        weatherContainer.innerHTML = `
            <div class="temp-display">${temp}°C</div>
            <div class="details">
                <span><i class="fa-solid fa-wind"></i> ${wind} km/h</span>
            </div>
        `;
    } catch (error) {
        weatherContainer.innerHTML = `<p>Weather unavailable</p>`;
        console.error("Weather fetch error:", error);
    }
}

// --- 2. Eye-Catching Quotes ---
const quotes = [
    { text: "The farmer is the only man in our economy who buys everything at retail, sells everything at wholesale, and pays the freight both ways.", author: "John F. Kennedy" },
    { text: "Agriculture is the most healthful, most useful, and most noble employment of man.", author: "George Washington" },
    { text: "Jai Jawan, Jai Kisan.", author: "Lal Bahadur Shastri" },
    { text: "To forget how to dig the earth and to tend the soil is to forget ourselves.", author: "Mahatma Gandhi" }
];

function loadQuotes() {
    const container = document.getElementById('quote-container');
    let index = 0;

    function showQuote() {
        const q = quotes[index];
        container.innerHTML = `
            <div class="quote-card fade-in-up">
                <p class="quote-text">"${q.text}"</p>
                <span class="quote-author">- ${q.author}</span>
            </div>
        `;
        index = (index + 1) % quotes.length;
    }

    showQuote();
    setInterval(showQuote, 5000); // Rotate every 5 seconds
}

// --- 3. Live Vegetable Prices (Mock Data) ---
const vegPrices = [
    { name: "Tomato", price: "₹25/kg", icon: "fa-solid fa-apple-whole" }, // Using apple icon as placeholder for tomato
    { name: "Onion", price: "₹30/kg", icon: "fa-solid fa-layer-group" },
    { name: "Potato", price: "₹22/kg", icon: "fa-solid fa-cookie" },
    { name: "Chilli", price: "₹60/kg", icon: "fa-solid fa-pepper-hot" },
    { name: "Carrot", price: "₹45/kg", icon: "fa-solid fa-carrot" }
];

function loadPrices() {
    const container = document.getElementById('price-container');
    
    // Clear container
    container.innerHTML = '';

    vegPrices.forEach((veg, idx) => {
        // Create card
        const card = document.createElement('div');
        card.className = 'price-card fade-in-up';
        card.style.animationDelay = `${idx * 0.1}s`; // Staggered animation

        card.innerHTML = `
            <div class="veg-icon">
                <i class="${veg.icon}"></i>
            </div>
            <h4>${veg.name}</h4>
            <p class="price-tag">${veg.price}</p>
        `;

        container.appendChild(card);
    });
}