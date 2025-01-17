import React from 'react';

const ToggleButton = ({ mode, handleModeToggle }) => {
  return (
    <div className="relative bg-gray-200 rounded-full inline-flex">
      <button
        className={`px-7 py-2 font-medium text-base rounded-full focus:outline-none ${
          mode === 'Issue'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-400'
        }`}
        onClick={() => handleModeToggle('Issue')}
      >
        Issue
      </button>
      <button
        className={`px-7 py-2 font-medium text-base rounded-full focus:outline-none ${
          mode === 'Return'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-400'
        }`}
        onClick={() => handleModeToggle('Return')}
      >
        Return
      </button>
    </div>
  );
};

export default ToggleButton;
