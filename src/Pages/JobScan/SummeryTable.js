import React,{useEffect, useState} from 'react';
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
import { TfiBackRight } from "react-icons/tfi";
import { IoSwapHorizontal } from "react-icons/io5";
import { IoReturnUpForward } from "react-icons/io5";
import DetailsTable from './DetailsTable';
import { IoClose } from 'react-icons/io5'; 
import { IoMdReturnRight } from "react-icons/io";


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

const initialRows = [
  { id: 1, sr: 1, bagPrepBy: ' ', employee: 'm admin', dept: 'filing', item: 'METAL', mType: 'Mi-01', type: 'GOLD', quality: '22K', color: 'bright', size: '1mm', actualPcs: 0, actualUsed: 5.0, receive: 0.0, supplier: 'company', flag: 1 },
  { id: 2, sr: 2, bagPrepBy: ' ', employee: 'm admin', dept: 'Setting', item: 'MISC', mType: 'PRS', type: 'PD', quality: 'PD', color: 'PD', size: '2mm', actualPcs: 2, actualUsed: 2.0, receive: 0.0, supplier: 'company', flag: 2 },
  { id: 3, sr: 3, bagPrepBy: ' ', employee: 'm admin', dept: 'filing', item: 'FCHAIN', mType: 'GOLD', type: 'GOLD', quality: '22K', color: 'Yellow', size: '2', actualPcs: 2, actualUsed: 2.0, receive: 0.0, supplier: 'company', flag: 1 },
  { id: 4, sr: 4, bagPrepBy: ' ', employee: 'm admin', dept: 'filing', item: 'DIAMOND', mType: 'ASSCH', type: 'ASSCH', quality: 'flashy', color: 'blackgreen', size: 'Any', actualPcs: 2, actualUsed: 2.0, receive: 0.0, supplier: 'company', flag: 0 },
  { id: 5, sr: 5, bagPrepBy: ' ', employee: 'm admin', dept: 'filing', item: 'COLOR STONE', mType: 'CS-3-A', type: 'amethyst', quality: 'white coral', color: 'bluish', size: '6', actualPcs: 2, actualUsed: 2.0, receive: 0.0, supplier: 'company', flag: 0 },
  { id: 6, sr: 6, bagPrepBy: ' ', employee: 'm admin', dept: 'filing', item: 'COLOR STONE', mType: 'CS-3-A', type: 'amethyst', quality: 'white coral', color: 'bluish', size: '6', actualPcs: 2, actualUsed: 2.0, receive: 0.0, supplier: 'company', flag: 0 },
  { id: 7, sr: 7, bagPrepBy: ' ', employee: 'm admin', dept: 'filing', item: 'COLOR STONE', mType: 'CS-3-A', type: 'amethyst', quality: 'white coral', color: 'bluish', size: '6', actualPcs: 2, actualUsed: 2.0, receive: 0.0, supplier: 'company', flag: 1 },
  { id: 8, sr: 8, bagPrepBy: ' ', employee: 'm admin', dept: 'filing', item: 'COLOR STONE', mType: 'CS-3-A', type: 'amethyst', quality: 'white coral', color: 'bluish', size: '6', actualPcs: 2, actualUsed: 2.0, receive: 0.0, supplier: 'company', flag: 2 },
];

export default function SummaryTable() {
  const [rows, setRows] = useState(initialRows);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [color,setcolor] = useState('white'); 
  const handleClickOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
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
  sx={{
    color: '#257BF0',
    '&:hover': {
      color: 'gray',
    }
  }}
>
  <VisibilityIcon sx={{ color: '#257BF0', fontSize: 20 }} />
</IconButton>

        </Tooltip>
      ),
    },
    {
      field: 'returnall',
      headerName: 'Return All',
      width: 70,
      renderCell: (params) => (
        
        <IconButton className="text-[#257BF0] cursor-pointer hover:text-blue-600"  onClick={() => handleClickOpen(params.id)}
        sx={{
          color: '#257BF0',
          '&:hover': {
            color: 'gray',
          }
        }}  
        >
            <IoSwapHorizontal size={20} />
          </IconButton>
      ),
    },
    {
      field: 'return',
      headerName: 'Return',
      width: 70,
      renderCell: (params) => (
        
        <IconButton className="text-[#257BF0] cursor-pointer hover:text-blue-600"  onClick={() => handleClickOpen(params.id)}
        sx={{
          color: '#257BF0',
          '&:hover': {
            color: 'gray',
          }
        }}  
        >
            <IoMdReturnRight  size={20} />
          </IconButton>
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
    if (params.row.flag === 1) {
      return 'bg-[#FFF3E8]';
    } else if (params.row.flag === 2) {
      return 'bg-[#E7F7FF]';
    }
    return '';
  };

  

  const CustomModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className=" bg-white w-2/3 p-4 rounded-lg ">
          <div className='w-full  h-full  flex  justify-end '>

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

  return (
    <div className="w-full bg-white h-[40vh] overflow-auto">
      <ThemeProvider theme={theme}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection={(params) => params.row.flag === 1 || params.row.flag === 2}
        isRowSelectable={(params) => params.row.flag === 1 || params.row.flag === 2}
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
      backgroundColor: '#d1e7fd',
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: '#f5f5f5', 
    },
  }}
/>



      </ThemeProvider>

      <CustomModal isOpen={openModal} onClose={handleCloseModal}>
        <DetailsTable />
      </CustomModal>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Return All</DialogTitle>
        <DialogContent>
          Are you sure you want to return all items from this RM bag?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReturnAll} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
