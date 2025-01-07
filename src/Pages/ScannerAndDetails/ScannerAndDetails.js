import React, { useState, useRef, useEffect } from 'react';
import { FaQrcode, FaUser, FaEdit } from 'react-icons/fa';
import QrScanner from 'qr-scanner';
import { ClipLoader } from 'react-spinners';
import ScannerIcon from '../../Assets/Qrcode.png';
import img from '../../Assets/Jew.jpg';
import '../../components/Scanner.css';
import Jobdetails from './Jobdetails';
import Bulkjobscan from './Bulkjobscan';
import { BiArrowToRight } from "react-icons/bi";
import JobDetailsTab from './JobDetailsTab';
import RfBagDetails from './RfBagDetails';
import ReturnJobDetails from './ReturnJobDetails';
import { TfiUnlock } from "react-icons/tfi";
import { dbJobdetails } from '../../fakeapi/JobDetails';
import { Rmbag } from '../../fakeapi/Rmbag';
import Swal from 'sweetalert2';
import { LocalSet,LocalGet } from './LocFunctions';

const ScannerAndDetails = () => {
const [scannedCode, setScannedCode] = useState('');
const [jobDetails, setJobDetails] = useState(null);
const [bulkJobDetails, setBulkJobDetails] = useState([]);
const [bulkScan, setBulkScan] = useState(false);
const [rfBagDetails, setRfBagDetails] = useState(null);
const [hasCamera, setHasCamera] = useState(true);
const [barcode, setBarcode] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [loading, setLoading] = useState(false);
const [rfBagArray, setRfBagArray] = useState([]); 
const videoRef = useRef(null);
const scannerRef = useRef(null);
const [selectedDept, setSelectedDept] = useState('');
const [bulkscancheck,setBulkscancheck] = useState(false);
const [employeeScanned, setEmployeeScanned] = useState(false);
const [employeeDetails, setEmployeeDetails] = useState(null);
const [returnjobdetails,setReturnjobdetails] = useState(null);
const [returnModeJob,setReturnModeJob] = useState(null);
const [jobflag,setJobflag]=useState('');
const [mode, setMode] = useState('Issue');
const [jobmode,setJobmode] = useState('Issue');
const EmployeeCodeRef = useRef(null); 
const [selectedRowIds, setSelectedRowIds] = useState([]); 
const JobRef = useRef(null); 
const Operator = JSON.parse(localStorage.getItem('tnxoperator'));
const tnxlocker = Operator?.["10"];
const lockerarray = JSON.parse(localStorage.getItem('tnxlockerid'));
const materialarray = JSON.parse(localStorage.getItem('tnxmaterialid'));
const Employees = LocalGet("tnxemployees");
const jobData = LocalGet("tnxjobs");
const Location = LocalGet("tnxlocation");
const rfBags = LocalGet("tnxrmbags");
console.log(JSON.stringify(Location),'jobData');


useEffect(() => {
    const handleFocus = () => {
      if (mode === 'Issue' && !employeeScanned && EmployeeCodeRef.current) {
        EmployeeCodeRef.current.focus();
      } else if (mode === 'Return' && JobRef.current) {
        JobRef.current.focus();
      }
    };
const timeoutId = setTimeout(handleFocus, 0);
   return () => clearTimeout(timeoutId);
 }, [employeeScanned, mode]);  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName !== 'INPUT') {
        event.preventDefault();
        const key = event.key.toUpperCase();  
        if (key === 'E' && EmployeeCodeRef.current) {
          EmployeeCodeRef.current.focus();
        } else if (/^[0-9]$/.test(key) && JobRef.current) {
          JobRef.current.focus();
        } else if (event.key.length === 1 && /^[0-9]$/.test(key) && scannedCode.length < 10) {
          setScannedCode(prev => prev + key);
        }
        if (scannedCode.length === 10) {
          handleScanSubmit();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [scannedCode]);

  const handleSelectedRowsChange = (selectedRows) => {
    setSelectedRowIds(selectedRows);
  };

  const handleUnlockEngage = () => {
    Swal.fire({
      icon: 'success',
      title: 'Material Unlocked',
      timer: 10000,
      text: 'The selected materials have been successfully Unlocked!',
      confirmButtonText: 'OK'
    });
  };
  function getValuesByIds(idsStringOrNum, array, num, match) {
    const ids = typeof idsStringOrNum === 'string' 
                  ? idsStringOrNum.split(",").map(id => id.trim()) 
                  : [idsStringOrNum];
  
    const result = [];
    
    ids.forEach(id => {
      const matchingObj = array?.find(obj => obj[`${num}`] === Number(id));
      if (matchingObj) {
        result.push(matchingObj[`${match}`]);
      }
    });
    
    return result;
  }
  
  const locker =  getValuesByIds(tnxlocker,lockerarray,1,2);


  console.log("loc",locker);
  const handleModeToggle = (mode) => {
    setMode(mode);  
    setEmployeeScanned(false);
    setEmployeeDetails(null);
    setScannedCode('');
    setJobDetails(null);
    setBulkJobDetails([]);
    setBulkScan(false);
    setBulkscancheck(false);
    setReturnjobdetails(null);
    setReturnModeJob(null);
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
  }, [hasCamera]);
  
const handleempChange = (e) => {
    setErrorMessage('');
    const value = e.target.value.toUpperCase(); 
    setScannedCode(value); 
  };
  const handleScan = (result) => {
    if (result) {
      setBarcode(result);
      handleScanSubmit(result);
    }
  };
const handleScanSubmit = () => {
    setErrorMessage('');
    let emplocation = [];
    let emplocker = [];
    if (mode === 'Issue' && !employeeScanned) {
      if (!scannedCode) { 
        setErrorMessage('Please enter employee code.');
      } else {
        const employeeFound = Employees.find(emp => emp["2"] === scannedCode);

        if (employeeFound) {
          if (employeeFound['10'] && employeeFound['9']) { 
            const locationString = employeeFound['9'];
            const lockerstring = employeeFound['10'];
            const emplocation = getValuesByIds(locationString, Location, 1, 2);
            const emplocker = getValuesByIds(lockerstring, lockerarray, 1, 2);
            console.log(emplocation, 'location');
            console.log(emplocker, 'emplocker');
            setEmployeeDetails(employeeFound);
            setEmployeeScanned(true);
            setErrorMessage('');
            setScannedCode('');
          } else {
            setErrorMessage("Employee doesn't have any location rights");
          }
        } else {
          setErrorMessage('Employee not found.');
        }
      }
    } else if (mode === 'Issue' && employeeScanned) {
      const isJobId = /^\d+\/\d+$/.test(scannedCode);
      if (isJobId) {
        const jobFound = jobData.find(job => job?.['2'] === scannedCode);
        if (jobFound) {
          if (emplocation.some(location => location.toUpperCase() !== jobFound?.['13']?.toUpperCase()))
           {
            setErrorMessage('Job Is not In Same Location');
          } else {
            setRfBagArray([]);
            setJobDetails(null);
            setBulkscancheck(false);
            setReturnjobdetails(null);
            if (jobFound?.['16'] === 0) {
              setJobDetails(jobFound);
             
              setBulkscancheck(true);
              if (bulkScan) {
                setBulkJobDetails(prev => {
                  const updatedBulkJobs = prev.filter(existingJob => existingJob.jobId !== jobFound.jobId);
                  console.log("updatedBulkJobs", bulkJobDetails);
                  return [jobFound, ...updatedBulkJobs];
                });
              } else {
                setJobDetails(jobFound);
                setBulkJobDetails([]);
              }
              setScannedCode('');
            } else {
              setReturnjobdetails(jobFound);
              if (bulkScan) {
                setErrorMessage('Job already Issued');
                setBulkscancheck(true);
              } else {
                setBulkJobDetails([]);
                setScannedCode('');
              }
            }
          }
        } else {
          setErrorMessage('Job ID not found.');
        }
      } else if (scannedCode.length === 10) {
        if (jobDetails || returnjobdetails) {
          console.log("hiii");
          
          const rfBagFound = rfBags.find(bag => bag?.['1'] === scannedCode);
          console.log(rfBagFound, 'rfBagFound');
          
          if (rfBagFound) {
            
            const rmlocker = getValuesByIds(rfBagFound['12'], lockerarray, 1, 2);
            const rmlockerString = String(rmlocker?.[0] || '');
            console.log(rmlockerString?.toLocaleUpperCase(), "abcd");
            
            if (locker.some(tnxlocker => String(tnxlocker).toUpperCase() === rmlockerString.toUpperCase())) {
              
              const tnxmaterial = getValuesByIds(rfBagFound?.['2'], materialarray, 1, 2);
              const material = String(tnxmaterial?.[0] || '');
              console.log(material);
              
              const job = jobDetails || returnjobdetails;
              console.log(material);
              
              if (material === 'METAL') {
                console.log(material, 'material');
                
                const bagField5 = String(rfBagFound?.['5'] || '');
                const jobField8 = String(job?.['8'] || '');
                const bagField6 = String(rfBagFound?.['6'] || '');
                const jobField9 = String(job?.['9'] || '');
      
                if (bagField5.toUpperCase() !== jobField8.toUpperCase() || bagField6.toUpperCase() !== jobField9.toUpperCase()) {
                  console.log(bagField5.toUpperCase(), jobField8.toUpperCase(), 'as');
                  setErrorMessage('Please scan a valid RM bag for metal.');
                } else {
                  console.log(bagField5.toUpperCase(), jobField8.toUpperCase(), 'abcd');
                  setRfBagArray(prev => [rfBagFound, ...prev]);
                  console.log(rfBagArray, 'rfbag');
                  setScannedCode('');
                }
                
              } else if (material !== 'METAL') {
                console.log(rfBagFound, 'rfbag');
                console.log('cus', job);
                
                const bagField14 = String(rfBagFound?.['14'] || '');
                const jobField14 = String(job?.['17'] || 'STOCK');
      
                if (bagField14.toUpperCase() !== jobField14.toUpperCase() && bagField14.toUpperCase() !== 'STOCK') {
                  console.log('rfBagFound?.customerName?.toUpperCase()', bagField14.toUpperCase());
                  setErrorMessage('Please scan a valid customer\'s RM bag.');
                } else {
                  setRfBagArray(prev => [rfBagFound, ...prev]);
                  setScannedCode('');
                }
              }
            } else {
              setErrorMessage("RM Bag is not in the same locker");
            }
            
          } else {
            setErrorMessage('RM Bag ID not found.');
          }
        } else {
          setErrorMessage('Please scan a job before scanning RM Bag.');
        }
      }
      else {
        setErrorMessage('');
      }
    } else if (mode === 'Return') {
      const isJobId = /^\d+\/\d+$/.test(scannedCode);
      if (isJobId) {
        const jobFound = jobData.find(job => job?.['2'] === scannedCode );
        console.log("Return Mode Job Found:", jobFound); 
        if (jobFound && jobFound?.['16'] == 1 ) {
          setReturnModeJob(jobFound); 
          setScannedCode('');
        } else {
          setErrorMessage('Job Is Not Issued Yet!');
          console.log(jobFound,'fj');
        }
      } else if (scannedCode.length === 10) {
        const rfBagFound = rfBags.find(bag => bag?.['1'] === scannedCode);
        if (rfBagFound && returnModeJob) {
          setRfBagArray(prev => [rfBagFound, ...prev]); 
          setEmployeeScanned(true);
          setEmployeeDetails({empid: 'E1203', workerfname: "John", workerlname: "Doe"}); 
          setMode('Issue'); 
          setReturnjobdetails(returnModeJob);
          setScannedCode('');
        } else {
          setErrorMessage('RM Bag ID not found or no Job scanned yet.');
        }
      } else {
        setErrorMessage('');
      }
    }
  };

const handleChange = (e) => {
    setScannedCode(e.target.value); 
    setErrorMessage(''); 
  };

const handleToggleBulkScan = (e) => {
    const isBulkScanChecked = e.target.checked;
    setBulkScan(isBulkScanChecked);

    if (isBulkScanChecked && jobDetails) {
      setBulkJobDetails((prev) => [jobDetails, ...prev]);
    } else if (!isBulkScanChecked) {
      
      setBulkJobDetails((prev) => prev.slice(1));
    }
};

const handleToggleScanner = () => {
    setHasCamera(true);
};

const handleChangeEmployee = () => {
    setEmployeeScanned(false);  
    setEmployeeDetails(null);      
    setBarcode('');                
    setBulkJobDetails([]);    
    setJobDetails(null);
    setRfBagDetails(null); 
    setReturnjobdetails(null);     
    setBulkScan(false);   
    setRfBagArray([]);
    setErrorMessage('');        
};

const handleissuesubmit = () =>{
 setBarcode('');                
 setBulkJobDetails([]);    
 setJobDetails(null);
 setRfBagDetails(null); 
 setReturnjobdetails(null);     
 // setBulkScan(false);   
 setRfBagArray([]);
 setErrorMessage('');    
 setBulkScan(false);    
 setBulkscancheck(false);
}

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-gray-100">
      <div className="max-w-screen">
        <div className="flex flex-row transition-all duration-500 ease-in-out transform">
          {mode === 'Issue' && !employeeScanned ?   (
            <div className="flex flex-col bg-white h-screen">

              <div className="p-4 mb-8 bg-indigo-50">   
              <div className="flex items-center justify-center mb-4">
        <div className="relative bg-gray-200 rounded-full inline-flex">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-full   focus:outline-none ${
              mode === 'Issue'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 '
            }`}
            onClick={() => handleModeToggle('Issue')}
            >
            Issue
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-full focus:outline-none ${
              mode === 'Return'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 '
            }`}
            onClick={() => handleModeToggle('Return')}
          >
            Return
          </button>
        </div>
      </div>
      <select className="w-full p-2 border  rounded-lg mb-4 focus:border-indigo-600 focus:ring focus:ring-indigo-200">
  {locker.map((lock, index) => (
    <option key={index} value={lock}>
      {lock}
    </option>
  ))}
</select>
                <h2 className="text-lg font-semibold">
                  <FaUser className="inline mr-2 text-indigo-500" /> Scan Employee ID
                </h2>
              </div>
              <div className="p-2 mb-8 transition-all duration-300 ease-in-out transform hover:scale-102">
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
                  <div className="h-[1.5rem] my-4">
                    {errorMessage && <p className="text-red-600 text-base text-center">{errorMessage}</p>}
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); handleScanSubmit(); }} className="w-fit">
                    <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden w-full">
                    <input
                    type="text"
                    className="p-3 w-fit text-gray-700 placeholder-gray-400 focus:outline-none"
                    placeholder="Enter Employee ID"
                    value={scannedCode.toUpperCase()}
                    onChange={(e) => handleempChange(e)}
                    ref={EmployeeCodeRef} 
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
          ) : (
<div className='flex flex-row w-screen  h-screen overflow-auto flexoverflow-x-hidden'>
<div className="flex flex-col justify-between max-w-96 bg-white h-screen">   
<div className=''>
<div className="p-4 mb-2 bg-indigo-50">
<div className="flex items-center justify-center mb-4">
<div className="relative bg-gray-200 rounded-full inline-flex">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-full   focus:outline-none 
            ${mode === 'Issue' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 ' }`}
            onClick={() => handleModeToggle('Issue')}
            >
            Issue
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-full focus:outline-none 
            ${  mode === 'Return'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 '
            }`}
            onClick={() => handleModeToggle('Return')}
          >
            Return
          </button>
        </div>
            </div>
           <div className="flex flex-row gap-2 w-full justify-between h-fit items-center">     
      <select className="w-full p-2 border rounded-lg mb-4 focus:border-indigo-600 focus:ring focus:ring-indigo-200">
  {locker.map((lock, index) => (
    <option key={index} value={lock}>
      {lock}
    </option>
  ))}
</select>
           </div>
           {mode === 'Issue' && (
   <div className="w-full flex flex-wrap justify-between">
   <p className="text-lg font-semibold flex flex-row items-center gap-2">
     <FaUser className="inline mr-2 text-indigo-500" />
     <div className='flex flex-col'>
     <strong className="text-blue-500">({employeeDetails?.['2']}) </strong>
      <p className="text-lg font-semibold">
  {employeeDetails?.['4']} {employeeDetails?.['5']} </p>
      </div>

   </p>
<button
onClick={handleChangeEmployee}
className=" text-blue-500 underline rounded-lg flex items-center ">
Change 
</button>
 </div>  )}
        
         </div>
        
         {(bulkScan || bulkscancheck) && (
  <div className="w-full flex flex-row justify-between pl-4">
    <div className="flex items-center">
      <input
        type="checkbox"
        id="bulkScan"
        checked={bulkScan}
        onChange={handleToggleBulkScan}  
        className="mr-2"
      />
      <label htmlFor="bulkScan" className="text-gray-700 font-medium">
        Bulk Scan
      </label>      
    </div>
  </div>
)}
          <div className="p-2 mb-8 transition-all duration-300 ease-in-out transform hover:scale-102">
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
             <div className="h-[1.5rem] my-4">
               {errorMessage && <p className="text-red-600 text-base text-center">{errorMessage}</p>}
             </div>
              <form onSubmit={(e) => { e.preventDefault(); handleScanSubmit(); }} className="w-fit">
               <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden w-full">
                 <input
                   type="text"
                   className="p-3 w-fit text-gray-700 placeholder-gray-400 focus:outline-none"
                   placeholder="Enter Job or RM Bag ID"
                   value={scannedCode}
                   onChange={handleChange}
                   ref={JobRef}
                 />
                 <button
                   onClick={handleScanSubmit}
                   className={`bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white px-6 py-3 font-semibold rounded-r-lg hover:bg-green-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                   disabled={loading}
                 >
                   {loading ? <ClipLoader size={20} color="#fff" /> : (
                     <>
                       <FaQrcode className="mr-2 h-full" /> Scan
                     </>

)}
                 </button>
               </div>
             </form>
</div>
</div>  
</div>  

{mode === 'Issue' && (jobDetails || returnjobdetails || bulkJobDetails.length > 0) && (
<div className='flex flex-col'> 
{!returnjobdetails && !bulkScan &&  (
  <button
  onClick={handleUnlockEngage}
  className={`bg-gradient-to-r from-orange-300 to-orange-500 m-3 rounded-md   flex items-center justify-center text-lg text-white px-6 py-3 mt-4 font-semibold hover:bg-green-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
  disabled={loading}
>
  {loading ? (
    <ClipLoader size={20} color="#fff" />
  ) : (
    <>
     Unlock Engage
      <TfiUnlock size={20} className="ml-2" />
    </>
  )}
</button>
)}
  <button
    onClick={handleissuesubmit}
    className={`bg-gradient-to-r from-blue-400 to-blue-600 flex  m-3 rounded-md mt-0 items-center justify-center text-lg text-white px-6 py-3 font-semibold hover:bg-green-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    disabled={loading}
  >
    {loading ? (
      <ClipLoader size={20} color="#fff" />
    ) : (
      <>
        Issue All
        <BiArrowToRight size={26} className="ml-2" />
      </>
    )}
  </button>

</div>
)}
       </div>
<div className='w-full  flex felx-col  h-screen overflow-auto '>
{mode === 'Issue' ? (
<>
  {bulkScan  ? (
  <div className='w-full h-full items-start flex flex-col justify-start'>
                <Bulkjobscan jobList={bulkJobDetails} /></div>
              ) : (
                jobDetails &&     
               <div className='p-4 w-full h-screen flex flex-col justify-between' >
                <Jobdetails jobDetail={jobDetails} />
                {rfBagArray.length > 0 && (
                <div className="h-[30vh] overflow-auto flex flex-col justify-end items-end ">
                  <RfBagDetails bagDetails={rfBagArray}     setBagDetails={setRfBagArray}/> 
           
                </div>
              )}
                <JobDetailsTab onSelectedRowsChange={handleSelectedRowsChange}  jobflag={jobDetails?.['16']} jobDetail={jobDetails} />
               </div>
                
              )}

{returnjobdetails &&  !bulkScan &&(
<>
<div className='p-4 w-full h-screen flex flex-col justify-between' >
        <Jobdetails jobDetail={returnjobdetails} />
        {rfBagArray.length > 0 && (
        <div className="h-[30vh] overflow-auto  flex flex-col justify-end items-end ">
  <RfBagDetails bagDetails={rfBagArray}     setBagDetails={setRfBagArray}/> 
        </div>
      )}
        <JobDetailsTab onSelectedRowsChange={handleSelectedRowsChange}  jobflag={returnjobdetails?.['16']} jobDetail={returnjobdetails} />
       </div>
</>
)}
</>):(<> 
{returnModeJob && (
  <div className='p-4 w-full h-screen flex flex-col justify-between' >  
    <Jobdetails jobDetail={returnModeJob} />
    <ReturnJobDetails jobDetails={returnModeJob}/>
    <JobDetailsTab onSelectedRowsChange={handleSelectedRowsChange}  jobflag={returnModeJob?.['16']} jobDetail={returnModeJob} />
 </div>
  )}
</>)}
</div>
       </div>   
          )}
    </div>
      </div>
    </div>
  );
};

export default ScannerAndDetails;





