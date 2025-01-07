import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaInfoCircle, FaChevronRight } from 'react-icons/fa'

const JobDetails = ({ jobDetail, isSelected, onSelect }) => {
  return (
    <motion.div
      layout
      className="bg-white w-full p-4 rounded-lg shadow-lg border border-gray-200 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => onSelect(jobDetail)}
      >
        <div className="flex items-center space-x-4">
          <div className='flex flex-row gap-2'> 
            <h2 className="text-2xl font-bold text-indigo-500">
              {jobDetail.jobId}
            </h2>
            <p className="font-medium text-gray-700 text-lg">
              ({jobDetail.designNumber})
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-600">
            Last Received: <strong className="text-lg text-green-700">{jobDetail.lastReceived}</strong>
          </p>
          <button className="text-gray-400 hover:text-indigo-500 transition-colors duration-200">
            <FaInfoCircle className="text-xl" />
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-white font-medium w-32 focus:outline-none transition duration-300 
              ${isSelected ? 'bg-gray-500 hover:bg-gray-600' : 'bg-indigo-500 hover:bg-indigo-600'}`}
            onClick={() => onSelect(jobDetail)}
          >
            {isSelected ? "Selected" : "View Details"}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const InfoItem = ({ label, value }) => (
  <div className="flex flex-wrap gap-3 px-3 py-2">
    <p className="text-sm text-gray-600">{label}:</p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
)

const JobDetailsPanel = ({ jobDetail }) => {
  if (!jobDetail) return null

  return (
    <div className="bg-white h-full p-3 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col items-center space-y-4">
       <div className='w-full flex flex-row justify-between'>
       <p className="text-2xl font-bold text-indigo-500">{jobDetail.jobId}</p>
       <p className="text-sm text-gray-600">
            Last Received: <strong className="text-lg text-green-700">{jobDetail.lastReceived}</strong>
          </p>
       </div>
          {/* <p className="text-xl font-medium text-gray-700">({jobDetail.designNumber})</p> */}
          <img
            src={jobDetail.image}
            alt="product"
            width={120}
            height={120}
            className="object-cover rounded-lg shadow-md"
          />
          <p className="text-lg font-medium text-gray-700">{jobDetail.name}</p>
        </div>
        <div className="space-y-4">
          <InfoItem label="Design No." value={jobDetail.designNumber} />
          <InfoItem label="Customer Name" value={jobDetail.customerName} />
          <InfoItem label="PO Number" value={jobDetail.poNumber} />
          <InfoItem label="Bag location" value={jobDetail.location} />
          <InfoItem label="Misc Add in Gross wt" value={jobDetail['Misc Add in Gross wt']} />
          <InfoItem label="Is HMW Job?" value={jobDetail['Is HMW Job?']} />
          <InfoItem label="Current Status" value={jobDetail.currentStatus} />
          <InfoItem label="Serial For" value={jobDetail.serialFor} />
        </div>
      </div>
    </div>
  )
}

const BulkJobScan = ({ jobList }) => {
  const [selectedJob, setSelectedJob] = useState(null)

  return (
    <div className="w-full h-screen flex bg-gray-100">
      <div className="w-3/4 p-6 overflow-y-auto">
        <div className="space-y-4">
          {jobList.map((job, index) => (
            <JobDetails
              key={index}
              jobDetail={job}
              isSelected={selectedJob && selectedJob.jobId === job.jobId}
              onSelect={setSelectedJob}
            />
          ))}
        </div>
      </div>
      <div className="w-1/4 border-l h-screen border-gray-200 overflow-y-auto">
        <JobDetailsPanel jobDetail={selectedJob} />
      </div>
    </div>
  )
}

export default BulkJobScan