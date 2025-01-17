import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import Scanemp from './Pages/Scanemployee';
import FetchDataComponent, { tnxemployees } from './Recoil/FetchDataComponent';
import Login from './Pages/Login';
import ScannerAndDetails from './Pages/ScannerAndDetails/ScannerAndDetails';
import { RowsProvider } from './Context/RowsContext';
import TextFileUploader from './DemoCode/TextFileUploader';
import { useRecoilValue } from 'recoil';
import JobDetailsTab from './DemoCode/demo';

const theme = createTheme({
  typography: {
    fontFamily: '"Public Sans", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          backgroundColor: 'white',
          fontFamily: '"Public Sans", "Roboto", "Helvetica", "Arial", sans-serif',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #f4f5fa',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f9fafc',
            color: '#6e6b7b',
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            '&::-webkit-scrollbar': {
              width: '5px',
              height: '5px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#F5F5F5',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#14121986',
              borderRadius: '6px',
            },
          },
        },
      },
    },
  },
});
const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <RowsProvider>
        <FetchDataComponent />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/*" element={<Login />} />
          <Route path="/empscan" element={<><FetchDataComponent /><Scanemp /></>} />
          <Route path="/JobScan" element={<ScannerAndDetails />} />


          {/* demo routes */}
          <Route path="/Text1" element={<JobDetailsTab />} />
        </Routes>
      </RowsProvider>
    </ThemeProvider>
  );
};

export default App;
