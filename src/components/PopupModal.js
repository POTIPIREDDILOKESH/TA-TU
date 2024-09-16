import React, { useState } from 'react';
import jsPDF from 'jspdf';  // Import jsPDF for generating the PDF

const PopupModal = ({ restaurant, onClose }) => {
  const [selectedTimes, setSelectedTimes] = useState([]); // Track selected time intervals
  const [name, setName] = useState(''); // Store the user's name
  const [phone, setPhone] = useState(''); // Store the user's phone number

  const timeSlots = {
    breakfast: ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM'],
    lunch: ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'],
    dinner: ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']
  };

  // Function to handle time interval selection/deselection
  const handleTimeClick = (time) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter(selectedTime => selectedTime !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  // Check if the time is selected
  const isSelected = (time) => selectedTimes.includes(time);

  // Function to generate and download the PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add content to PDF
    doc.setFontSize(16);
    doc.text('Booking Confirmation', 105, 20, null, null, 'center');
    
    doc.setFontSize(12);
    doc.text(`Restaurant: ${restaurant.name}`, 20, 40);
    doc.text(`User Name: ${name}`, 20, 50);
    doc.text(`Phone Number: ${phone}`, 20, 60);
    doc.text(`Selected Time: ${selectedTimes.join(', ')}`, 20, 70);

    // Add table symbol as a stamp at the bottom right
    doc.setFontSize(40);
    doc.text('🍽️', 180, 280);  // A table symbol at the bottom-right corner

    // Save the generated PDF
    doc.save('booking_confirmation.pdf');
  };

  if (!restaurant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg relative w-96">
        <h2 className="text-xl font-bold text-center mb-4">{restaurant.name}</h2>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Phone Number Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Breakfast Time Slots */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Breakfast</h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.breakfast.map(time => (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                className={`py-1 rounded-lg ${
                  isSelected(time) ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-600'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Lunch Time Slots */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Lunch</h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.lunch.map(time => (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                className={`py-1 rounded-lg ${
                  isSelected(time) ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-600'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Dinner Time Slots */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Dinner</h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.dinner.map(time => (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                className={`py-1 rounded-lg ${
                  isSelected(time) ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-600'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Book My Table Button */}
        <div className="text-center">
          <button
            onClick={generatePDF}  // Trigger PDF generation on button click
            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600"
          >
            Book My Table
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default PopupModal;
