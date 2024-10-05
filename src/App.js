import React from 'react';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import RestaurantSearch from './components/RestaurantSearch';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter> {/* Wrap your components with BrowserRouter */}
      <div>      
        <Header/>
        <RestaurantSearch/>
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App;
