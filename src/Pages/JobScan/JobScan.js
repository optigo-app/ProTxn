
import React, { useState, useEffect, useRef } from 'react';
import { FaQrcode, FaUser,  FaArrowRight } from 'react-icons/fa';
import QrScanner from 'qr-scanner';
import { ClipLoader } from 'react-spinners';
import ScannerIcon from '../../Assets/Qrcode.png';
import img from '../../Assets/Jew.jpg';
import '../../components/Scanner.css';
import { PiKeyReturnBold } from "react-icons/pi";
import SummeryTable from './SummeryTable';

const JobScan = () => { 
const [scannedCode, setScannedCode] = useState('');
const [jobDetails, setJobDetails] = useState(null);
const [rfBagDetails, setRfBagDetails] = useState(null);
const [activeTab, setActiveTab] = useState('summary');
const [mountWeight, setMountWeight] = useState('');
const [stockWeight, setStockWeight] = useState('');
const [pcs, setPcs] = useState('');
const [hasCamera, setHasCamera] = useState(true);
const [barcode, setBarcode] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [loading, setLoading] = useState(false);
const videoRef = useRef(null);
const scannerRef = useRef(null);
const [selectedDept, setSelectedDept] = useState('');

const departments = ['Filing', 'Casting', 'Polishing'];

const handleDeptClick = (dept) => {
  setSelectedDept(dept);
};
const handleScan = (result) => {
  if (result) {
    setBarcode(result);
    setHasCamera(false);
    handleCodeSubmit(result);
    handleScanSubmit(result);
  }
};

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
  }, [hasCamera,handleScan]);


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
      jobId: "1/123456",
      name: "GOLD 10K Shine Gold",
      designNumber: "FD4",
      serialFor: "WOMENS",
      image: img,
      customerName: "ashok01",
      poNumber: "100 jobs for testing",
      lastReceived: "1.000 Gm",
      currentStatus: "Filing-Issue",
      location: "INDIA",
      jobFlag: 'Issue',
    },
    { 
      jobId: "1/123457",
      name: "GOLD 18K Shine Yellow",
      designNumber: "NEW-COP",
      serialFor: "Titan Earring",
      image: img,
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
      rfbagid: "0000008991",
      Lot: "1",
      Material: "DIAMOND",
      Shape: "ROUND",
      Color: "IJ",
      Size: "MIX",
      Clarity: "SI",
      Ctw: "97/100"
    }
  ];

  // 1/266087

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
  // const renderJobDetails = () => (
  // jobDetails && (
  //     <div className='w-full flex flex-col justify-between h-full overflow-hidden transition-all duration-300 ease-in-out transform p-4'>
  //       <div className='w-full h-fit flex justify-center items-center'>
  //         {jobDetails.jobFlag === 'Return' && (
  //           <div className='w-full flex flex-row bg-white justify-between rounded-xl shadow-lg h-full items-center justify-self-center p-4'>
            
  //           <div className='flex justify-center  rounded-lg items-center h-full w-1/2'>

  //           <div className="px-4 py-4 w-full max-w-96 h-fit items-center flex flex-col gap-6">
  //               <h3 className="text-lg w-full mb-2 text-gray-600">
  //                 Return Job 
  //                 <p className='font-bold text-green-600 text-2xl w-full text-pretty'>
  //                   ({jobDetails.jobId})
  //                 </p>
  //               </h3>
  //               <div className='flex flex-col gap-2 w-full justify-between h-fit items-start'>
  //                 <p className="w-fit text-gray-600 ">Dept:</p>
  //                 <select className="p-2 w-full  text-2xl border bg-gray-200 font-bold rounded-md  focus:border-indigo-500 focus:ring focus:ring-indigo-300" disabled>
  //                   <option>Filing</option>
  //                 </select>
  //               </div>

  //               <div className='flex flex-col gap-2 w-full justify-between items-start'>
  //                 <p className="text-gray-600 ">Mount Wt:</p>
  //                 <input
  //                   type="number"
  //                   value={mountWeight}
  //                   onChange={(e) => setMountWeight(e.target.value)}
  //                   placeholder="Enter Mount Wt."
  //                   className="border p-2  w-full  text-2xl rounded-md  focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-300 transition duration-200"
  //                 />
  //               </div>

  //               <div className='flex flex-row w-full gap-4'>
  //                 <button
  //                   onClick={() => {
  //                     alert("Job successfully returned");
                     
  //                   }}
  //                   className="bg-blue-600 text-lg w-fit font-semibold text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300  shadow-md flex items-center justify-center"
  //                 >
  //                   <PiKeyReturnBold  size={24} className='mr-2' /> Return
  //                 </button>
  //                 <button
  //                   onClick={() => {
                    
  //                   }}
  //                   className="bg-gray-500 text-white w-fit px-4 py-2 text-lg font-semibold rounded-md hover:bg-gray-600 transition duration-300  shadow-md"
  //                 >
  //                   Cancel
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
         

  //             <div className=' p-6 bg-blue-50 rounded-xl w-1/2 h-full shadow-md ml-8'>
  //               <div className='grid grid-cols-2 gap-2 text-gray-700'>
  //                 <div className='text-gray-400 text-sm '>Alloy Wt: <strong className='text-lg text-gray-600'>0.000</strong></div>
  //                 <div className='text-gray-400 text-sm '>Lab Grown: <strong className='text-lg text-gray-600'>0.000</strong></div>
  //                 <div className='text-gray-400 text-sm '>Diamond: <strong className='text-lg text-gray-600'>0.000</strong></div>
  //                 <div className='text-gray-400 text-sm '>Color Stone: <strong className='text-lg text-gray-600'>0.000</strong></div>
  //                 <div className='text-gray-400 text-sm '>Misc: <strong className='text-lg text-gray-600'>0.000</strong></div>
  //                 <div className='text-gray-400 text-sm '>Current Net: <strong className='text-lg text-gray-600'>0.000</strong></div>
  //                 <div className='text-gray-400 text-sm '>Current Gross: <strong className='text-lg text-gray-600'>0.000</strong></div>
  //                 <hr className='col-span-2 border-gray-300' />
  //                 <div className='text-gray-400 text-sm '>Loss Weight: <strong className='text-lg text-gray-600'>0.000</strong></div>
  //                 <div className='text-gray-400 text-sm '>Actual Loss: <strong className='text-lg text-gray-600'>0.000</strong></div>
  //                 <div className='text-gray-400 text-sm '>Scrap Loss: <strong className='text-lg text-gray-600'>0.000</strong></div>
  //                 <hr className='col-span-2 border-gray-300' />
  //                 <div className='text-gray-400 text-sm '>Exp Loss: <strong className='text-lg text-gray-600'>0.000</strong></div>
  //                 <div className='text-gray-400 text-sm '>Max Loss %: <strong className='text-lg text-gray-600'>0.000</strong></div>
  //               </div>

  //               <div className='mt-4 flex items-center gap-4'>
  //                 <p className='font-medium text-gray-700'>Scrap:</p>
  //                 <input
  //                   type='number'
  //                   value={scrap}
  //                   onChange={(e) => setScrap(e.target.value)}
  //                   placeholder='Enter scrap'
  //                   className='border p-2 rounded-md w-36 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200'
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //         )}
  //         {jobDetails.jobFlag === 'Issue' && (
  //           <div className='w-full items-center flex justify-center'>
  //             <div className="px-6 py-4 w-full bg-white flex flex-col gap-4 rounded-lg shadow-inner max-w-5xl">
              
  //               <h3 className="text-lg font-semibold mb-2 text-gray-600">
  //                 Issue Job 
  //                 <p className='font-bold text-indigo-600 text-2xl w-full text-pretty'>
  //                   ({jobDetails.jobId})
  //                 </p>
  //               </h3>

  //               <div className='flex flex-col gap-2 w-full justify-between h-fit items-start'>
  //                 <p className="w-fit text-gray-700 flex items-center">Select Dept:</p>
  //                 <select className="w-full p-2 border rounded-lg mb-4 focus:border-indigo-600 focus:ring focus:ring-indigo-200">
  //                   <option>Select Department</option>
  //                   <option value="Filing">Filing</option>
  //                   <option value="Casting">Casting</option>
  //                   <option value="Polishing">Polishing</option>
  //                 </select>
  //               </div>
  //               <button
  //                 onClick={() => {
  //                   alert("Job successfully issued");
                    
  //                 }}
  //                 className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-lg font-semibold transition duration-300 flex items-center justify-center"
  //               >
  //                 Issue Job <FaArrowRight className="ml-2" />
  //               </button>
  //             </div>
  //           </div>
  //         )}
  //       </div>

  //       {jobDetails && (
  //         <div className="bg-white mt-5 h-full w-full">
  //           <div className="border-b border-gray-300">
  //             <button
  //               className={`py-2 text-center cursor-pointer rounded-t-md flex-1 max-w-fit px-3 transition duration-300 ${activeTab === 'summary' ? 'border-b-2 border-indigo-600 font-semibold text-blue-600' : ''}`}
  //               onClick={() => setActiveTab('summary')}
  //             >
  //               Summary
  //             </button>
  //             <button
  //               className={`py-2 text-center cursor-pointer rounded-t-md flex-1 max-w-fit px-3 transition duration-300 ${activeTab === 'details' ? 'border-b-2 border-indigo-600 font-semibold text-blue-600' : ''}`}
  //               onClick={() => setActiveTab('details')}
  //             >
  //               Details
  //             </button>
  //           </div>
  //           {activeTab === 'summary' && (
  //             <div className="p-6 bg-white h-full flex justify-center items-start">
  //               <table className="min-w-full">
  //                 <thead>
  //                   <tr className="bg-gray-100">
  //                     <th className="border-b-2 border-gray-300 p-4">Detail</th>
  //                     <th className="border-b-2 border-gray-300 p-4">Value</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   <tr>
  //                     <td className="border-b border-gray-200 p-4">Job ID</td>
  //                     <td className="border-b border-gray-200 p-4">{jobDetails.jobId}</td>
  //                   </tr>
  //                 </tbody>
  //               </table>
  //             </div>
  //           )}
  //           {activeTab === 'details' && (
  //             <div className="p-6 bg-white h-full flex justify-center items-start">
  //               <table className="min-w-full">
  //                 <thead>
  //                   <tr className="bg-gray-100">
  //                     <th className="border-b-2 border-gray-300 p-4">History Item</th>
  //                     <th className="border-b-2 border-gray-300 p-4">Timestamp</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
                    
  //                   <tr>
  //                     <td className="border-b border-gray-200 p-4">Sample History Item</td>
  //                     <td className="border-b border-gray-200 p-4">2024-10-02 10:00 AM</td>
  //                   </tr>
  //                 </tbody>
  //               </table>
  //             </div>
  //           )}
  //         </div>
  //       )}
  //     </div>
  //   )
  // );
  


  const renderJobDetails = () => (
    jobDetails && (
      <div className='w-full flex flex-col justify-between h-full overflow-hidden transition-all duration-300 ease-in-out transform p-4 bg-gray-50 rounded-xl shadow-lg'>
        <div className='w-full h-fit flex justify-center items-center'>
          {jobDetails.jobFlag === 'Return' && (
            <div className='w-full flex flex-col md:flex-row bg-white justify-between rounded-xl shadow-md h-full items-stretch p-6 gap-6'>
              <div className='flex-1 flex flex-col justify-between rounded-lg items-start'>
                <div className="w-full max-w-md space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Return Job 
                    <span className='block text-green-600 text-3xl mt-1'>
                      {jobDetails.jobId}
                    </span>
                  </h3>
                  <div className='space-y-4 w-full'>
                    <div>
                      <label htmlFor="dept" className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
                      <select id="dept" className="w-full p-3 text-xl border bg-gray-100 font-semibold rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200" disabled>
                        <option>Filing</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="mountWeight" className="block text-sm font-medium text-gray-700 mb-1">Mount Weight:</label>
                      <input
                        id="mountWeight"
                        type="number"
                        value={mountWeight}
                        onChange={(e) => setMountWeight(e.target.value)}
                        placeholder="Enter Mount Wt."
                        className="w-full p-3 text-xl border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>
                  <div className='flex gap-4'>
                    <button
                      onClick={() => alert("Job successfully returned")}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300 shadow-md flex items-center justify-center text-lg font-semibold"
                    >
                      <PiKeyReturnBold size={24} className='mr-2' /> Return
                    </button>
                    <button
                      onClick={() => {}}
                      className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition duration-300 shadow-md text-lg font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
              <div className='flex-1 p-6 bg-blue-50 rounded-xl shadow-inner'>
                <div className='grid grid-cols-2 gap-4 text-gray-700'>
                  {[ 'Diamond', 'Color Stone', 'Misc', 'Current Net', 'Current Gross'].map((item) => (
                    <div key={item} className='flex justify-between items-center'>
                      <span className='text-gray-500'>{item}:</span>
                      <strong className='text-lg text-gray-800'>0.000</strong>
                    </div>
                  ))}
                  <hr className='col-span-2 border-gray-300 my-2' />
                  {['Loss Weight', 'Actual Loss'].map((item) => (
                    <div key={item} className='flex justify-between items-center'>
                      <span className='text-gray-500'>{item}:</span>
                      <strong className='text-lg text-gray-800'>0.000</strong>
                    </div>
                  ))}
                  <hr className='col-span-2 border-gray-300 my-2' />
                  {['Exp Loss', 'Max Loss %'].map((item) => (
                    <div key={item} className='flex justify-between items-center'>
                      <span className='text-gray-500'>{item}:</span>
                      <strong className='text-lg text-gray-800'>0.000</strong>
                    </div>
                  ))}
                </div>
             
              </div>
            </div>
          )}

        </div>
        {jobDetails.jobFlag === 'Issue' && (
        <div className="w-full flex justify-center mt-8">
          <div className="w-full max-w-2xl bg-white flex flex-col gap-6 rounded-xl shadow-lg p-8 ">
            <h3 className="text-2xl font-bold text-gray-800 text-center">
              Issue Job
              <span className="block text-indigo-600 text-3xl mt-2">
                {jobDetails.jobId}
              </span>
            </h3>

            <div>
              <label htmlFor="issueDept" className="block text-sm font-medium text-gray-700 mb-2">
                Select Department:
              </label>
              <div className="w-full rounded-lg p-4 flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <div
                    key={dept}
                    className={`p-2 rounded-md px-4 border cursor-pointer transition-colors duration-300
                      ${selectedDept === dept ? 'bg-[#56a4ff] border-[#56a4ff] text-white' : 'bg-white text-gray-800 border-gray-300  '}`}
                    onClick={() => handleDeptClick(dept)}
                  >
                    {dept}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => alert('Job successfully issued')}
              className="w-full bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-300 text-lg font-semibold transition duration-300 flex items-center justify-center"
            >
              Issue Job <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      )}
   
        {jobDetails && (
          <div className="bg-white mt-8 h-full rounded-xl shadow-md overflow-auto">
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-3 px-6 text-center font-semibold transition duration-300 ${activeTab === 'summary' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('summary')}
              >
                Summary
              </button>
              <button
                className={`flex-1 py-3 px-6 text-center font-semibold transition duration-300 ${activeTab === 'details' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
            </div>
            <div className="p-6">
              {activeTab === 'summary' && (
                // <table className="min-w-full divide-y divide-gray-200">
                //   <thead className="bg-gray-50">
                //     <tr>
                //       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
                //       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                //     </tr>
                //   </thead>
                //   <tbody className="bg-white divide-y divide-gray-200">
                //     <tr>
                //       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Job ID</td>
                //       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{jobDetails.jobId}</td>
                //     </tr>
                  
                //   </tbody>
                // </table>

                <SummeryTable/>
              )}
              {activeTab === 'details' && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">History Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sample History Item</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-10-02 10:00 AM</td>
                    </tr>
                 
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    )
  );
  

  const renderSideJobDetails = () => (
    jobDetails && (
      <div className='bg-white min-h-screen w-full lg:w-[20vw] flex flex-col shadow-lg rounded-lg overflow-hidden transition-transform duration-300 p-4'>
        <div className='flex flex-col'>
    
          <div className="flex flex-col w-full justify-center items-center mb-2">
            <h1 className='text-2xl font-bold text-indigo-600'>
              {/* {jobDetails.jobId} */}
              {jobDetails.designNumber}
            </h1>
            <h2 className='text-lg w-full flex justify-center font-semibold text-gray-500'>
              {jobDetails.name}
            </h2>
          </div>
  
          <div className='flex flex-col items-center mb-2'>
            <img
              className='h-96 w-96  object-cont rounded-lg shadow-md'
              src={jobDetails.image}
              alt='Job'
            />
     <div className='w-full mt-3'>
  <div className="flex flex-col gap-1 px-2">
    <div className='grid grid-cols-2 gap-1'>
    {/* <p className='text-gray-600'>
     Design: <span className='text-gray-800  font-bold'>{jobDetails.designNumber}</span>
    </p> */}
    <p className='text-gray-600'>
     Customer: <span className='text-gray-800  font-bold'>{jobDetails.customerName}</span>
    </p>
   
    <p className='text-gray-600'>
     PO: <span className='text-gray-800  font-bold'>{jobDetails.poNumber}</span>
    </p>
    <p className='text-gray-600'>
     Location: <span className='text-gray-800  font-bold'>{jobDetails.location}</span>
    </p>
    <p className='text-gray-600'>
     Status: <span className='text-gray-800  font-bold'>{jobDetails.currentStatus}</span>
    </p>
    </div>
  
    
  </div>
</div>

          </div>
  
   
        </div>
      </div>
    )
  );

  const renderRfBagDetails = () => (
    rfBagDetails && (
      <div className='w-full h-full flex justify-center items-center'>
        <div className="bg-white w-full max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden mt-6 transition-all duration-300 ease-in-out transform hover:scale-102">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-purple-500">RF Bag Details</h2>
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
    
                {rfBagDetails.Material === "METAL" ? (
                  <input
                    type="number"
                    value={stockWeight}
                    onChange={(e) => setStockWeight(e.target.value)}
                    placeholder="Enter Required Weight (Gm)"
                    className="w-full p-3 border rounded"
                  />
                ) : (
                  <>
                    <input
                      type="number"
                      value={stockWeight}
                      onChange={(e) => setStockWeight(e.target.value)}
                      placeholder="Enter Required Weight (Gm)"
                      className="w-full p-3 border rounded"
                    />
                    <input
                      type="number"
                      value={pcs}
                      onChange={(e) => setPcs(e.target.value)}
                      placeholder="Enter Number of Pieces"
                      className="w-full p-3 border rounded"
                    />
                  </>
                )}
  
               
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      alert(`Weight: ${stockWeight} Gm, Pieces: ${pcs}`);
                    }}
                    className="w-full bg-purple-500 text-white px-4 py-3 rounded hover:bg-purple-600 transition duration-300 flex items-center justify-center"
                  >
                    Save
                  </button>
  
                  <button
                    onClick={() => {
                
                      alert('Canceled');
                    }}
                    className="w-full bg-gray-500 text-white px-4 py-3 rounded hover:bg-gray-600 transition duration-300 flex items-center justify-center"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
  

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-gray-100 ">
      <div className="max-w-screen">
        <div className="flex flex-row ">
          <div className="flex flex-col bg-white h-screen ">
          <div className=" p-4 mb-8 bg-indigo-50">
          <div className='flex flex-row gap-2 w-full justify-between h-fit items-center'>
         
            <select className="w-full p-2 border rounded-lg mb-4 focus:border-indigo-600 focus:ring focus:ring-indigo-200">
              <option value="Filing">Gujarat-Gujarat</option>

              <option value="Casting">India</option>
              <option value="Polishing">Kolkata</option>
            </select>
            </div>
              <div className=" w-full flex flex-col ">
                <p  className='text-lg font-semibold'><FaUser className="inline mr-2 text-indigo-500" /> <strong className='text-blue-500'>(E1343) </strong> Pradeep Varma </p>

              </div>
            </div>
            <div className=" p-2 mb-8 transition-all duration-300 ease-in-out transform hover:scale-102">
              <div className="w-full flex flex-col items-center justify-center pt-2">
                {hasCamera ? (
                  <div className="w-64 h-64 bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                    <video ref={videoRef} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="relative h-64 w-64 bg-gray-50 rounded-lg shadow-lg overflow-hidden flex items-center justify-center" onClick={handleToggleScanner}>
                    <img src={ScannerIcon} alt="scanner" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute top-0 left-0 w-full h-full">
                      <div className="absolute top-0 w-full h-1 bg-red-500 animate-scanner-line"></div>
                    </div>
                  </div>
                )}
                <div className='h-[1.5rem] my-4'>
                  {errorMessage && <p className="text-red-600 text-base text-center">{errorMessage}</p>}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleCodeSubmit(barcode); }} className="w-fit">
                  <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden w-full">
                    <input
                      type="text"
                      className="p-3 w-fit text-gray-700 placeholder-gray-400 focus:outline-none"
                      placeholder="Enter Code"
                      value={scannedCode}
                      onChange={handleChange}
                    />
                    <button
                      onClick={handleScanSubmit}
                      className={`bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white px-6 py-3 font-semibold rounded-r-lg hover:bg-green-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
       

<div className="flex  px-4 py-1 w-full flex-col h-screen  overflow-auto">
        {renderJobDetails()}
        {renderRfBagDetails()}
      </div>
      <div className='h-fit   min-h-screen w-full lg:w-[20vw]  '>
        {renderSideJobDetails()}
      </div>
        </div>
      </div>
    </div>
  );
}


export default JobScan;

// T D: 2 Pcs /2 Ctw	
// T C: 2 Pcs /2 Ctw	
// T Misc: 2 Pcs /2 gm	
// Metal: 5 Gm	
// Finding: 2 Gm	
// Engaged Finding: 2 Gm


