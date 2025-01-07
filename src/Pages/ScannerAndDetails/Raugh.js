
import React, { useState, useEffect ,useRef} from 'react';
import {  FaChevronLeft, FaChevronRight, FaCheck, FaRegThumbsUp, FaRegThumbsDown, FaPause, FaEllipsisH, FaQuestionCircle, FaCheckCircle,FaRegEdit } from 'react-icons/fa';
import { BiSolidImageAdd } from "react-icons/bi";
import { SiTicktick } from "react-icons/si";
import Swal from 'sweetalert2';

import { IoCloseOutline } from "react-icons/io5";
import { ImCross } from "react-icons/im";
// import { SiTicktick  } from "react-icons/fc";

import { useRecoilValue } from 'recoil';
import { rdState, rd1State, rd2State,rd5State,YearCodeState,salesrdState } from '../Recoil/FetchDataComponent';
import { TbMoodEmpty } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { faBarcode, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation,useNavigate } from "react-router-dom";
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';



const useQueryParams = () => {
const location = useLocation();
return new URLSearchParams(location.search);
};


function Survey() {
  const navigate = useNavigate();
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [answers, setAnswers] = useState({});
const [selectedQuestions, setSelectedQuestions] = useState([]);
const [pageStartIndex, setPageStartIndex] = useState(0);
const [showSelection, setShowSelection] = useState(true);
const [showSuccessMessage, setShowSuccessMessage] = useState(false);
const [remarks, setRemarks] = useState({});
const [editingRemark, setEditingRemark] = useState(null);
const [images, setImages] = useState([]); 
const [imageUrls, setImageUrls] = useState([]); 
const queryParams = useQueryParams();
const [loading, setLoading] = useState(false);
const [showConclusionSlide, setShowConclusionSlide] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const[issales,setIssales]=useState(false);
const[dis,setDis]=useState(false);

const qcID = atob(queryParams.get('QCID'));
const empbarcode = atob(queryParams.get('empbarcode'));
const jobid = atob(queryParams.get('jobid'));
const empid = atob(queryParams.get('employeeid'));
const eveid = atob(queryParams.get('eventid'));
const yc = localStorage.getItem('yearcode');
const token = localStorage.getItem('proqctoken');
const JobStatusId = localStorage.getItem('JobCompleteStatusId');


const questionsData = useRecoilValue(rdState);
const optionsData = useRecoilValue(rd1State);
const bindedData = useRecoilValue(rd2State);
const bindedQuestionsData = useRecoilValue(rd5State);

const salesrd = useRecoilValue(salesrdState) || JSON.parse(localStorage.getItem('salesrd')) || [];
const Questions = questionsData.length ? questionsData : JSON.parse(localStorage.getItem('rd')) || [];
const Options = optionsData.length ? optionsData : JSON.parse(localStorage.getItem('rd1')) || [];

const Binded = bindedData.length ? bindedData : JSON.parse(localStorage.getItem('rd2')) || [];
const BindedQuestions = bindedQuestionsData.length ? bindedQuestionsData : JSON.parse(localStorage.getItem('rd5')) || [];
const filteredBindedQuestions = BindedQuestions.filter(bq => bq.qcdeptid === Number(qcID));
const bindedQuestionIds = filteredBindedQuestions.flatMap(bq => bq.que.split(',').map(Number));
const filteredQuestions = Questions.filter(q => bindedQuestionIds.includes(q.id));
const QuestionOptBinded = Binded.map((bind) => {
  const question = filteredQuestions.find(q => q.id === bind.queid);
  if (question) {
    const optionIds = bind.opt.split(',').map(Number);
    const questionOptions = Options.filter(option => optionIds.includes(option.id));
    return {
      id: question.id,
      question: question.que,
      options: questionOptions.map(opt => opt.opt).join(', ')
    };
  }
  return null;
}).filter(item => item !== null);
const hasQuestions = QuestionOptBinded.length >= 1;
const allQuestions = hasQuestions ? QuestionOptBinded : [];
const filteredQuestionsList = hasQuestions ? allQuestions.filter(q => selectedQuestions.includes(q.id)) : [];
const questionsToDisplay = hasQuestions ? (showSelection ? allQuestions : filteredQuestionsList) : [];
const conclusionQuestion = {
  id: 'conclusion',
  question: 'Conclusion',
  // options: 'Approved,Rejected,On Hold',
  options: 'Approved,Rejected,FinalApproved,FinalReject',
};
const [selectedConclusion, setSelectedConclusion] = useState(null);
const RemarkRef = useRef(null); 
useEffect(() => {
  if (editingRemark && RemarkRef.current) {
    RemarkRef.current.focus();
  }
}, [editingRemark]);

const Conclusion = [
  { id: '1', status: 'Approved', icon: 'FaRegThumbsUp', iconcolor: '#4CAF50', bgcolor: '#4CAF5030' },
  { id: '2', status: 'Rejected', icon: 'FaRegThumbsDown', iconcolor: '#F44336', bgcolor: '#F4433630' },
  { id: '3', status: 'FinalApproved', icon: 'SiTicktick ', iconcolor: '#4CAF50', bgcolor: '#4CAF5030',rem:'Move to Stock Book' },
  { id: '4', status: 'FinalReject', icon: 'ImCross', iconcolor: '#F44336', bgcolor: '#F4433630',rem:'Move to Production' },
];
const topConclusions = Conclusion.slice(0, 2);
const bottomConclusions = eveid === '1' ? Conclusion.slice(2, 4) : [];

const getIconComponent = (iconName) => {
  switch (iconName) {
    case 'FaRegThumbsUp':
      return <FaRegThumbsUp size={24} color="#4CAF50" />;
    case 'FaRegThumbsDown':
      return <FaRegThumbsDown size={24} color="#F44336" />;
    case 'SiTicktick ':
      return <SiTicktick  size={24} />;
    case 'ImCross':
      return <ImCross size={24}  />;
    default:
      return null;
  }
};




// const handleConclusionClick = (status, bgcolor) => {
//   setSelectedConclusion(status);
// };


const currentQuestion = questionsToDisplay[currentQuestionIndex];
const isLastQuestion = currentQuestionIndex === questionsToDisplay.length - 1;

useEffect(() => {
  const storedAnswers = JSON.parse(localStorage.getItem('answers'));
  const storedSelectedQuestions = JSON.parse(localStorage.getItem('selectedQuestions'));
  const storedRemarks = JSON.parse(localStorage.getItem('remarks'));
  if (storedAnswers) {
    setAnswers(storedAnswers);
  }
  if (storedSelectedQuestions) {
    setSelectedQuestions(storedSelectedQuestions);
    if (storedSelectedQuestions.length > 0) {
      setShowSelection(false);
    }
  }
  if (storedRemarks) {
    setRemarks(storedRemarks);
  }
}, []);
// useEffect(() => {
//   if (showSuccessMessage) {
//     setTimeout(() => {
//       setShowSuccessMessage(false);
//       setCurrentQuestionIndex(0);
//       setPageStartIndex(0);
//       setShowSelection(true);
//       navigate(`/Scannerpage?QCID=${btoa(qcID)}&empbarcode=${btoa(empbarcode)}&employeeid=${btoa(empid)}&eventid=${btoa(eveid)} `);
//     }, 10000);
//   }
// }, [showSuccessMessage, navigate, qcID, empbarcode]);

useEffect(() => {
  let timeoutId;

  if (showSuccessMessage) {
    timeoutId = setTimeout(() => {
      setShowSuccessMessage(false);
      setCurrentQuestionIndex(0);
      setPageStartIndex(0);
      setShowSelection(true);
      navigate(`/Scannerpage?QCID=${btoa(qcID)}&empbarcode=${btoa(empbarcode)}&employeeid=${btoa(empid)}&eventid=${btoa(eveid)} `);
    }, 10000);
  }
  return () => clearTimeout(timeoutId);
}, [showSuccessMessage, navigate, qcID, empbarcode]);

const handleContinue = () => {
  setShowSuccessMessage(false); 
  navigate(`/Scannerpage?QCID=${btoa(qcID)}&empbarcode=${btoa(empbarcode)}&employeeid=${btoa(empid)}&eventid=${btoa(eveid)} `);
};


const handleOptionClick = (option) => {
  const selectedOptions = answers[currentQuestion.id] || [];
  const updatedOptions = selectedOptions.includes(option)
    ? selectedOptions.filter(opt => opt !== option)
    : [...selectedOptions, option];
  const updatedAnswers = { ...answers, [currentQuestion.id]: updatedOptions };
  setAnswers(updatedAnswers);
  localStorage.setItem('answers', JSON.stringify(updatedAnswers));
};
const handleNext = () => {
  if (isLastQuestion) {
    setShowConclusionSlide(true); 
  } else {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    if (currentQuestionIndex + 1 >= pageStartIndex + 5) {
      setPageStartIndex(pageStartIndex + 5);
    }
  }
};


const handleConclusionClick = (statusid, status) => {
  // setDis(true);
  const answerssel = answers[Object.keys(answers)] ?? [];

  if ((status === 'Rejected' || status === 'FinalReject') && answerssel.length === 0) {
    setErrorMessage("Please select at least one reason before rejection.");
    setDis(false);

    
    const timeoutId = setTimeout(() => {
      setErrorMessage("");
    }, 5000);
    
    return timeoutId; 
  }

  if (status === 'FinalReject') {
    Swal.fire({
      icon: 'error',
      title: 'Are You Sure Want To Reject?',
      text: 'On conformation your job will be moved to production.',
      showCancelButton: true,  
      confirmButtonText: 'Confirm', 
      cancelButtonText: 'Cancel',
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      },  
      customClass: {
        confirmButton: 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded',
      },
      reverseButtons: true, 
    }).then((result) => {
      if (result.isConfirmed) {
        
        setSelectedConclusion(status);
        handleSubmit(statusid);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
       
      }
    });

    return;
  }
  if (status === 'FinalApproved') {
    Swal.fire({
      icon: 'success',
      title: 'Are You Sure Want To Approve?',
      text: 'On conformation your job will be moved to StockBook.',
      showCancelButton: true,  
      confirmButtonText: 'Confirm', 
      cancelButtonText: 'Cancel',
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }, 
      customClass: {
        confirmButton: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded',
      },
      reverseButtons: true, 
    }).then((result) => {
      if (result.isConfirmed) {
        
        setSelectedConclusion(status);
        handleSubmit(statusid);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
       
      }
    });

    return;
  }

  setSelectedConclusion(status);
  handleSubmit(statusid);
};

const handlePrevious = () => {
  if (currentQuestionIndex > 0) {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    if (currentQuestionIndex - 1 < pageStartIndex) {
      setPageStartIndex(pageStartIndex - 5);
    }
  }
};

const handlePaginationClick = (index) => {
  setCurrentQuestionIndex(index);
  if (index >= pageStartIndex + 5) {
    setPageStartIndex(index - 4);
  } else if (index < pageStartIndex) {
    setPageStartIndex(index);
  }
};

const handleScrollRight = () => {
  if (pageStartIndex + 5 < questionsToDisplay.length) {
    setPageStartIndex(pageStartIndex + 5);
  }
};

const handleScrollLeft = () => {
  if (pageStartIndex > 0) {
    setPageStartIndex(pageStartIndex - 5);
  }
};

const optionMap = Options.reduce((acc, option) => {
  acc[option.opt] = option.id;
  return acc;
}, {});

function mapValuesToIds(valueString) {
  const values = valueString.split(",").map(value => value.trim());
  const ids = values.map(value => optionMap[value]);
  return ids.join(","); 
}


const handleSubmit = async (statusid) => {
  setDis(true);
  setLoading(true);
  const ipResponse = await axios.get('https://api.ipify.org?format=json');
  const ipAddress = ipResponse.data.ip;
  const payload = {
    con: JSON.stringify({
      id: "",
      mode: "SAVEQC",
      appuserid: "kp23@gmail.com",
    }),
    p: "eyJQYWNrYWdlSWQxIjoiMSIsIkZyb250RW5kX1JlZ05vMSI6Ijgwa2dpemJpZHV3NWU3Z2ciLCJDdXN0b21lcmlkMSI6IjEwIn0=",
    dp: JSON.stringify({
      empid: `${empid}`,
      qcdeptid: qcID,
      Jobno: `${jobid}`,
      conclusion: statusid ? statusid:'',
      que: btoa(JSON.stringify(
        Object.keys(answers).map(questionId => ({
          queid: questionId,
          optid:mapValuesToIds( answers[questionId].join(',')), 
          rem: remarks[questionId] || ""   
        }))
        
      )),
      image: images.join(','), 
      eventid:eveid,
      JobCompleteStatusId: JobStatusId,
      ipaddress: ipAddress                  
    }),
  };
  try {
    const response = await axios.post('https://api.optigoapps.com/ReactStore/ReactStore.aspx',  payload, {
      headers: {
        Authorization:token,
        Yearcode: `${yc}`,
        Version: "v1",
        sp: "4",
        sv:'2',
        domain: "",
        "Content-Type": "application/json",
      }
    });
    console.log("response.data", response.data);

    if (response.data.Data.rd[0].stat == 1) {
      setShowSuccessMessage(true);
      setAnswers({});
      setSelectedQuestions([]);
      setRemarks({});
      setImages([]);
      setImageUrls([]);
      localStorage.removeItem('answers');
      localStorage.removeItem('selectedQuestions');
      localStorage.removeItem('remarks');
      localStorage.removeItem('images'); 
    } else {
      setErrorMessage("Thee is some issue saving your answers ! Please try again")
    }
  } catch (error) {
    alert("Error saving your answer. Try again.");
  }
  finally {
  setDis(false);
    setLoading(false);
  }
};
console.log("optionmap",optionMap['Quality/Color']);
const getSelectedCount = () => {
  return (answers[currentQuestion.id] || []).length;
};
const handleback = () =>{
  setErrorMessage(""); 
  setShowConclusionSlide(false)
}
const handleRemarkChange = (questionId, newRemark) => {
  const updatedRemarks = { ...remarks, [questionId]: newRemark };
  setRemarks(updatedRemarks);
  localStorage.setItem('remarks', JSON.stringify(updatedRemarks));
};

const handleRemarkEdit = (questionId) => {
  if (editingRemark === questionId) {
    setEditingRemark(null);
  } else {
    setEditingRemark(questionId);
  }
};

const handleRemarkSave = (questionId) => {
  setEditingRemark(null);
  handleRemarkChange(questionId, remarks[questionId] || '');
};


const handleImageUpload = (event) => {
  const files = Array.from(event.target.files);
  const newImageUrls = files.map(file => URL.createObjectURL(file));
  setImages(prevImages => [
    ...prevImages,
    ...files.map(file => file.name)
  ].slice(0, 4)); 
   setImageUrls(prevImageUrls => [
    ...prevImageUrls,
    ...newImageUrls
  ].slice(0, 4)); 
};

const handleRemoveImage = (index) => {
  setImages(prevImages => prevImages.filter((_, i) => i !== index));
  setImageUrls(prevImageUrls => prevImageUrls.filter((_, i) => i !== index));
};
const currentQuestionNumber = currentQuestionIndex + 1;
const totalQuestions = allQuestions.length;
console.log("allQuestions",allQuestions); 

return (
  <div className="flex flex-col lg:flex-row max-w-screen w-full  lg:w-[60vw]  min-h-[80vh] mb-5 md:mb-5 h-fit  overflow-auto mx-auto p-6 bg-white shadow-md rounded-lg">
    {showSuccessMessage ? (
    <>
      <div className="flex-1  flex flex-col items-center justify-center p-6 bg-green-100 rounded-lg shadow-md">
      <div className='h-64'></div>
        <FaCheck className="text-green-500 mb-4" size={40} />
      
        <h2 className="text-2xl font-semibold mb-2">Answers Submitted Successfully!</h2>
        <p className="text-gray-700 text-center mb-6">Thank you.</p>
        <button
     className="flex items-center justify-center px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-green-700 transition-colors duration-300"
     onClick={handleContinue}
   >
     <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
     Continue
   </button>
        <div className='h-64'></div>
        </div>
    </>
 
    ) :  showConclusionSlide ? (
      <>
         <div className="mt-6 flex flex-col justify-between " style={{ width: '100%', }}>
  <div className="flex h-fit justify-between items-center">
    <button
      onClick={handleback}
      className="py-2 mb-6 text-gray-600 hover:text-gray-800 transition-all"
    >
      <MdOutlineArrowBackIosNew className="text-3xl font-bold" />
    </button>
  </div>

  <div className='flex flex-col  justify-center items-center' style={{height:'-webkit-fill-available'}}>
  <h2 className="text-2xl font-semibold w-full  text-center mb-6 text-gray-800">{conclusionQuestion.question}</h2>

<div className="flex flex-col h-fit">
  {/* <div className="flex flex-wrap gap-10 mb-4 justify-center">
    {Conclusion.map((item) => (
      <button
        key={item.id}
        onClick={() => handleConclusionClick(item.id, item.status, item.bgcolor)}
        style={{
          backgroundColor: selectedConclusion === item.status ? item.bgcolor : 'white',
          color: item.iconcolor,
          border: `2px solid ${item.iconcolor}`,
          transition: 'all 0.3s ease',
        }}
        className={`flex flex-col items-center py-5 px-8 rounded-lg shadow-md focus:outline-none transform hover:scale-105 transition-transform ${
          selectedConclusion === item.status ? 'bg-opacity-90' : 'bg-opacity-100'
        }`}
      >
        {loading && selectedConclusion === item.status ? (
          <ClipLoader size={26} color={`${item.iconcolor}`} />
        ) : (
          <>{getIconComponent(item.icon)}</>
        )}
        <span className="mt-3 text-xl font-semibold">{item.status}</span>
      </button>
    ))}
  </div> */}
  <div className="flex flex-col items-center mb-4 space-y-6">
    <div className="flex space-x-10">
      {topConclusions.map((item) => (
        <button
          key={item.id}
          onClick={() => handleConclusionClick(item.id, item.status)}
          style={{
            backgroundColor: selectedConclusion === item.status ? item.bgcolor : 'white',
            color: item.iconcolor,
            border: `2px solid ${item.iconcolor}`,
          }}
          className="flex flex-col w-48 items-center py-5 px-8 rounded-lg shadow-md cursor-pointer focus:outline-none transform hover:scale-105 transition-transform"
          disabled={dis}
        >
          <div className='h-[1rem] md:h-[0.625rem] md:'/>
          {loading && selectedConclusion === item.status ? (
            <ClipLoader size={26} color={item.iconcolor} />
          ) : (
            getIconComponent(item.icon)
          )}
          <span className="mt-3 text-base md:text-xl  font-semibold">{item.status}</span>
          <div className='h-[1rem] md:-[0.625rem]'/>
        </button>
      ))}
    </div>

    {bottomConclusions.length > 0 && (
      <div className="flex space-x-10">
        {bottomConclusions.map((item) => (
          <button
            key={item.id}
            onClick={() => handleConclusionClick(item.id, item.status)}
            style={{
              backgroundColor: selectedConclusion === item.status ? item.bgcolor : item.iconcolor,
              color: 'white',
            }}
            className="flex flex-col w-48 items-center py-5 px-8 rounded-lg shadow-md cursor-pointer focus:outline-none transform hover:scale-105 transition-transform"
            disabled={dis}

          >
            <div className='h-[1rem] md:h-[0.625rem] '/>
            {loading && selectedConclusion === item.status ? (
              <ClipLoader size={26} color={item.iconcolor} />
            ) : (
              getIconComponent(item.icon)
            )}
            <span className="mt-3 text-base md:text-xl  font-semibold">{item.status}</span>
            {item.rem && <span className="text-xs md:text-sm font-semibold">{item.rem}</span>}
            <div className='h-[1rem] md:-[0.625rem]'/>
          </button>
        ))}
      </div>
    )}
  </div>
  <div className='h-[2.5rem]'>
  {errorMessage && (
    <div className="text-red-500 p-2 bg-red-50 border-red-200 border   text-center mb-6">
      {errorMessage}
    </div>
  )}
  </div>
  {/* 
  <div className="flex flex-wrap gap-4 mb-6 justify-center">
    <label
      htmlFor="file-input"
      className={`flex flex-col items-center py-4 px-6 rounded-lg shadow-lg border border-gray-300 cursor-pointer ${
        images.length >= 4 ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}
    >
      <BiSolidImageAdd size={30} color="#a9a9a9" />
      <span className="mt-2 text-base font-medium">Add Photo</span>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
        disabled={images.length >= 4}
      />
    </label>
  </div>
  */}
   {/* <div className="flex  h-32 flex-wrap gap-4 mb-8">
   {imageUrls.length > 0 && (
       <div className="flex flex-wrap gap-4">
         {imageUrls.map((img, index) => (
           <div key={index} className="relative rounded-lg shadow-lg border border-gray-300">
             <img src={img} alt={`Uploaded ${index}`} className="w-32 h-32 object-cover rounded-md" />
             <button
               onClick={() => handleRemoveImage(index)}
               className="absolute top-[-10px]   right-[-5px] bg-gray-500 text-white rounded-full p-1"
             >
<IoCloseOutline size={15} color="white" />
             </button>
           </div>
         ))}
       </div>
     )}
   </div> */}

</div>
  </div>

  <div className="flex h-fit justify-between items-center">
    <div  className="py-2 mb-6 text-gray-600 hover:text-gray-800 transition-all"
    >
      <div className="h-[2.25rem] font-bold" />
    </div>
  </div>
</div>
      
    
    </>
    ) : hasQuestions  && allQuestions ? ( 

      <div className="flex w-full flex-col lg:flex-row lg:pr-4 ">
        <div className=" flex flex-col justify-between h-full " style={{width:'-webkit-fill-available'}}>
            <>
        <div>
        <div className="flex w-full justify-between items-center mb-4">
              <div className="flex space-x-2 my-5 w-fit justify-between flex-row items-center">
  <button
    onClick={handleScrollLeft}
    disabled={pageStartIndex === 0}
    className={`w-8 h-8 rounded-full shadow-md focus:outline-none text-white bg-gray-600 hover:bg-gray-300 justify-center items-center disabled:text-gray-300 ${selectedQuestions.length > 10 ? 'flex' : 'hidden'}`}
  >
    <FaChevronLeft />
  </button>
  <div className='flex flex-row gap-3'>

    {questionsToDisplay.slice(pageStartIndex, pageStartIndex + 10).map((_, index) => (
      <button
        key={index + pageStartIndex}
        onClick={() => handlePaginationClick(index + pageStartIndex)}
        className={`w-8 h-8 rounded-full shadow-md focus:outline-none ${
          currentQuestionIndex === index + pageStartIndex
            ? 'text-[#fff] hover:bg-[#56a4ff] bg-[#56a5ffb9]'
            : 'text-gray-700 hover:bg-gray-300'
        }`}
      >
        {index + pageStartIndex + 1}
      </button>
    ))}
  </div>


  <button
    onClick={handleScrollRight}
    disabled={pageStartIndex + 10 >= questionsToDisplay.length}
    className={`w-8 h-8 rounded-full shadow-md focus:outline-none text-[#56a4ff] hover:bg-gray-300 justify-center items-center disabled:text-gray-300 ${selectedQuestions.length > 10 ? 'flex' : 'hidden'}`}
  >
    <FaChevronRight />
  </button>
</div>


<p className='text-lg font-bold text-green-500'>
                  {getSelectedCount()}
                </p>
              </div>
              <div className="flex items-center mb-6">
                <div className="text-lg font-semibold mr-4 text-[#39aa78]" >
                  {currentQuestionNumber}/{totalQuestions}
                </div>
                <h2 className="text-2xl flex-1">{currentQuestion.question}</h2>
                <button
                  onClick={() => handleRemarkEdit(currentQuestion.id)}
                  className="ml-4 p-3 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <FaRegEdit className="text-2xl transition text-blue-600 duration-300 ease-in-out hover:text-blue-200" />
                </button>
              </div>
              <div className="flex  flex-wrap gap-3 mb-6">
                {currentQuestion.options.split(',').map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className={`py-2 px-4 rounded-full shadow-md border border-gray-300 focus:outline-none ${
                      answers[currentQuestion.id]?.includes(option)
                        ? 'bg-[#56a4ff] text-white'
                        : 'bg-white text-gray-700 hover:bg-teal-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}       
              </div>
        </div>
        {/* <div className='h-96'>
                {isLastQuestion ? (
                  <>
                    <div className="mt-6">
                      <h2 className="text-xl font-semibold mb-6 text-gray-800">{conclusionQuestion.question}</h2>
                   <div className='flex flex-col '>
                   <div className='flex flex-wrap gap-4 mb-2'>
                   <div className="flex flex-wrap gap-4 mb-5">
                   {Conclusion.map((item) => (
           <button
                  key={item.id}
                  onClick={() => handleConclusionClick(item.id, item.status, item.bgcolor)}
                  style={{
                    backgroundColor: selectedConclusion === item.status ? item.bgcolor : 'white',
                    color: item.iconcolor,
                    border: `1px solid ${item.iconcolor}`,
                  }}
                  className={`flex flex-col items-center py-4 px-6 rounded-lg shadow-lg border border-gray-300 focus:outline-none transition-transform transform ${
                    selectedConclusion === item.status ? 'bg-opacity-80' : 'bg-opacity-100'
                  }`}
                >
                  {loading && selectedConclusion === item.status ? (
                    <ClipLoader size={20} color={`${item.iconcolor}`} />
                  ) : (
                    <>{getIconComponent(item.icon)}</>
                  )}
                  <span className="mt-2 text-lg font-medium">{item.status}</span>
                </button>
      ))}
    </div>
                        

                        <div className="flex flex-wrap gap-4 mb-5">
                          <label
                            htmlFor="file-input"
                            className={`flex flex-col items-center py-4 px-6 rounded-lg shadow-lg border border-gray-300 cursor-pointer ${images.length >= 4 ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                          >
                            <BiSolidImageAdd size={30} color="#a9a9a9" />
                            <span className="mt-2 text-base font-medium">Add Photo</span>
                            <input
                              id="file-input"
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={images.length >= 4}
                            />
                          </label>
                        </div>

                       
                      </div>
                      <div className="flex  h-32 flex-wrap gap-4 mb-8">
                        {imageUrls.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                              {imageUrls.map((img, index) => (
                                <div key={index} className="relative rounded-lg shadow-lg border border-gray-300">
                                  <img src={img} alt={`Uploaded ${index}`} className="w-32 h-32 object-cover rounded-md" />
                                  <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-[-10px]   right-[-5px] bg-gray-500 text-white rounded-full p-1"
                                  >
<IoCloseOutline size={15} color="white" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between">
            <button
              onClick={() => setShowConclusionSlide(false)}
              className="py-2 px-4 bg-gray-600 text-white rounded-full shadow-md"
            >
              Previous
            </button>
          </div>
                   </div> 
                   </div>
                  </>
                ) : null} 
              </div>  */}

              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="py-2 px-4 bg-[#39aa78] rounded-full disabled:text-gray-700 text-white shadow-md disabled:bg-gray-200"
                >
                  Previous
                </button>
                {/* {isLastQuestion ? (
                  <>
                    <button
                      onClick={handleSubmit}
                      className={`py-2 px-4 bg-[#56a4ff] w-20 text-white rounded-full shadow-md${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
                  
                  >
                 {loading ? <ClipLoader size={20} color="#fff" /> : 'Submit'}
  
                    </button>
                  </>
                ) : ( */}
                  <button
                    onClick={handleNext}
                    className="py-2 px-4 bg-[#56a4ff] text-white rounded-full shadow-md"
                  >
                    Next
                  </button>
                {/* )} */}
              </div>
            </>
        </div>
        {editingRemark === currentQuestion.id && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h3 className="text-lg font-semibold mb-4">Add Remark</h3>
              <textarea
                value={remarks[currentQuestion.id] || ''}
                onChange={(e) => handleRemarkChange(currentQuestion.id, e.target.value)}
                className="w-full p-2 border border-gray-300 outline-none rounded-lg mb-4"
                rows="4"
                ref={RemarkRef}
              />
              <div className="flex justify-end">
                <button
                  onClick={() => handleRemarkSave(currentQuestion.id)}
                  className="py-2 px-4 bg-[#56a4ff] text-white rounded-full shadow-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    ): (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
  <div className="h-64"></div>
  <div className="flex flex-col items-center">
    <TbMoodEmpty className="text-5xl text-gray-600 mb-4" />
    <h2 className="text-3xl font-semibold text-gray-600">No Questions Available</h2>
    <p className="text-gray-600 mt-2">Please try again later or contact support.</p>
  </div>
  <div className="h-64"></div>
</div>
    )}
  </div>
);  
}                                         

export default Survey;



         