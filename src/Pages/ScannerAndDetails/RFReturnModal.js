// can you please  
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaQrcode } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import ScannerIcon from '../../Assets/Qrcode.png';
import QrScanner from 'qr-scanner';
import { ReturnRmBags } from '../../fakeapi/ReturnRmBags';

const ReturnModal = ({isOpen,handleCloseReturnModal,selectedRowData,isWeightModalOpen,loading}) => {
  const rmBags = ReturnRmBags;
  const [hasCamera, setHasCamera] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [rmbagDetails, setRmbagDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const[pcs,setPcs]=useState('');
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const JobRef = useRef(null);
  const WtRef = useRef(null);
  const [returnWeight, setReturnWeight] = useState('');
  const [selectedReturnType, setSelectedReturnType] = useState(null); 
  const [wterror,setWterror] = useState(false);
  const[willremain,setWillremain] = useState(selectedRowData?.actualUsed?.toFixed(3));
  
  
  
  useEffect(() => {
    if (isWeightModalOpen && JobRef.current) {
      JobRef.current.focus();
    }
  }, [isWeightModalOpen]);

  useEffect(() => {
    if (rmbagDetails && WtRef.current) {
      WtRef.current.focus();
    }
  }, [rmbagDetails]);

  const handleRMChange = (e) => {
    const value = e.target.value.toUpperCase();
    setErrorMessage('');
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
    console.log(scannedCode);
    const foundBag = rmBags.find((bag) => bag.rmbagid === scannedCode);
    if (foundBag) {
      if (
        foundBag?.Material?.toUpperCase() === 'METAL' &&
        (foundBag?.Type?.toUpperCase() !== selectedRowData?.type.toUpperCase() ||
          foundBag?.Purity?.toUpperCase() !== selectedRowData?.quality.toUpperCase() ||
          foundBag?.Color?.toUpperCase() !== selectedRowData?.color.toUpperCase())
      ) {
        setErrorMessage('Please Scan Valid RM Bag !');
      } else if (
        
        foundBag?.Material?.toUpperCase() !== 'METAL' &&
        foundBag?.customerName?.toUpperCase() !== selectedRowData?.supplier.toUpperCase()
      ) {
        setRmbagDetails();
        setErrorMessage('Supplier Mismatched !');
      } else if (
        foundBag?.Material?.toUpperCase() !== 'METAL' &&
          (foundBag?.Clarity?.toUpperCase() !== selectedRowData?.quality.toUpperCase() ||
          foundBag?.Color?.toUpperCase() !== selectedRowData?.color.toUpperCase() ||
          foundBag?.Size?.toUpperCase() !== selectedRowData?.size.toUpperCase())
          ) {
        setRmbagDetails();
        setErrorMessage('Mismatched Criteria !');
      } else {
        setRmbagDetails(foundBag);
        setErrorMessage('');
        console.log("rmbagDetails", rmbagDetails);
      }
    } else {
      setRmbagDetails();
      setErrorMessage('RM Bag not found');
    }
  };

// const handlewtchange = (e) => {
//     const value = e.target.value;
//     if(value > selectedRowData?.actualUsed?.toFixed(3)){
//       setReturnWeight(value)
//       setErrorMessage("errr")
//     }else{
//       setReturnWeight(value)
//     }
//   }

  const retwtchange = (e) => {
    const value = e.target.value;
    console.log(value,'value');
    const grosswt = parseFloat(selectedRowData?.actualUsed?.toFixed(3)) || 0;
    setReturnWeight(value);
    setWterror(false);
  
    if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) <= grosswt)) {
      if (value === '') {
        setWillremain('0.000');
        return;
      }
      const totalLoss = grosswt - parseFloat(value);
      setWillremain(totalLoss.toFixed(3));
    } else {
      setWterror(true);
      setWillremain('0.000');
    }
  };

  if (!isOpen || !selectedRowData) return null;

  return (
    <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white flex flex-col justify-between  rounded-lg shadow-xl p-6 w-[50vw] min-w-[30vw] h-[50vh]">
       <div>
       <div className="flex justify-between items-center mb-6">

<div className="flex flex-col items-center gap-4 mb-6">
{(
selectedRowData?.item?.toUpperCase() === "DIAMOND" || 
selectedRowData?.item?.toUpperCase() === "MISC" || 
selectedRowData?.item?.toUpperCase() === "COLOR STONE"
) && (
<div className="flex gap-2">
{['Return All','Extra Return', 'Lost', 'Broken'].map((option) => (
  <button
    key={option}
    onClick={() => setSelectedReturnType(option)}
    className={`px-4 py-2 rounded-full   ${
      selectedReturnType === option ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
  >
    {option}
  </button>
))}  
</div>
)}
</div>
  <button
    onClick={handleCloseReturnModal}
    className="text-gray-500 hover:text-red-600 transition-colors outline-none border-none duration-200"
  >
    <AiOutlineClose className="text-2xl" />
  </button>
</div>

<div className="flex flex-row gap-7">
  <div className="flex flex-row mb-8">
    <div className="transition-all duration-300 ease-in-out transform hover:scale-102 w-full flex flex-col justify-start items-start">
    
      {hasCamera ? (
        <div className="w-44 h-44 bg-gray-100 rounded-lg shadow-lg overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="relative h-44 w-44 bg-gray-50 rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
          <img src={ScannerIcon} alt="scanner" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 w-full h-1 bg-red-500 animate-scanner-line"></div>
          </div>  
        </div>
      )}

      <div className="h-[1rem] my-4">
        {errorMessage && <p className="text-red-600 text-sm text-center">{errorMessage}</p>}
      </div>
      <form onSubmit={(e) => {e.preventDefault(); }} className="w-48">
        <div className="flex items-center justify-between bg-white border h-full border-gray-300 rounded-lg shadow-lg overflow-hidden w-full">
          <input
            type="text"
            className="p-3 w-4/6 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
            placeholder="Scan RM Bag"
            value={scannedCode.toUpperCase()}
            onChange={handleRMChange}
            ref={JobRef}
          />
          <button
            onClick={handleScanSubmit}
            className={`bg-gradient-to-r from-green-400 w-2/6 to-green-600 flex items-center justify-center h-auto ring-0 outline-none text-white px-3 font-semibold rounded-r-lg p-3 hover:bg-green-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <ClipLoader size={20} color="#fff"/>
            ) : (
              <FaQrcode size={20} className="h-[1.5rem]" />
            )}
          </button>
        </div>
      </form>
    </div>
  </div>

  <div className="grid md:grid-cols-2  gap-6 flex-grow">
    <div className="flex flex-col">
    <div className="flex flex-col bg-[#fff7edc9] border border-orange-300 h-fit p-3 rounded-lg ">
<div className='flex flex-col gap-0 '>
  <div className='flex flex-row justify-between w-full'>
  <p className="text-orange-600 text-lg font-semibold">{selectedRowData.rmbagid}({selectedRowData.item})</p> 
<p className="text-sky-700 font-medium">{selectedRowData.supplier}</p>
  </div>

      {selectedRowData?.item?.toUpperCase() !== "METAL" ? (
      <p className="text-black font-sm">            
        ( {selectedRowData.type} {selectedRowData.quality} {selectedRowData.color} {selectedRowData.size}  ) 
          </p>):(<p className="text-black font-sm">
({selectedRowData.quality} {selectedRowData.color} {selectedRowData.type}) 
</p>  
)}

<div className='flex flex-row w-full  font-semibold justify-between'>
{selectedRowData?.item?.toUpperCase() !== "METAL"  ?(

<div className="text-black flex flex-row gap-1 items-center">
  <p className="text-gray-800 font-semibold flex flex-row text-2xl">
  {selectedRowData.actualPcs} / {selectedRowData?.actualUsed?.toFixed(3)}
    </p>

  
  </div> ):(
  <p className="text-gray-800 font-semibold flex flex-row text-2xl">
  {selectedRowData?.actualUsed?.toFixed(3)}
          </p>

)}
</div>
       </div>
      </div>

     



    </div>

    {rmbagDetails && (
      <div className="flex flex-col bg-blue-50 h-fit p-3 rounded-lg">


       <div className='flex flex-col gap-0 '>
       <p className="text-green-700 text-lg font-semibold">{rmbagDetails.rmbagid} ({rmbagDetails.Material})</p> 
      {rmbagDetails?.Material?.toUpperCase() === 'METAL' ?(
      <p className="text-black font-sm">
        ({rmbagDetails.Purity} {rmbagDetails.Color} {rmbagDetails.Type}  ) 
          </p>):(
<p className="text-black font-sm">
({rmbagDetails.Shape} {rmbagDetails.Clarity} {rmbagDetails.Color} {rmbagDetails.Size}) 
</p>  
)}
</div>

{rmbagDetails?.Material?.toUpperCase() === 'METAL' ?(
      <p className="text-black font-semibold font-sm">
      {rmbagDetails.wt}(Gm)
          </p>):(
  <p className="text-gray-800 font-semibold flex flex-row text-2xl">
  {rmbagDetails.Pcs} / {rmbagDetails.wt}
</p>)}
      </div>
    )}


<div className=' grid w-[70%] col-span-2 '>
<div className='grid grid-cols-3  '>
<div className="grid grid-cols-5 ">

{rmbagDetails && (
<>
{rmbagDetails?.Material?.toUpperCase() === 'METAL' ? (

<>
<p className="text-gray-500">Extra Remaining</p>
<div className='col-span-2'>
<input
  type="text"
  placeholder="Add Wt."
  className={`p-2 w-20 border rounded-lg focus:outline-none ${wterror ? 'border-red-700' : 'border-gray-700'}`}
  value={returnWeight}
  onChange={retwtchange}
  ref={WtRef}
/>

</div>
</>
):(
<>
<p className="text-gray-500  flex items-center ">Wt.</p>
<div className='grid col-span-4'>
<div className='flex flex-col  justify-start '>
<input
type="text"
placeholder="Enter Wt"
// className="p-2 border text-2xl rounded-lg  w-32  focus:outline-none placeholder:text-lg"
className={`p-2  rounded-lg w-20  focus:outline-none ${wterror ? ' border-red-700 border-2' :'border-gray-600 border'}`}
value={returnWeight}
ref={WtRef}
onChange={retwtchange}
/>
{/* <div className="h-[0.875rem] my-2">
{wterror && <p className="text-red-600 text-sm text-left">
  {wterror}
  </p>}
</div> */}
</div>
</div>

<p className="text-gray-500 flex items-center">Pcs.</p>
<div className='grid col-span-4 mt-2'>
<input
type="text"                       
placeholder="Enter Pcs"
className="p-2 border rounded-lg text-2xl  w-32  focus:outline-none placeholder:text-lg"
value={pcs}
onChange={(e) => setPcs(e.target.value)}
/>
</div>
</>
)}

<div className='grid '>
</div>
<div className='grid col-span-4 '>

<div 
className={`bg-gradient-to-r w-32 from-orange-300 to-orange-500 rounded-md  cursor-pointer flex items-center justify-center  text-white px-3 py-3 mt-4 font-semibold  transition duration-200`}
>
Return
</div>
</div>

</>

)}
</div>

<div className='w-full grid col-span-2' > 

{returnWeight && (
  <div className="flex w-full justify-start">
  <div className="flex flex-row w-fit gap-1 items-center h-fit">
    <p className="text-gray-500">Will Remain:</p>
    
    {rmbagDetails?.Material?.toUpperCase() === 'METAL' && (
      <p className="text-orange-600 font-semibold text-lg">
        {Number(willremain || 0).toFixed(3)} (Gm)
      </p>
    )}

    {rmbagDetails?.Material?.toUpperCase() !== "METAL" && (
      <p className="text-orange-600 font-semibold text-lg">
        {Number(willremain || 0).toFixed(3)} (Ctw)
      </p>
    )}
  </div>

</div>
)

}
</div>


</div>
</div>
    
  </div>
</div>

       </div>
        <div className="flex justify-end mt-4">
          <p className="text-xs font-bold text-gray-400">Press ESC to Close</p>
        </div>  
      </div>
    </div>
  );};

export default ReturnModal;
