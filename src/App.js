import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import Scanemp from './Pages/Scanemployee';
import FetchDataComponent from './Recoil/FetchDataComponent';
import Login from './Pages/Login';
import ScannerAndDetails from './Pages/ScannerAndDetails/ScannerAndDetails';
import { RowsProvider } from './Context/RowsContext';

const theme = createTheme({
  typography: {
    fontFamily: '"Public Sans", "Roboto", "Helvetica", "Arial", sans-serif',
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
        </Routes>

      </RowsProvider>
    </ThemeProvider>
  );
};

export default App;
