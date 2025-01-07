import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Scanemp from './Pages/Scanemployee';
import FetchDataComponent from './Recoil/FetchDataComponent';
import Login from './Pages/Login';
import ScannerAndDetails from './Pages/ScannerAndDetails/ScannerAndDetails';
import { RowsProvider } from './Context/RowsContext'; 

const App = () => {
  return (
    <RowsProvider> 
   
        <FetchDataComponent />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/*" element={<Login />} />
          <Route path="/empscan" element={<><FetchDataComponent /><Scanemp /></>} />
          <Route path="/JobScan" element={<ScannerAndDetails />} />
        </Routes>

    </RowsProvider>
  );
};

export default App;
