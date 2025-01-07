 
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import QrReader from 'react-qr-barcode-scanner';
import { FaQrcode, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import Scannericon from '../Assets/Qrcode.png';
import { useRecoilValue } from 'recoil';
import { rd4State } from '../Recoil/FetchDataComponent';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';

const Scanemp = () => {
 
  const navigate = useNavigate();
  const [barcode, setBarcode] = useState('');
  const [scannedCode, setScannedCode] = useState('');
  const [hasCamera, setHasCamera] = useState(true);
  const [qcdept, setQcdept] = useState([]);
  const [employeeid, setEmployeeid] = useState();
  const [eventid, setEventid] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalButtons, setModalButtons] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [isPinVisible, setIsPinVisible] = useState(false); 
  const [isSlideVisible, setIsSlideVisible] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false); 
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F12') {
        e.preventDefault();
        setIsScannerActive(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const yc = localStorage.getItem('yearcode');
  const token = localStorage.getItem('proqctoken');
  const rd4 = useRecoilValue(rd4State);
  const EmployeeCodeRef = useRef(null); 
  const PinRef = useRef(null); 

  useEffect(() => {
    if (EmployeeCodeRef.current) {
      EmployeeCodeRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorMessage) {
        setErrorMessage('');
        // setBarcode('');
        // setScannedCode('');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const handleScan = (result) => {
    if (result) {
      setScannedCode(result.text);
      setBarcode(result.text);
    }
  };

  const handleError = () => {
    setHasCamera(false);
  };

  const handleChange = (e) => {
    setBarcode(e.target.value);
    setScannedCode(e.target.value);
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (barcode.trim() === '') {
      setErrorMessage('Please enter a valid barcode.');
    } else {
      setIsSlideVisible(true);
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin.trim() === '') {
      setErrorMessage('Please enter your PIN.');
    } else {
      senddatatoapi(barcode, pin);
    }
  };

  const senddatatoapi = (barcode, pin) => {
    setLoading(true);
    const myHeaders = {
      Authorization: token,
      Yearcode: yc,
      Version: "v1",
      sp: '5',
      sv:'0',
      domain: "",
      "Content-Type": "application/json",
    };

    const raw = JSON.stringify({
      con: "{\"id\":\"\",\"mode\":\"SCANEMP\",\"appuserid\":\"kp23@gmail.com\"}",
      p: "eyJQYWNrYWdlSWQxIjoiMSIsIkZyb250RW5kX1JlZ05vMSI6Ijgwa2tpemJpZHV3NWU3Z2ciLCJDdXN0b21lcmlkMSI6IjEwIn0=",
      dp: `{\"empbarcode\":\"${barcode}\",\"FrontEnd_RegNo\":\"\",\"pin\":\"${pin}\",\"Customerid\":\"\"}`,
    });

    axios.post('https://api.optigoapps.com/ReactStore/ReactStore.aspx', raw, { headers: myHeaders })
      .then((response) => {
        setLoading(false);
        const status = response.data.Data.rd[0].stat;
        if (status === 1) {
          const qcdepartment = response.data.Data.rd[0].qcdept.split(',');
          const empid = response.data.Data.rd[0].emp_id;
          const eveid = response.data.Data.rd[0].eventid;
          const qcdept = response.data.Data.rd[0].qcdept;
          const fname = response.data.Data.rd[0].emp_firstname;
          const lname = response.data.Data.rd[0].emp_lastname;
          
          localStorage.setItem('empfname', fname);
          localStorage.setItem('emplname', lname);
          localStorage.setItem('empid', empid);
          localStorage.setItem('qcdept', qcdept);
          localStorage.setItem('eventId', eveid);
          setEmployeeid(empid);
          setEventid(eveid);

          const filteredQcdeptNames = rd4
            .filter(item => qcdepartment.includes(item.id.toString()))
            .map(item => item.qcdeptname);

          const filteredQcdeptIds = rd4
            .filter(item => qcdepartment.includes(item.id.toString()))
            .map(item => item.id);

          setQcdept(filteredQcdeptNames);

          if (filteredQcdeptNames.length > 1) {
            setModalButtons(filteredQcdeptNames);
            setIsModalOpen(true);
          } else if (filteredQcdeptNames.length === 1) {
            const qcdeptId = filteredQcdeptIds[0];
            navigate(`/job-questions?QCID=${btoa(qcdeptId)}&empbarcode=${btoa(barcode)}&employeeid=${btoa(empid)}}`);
          }
        } else {
          setErrorMessage("Invalid Employee Barcode or pin . Please try again.");
        }
      })
      .catch((error) => {
        setLoading(false);
        setErrorMessage("Some ErrorOccured. Please try again.");
        console.error(' ', error);
      });
  };

  const handlebuttonclick = (qcdeptId) => {
    navigate(`/job-questions?QCID=${btoa(qcdeptId)}&empbarcode=${btoa(barcode)}&employeeid=${btoa(employeeid)}`);
  };


  const Modal = ({ buttons, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 p-4 md:p-20 bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl flex flex-col justify-center items-center relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 transition duration-200"
        >
          <FaTimes size={20} />
        </button>
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-700">Select QC Department</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2  gap-4">
          {buttons.map(({ name, id }) => (
            <div
              key={id}
              onClick={() => handlebuttonclick(id)}
              className=" text-lg h-24 px-6 flex items-center justify-center bg-blue-50 hover:bg-green-100 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
            >
              <p className="text-gray-800 font-semibold">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  useEffect(() => {
    if (isSlideVisible && PinRef.current) {
      PinRef.current.focus();
    }
  }, [isSlideVisible]);
  

  const handleLogout = () => {
    localStorage.removeItem('UploadLogicalPath');
    localStorage.removeItem('ukey');
    localStorage.removeItem('yearcode');
    localStorage.removeItem('proqctoken');
    localStorage.removeItem('rd');
    localStorage.removeItem('rd1');
    localStorage.removeItem('rd2');
    localStorage.removeItem('rd3');
    localStorage.removeItem('rd4');
    localStorage.removeItem('rd5');
    navigate('/');
  };
  

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-indigo-50 to-green-100 p-4">
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-200"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>

      <AnimatePresence>
        {!isSlideVisible ? (
          <div className="w-full max-w-lg flex flex-col justify-center bg-white rounded-lg shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Scan Employee Barcode</h2>
            {hasCamera ? (
              <div className="h-64 w-64 flex items-center justify-center bg-gray-100 rounded-lg shadow-lg mx-auto">
                <QrReader
                  delay={300}
                  onError={handleError}
                  onScan={handleScan}
                  style={{ width: '100%', height: '100%' }}
                />  
              </div>
            ) : (
              <div className="h-64 w-64 flex items-center justify-center bg-gray-100 rounded-lg shadow-lg mx-auto">
                <img src={Scannericon} alt="Scanner" className="h-full w-full object-contain" />
              </div>
            )}

       
                          {errorMessage && (
                            <div className="mt-4 text-red-600 rounded-lg">
   {errorMessage}
                               </div>
                          )}
              
                          <div className="mt-6">
                            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                              <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden w-full">
                                <input
                                  type="text"
                                  className="p-3 w-full text-gray-700 placeholder-gray-400 focus:outline-none"
                                  placeholder="Enter Employee Barcode"
                                  value={barcode}
                                  onChange={handleChange}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                 ref={EmployeeCodeRef} 
                              
                              />
                                <button
                                  type="submit"
                                  className={`bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 font-semibold rounded-r-lg hover:bg-green-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  disabled={loading}
                                >
                                  {loading ? <ClipLoader size={20} color="#fff" /> : 'Go'}
                                </button>
                              </div>
                            </form>
                          
                          </div>
                        </div>
                      ) : (
                        
                        <motion.div
                        className="w-full max-w-lg flex flex-col justify-start h-80 items-center bg-white rounded-lg shadow-2xl p-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 1 }}
                      >
                        <div className='flex flex-row justify-between  h-fit w-full  items-center mb-2'>
                          <button
                            onClick={() => setIsSlideVisible(false)}
                            className=" text-gray-600 hover:text-gray-900 transition duration-200"
                          >
                            <FaArrowLeft size={20} />
                          </button>
                          <div className='w-full flex flex-col justify-center items-center'>
                            <p className="text-lg font-semibold text-center text-gray-700">Enter PIN </p>
                            <p className='text-[#26486e] text-2xl font-bold'>{barcode}</p>
                          </div>
                          <div className=" text-gray-600 w-20 hover:text-gray-900 transition duration-200"></div>
                        </div>
                  
                        <form onSubmit={handlePinSubmit} className="flex flex-col w-full h-full justify-center items-center">
                          <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden w-full">
                            <input
                              type="text" 
                              className="p-3 w-full text-gray-700 placeholder-gray-400 focus:outline-none"
                              placeholder="Enter PIN"
                              value={pin}
                              onChange={(e) => setPin(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit(e)}
                              style={{
                                WebkitTextSecurity: !isPinVisible ? 'disc' : 'none',  
                                textSecurity: !isPinVisible ? 'disc' : 'none', 
                                fontFamily: !isPinVisible ? 'inherit' : 'inherit', 
                                // letterSpacing: !isPinVisible ? '3px' : 'normal',
                              }}
                              ref={PinRef}
                            />
                            <button
                              type="button"
                              className="px-3"
                              onClick={() => setIsPinVisible(!isPinVisible)} 
                            >
                              {isPinVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                          </div>
                          {errorMessage && (
                            <div className="mt-4 p-2 text-red-600 text-center rounded-lg">
                              {errorMessage}
                            </div>
                          )}
                  
                          <button
                            type="submit"
                            className={`bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 font-semibold mt-5 w-full rounded-lg hover:bg-green-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                          >
                            {loading ? <ClipLoader size={20} color="#fff" /> : 'Submit'}
                          </button>
                        </form>
                      </motion.div>
                      )}
                    </AnimatePresence>
              
                    {isModalOpen && (
             
                      <Modal
                        buttons={modalButtons.map(name => ({ name, id: rd4.find(item => item.qcdeptname === name)?.id }))}
                        onClose={() => setIsModalOpen(false)}
                      />
                    )}
                  </div>
                );
            
              };
              
              export default Scanemp;
              