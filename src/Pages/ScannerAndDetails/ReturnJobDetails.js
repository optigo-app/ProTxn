import React, { useState, useRef,useEffect } from 'react';
import { PiKeyReturnBold } from "react-icons/pi";

const ReturnJobDetails = ({ jobDetails }) => {
  const [mountWeight, setMountWeight] = useState('');  
  const [losswt, setLosswt] = useState('0.000');       
  const [expwt, setExpwt] = useState('0.000');         
  const [error, setError] = useState('');              
const [isdisabled,setIsdisabled] = useState(true);
const JobRef = useRef(null); 
useEffect(() => {
  if (JobRef.current) {
    JobRef.current.focus();
  }
}, []);

  const grosswt = jobDetails.metalwt + (jobDetails.diamondwt / 5) + (jobDetails.cswt / 5) + (jobDetails.miscwt/5);
  const retjob = () => {
    if (mountWeight === '' || parseFloat(mountWeight) === 0) {
    setMountWeight('');
    setLosswt('0.000');
    setExpwt('0.000');
    setError('');
    } else if (parseFloat(mountWeight) <= grosswt) {
      const totalLoss = grosswt - parseFloat(mountWeight);
      setLosswt(totalLoss.toFixed(3));  
      const expLoss = (totalLoss / jobDetails?.metalwt) * 100;
      setExpwt(expLoss.toFixed(3));     
      setError('');  
    } else {
      setError('Return Wt. should not be more than Gross Wt.');
      setLosswt('0.000');
      setExpwt('0.000');
    }
  };

  const retwtchange = (e) => {
    setIsdisabled(true)

    const value = e.target.value;
    setMountWeight(value);
    if (value === '' || parseFloat(value) <= grosswt) {
      if (value === '') {
        setLosswt('0.000');
        setExpwt('0.000');
        setError('');
        return;
      }
      const totalLoss = grosswt - parseFloat(value);  
      setLosswt(totalLoss.toFixed(3));
      const expLoss = (totalLoss / jobDetails?.metalwt) * 100;
      setExpwt(expLoss.toFixed(3));
      setError('');
      setIsdisabled(false);
      if (parseFloat(totalLoss) > jobDetails?.metalwt) {
        setError('Loss Limit Exceeded');
      setIsdisabled(true)

      }

    } else {
      setError('Return Wt. should not be more than Gross Wt.');
      setLosswt('0.000');
      setExpwt('0.000');
      setIsdisabled(true)
    }
  };

  return (
    <div className='w-full flex flex-col md:flex-row h-[30vh] bg-white justify-between rounded-xl shadow-md items-stretch p-6 gap-6'>
      <div className='flex-1 flex flex-col justify-between rounded-lg items-start'>
        <div className="w-full max-w-md space-y-4">

          <div className='space-y-4 w-full'>
            <div>
              <label htmlFor="dept" className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
              <select id="dept" className="w-full p-3 text-xl border bg-gray-100 font-semibold rounded-md " disabled>
                <option>Filing</option>   
              </select>
            </div>
            <div>
              <label htmlFor="mountWeight" className="block text-sm font-medium text-gray-700 mb-1">Return Weight:</label>
              <input
                id="mountWeight"
                type="number"
                value={mountWeight}
                onChange={retwtchange}  
                placeholder="Enter Return Wt."
                className="w-full p-3 text-xl border rounded-md "
                ref={JobRef}

              />
            </div>
          </div>

          <div className='flex flex-col gap-1'> 
            <div className='h-[1.5rem]'>
              {error && (
                <p className='text-base text-red-600'>
                  {error}
                </p>
              )}
            </div>
            <div className='flex gap-4'>
              <button
                onClick={retjob}
                className="flex-1 bg-[#33a024f5] text-white disabled:bg-gray-300 px-6 py-3 rounded-md hover:bg-green-200 transition duration-300 shadow-md flex items-center disabled:cursor-not-allowed justify-center text-lg font-semibold"
                disabled={isdisabled}
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
      </div>
      <div className='flex-1 p-2 px-6 bg-blue-50 overflow-auto h-full rounded-xl flex justify-center shadow-inner'>

      <div className='grid grid-cols-2 gap-6 w-full text-gray-700'>
  <div className='space-y-3 w-[80%]'>
    <div className='flex justify-between items-center'>
      <span className='text-gray-500'>Diamond:</span>
      <strong className='text-lg text-gray-800'>{(jobDetails?.diamondwt / 5)?.toFixed(3)}</strong>
    </div>

    <div className='flex justify-between items-center'>
      <span className='text-gray-500'>Misc:</span>
      <strong className='text-lg text-gray-800'>{(jobDetails?.miscwt / 5)?.toFixed(3)}</strong>
    </div>

    <div className='flex justify-between items-center'>
      <span className='text-gray-500'>Color Stone:</span>
      <strong className='text-lg text-gray-800'>{(jobDetails?.cswt / 5)?.toFixed(3)}</strong>
    </div>

    <div className='flex justify-between items-center'>
      <span className='text-gray-500'>Current Gross:</span>
      <strong className='text-lg text-gray-800'>{grosswt?.toFixed(3)}</strong>
    </div>

    <div className='flex justify-between items-center'>
      <span className='text-gray-500'>Current Net:</span>
      <strong className='text-lg text-gray-800'>{jobDetails?.metalwt?.toFixed(3)}</strong>
    </div>
  </div>

  <div className='space-y-3 w-[80%]'>
    <div className='flex justify-between items-center'>
      <span className='text-gray-500'>Loss Weight:</span>
      <strong className='text-lg text-gray-800'>{losswt}</strong>
    </div>

    <div className='flex justify-between items-center'>
      <span className='text-gray-500'>Actual Loss:</span>
      <strong className='text-lg text-gray-800'>0.000</strong>
    </div>

    <div className='flex justify-between items-center'>
      <span className='text-gray-500'>Exp Loss:</span>
      <strong className='text-xl text-red-600'>{losswt}</strong>
    </div>

    <div className='flex justify-between items-center'>
      <span className='text-gray-500'>Exp Loss %:</span>
      <strong className='text-lg text-gray-800'>{expwt}</strong>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default ReturnJobDetails;
