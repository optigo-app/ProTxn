import React from 'react';

const LockerSelect = ({ lockers, selectedLocker, onLockerChange }) => {
    return (
        <div className="relative w-full mb-4">
            <select
                className="w-full px-2 py-1.5  text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                value={selectedLocker}
                onChange={(e) => onLockerChange(e.target.value)}
            >
                <option value="" disabled>Select a locker</option>
                {lockers.map((lock, index) => (
                    <option key={index} value={lock}>
                        {lock}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
        </div>
    );
};

export default LockerSelect;
