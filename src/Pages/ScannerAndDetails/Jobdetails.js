import React, { useState, useEffect, useRef } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { MdNumbers } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import ScannerIcon from '../../Assets/Qrcode.png';
import QrScanner from 'qr-scanner';
import { ClipLoader } from 'react-spinners';
import img from '../../Assets/Jew.jpg';
import { FaQrcode } from 'react-icons/fa';
import '../../components/Scanner.css';


const Jobdetails = ({ jobDetail }) => {
    console.log('jobDetail: ', jobDetail);
    const [scannedCode, setScannedCode] = useState('');
    const [hasCamera, setHasCamera] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const videoRef = useRef(null);
    const scannerRef = useRef(null);
    const JobRef = useRef(null);
    const [returnWeight, setReturnWeight] = useState('');
    const [rmbagDetails, setRmbagDetails] = useState(false);
    const [returnsprued, setReturnsprued] = useState('');
    const [loading, setLoading] = useState(false);

    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);

    const handleOpenInfoModal = () => setIsInfoModalOpen(true);
    const handleCloseInfoModal = () => setIsInfoModalOpen(false);

    const handleOpenWeightModal = () => setIsWeightModalOpen(true);
    const handleCloseWeightModal = () => setIsWeightModalOpen(false);


    const submitretwt = () => {
        setReturnsprued(returnWeight);
        handleCloseWeightModal();
    }
    useEffect(() => {
        if (isWeightModalOpen && JobRef.current) {
            JobRef.current.focus();
        }
    }, [isWeightModalOpen]);

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                handleCloseInfoModal();
                handleCloseWeightModal();
            }
        };
        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, []);
    const handleRMChange = (e) => {
        const value = e.target.value.toUpperCase();
        setScannedCode(value);
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

    const handleScan = (result) => {
        if (result) {
            setScannedCode(result);
            console.log("Scanned Result: ", result);
        }
    };

    const handleScanSubmit = () => {
        const foundBag = rmBags.find((bag) => bag.rmbagid === scannedCode);
        if (foundBag) {
            setRmbagDetails(foundBag);
            setErrorMessage('');
        } else {
            setErrorMessage('RM Bag not found');
        }
    };

    const rmBags = [
        {
            rmbagid: "0000009006",
            Material: "METAL",
            Type: "GOLD",
            Color: "RED",
            Purity: "18K",
            Gm: "16.912/16.912",

        },]

    const tableData = [
        { shape: 'D:M round9', pointer: '0.250', quality: 'round9', color: 'bluish-white', pcs: 2, ctw: '0.500' },
        { shape: 'D:M round9', pointer: '0.500', quality: 'round9', color: 'bluish-white', pcs: 1, ctw: '0.500' },
        { shape: 'D:M round9', pointer: '0.667', quality: 'round9', color: 'bluish-white', pcs: 3, ctw: '2.000' },
        { shape: 'C:round9', pointer: '0.417', quality: 'round9', color: 'Emerald-green', pcs: 6, ctw: '2.500' },
        { shape: 'C:round9', pointer: '0.450', quality: 'round9', color: 'Emerald-green', pcs: 2, ctw: '0.900' },
        { shape: 'C:round9', pointer: '1.000', quality: 'round9', color: 'Emerald-green', pcs: 1, ctw: '1.000' },
        { shape: 'M:GOLD', pointer: '0.000', quality: '18K', color: 'RED', pcs: 0, ctw: '2.500' },
    ];

    return (
        <div>
            <div className="w-full shadow-lg bg-white rounded-lg">
                <div className="flex items-start gap-4 p-4">
                    <div className="flex flex-col items-start gap-2">
                        <img
                            src={jobDetail?.image ?? img}
                            alt={jobDetail?.designno}
                            className="w-28 h-28 rounded-lg object-cover"
                        />
                        <span className="inline-flex items-center 
                        justify-center w-28 rounded-lg bg-gray-50 px-4 py-1 
                        text-sm font-medium 
                        text-gray-600 ring-1 ring-inset ring-gray-500/10">{jobDetail?.Locationname}</span>
                    </div>

                    <div className="flex-1">
                        <div className="max-w-72">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl font-medium">{jobDetail?.serialjobno} ({jobDetail?.designno})</h2>
                                <FaInfoCircle className="h-6 w-6 text-indigo-500 cursor-pointer" onClick={handleOpenInfoModal} />
                            </div>
                            <p className="text-base text-gray-600 mb-2">{jobDetail?.CustomerName} ({jobDetail?.PO})</p>
                            <span className="bg-indigo-500 text-white text-base px-4 py-1 rounded-full">{jobDetail?.metaltype} {jobDetail?.metalpurity} {jobDetail?.MetalColor}</span>
                            <div className="flex flex-row items-center justify-between gap-1 mt-2">
                                <span className="text-gray-600">MISC Add in Gross Weight:</span>
                                <span className="text-xl">({jobDetail?.ismisc_not_addingrosswt == 0 ? "NO" : "YES"})</span>
                            </div>
                            <div className="flex flex-row items-center justify-between gap-1">
                                <span className="text-gray-600">Is Hmw Job:</span>
                                <span className="text-xl">({jobDetail?.iddhadijob == 0 ? "NO" : "YES"})</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-600">{jobDetail.currentStatus ?? 'Pending'} </p>
                        </div>
                    </div>
                    <div className="grid gap-4 text-base border-2 border-indigo-500 rounded-2xl p-4 bg-neutral-100">
                        <div className="flex justify-items-center items-center">
                            <div>
                                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-x-12 gap-y-3">
                                    <div className="flex flex-row items-center justify-between gap-1">
                                        <span className="text-gray-600">Gross wt:</span>
                                        <span className="text-2xl">0gm</span>
                                    </div>
                                    <div className="flex flex-row items-center justify-between gap-1">
                                        <span className="text-gray-600">Net wt:</span>
                                        <span className="text-2xl">0gm</span>
                                    </div>
                                    <div className="flex flex-row items-center justify-between gap-1">
                                        <span className="text-gray-600">T. MISC:</span>
                                        <span className="text-2xl">0gm</span>
                                    </div>
                                    <div className="flex flex-row items-center justify-between gap-1">
                                        <span className="text-gray-600">T. Finding:</span>
                                        <span className="text-2xl">0.0gm</span>
                                    </div>
                                    <div className="flex flex-row items-center justify-between gap-1">
                                        <span className="text-gray-600">T. D:</span>
                                        <span className="text-2xl">0ctw / 0Pcs</span>
                                    </div>
                                    <div className="flex flex-row items-center justify-between gap-1">
                                        <span className="text-gray-600">T. CS:</span>
                                        <span className="text-2xl">0ctw / 0Pcs</span>
                                    </div>
                                </div>
                            </div>
                            <div className="border-r-4 border-indigo-500 h-full mx-4"></div>
                            <div>
                                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-x-12 gap-y-3">
                                    <div className="flex flex-row items-center justify-between gap-1">
                                        <span className="text-gray-600">Metal:</span>
                                        <span className="text-2xl">0gm</span>
                                    </div>
                                    <div className="flex flex-row items-center justify-between gap-1">
                                        <span className="text-gray-600">Last Received:</span>
                                        <span className="text-2xl">0gm</span>
                                    </div>
                                    <div className="flex flex-row items-center justify-between gap-1">
                                        <span className="text-gray-600">Sprued wt:</span>
                                        <span className="text-2xl">0gm</span>
                                    </div>
                                    <div className="flex flex-row items-center justify-between gap-1">
                                        <span className="text-gray-600">Actual Loss:</span>
                                        <span className="text-2xl">0gm</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isInfoModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-[#7367F0]">
                                    Estimated Material For: {jobDetail.jobId}
                                </h2>
                                <button
                                    onClick={handleCloseInfoModal}
                                    className="text-gray-500 hover:text-red-600 transition-colors outline-none border-none duration-200"
                                >
                                    <AiOutlineClose className="text-2xl" />
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            {['Shape', 'Pointer', 'Quality', 'Color', 'PCs', 'Ctw'].map((header) => (
                                                <th key={header} className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.map((row, index) => (
                                            <tr
                                                key={index}
                                                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors duration-150`}
                                            >
                                                {Object.values(row).map((cell, cellIndex) => (
                                                    <td key={cellIndex} className="py-3 px-4 text-sm text-gray-700">
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex w-full p-3 pt-0 justify-end">
                            <p className="text-xs font-bold text-gray-400">
                                Press ESC to Close
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {isWeightModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 min-w-[30vw]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-indigo-600">Manage Weight</h2>
                            <button
                                onClick={handleCloseWeightModal}
                                className="text-gray-500 hover:text-red-600 transition-colors outline-none border-none duration-200"
                            >
                                <AiOutlineClose className="text-2xl" />
                            </button>
                        </div>

                        <div className='flex flex-row gap-10'>
                            <div className="flex flex-row mb-8">
                                <div className=" transition-all duration-300 ease-in-out transform hover:scale-102 w-full flex flex-col justify-start   items-start">
                                    {hasCamera ? (
                                        <div className="w-48 h-48 bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                                            <video ref={videoRef} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="relative h-48 w-48 bg-gray-50 rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
                                            <img src={ScannerIcon} alt="scanner" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute top-0 left-0 w-full h-full">
                                                <div className="absolute top-0 w-full h-1 bg-red-500 animate-scanner-line"></div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="h-[1rem] my-4">
                                        {errorMessage && <p className="text-red-600 text-sm text-center">{errorMessage}</p>}
                                    </div>
                                    <form onSubmit={(e) => { e.preventDefault(); }} className="w-48">
                                        <div className="flex items-center justify-between bg-white border h-full border-gray-300 rounded-lg shadow-lg overflow-hidden w-full">
                                            <input
                                                type="text"
                                                className="p-3 w-4/6 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                                placeholder="Scan RM Bag"
                                                value={scannedCode.toUpperCase()}
                                                onChange={(e) => handleRMChange(e)}
                                                ref={JobRef}
                                            />
                                            <button
                                                onClick={handleScanSubmit}
                                                className={`bg-gradient-to-r  from-green-400 w-2/6 to-green-600 flex items-center justify-center h-auto ring-0 outilne-none text-white px-3 font-semibold rounded-r-lg p-3 hover:bg-green-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {loading ? (
                                                    <ClipLoader size={20} color="#fff" />
                                                ) : (
                                                    <FaQrcode size={20} className="h-[1.5rem]" />
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className='grid grid-cols-2'>
                                <div className='flex flex-col'>
                                    <div className="w-[80%] grid grid-cols-2 gap-1 mb-6">
                                        <p className='text-gray-500'>Job No:</p>
                                        <p className='text-black'><>{jobDetail.jobId}</></p>
                                        <p className='text-gray-500'>Sprued Metal:</p>
                                        <p className='text-black'><>{jobDetail.Metal}</></p>
                                        <p className='text-gray-500'>Sprued Color:</p>
                                        <p className='text-black'><>RED</></p>
                                        <p className='text-gray-500'>Metal Type:</p>
                                        <div className="col-span-1">
                                            <select className="w-full p-2 rounded-lg mb-4 border border-gray-500 outline-none">
                                                <option value="dept1">All</option>
                                                <option value="dept2">GOLD 18K</option>
                                            </select>
                                        </div>
                                        <p className='text-gray-500'>Sprued Wt:</p>
                                        <p className='text-black'><>2</></p>
                                        <p className='text-gray-500'>Net Wt:</p>
                                        <p className='text-black'><>2.000</></p>
                                    </div>
                                    <div className='w-full flex justify-center'>
                                        {rmbagDetails && (
                                            <div className='flex flex-col'>
                                                <div className="w-[80%] grid grid-cols-2 gap-1 mb-6">

                                                    <p className='text-gray-500'>Add Wt:</p>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Return Weight"
                                                        className="p-2 border rounded-lg"
                                                        value={returnWeight}
                                                        onChange={(e) => setReturnWeight(e.target.value)}
                                                    />
                                                </div>
                                                <button
                                                    onClick={submitretwt}
                                                    className="mt-4 bg-indigo-500 text-white py-2 px-4  w-fit rounded-lg"
                                                >
                                                    Return and Close
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {rmbagDetails && (
                                    <div className='flex flex-col h-full'>
                                        <p className='text-green-700 text-lg font-semibold'><>{rmbagDetails.rmbagid}</></p>
                                        <div className="w-[80%] grid grid-cols-2  gap-1 mb-6">
                                            <p className='text-gray-500'>Material:</p>
                                            <p className='text-black'><>{rmbagDetails.Material}</></p>
                                            <p className='text-gray-500'>Type:</p>
                                            <p className='text-black'><>{rmbagDetails.Type}</></p>
                                            <p className='text-gray-500'>Color:</p>
                                            <p className='text-black'><>{rmbagDetails.Color}</></p>
                                            <p className='text-gray-500'>Purity:</p>
                                            <p className='text-black'><>{rmbagDetails.Purity}</></p>
                                            <p className='text-gray-500'>Gm:</p>
                                            <p className='text-black'><>{rmbagDetails.Gm}</></p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <p className="text-xs font-bold text-gray-400">Press ESC to Close</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Jobdetails;


