import React, { useState } from 'react';
import axios from 'axios';
import PopupModal from './PopupModal';  // Import the PopupModal component

const gradientStyle = {
  backgroundColor: 'rgb(23, 23, 23)' // Fallback color
};

// Function to parse formatted address into city, state, and country
const parseAddress = (formattedAddress) => {
  // Example address: "Contonment, Vivekananda Colony, BIT 1, Vizianagaram, Andhra Pradesh 535001, India"
  const addressParts = formattedAddress.split(',');
  const city = addressParts.length > 1 ? addressParts[addressParts.length - 3].trim() : '';
  const state = addressParts.length > 2 ? addressParts[addressParts.length - 2].trim() : '';
  const country = addressParts.length > 3 ? addressParts[addressParts.length - 1].trim() : '';
  return { city, state, country };
};

const RestaurantSearch = () => {
  const [location, setLocation] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Store the selected restaurant for the popup

  const handleSearch = async () => {
    if (!location) {
      setError('Please enter a location');
      return;
    }
    setError('');
    try {
      const response = await axios.get('https://map-places.p.rapidapi.com/textsearch/json', {
        params: {
          radius: '1500',
          keyword: 'cruise',
          query: `restaurants in ${location}`
        },
        headers: {
          'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
          'x-rapidapi-host': 'map-places.p.rapidapi.com'
        }
      });

      if (!response.data.results || response.data.results.length === 0) {
        setError('No results found');
        setRestaurants([]);
        return;
      }

      const fetchedRestaurants = response.data.results.map(restaurant => {
        let photoUrl = 'No photo available';
        if (restaurant.photos && Array.isArray(restaurant.photos)) {
          const photoReference = restaurant.photos[0].photo_reference;
          photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=960&photoreference=${photoReference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
        }

        const { city, state, country } = parseAddress(restaurant.formatted_address);

        return {
          name: restaurant.name,
          photo_url: photoUrl,
          rating: restaurant.rating,
          price_level: restaurant.price_level || 'N/A',
          user_ratings_total: restaurant.user_ratings_total || 0,
          open_now: restaurant.opening_hours?.open_now || false,
          city,
          state,
          country
        };
      });

      const priceLevelMap = { 'N/A': 0, '$': 1, '$$': 2, '$$$': 3, '$$$$': 4 };
      const filteredRestaurants = fetchedRestaurants.filter(restaurant => {
        const price = priceLevelMap[restaurant.price_level] || 0;
        return price >= 0; // Relaxed filter to include all restaurants
      });

      const sortedRestaurants = filteredRestaurants.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.user_ratings_total - a.user_ratings_total;
      });

      setRestaurants(sortedRestaurants);
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError('Error fetching data');
    }
  };

  const openPopup = (restaurant) => {
    setSelectedRestaurant(restaurant); // Set the selected restaurant for the popup
  };

  const closePopup = () => {
    setSelectedRestaurant(null); // Close the popup
  };

  return (
    <div style={gradientStyle} className="p-5 min-h-screen">
      <div className="mb-5 flex flex-col items-center">
        <div className="flex flex-col items-center w-full">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            className="border border-gray-300 rounded-lg p-2 w-80 mb-2"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg w-80 hover:bg-blue-600"
          >
            Search
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant, index) => (
            <div
              key={index}
              className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-red-400 dark:border-red-700"
              style={{ backgroundColor: 'rgba(255, 255, 255,0.48)' }} // Transparent background
            >
              <a href="#">
                {restaurant.photo_url !== 'No photo available' ? (
                  <img
                    className="p-8 rounded-t-lg w-full h-48 object-cover"
                    src={restaurant.photo_url}
                    alt={restaurant.name}
                  />
                ) : (
                  <div className="p-8 rounded-t-lg bg-gray-200 w-full h-48 flex items-center justify-center">
                    <p className="text-gray-500">No Photo Available</p>
                  </div>
                )}
              </a>
              <div className="px-5 pb-5">
                <a href="#">
                  <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {restaurant.name}
                  </h5>
                </a>
                <div className="flex items-center mt-2.5 mb-5">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                    Rating: {restaurant.rating || 'No Rating'}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 ms-3">
                    Reviews: {restaurant.user_ratings_total || 'N/A'}
                  </span>
                  <span className={`bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 ms-3 ${restaurant.open_now ? 'bg-green-100' : 'bg-red-100'}`}>
                    {restaurant.open_now ? 'Open Now' : 'Closed'}
                  </span>
                </div>
                <div className="text-gray-700 mb-3">
                  {restaurant.city && <p>City: {restaurant.city}</p>}
                  {restaurant.state && <p>State: {restaurant.state}</p>}
                  {restaurant.country && <p>Country: {restaurant.country}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => openPopup(restaurant)}
                    className="text-white bg-slate-100 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <img
src='https://cdn-icons-png.flaticon.com/256/4223/4223218.png'              className="w-6 h-6" // Adjust size as needed
            />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No restaurants found</p>
        )}
      </div>

      {/* Render the PopupModal component */}
      <PopupModal
        restaurant={selectedRestaurant}
        onClose={closePopup}
      />
    </div>
  );
};

export default RestaurantSearch;
