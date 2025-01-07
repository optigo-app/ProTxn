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
import { LocalSet,LocalGet } from './ScannerAndDetails/LocFunctions';

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
const employees =LocalGet('tnxemployees') || '[]';
  // console.log('tnxemployees',employees);
console.log("employees",employees);

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

const EmployeeCodeRef = useRef(null);
const PinRef = useRef(null);

useEffect(() => {
    if (EmployeeCodeRef.current) {
      EmployeeCodeRef.current.focus();
    }
  }, []);

useEffect(() => {
    if (isSlideVisible && PinRef.current) {
      PinRef.current.focus();
    }
  }, [isSlideVisible]);

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
      validateEmployee(result.text);
    }
  };

  const handleError = () => {
    setHasCamera(false);
  };

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    setBarcode(value);
    setScannedCode(value);
    if (errorMessage) setErrorMessage('');
  };

  // const validateEmployee = (scannedCode) => {
  //   const Foundemp = employees.find(employee => employee?.["2"] === scannedCode);
  //   if (Foundemp) {
  //     if (Foundemp['10'] && Foundemp['9']) { 
  //       LocalSet('tnxoperator', Foundemp);
  //       setIsSlideVisible(true);
  //       setErrorMessage('');
  //     } else {
  //       setErrorMessage('Employee has no location rights');
  //       console.log("Foundemp", Foundemp);
  //     }
  //   } else {
  //     setErrorMessage('Invalid employee');
  //   }
  // };

  const validateEmployee = (scannedCode) => {
    const normalizedScannedCode = String(scannedCode).trim().toUpperCase();
    const Foundemp = employees.find(employee => 
      String(employee?.["2"] || "").trim().toUpperCase() === normalizedScannedCode
    );

    if (Foundemp) {
      const hasLocationRights = Boolean(Foundemp['10']);
      const hasAdditionalRights = Boolean(Foundemp['9']);
      if (hasLocationRights && hasAdditionalRights) {
        LocalSet('tnxoperator', Foundemp);  
        setIsSlideVisible(true);  
        setErrorMessage('');  
      } else {
        setErrorMessage('Employee has no location rights');
        console.log("Access Rights Missing:", Foundemp);
      }
    } else {
      setErrorMessage('Invalid employee');
      console.log("Invalid Scanned Code:", scannedCode);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (barcode.trim() === '') {
      setErrorMessage('Please enter a valid barcode.');
    } else {
      validateEmployee(barcode);
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin.trim() === '123456') {
      navigate('/JobScan');
    } else {
      setErrorMessage('Please enter a valid PIN.');
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-[#E8EEEC] p-4">
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
                    value={barcode.toUpperCase()}
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


    </div>
  );

};

export default Scanemp;
