

// // now in this code i have a qrcode scanner but currenty it is not working properly  so in place of this qrcodescabnner use scanner and all its functionalityt till scnnning to sound and all and integrate above scanner in this code successfully without any mistake .. also add one more thing to the process when scanner scans the code it will show
// import React, { useState, useEffect ,useRef} from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import QrReader from 'react-qr-barcode-scanner';
// import axios from 'axios';
// import Scannericon from '../Assets/Qrcode.png';
// import '../components/Scanner.css';
// import { MdOutlineArrowBackIos } from 'react-icons/md';
// import { FaArrowRight } from 'react-icons/fa';
// import { useRecoilValue } from 'recoil';
// import { rd3State, rd4State, YearCodeState } from '../Recoil/FetchDataComponent';
// import { IoMdExit } from 'react-icons/io';
// import { ClipLoader } from 'react-spinners';

// const useQueryParams = () => {
//   const location = useLocation();
//   return new URLSearchParams(location.search);
// };

// const ScannerPage = () => {
//   const navigate = useNavigate();
//   const [hasCamera, setHasCamera] = useState(true);
//   const [scannedCode, setScannedCode] = useState('');
//   const [barcode, setBarcode] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const companyCodeRef = useRef(null); 

//   useEffect(() => {
//     if (companyCodeRef.current) {
//       companyCodeRef.current.focus();
//     }
//   }, []);

//   const queryParams = useQueryParams();
//   const qcID = atob(queryParams.get('QCID'));
//   const empcode = atob(queryParams.get('empbarcode'));
//   const eveid = localStorage.getItem('eventId');
//   const yc = localStorage.getItem('yearcode');
//   const empfname = localStorage.getItem('empfname');
//   const emplname = localStorage.getItem('emplname');
//   const token = localStorage.getItem('proqctoken');
//   const empid = localStorage.getItem('empid');

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (errorMessage) {
//         setErrorMessage('');
//         setBarcode('');
//         setScannedCode('');
//         setHasCamera(true);
//       }
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, [errorMessage]);

//   const handleCodeSubmit = async (e) => {
//     e.preventDefault();
//     e.preventDefault();
//     if (barcode.trim() === '') {
//       setErrorMessage('Please enter your PIN.');
//     } else {
//           setLoading(true); 
//       try {
//         const response = await axios.post('https://api.optigoapps.com/ReactStore/ReactStore.aspx', {
//           con: "{\"id\":\"\",\"mode\":\"SCANJOB\",\"appuserid\":\"kp23@gmail.com\"}",
//           p: "eyJQYWNrYWdlSWQxIjoiMSIsIkZyb250RW5kX1JlZ05vMSI6Ijgwa2dpemJpZHV3NWU3Z2ciLCJDdXN0b21lcmlkMSI6IjEwIn0=",
//           dp: JSON.stringify({
//             empbarcode: empcode,
//             Jobno: barcode,
//             Customerid: "10",
//             eventid: eveid
//           })
//         }, {
//           headers: {
//             Authorization: token,
//             Yearcode: yc,
//             Version: "v1",
//             sp: '5',
//             sv:'0',
//             domain: "",
//             "Content-Type": "application/json",
//             "Cookie": "ASP.NET_SessionId=f0w3jjmd1vryhwsww0dfds1z"
//           }
//         });

//         if (response.data.Data.rd[0].stat === 1) {
//           localStorage.setItem('JobData', JSON.stringify(response.data.Data.rd));
//           navigate(`/job-questions?QCID=${btoa(qcID)}&empbarcode=${btoa(empcode)}&jobid=${btoa(barcode)}&employeeid=${btoa(empid)}&eventid=${btoa(eveid)}`);
//         } else {
//           setErrorMessage('Job scan failed. Please check the code and try again.');
//         }
//       } catch (error) {
//         setErrorMessage('API call failed. Please try again.');
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleScan = (result) => {
//     if (result) {
//       setScannedCode(result.text);
//       setBarcode(result.text);
//       setErrorMessage('');
//     }
//   };

//   const handleError = () => {
//     setHasCamera(false);
//   };

//   const handleChange = (e) => {
//     setBarcode(e.target.value);
//     setScannedCode(e.target.value);
//     setErrorMessage('');
//   };

//   return (
//     <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 via-indigo-50 to-green-100 p-4">
//       <div className="w-full max-w-lg flex flex-col items-center bg-purple-50 rounded-lg shadow-2xl mb-6 p-4">
//         <div className="flex items-center justify-between w-full">
//           <div>
//             <p className="text-lg font-bold text-gray-800">
//               <span className='text-[#56a4ff] font-semibold'>({empcode})</span> {empfname} {emplname}
//             </p>
//           </div>
//           <button
//             onClick={() => navigate('/empscan')}
//             className="flex items-center bg-red-500 text-white px-4 py-2 gap-3 rounded-lg hover:bg-red-600 transition duration-200"
//           >
//             <IoMdExit size={22} /> <p className='text-base'>Exit</p>
//           </button>
//         </div>
//       </div>

//       <div className="w-full max-w-lg flex flex-col items-center justify-center bg-white rounded-lg shadow-2xl p-8 pt-2">
//         <h2 className="text-2xl font-bold text-center gap-5 mb-6 text-gray-700">Scan Job</h2>
//         {hasCamera ? (
//           <div className="h-64 w-64 flex items-center justify-center bg-gray-100 rounded-lg shadow-lg mx-auto">
//             <QrReader
//               delay={300}
//               onScan={handleScan}
//               onError={handleError}
//               style={{ width: '100%', height: '100%' }}
//             />
//           </div>
//         ) : (
//           <div className="h-64 w-64 bg-white flex items-center justify-center rounded-lg shadow-lg relative overflow-hidden">
//             <img src={Scannericon} alt="scanner" className="h-full w-full object-contain" />
//             <div className="absolute top-0 left-0 w-full h-full">
//               <div className="w-full h-2 bg-red-500 animate-scanner-line"></div>
//             </div>
//           </div>
//         )}

//         {errorMessage && (
//           <p className="text-red-600 text-center mt-4">{errorMessage}</p>
//         )}

//         <div className="mt-6">
//           <form onSubmit={handleCodeSubmit} className="flex flex-col items-center">
//             <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden w-full">
//               <input
//                 type="text"
//                 className="p-3 w-full text-gray-700 placeholder-gray-400 focus:outline-none"
//                 placeholder="Enter job#"
//                 value={barcode}
//                 onChange={handleChange}
//                 onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit(e)} 
//                 ref={companyCodeRef}
           
//            />
//               <button
//                 type="submit"
//                 className={`bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 font-semibold rounded-r-lg hover:bg-green-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 disabled={loading}
//               >
//                 {loading ? <ClipLoader size={20} color="#fff" /> : 'Go'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScannerPage;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Scannericon from '../Assets/Qrcode.png';
import '../components/Scanner.css';
import { IoMdExit } from 'react-icons/io';
import { ClipLoader } from 'react-spinners';
import QrScanner from 'qr-scanner';
import notiSound from '../components/sound/Timeout.mpeg';
import Sound from 'react-sound';

const useQueryParams = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

const ScannerPage = () => {
  const navigate = useNavigate();
  const [hasCamera, setHasCamera] = useState(true); // Initially shows camera
  const [scannedCode, setScannedCode] = useState('');
  const [barcode, setBarcode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const companyCodeRef = useRef(null);

  const queryParams = useQueryParams();
  const qcID = atob(queryParams.get('QCID'));
  const empcode = atob(queryParams.get('empbarcode'));
  const eveid = localStorage.getItem('eventId');
  const yc = localStorage.getItem('yearcode');
  const empfname = localStorage.getItem('empfname');
  const emplname = localStorage.getItem('emplname');
  const token = localStorage.getItem('proqctoken');
  const empid = localStorage.getItem('empid');

  useEffect(() => {
    if (companyCodeRef.current) {
      companyCodeRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (videoRef.current && !scannerRef.current && hasCamera) {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleScan(result.data), // Pass the scanned data
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

  const playAudio = () => {
    setPlayStatus(Sound.status.PLAYING);
    setTimeout(() => setPlayStatus(Sound.status.STOPPED), 150);
  };

  const handleScan = (result) => {
    if (result) {
      setScannedCode(result);
      setBarcode(result);
      playAudio();
      setHasCamera(false); // Disable camera after scanning
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (barcode.trim() === '') {
      setErrorMessage('Please enter your PIN.');
    } else {
      setLoading(true);
      try {
        const response = await axios.post(
          'https://api.optigoapps.com/ReactStore/ReactStore.aspx',
          {
            con: '{"id":"","mode":"SCANJOB","appuserid":"kp23@gmail.com"}',
            p: 'eyJQYWNrYWdlSWQxIjoiMSIsIkZyb250RW5kX1JlZ05vMSI6Ijgwa2dpemJpZHV3NWU3Z2ciLCJDdXN0b21lcmlkMSI6IjEwIn0=',
            dp: JSON.stringify({
              empbarcode: empcode,
              Jobno: barcode,
              Customerid: '10',
              eventid: eveid,
            }),
          },
          {
            headers: {
              Authorization: token,
              Yearcode: yc,
              Version: 'v1',
              sp: '5',
              sv: '0',
              domain: '',
              'Content-Type': 'application/json',
              Cookie: 'ASP.NET_SessionId=f0w3jjmd1vryhwsww0dfds1z',
            },
          }
        );

        if (response.data.Data.rd[0].stat === 1) {
          localStorage.setItem('JobData', JSON.stringify(response.data.Data.rd));
          navigate(
            `/job-questions?QCID=${btoa(qcID)}&empbarcode=${btoa(empcode)}&jobid=${btoa(
              barcode
            )}&employeeid=${btoa(empid)}&eventid=${btoa(eveid)}`
          );
        } else {
          setErrorMessage('Job scan failed. Please check job# and try again.');
        }
      } catch (error) {
        setErrorMessage('Some Network Issue,Please try Again');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRescanClick = () => {
    setHasCamera(true);
    setScannedCode('');
    setBarcode('');
  };

  const handleChange = (e) => {
    setBarcode(e.target.value);
    setScannedCode(e.target.value);
    setErrorMessage('');
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 via-indigo-50 to-green-100 p-4">
      <Sound
        url={notiSound}
        playStatus={playStatus}
        onFinishedPlaying={() => setPlayStatus(Sound.status.STOPPED)}
      />
      <div className="w-full max-w-lg flex flex-col items-center bg-purple-50 rounded-lg shadow-2xl mb-6 p-4">
        <div className="flex items-center justify-between w-full">
          <p className="text-lg font-bold text-gray-800">
            <span className="text-[#56a4ff] font-semibold">({empcode})</span> {empfname} {emplname}
          </p>
          <button
            onClick={() => navigate('/empscan')}
            className="flex items-center bg-red-500 text-white px-4 py-2 gap-3 rounded-lg hover:bg-red-600 transition duration-200"
          >
            <IoMdExit size={22} /> <p className="text-base">Exit</p>
          </button>
        </div>
      </div>

      <div className="w-full max-w-lg flex flex-col items-center justify-center bg-white rounded-lg shadow-2xl p-8 pt-2">
        <h2 className="text-2xl font-bold text-center gap-5 mb-6 text-gray-700">Scan Job</h2>
        {hasCamera ? (
          <div className="h-64 w-64 flex items-center justify-center bg-gray-100 rounded-lg shadow-lg mx-auto">
            {/* <video ref={videoRef} style={{ width: '100%', height: '100%' }} /> */}
            <video ref={videoRef} style={{ width: '16rem', height: '16rem' }} />
          </div>
        ) : (
          <div className="h-64 w-64 bg-blue-200 flex items-center justify-center rounded-lg shadow-lg relative overflow-hidden">
            <button onClick={handleRescanClick} className="p-4 bg-blue-200 text-indigo-500 text-xl font-bold rounded-xl">
              Click here to scan again
            </button>
          </div>
        )}

        {errorMessage && <p className="text-red-600 text-center mt-4">{errorMessage}</p>}

        <div className="mt-6">
          <form onSubmit={handleCodeSubmit} className="flex flex-col items-center">
            <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden w-full">
              <input
                type="text"
                className="p-3 w-full text-gray-700 placeholder-gray-400 focus:outline-none"
                placeholder="Enter job#"
                value={barcode}
                onChange={handleChange}
                ref={companyCodeRef}
              />
              <button
                type="submit"
                className={`bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 font-semibold rounded-r-lg hover:bg-green-700 transition duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? <ClipLoader size={20} color="#fff" /> : 'Go'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;

