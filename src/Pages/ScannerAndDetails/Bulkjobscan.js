import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const JobDetails = ({ jobDetail, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    console.log(jobDetail,'jobDetail');
  }; 

  console.log("jobDetail",jobDetail);

  return (
    <motion.div
      layout
      className="bg-white w-full p-3 px-4 rounded-lg shadow-lg border border-gray-200 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center space-x-4">    
          <div className='flex flex-row gap-2'> 
            <h2 className="text-2xl font-bold text-indigo-500">
            {jobDetail?.['2']}            </h2>
            <p className="font-medium text-gray-700 text-lg">
              ({jobDetail?.['11']})
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-600">
            Last Received: <strong className="text-lg text-green-700">{jobDetail.lastReceived}</strong>
          </p>
          
          <button
            className={`px-4 py-2 rounded-lg text-white font-medium w-32 focus:outline-none transition duration-300 
              ${isExpanded ? 'bg-gray-500 hover:bg-gray-600' : 'bg-indigo-500 hover:bg-indigo-600'}`}
            onClick={toggleExpand}
          >
            {isExpanded ? "Hide Details" : "Show Details"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className=" "
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center space-y-1">
                <p className="text-lg font-medium text-gray-700">{jobDetail.serialFor}</p>
                <motion.img
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  src={jobDetail.image}
                  alt="product"
                  className="h-20 w-20 object-cover rounded-lg shadow-md"
                />
                <p className="text-lg font-medium text-gray-700">{jobDetail.name}</p>
              </div>
              <div className="flex flex-col justify-evenly ">
                <InfoItem label="Customer Name" value={jobDetail?.['6']} />
                <InfoItem label="PO Number" value={jobDetail?.['12']} />
                <InfoItem label="Bag location" value={jobDetail?.['13']} />
              </div>
              <div className="flex flex-col justify-evenly ">
                <InfoItem label="Misc Add in Gross wt" value={jobDetail?.['14'] == 0 ? "NO" :"YES"} />
                <InfoItem label="Is HMW Job?" value={jobDetail['15']== 0 ? "NO" :"YES"} />
                <InfoItem label="Current Status" value={jobDetail.currentStatus} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className=" flex flex-wrap gap-3 px-3">
    <p className="text-sm text-gray-600">{label}:</p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
);

const BulkJobScan = ({ jobList }) => {
  return (
    <div className="w-full h-full flex flex-col gap-2 justify-start p-6 bg-gray-100">
      <AnimatePresence>
        {jobList.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <JobDetails jobDetail={job} defaultExpanded={index === 0} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BulkJobScan;
