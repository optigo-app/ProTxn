import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import banner from '../Assets/proqc.png';
import horizontalbanner from '../Assets/banner.png';
import { InitTxnApi } from '../Api/InitTxnApi';

const Login = () => {
  const [companyCode, setCompanyCode] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [proqctoken, setProqctoken] = useState('');
  const [yearcode, setYearcode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const companyCodeRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (companyCodeRef.current) {
      companyCodeRef.current.focus();
    }
  }, []);

  const handleLogin = async () => {
    if (!companyCode || !password) {
      setErrorMessage('Please fill in all the fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await InitTxnApi({ companyCode, password });

      if (response?.Data?.rd[0]?.stat === 1) {
        const yearcode = response.Data.rd[0].yearcode;
        const dbUniqueKey = response.Data.rd[0].dbUniqueKey;
        localStorage.setItem('yearcode', yearcode);
        localStorage.setItem('proqctoken', dbUniqueKey);

        setProqctoken(dbUniqueKey);
        setYearcode(yearcode);

        navigate('/empscan');
      } else {
        setErrorMessage('Please Enter A Valid Company Code Or Password');
      }
    } catch (error) {
      console.error('There was an error making the request!', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      if (field === 'companyCode' && passwordRef.current) {
        passwordRef.current.focus();
      } else if (field === 'password') {
        handleLogin();
      }
    }
  };

  const clearError = () => {
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-blue-50 p-4">
      <div className="w-full max-w-4xl h-fit flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-auto">
        {/* Left Section for Large Screens */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <img
            src={banner}
            alt="banner"
            className="w-full h-full object-cover rounded-l-xl"
          />
        </div>

        {/* Top Banner for Small Screens */}
        <div className="w-full md:hidden mb-4">
          <img
            src={horizontalbanner}
            alt="banner"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Login Form Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Sign In</h2>
          <div className="h-7">
            {errorMessage && (
              <div className="mb-3 text-center text-red-600 rounded-lg">{errorMessage}</div>
            )}
          </div>
          <div className="mb-4 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="companyCode">
              Company Code
            </label>
            <input
              id="companyCode"
              type="text"
              placeholder="Enter your company code"
              value={companyCode}
              onChange={(e) => {
                setCompanyCode(e.target.value);
                clearError();
              }}
              onKeyDown={(e) => handleKeyDown(e, 'companyCode')}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              ref={companyCodeRef}
            />
          </div>

          <div className="mb-6 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="flex items-center border rounded-lg shadow-sm">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                ref={passwordRef}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                onKeyDown={(e) => handleKeyDown(e, 'password')}
                className="w-full px-3 py-2 border-none outline-none rounded-l-lg"
              />
              <div
                className="px-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-500" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <button
              onClick={handleLogin}
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none transition-transform transform hover:scale-105"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
