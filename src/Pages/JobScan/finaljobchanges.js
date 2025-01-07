'use client'

import React, { useState, useEffect, useRef } from 'react';
import { FaQrcode, FaUser, FaArrowRight } from 'react-icons/fa';
import QrScanner from 'qr-scanner';
import { ClipLoader } from 'react-spinners';

export default function JobScan() {
  const [scannedCode, setScannedCode] = useState('');
  const [jobDetails, setJobDetails] = useState(null);
  const [rfBagDetails, setRfBagDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [mountWeight, setMountWeight] = useState('');
  const [stockWeight, setStockWeight] = useState('');
  const [scrap, setScrap] = useState(0);
  const [pcs, setPcs] = useState('');
  const [hasCamera, setHasCamera] = useState(true);
  const [barcode, setBarcode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && !scannerRef.current && hasCamera) {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleScan(result.data),
        {
          onDecodeError: (err) => console.log(err),
          preferredCamera: 'environment',
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      scannerRef.current.start().catch((err) => {
        console.error(err);
        setHasCamera(false);
      });
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current = null;
      }
    };
  }, [hasCamera]);

  const handleScan = (result) => {
    if (result) {
      setBarcode(result);
      setHasCamera(false);
      handleCodeSubmit(result);
      handleScanSubmit(result);
    }
  };

  const handleCodeSubmit = async (scannedCode) => {
    if (barcode.trim() === '') {
      setErrorMessage('Please enter the Job#.');
      return;
    }
  };

  const handleToggleScanner = () => {
    setHasCamera(true);
  };

  const handleChange = (e) => {
    setScannedCode(e.target.value); 
    setBarcode(e.target.value);
    setErrorMessage('');
  };

  const jobData = [
    {
      jobId: "1/266040",
      name: "GOLD 10K Shine Gold",
      designNumber: "FD4",
      serialFor: "WOMENS",
      image: '/placeholder.svg?height=300&width=300',
      customerName: "ashok01",
      poNumber: "100 jobs for testing",
      lastReceived: "1.000 Gm",
      currentStatus: "Filing-Issue",
      location: "INDIA",
      jobFlag: 'Issue',
    },
    { 
      jobId: "1/266041",
      name: "GOLD 18K Shine Yellow",
      designNumber: "NEW-COP",
      serialFor: "Titan Earring",
      image: '/placeholder.svg?height=300&width=300',
      customerName: "amolpatil",
      poNumber: "15030",
      lastReceived: "0.000 Gm",
      currentStatus: "EC QC1-Issue",
      location: "INDIA",
      jobFlag: 'Return',
    }
  ];

  const rfBags = [
    {
      rfbagid: "0000008992",
      Material: "METAL",
      Type: "GOLD",
      Color: "YELLOW",
      Purity: "14K",
      Gm: "16.912/16.912"
    },
    {
      rfbagid: "0000009399",
      Lot: "1",
      Material: "DIAMOND",
      Shape: "ROUND",
      Color: "IJ",
      Size: "MIX",
      Clarity: "SI",
      Ctw: "97/100"
    }
  ];

  const handleScanSubmit = () => {
    const isJobId = scannedCode.startsWith("1/") && scannedCode.length > 2;
    if (isJobId) {
      const jobFound = jobData.find(job => job.jobId === scannedCode);
      if (jobFound) {
        setJobDetails(jobFound);
        setRfBagDetails(null);
      } else {
        alert("Job ID not found.");
      }
    } else if (scannedCode.length === 10) {
      const rfBagFound = rfBags.find(bag => bag.rfbagid === scannedCode);
      if (rfBagFound) {
        setRfBagDetails(rfBagFound);
        setJobDetails(null);
      } else {
        alert("RF Bag ID not found.");
      }
    } else {
      alert("Invalid code.");
    }
  };

  const renderJobDetails = () => (
    jobDetails && (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-102">
        <div className="p-6 space-y-6">
          {jobDetails.jobFlag === 'Return' && (    
            <div className="bg-blue-50 p-6 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">Return Job</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-gray-700 font-medium">Dept:</label>
                  <select className="p-2 border bg-gray-100 font-bold rounded-lg w-48 focus:border-blue-600 focus:ring focus:ring-blue-200" disabled>
                    <option>Filing</option>
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <label className="text-gray-700 font-medium">Mount Wt:</label>
                  <input
                    type="number"
                    value={mountWeight}
                    onChange={(e) => setMountWeight(e.target.value)}
                    placeholder="Enter Mount Wt."
                    className="border p-2 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      alert("Job successfully returned");
                      setJobDetails(null);
                    }}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex-1"
                  >
                    Return
                  </button> 
                  <button
                    onClick={() => {
                      setJobDetails(null);
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-300 flex-1"
                  >
                    Cancel
                  </button> 
                </div>
              </div>
            </div>
          )} 
          {jobDetails.jobFlag === 'Issue' && (
            <div className="bg-indigo-50 p-6 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold mb-4 text-indigo-700">Issue Job</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-gray-700 font-medium">Select Dept:</label>
                  <select className="w-48 p-2 border rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200">
                    <option>Select Department</option>
                    <option value="Filing">Filing</option>
                    <option value="Casting">Casting</option>
                    <option value="Polishing">Polishing</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    alert("Job successfully issued");
                    setJobDetails(null);
                  }}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
                >
                  Issue Job <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          )}
          <div className="mt-6">
            <div className="flex mb-4">
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex-1 py-2 px-4 rounded-tl-lg rounded-tr-lg transition duration-300 ${activeTab === 'summary' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-2 px-4 rounded-tl-lg rounded-tr-lg transition duration-300 ${activeTab === 'details' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Details
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              {activeTab === 'summary' ? (
                <p>This is the summary tab content.</p>
              ) : (
                <p>This is the details tab content.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderSideJobDetails = () => (
    jobDetails && (
      <div className='bg-white h-full w-full lg:w-80 flex flex-col shadow-lg rounded-lg overflow-hidden transition-transform duration-300 p-4'>
        <div className='flex flex-col h-full'>
          <div className="flex flex-col w-full justify-center items-center mb-4">
            <h1 className='text-2xl font-bold text-indigo-600'>{jobDetails.jobId}</h1>
            <h2 className='text-lg text-center font-semibold text-gray-500'>{jobDetails.name}</h2>
          </div>
          <div className='flex-1 flex flex-col items-center mb-4 overflow-y-auto'>
            <img
              className='h-64 w-64 object-cover rounded-lg shadow-md mb-4'
              src={jobDetails.image}
              alt='Job'
            />
            <div className='w-full'>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className='text-gray-600'>Design: <span className='text-gray-800 font-bold'>{jobDetails.designNumber}</span></p>
                <p className='text-gray-600'>Customer: <span className='text-gray-800 font-bold'>{jobDetails.customerName}</span></p>
                <p className='text-gray-600'>PO: <span className='text-gray-800 font-bold'>{jobDetails.poNumber}</span></p>
                <p className='text-gray-600'>Location: <span className='text-gray-800 font-bold'>{jobDetails.location}</span></p>
                <p className='text-gray-600 col-span-2'>Status: <span className='text-gray-800 font-bold'>{jobDetails.currentStatus}</span></p>
              </div>
            </div>
          </div>
          {jobDetails.jobFlag === 'Return' && (
            <div className='bg-blue-50 p-4 rounded-lg shadow-md mt-4'>
              <div className='grid grid-cols-2 gap-2 text-sm'>
                <p>Alloy Wt: <strong>0.000</strong></p>
                <p>Lab Grown: <strong>0.000</strong></p>
                <p>Diamond: <strong>0.000</strong></p>
                <p>Color Stone: <strong>0.000</strong></p>
                <p>Misc: <strong>0.000</strong></p>
                <p>Current Net: <strong>0.000</strong></p>
                <p>Current Gross: <strong>0.000</strong></p>
                <hr className='col-span-2 border-gray-300 my-2' />
                <p>Loss Weight: <strong>0.000</strong></p>
                <p>Actual Loss: <strong>0.000</strong></p>
                <p>Scrap Loss: <strong>0.000</strong></p>
                <hr className='col-span-2 border-gray-300 my-2' />
                <p>Exp Loss: <strong>0.000</strong></p>
                <p>Max Loss %: <strong>0.000</strong></p>
              </div>
              <div className='mt-4 flex items-center gap-2'>
                <label className='font-medium text-sm'>Scrap:</label>
                <input
                  type='number'
                  value={scrap}
                  onChange={(e) => setScrap(e.target.value)}
                  placeholder='Enter scrap'
                  className='border p-1 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
   
  const renderRfBagDetails = () => (
    rfBagDetails && (
      <div className="bg-white w-full max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden mt-6 transition-all duration-300 ease-in-out transform hover:scale-102">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-indigo-600">RF Bag Details</h2>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <p><strong>RF Bag ID:</strong> {rfBagDetails.rfbagid}</p>
            <p><strong>Material:</strong> {rfBagDetails.Material}</p>
            <p><strong>Type:</strong> {rfBagDetails.Type}</p>
            <p><strong>Color:</strong> {rfBagDetails.Color}</p>
            <p><strong>Purity:</strong> {rfBagDetails.Purity}</p>
            <p><strong>Weight:</strong> {rfBagDetails.Gm}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4 text-lg">Material Requirements</h3>
            <div className="space-y-4">
              <input
                type="number"
                value={stockWeight}
                onChange={(e) => setStockWeight(e.target.value)}
                placeholder="Enter Required Weight (Gm)"
                className="w-full p-3 border rounded focus:border-indigo-500 focus:ring focus:ring-indigo-200"
              />
              <input
                type="number"
                value={pcs}
                onChange={(e) => setPcs(e.target.value)}
                placeholder="Enter Number of Pieces"
                className="w-full p-3 border rounded focus:border-indigo-500 focus:ring focus:ring-indigo-200"
              />
              <button
                onClick={() => {
                  alert(`Weight: ${stockWeight} Gm, Pieces: ${pcs}`);
                }}
                className="w-full bg-green-500 text-white px-4 py-3 rounded hover:bg-green-600 transition duration-300 flex items-center justify-center"
              >
                Save Material Requirements <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-80 bg-white shadow-lg">
        <div className="p-6 bg-indigo-50">
          <select className="w-full p-2 border rounded-lg mb-4 focus:border-indigo-600 focus:ring focus:ring-indigo-200">
            <option value="Filing">Gujarat-Gujarat</option>
            <option value="Casting">India</option>
            <option value="Polishing">Kolkata</option>
          </select>
          <p className='text-lg font-semibold'>
            <FaUser className="inline mr-2 text-indigo-500" /> 
            <strong className='text-blue-500'>(E1343) </strong> 
            Pradeep Varma
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center">
            {hasCamera ? (
              <div className="w-64 h-64 bg-gray-100 rounded-lg shadow-lg overflow-hidden mb-4">
                <video ref={videoRef} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div 
                className="relative h-64 w-64 bg-gray-50 rounded-lg shadow-lg overflow-hidden flex items-center justify-center mb-4 cursor-pointer" 
                onClick={handleToggleScanner}
              >
                <FaQrcode className="text-6xl text-gray-400" />
                <div className="absolute top-0 w-full h-1 bg-red-500 animate-scanner-line"></div>
              </div>
            )}
            {errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}
            <form onSubmit={(e) => { e.preventDefault(); handleCodeSubmit(barcode); }} className="w-full">
              <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                <input
                  type="text"
                  className="p-3 w-full text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="Enter Code"
                  value={scannedCode}
                  onChange={handleChange}
                />
                <button
                  onClick={handleScanSubmit}
                  className={`bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white px-6 py-3 font-semibold hover:from-green-500 hover:to-green-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={20} color="#fff" /> : (
                    <>
                      <FaQrcode className="mr-2" /> Scan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        {renderJobDetails()}
        {renderRfBagDetails()}
      </div>
      <div className="w-80">
        {renderSideJobDetails()}
      </div>
    </div>
  );
}