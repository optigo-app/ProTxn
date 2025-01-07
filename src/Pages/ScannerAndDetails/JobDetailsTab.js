import React, { useEffect, useState,useRef } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import '../../components/Scrollbar.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IoSwapHorizontal } from "react-icons/io5";
import DetailsTable from '../JobScan/DetailsTable';
import { IoClose } from 'react-icons/io5'; 
import { IoMdReturnRight } from "react-icons/io";
import { GrTransaction } from "react-icons/gr";
import '../../components/Scanner.css';
import { ReturnRmBags } from '../../fakeapi/ReturnRmBags';
import initialRows from '../../fakeapi/initialrws';
import ReturnModal from './RFReturnModal';

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          backgroundColor: 'white',
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

const JobDetailsTab = ({ jobflag,jobDetail}) => {
  const [rows, setRows] = useState(initialRows);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openReturnModal, setOpenReturnModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const[rmbagDetails,setRmbagDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const[showgrid,setShowgrid] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const handleOpenWeightModal = () => setIsWeightModalOpen(true);
  const handleCloseWeightModal = () => setIsWeightModalOpen(false);
  const rmBags = ReturnRmBags; 

  useEffect(() => {
      const handleEscKey = (event) => {
        if (event.key === 'Escape') {      
          handleCloseWeightModal();
          handleCloseReturnModal();
        }
      };
            document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }, []);

    const handleScanSubmit = () => {
  const foundBag = rmBags.find((bag) => bag.rmbagid === scannedCode);
  if (foundBag) {
        setRmbagDetails(foundBag);
        setErrorMessage('');
      } else {
        setErrorMessage('RM Bag not found');
      }
    };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenModal = (id) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedId(null);
  };

const handleReturnAll = () => {
    setRows(rows.filter((row) => row.id !== selectedId));
    setOpen(false);
  };

  const handleOpenReturnModal = (id) => {
    const rowData = rows.find(row => row.id === id);
    setSelectedRowData(rowData);
    setOpenReturnModal(true);
  };
  
  const handleCloseReturnModal = () => {
    setOpenReturnModal(false);
    setSelectedRowData(null);
  };

  const columns = [
    { field: 'sr', headerName: 'Sr#', width: 50 },
    {
      field: 'view',
      headerName: 'View',
      width: 80,
      renderCell: (params) => (
        <Tooltip title="View Details">
          <IconButton
            className="text-[#257BF0] hover:text-gray-600"
            onClick={() => handleOpenModal(params.id)}
            sx={{ color: '#257BF0', '&:hover': { color: 'gray' } }}
          >
            <VisibilityIcon sx={{ color: '#257BF0', fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      ),
    },

    // {
    //   field: 'returnall',
    //   headerName: 'Return All',
    //   width: 70,
    //   renderCell: (params) => (
    //     params.row.flag === 0 ? (  
    //       <IconButton
    //         className="text-[#257BF0] cursor-pointer hover:text-blue-600"
    //         onClick={() => handleClickOpen(params.id)}
    //         sx={{ color: '#257BF0', '&:hover': { color: 'gray' } }}
    //       >
    //         <IoSwapHorizontal size={20} />
    //       </IconButton>
    //     ) : null  
    //   ),
    // },    
    
    {
      field: 'return',
      headerName: 'Return',
      width: 70,
      renderCell: (params) => (
        params.row.flag === 0 ? (    <IconButton
          className="text-[#257BF0] cursor-pointer hover:text-blue-600"
          onClick={() => handleOpenReturnModal(params.id)}
          sx={{ color: '#257BF0', '&:hover': { color: 'gray' } }}
        >
          <IoMdReturnRight size={20} />
        </IconButton>):null
      ),
    },
    { field: 'bagPrepBy', headerName: 'BagPrepBy', width: 100 },
    { field: 'employee', headerName: 'Employee', width: 150 },
    { field: 'dept', headerName: 'Dept', width: 100 },
    { field: 'item', headerName: 'Item', width: 140 },
    { field: 'mType', headerName: 'M.Type', width: 100 },
    { field: 'type', headerName: 'Type', width: 100 },
    { field: 'quality', headerName: 'Quality', width: 100 },
    { field: 'color', headerName: 'Color', width: 120 },
    { field: 'size', headerName: 'Size', width: 80 },
    { field: 'actualPcs', headerName: 'Actual PCs', width: 100 },
    { field: 'actualUsed', headerName: 'Actual Used', width: 120 },
    { field: 'receive', headerName: 'Receive', width: 100 },
    { field: 'supplier', headerName: 'Supplier', width: 120 },
  ];

  const getRowClassName = (params) => {
    if (jobflag === 0 && params.row.flag === 1) {
        return 'bg-custom-hover';
    } else if (jobflag === 0 && params.row.flag === 2) {
        return 'bg-cusyellow-50';
    }
    return '';
};

  const CustomModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white w-2/3 p-4 rounded-lg">
          <div className='w-full h-full flex justify-end'>
            <IconButton
              className="text-gray-600 hover:text-red-600"
              onClick={onClose}
            >
              <IoClose size={24} />
            </IconButton>
          </div>
          {children}
        </div>
      </div>
    );
  };


  const handleshowgrid =() =>{
    setShowgrid(!showgrid);
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 pb-0 w-full mx-auto">
      <div className="flex w-fit justify-start mb-2 text-blue-600 gap-3 text-lg items-center cursor-pointer" onClick={handleshowgrid}>
        <GrTransaction />
        Transactions
      </div>
      <div className="relative overflow-hidden">
        <div className="w-full bg-white h-[40vh] overflow-auto">
        {showgrid &&     
        <ThemeProvider theme={theme}>
        <DataGrid
      rows={rows}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      checkboxSelection={jobflag === 0}
      isRowSelectable={(params) => jobflag === 0 && ( params.row.flag === 1)}
      getRowClassName={getRowClassName}
      sx={{ 
          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
          outline: 'none',
          boxShadow: 'none',
        },
        '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
          outline: 'none',
          boxShadow: 'none',
        },
        '& .css-de9k3v-MuiDataGrid-selectedRowCount': {
          visibility: 'hidden',
        },
        '& .MuiDataGrid-row.Mui-selected': {
          backgroundColor: '#d1e7fd !important',
        },
        '&  .Mui-disabled' :{
          color:'transparent !important'
        }
}}
        />
        </ThemeProvider>
        }
        
          <CustomModal isOpen={openModal} onClose={handleCloseModal}>
            <DetailsTable />
          </CustomModal>

            {openReturnModal && selectedRowData && (
            <ReturnModal
            isOpen={openReturnModal}
            handleCloseReturnModal={handleCloseReturnModal}
            selectedRowData={selectedRowData}
            isWeightModalOpen={openReturnModal}
            handleScanSubmit={handleScanSubmit}
            loading={loading}
          />
            )}

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirm Return All</DialogTitle>
            <DialogContent>
              Are you sure you want to return all items from this RM bag?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">Cancel</Button>
              <Button onClick={handleReturnAll} color="primary">Confirm</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsTab;
