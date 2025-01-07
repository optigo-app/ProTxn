import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventSelectionPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (eventType) => {
    if (eventType === 'Sales') {
      navigate('/ScannerPage?eventid=2');
    } else if (eventType === 'Manufacturing') {
      navigate('/scanemp?eventid=1');
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 via-indigo-50 to-green-100 p-4">
      <div className="w-full max-w-md flex flex-col items-center justify-center bg-white rounded-lg shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Select Event</h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleNavigation('Sales')}
            className="bg-green-500 text-white px-6 py-3 font-semibold rounded-lg hover:bg-green-600 transition duration-200"
          >
            Sales
          </button>
          <button
            onClick={() => handleNavigation('Manufacturing')}
            className="bg-blue-500 text-white px-6 py-3 font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Manufacturing
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventSelectionPage;
