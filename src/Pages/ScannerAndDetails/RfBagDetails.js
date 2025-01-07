import React, { useEffect, useState, useRef } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';
import { IoIosArrowDropleftCircle } from 'react-icons/io';

const RfBagDetails = ({ bagDetails, setBagDetails }) => {
  const [expandedIndex, setExpandedIndex] = useState(bagDetails.length - 1);
  const [issuedWeight, setIssuedWeight] = useState({});
  const [tempWeight, setTempWeight] = useState('');
  const [pcs, setPcs] = useState({});
  const [tempPcs, setTempPcs] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const WeightRef = useRef(null);
  const pcsInputRef = useRef(null);
  const [willremain, setWillremain] = useState(bagDetails?.[expandedIndex]?.wt);
  const [isdisabled, setIsdisabled] = useState(true);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    const selectedBag = bagDetails[index];
    setTempWeight(issuedWeight[selectedBag.rfbagid] || '');
    setTempPcs(selectedBag.Material !== 'METAL' ? pcs[selectedBag.rfbagid] || '' : '');
    setErrorMessage('');
  };

  useEffect(() => {
    if (expandedIndex && WeightRef.current) {
      WeightRef.current.focus();
    }
  }, [expandedIndex]);

  const handleRemove = (index) => {
    setBagDetails((prevBagDetails) => prevBagDetails.filter((_, i) => i !== index));
    if (index === expandedIndex) {
      setExpandedIndex(bagDetails.length - 2);
    }
  };

  useEffect(() => {
    if (!bagDetails[expandedIndex]) {
      setExpandedIndex(bagDetails.length - 1);
    }
  }, [bagDetails, expandedIndex]);

  const handleIssue = (index) => {
    const selectedBag = bagDetails[index];
    if (!tempWeight || (selectedBag.Material !== 'METAL' && !tempPcs)) {
      setErrorMessage('Weight and Pcs must not be empty.');
      return;
    }
    setIssuedWeight((prev) => ({
      ...prev,
      [selectedBag.rfbagid]: tempWeight,
    }));
    if (selectedBag.Material !== 'METAL') {
      setPcs((prev) => ({
        ...prev,
        [selectedBag.rfbagid]: tempPcs,
      }));
    }
    if (bagDetails.length > 2) {
      if (index < bagDetails.length - 1) {
        setExpandedIndex(index + 1);
        const nextBag = bagDetails[index + 1];
        setTempWeight(issuedWeight[nextBag.rfbagid] || '');
        setTempPcs(nextBag.Material !== 'METAL' ? pcs[nextBag.rfbagid] || '' : '');
      } else {
        setExpandedIndex(bagDetails.length - 1);
      }
    }
  };
  useEffect(() => {
    if (bagDetails[expandedIndex]?.wt) {
      setWillremain(parseFloat(bagDetails[expandedIndex].wt).toFixed(3));
    }
  }, [expandedIndex, bagDetails]);

  const retwtchange = (e) => {
    setIsdisabled(true);
    const value = e.target.value;
    console.log(value, 'value');
    const grosswt = parseFloat(bagDetails?.[expandedIndex]?.wt) || 0;
    setTempWeight(value);
    setErrorMessage("");


    if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) <= grosswt)) {
      if (value === '') {
        setWillremain('0.000');
        return;
      }
      const totalLoss = grosswt - parseFloat(value);
      setWillremain(totalLoss.toFixed(3));
      setIsdisabled(false);
    } else {
      setErrorMessage("Issue Limit Exceeted");
      setWillremain('0.000');
      setIsdisabled(true);
    }
  };
  console.log('willremain', willremain);
  return (
    <div className="w-full h-[30vh] flex flex-row-reverse gap-3">
      <div className="w-1/2 pr-4 h-[30vh] overflow-auto">
        {bagDetails.map((rfBagDetails, index) => (
          <div key={index} className={`w-full mx-auto shadow-lg overflow-hidden mt-1 transition-all duration-300 ease-in-out 
      ${expandedIndex === index ? 'bg-white ' : 'bg-white'}`}>
            <div className='flex flex-row h-full justify-start'>
              {expandedIndex === index ? (
                <div className='flex justify-center items-center '>
                  <IoIosArrowDropleftCircle className="ml-2 text-[#28c76f] animate-pulse" size={30} />
                </div>
              ) : (
                <>
                  <IoIosArrowDropleftCircle className="ml-2 text-transparent animate-pulse" size={30} />
                </>
              )}
              <div className="p-4 w-full cursor-pointer" onClick={() => toggleExpand(index)}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg flex flex-row font-semibold ">
                    <span className="flex flex-row justify-center items-center gap-2">
                      <span className={`p-1 px-3 ${expandedIndex === index ? 'bg-[#DCF6E8] text-[#28c76f]' : ' bg-gray-100 text-gray-400'}
           rounded-md`} style={{ fontWeight: '500' }} >
                        {rfBagDetails?.['1']}
                      </span>
                      {rfBagDetails?.['2'] === 1 && (
                        <>
                          <p className='text-gray-500 text-sm font-medium'>
                            (  {rfBagDetails?.['6']} {rfBagDetails?.['7']} {rfBagDetails?.['5']} )
                          </p>
                        </>
                      )}
                      {rfBagDetails?.['2'] !== 1 && (
                        <p className='text-gray-500 text-sm font-medium'>
                          {rfBagDetails?.['5']} ({rfBagDetails?.['6 ']} {rfBagDetails?.["7"]} {rfBagDetails?.['8']} )
                          
                          {/* {rfBagDetails.Size}  {rfBagDetails?.Mtype} )  */}
                          | {rfBagDetails?.['14'] } 
                        </p>
                      )}
                    </span>
                  </h3>
                  <div className='flex flex-row gap-3'>
                    <div>
                      {rfBagDetails.Material !== "METAL" && issuedWeight[rfBagDetails.rfbagid] && (
                        <div className="text-base font-medium text-gray-800">
                          | Issue Weight: {issuedWeight?.[rfBagDetails?.rfbagid]} Ctw | Pcs: {pcs[rfBagDetails?.rfbagid] || '0'}
                        </div>
                      )}
                      {rfBagDetails.Material === "METAL" && issuedWeight[rfBagDetails?.rfbagid] && (
                        <div className="text-base font-medium text-gray-800">
                          | Issue Weight: {issuedWeight?.[rfBagDetails?.rfbagid]} Gm
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <button onClick={() => handleRemove(index)} className="text-gray-400 hover:text-gray-600">
                        <FaTimes size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-1/2 h-full bg-white border-none rounded-lg p-6">
        {bagDetails[expandedIndex] ? (
          <div className="flex flex-col h-full justify-between">
            <div className="flex flex-col  justify-start">
              <div className=' flex flex-row w-full justify-between '>
                <div className=' flex flex-col'>
                  <span className='p-1 px-3 bg-[#DCF6E8] text-[#28c76f] font-semibold rounded-md w-fit text-xl mb-1'>
                    {bagDetails[expandedIndex]?.['1']}
                  </span>
                  <div className="grid grid-cols-1 gap-4 mb-2">
                    {bagDetails[expandedIndex]?.['2'] === 1 && (
                      <div className='flex flex-col '>
                        <p className='text-gray-500 text-lg'>{bagDetails?.[expandedIndex]?.['6']} {bagDetails?.[expandedIndex]?.['7']} {bagDetails?.[expandedIndex]?.['5']}</p>
                      </div>
                    )}
                    {bagDetails[expandedIndex]?.Material?.['2'] !== 1 && (
                      <p className='text-gray-500 text-lg'>
                        {bagDetails?.[expandedIndex]?.Material} ({bagDetails?.[expandedIndex]?.Shape} {bagDetails?.[expandedIndex]?.Clarity} {bagDetails?.[expandedIndex]?.Color} {bagDetails?.[expandedIndex]?.Size})</p>
                    )}
                  </div>
                </div>

                <div className='flex flex-row w-fit gap-1 items-center h-fit'>
                  <p className='text-gray-500  '>
                    Bag Wt:
                              </p>

                  {bagDetails[expandedIndex]?.Material === 'METAL' && (
                    <p className='text-blue-500 font-semibold text-lg  '>
                      {Number(bagDetails?.[expandedIndex]?.wt || 0).toFixed(3)} | {Number(bagDetails?.[expandedIndex]?.beforewt || 0).toFixed(3)} (Gm)
                    </p>)}

                  {bagDetails[expandedIndex]?.Material !== "METAL" && (
                    <p className='text-blue-500 font-semibold text-lg '>
                      {Number(bagDetails?.[expandedIndex]?.wt || 0).toFixed(3)} | {Number(bagDetails?.[expandedIndex]?.beforewt || 0).toFixed(3)} (Ctw)
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-full justify-between">
                <div className='w-full justify-center flex'>
                  <div className="p-2 w-64 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <h4 className="text-right text-gray-500 text-base">Issued Weight:</h4>
                      <input
                        // type="number"
                        value={tempWeight}
                        onChange={retwtchange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (bagDetails?.[expandedIndex]?.Material !== "METAL") {
                              pcsInputRef.current.focus();
                            } else {
                              handleIssue(expandedIndex);
                            }
                          }
                        }}
                        placeholder="Weight"
                        className="w-full p-1 border-2 rounded border-gray-500 text-lg"
                        ref={WeightRef}
                      />

                      {bagDetails?.[expandedIndex]?.Material !== "METAL" && (
                        <>
                          <h4 className="text-right text-gray-500 text-base">Issued Pcs:</h4>
                          <input
                            ref={pcsInputRef}
                            // type="number"
                            value={tempPcs}
                            onChange={(e) => {
                              setTempPcs(e.target.value);
                              setErrorMessage('');
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleIssue(expandedIndex);
                              }
                            }}
                            placeholder="Pcs"
                            className="w-full p-1 border-2 rounded border-gray-500 text-lg"
                          />
                        </>
                      )}
                    </div>

                    <div className='h-[1.25rem] mt-3'>
                      {errorMessage && (
                        <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
                      )}
                    </div>

                    <div className="flex justify-end ">
                      <button
                        onClick={() => handleIssue(expandedIndex)}
                        className="flex items-center justify-center bg-[#28c76f] text-white text-lg px-2 py-1 rounded hover:bg-[#4dc284] transition duration-300"
                      >
                        <FaPlus className="mr-1" /> Issue
                      </button>
                    </div>


                  </div>
                </div>

                <div className='flex w-full  justify-end'>
                  {tempWeight && (
                    <div className="flex w-full justify-end">
                      <div className="flex flex-row w-fit gap-1 items-center h-fit">
                        <p className="text-gray-500">Will Remain:</p>

                        {bagDetails[expandedIndex]?.Material === 'METAL' && (
                          <p className="text-orange-600 font-semibold text-lg">
                            {Number(willremain || 0).toFixed(3)} (Gm)
                          </p>
                        )}

                        {bagDetails[expandedIndex]?.Material !== "METAL" && (
                          <p className="text-orange-600 font-semibold text-lg">
                            {Number(willremain || 0).toFixed(3)} (Ctw)
                          </p>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='h-full w-full justify-center items-center text-center'>
            <p>No RMbag Selected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RfBagDetails;


