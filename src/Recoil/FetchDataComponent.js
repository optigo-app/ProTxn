import { atom, useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { masterFunctionData } from '../Utils/MasterFunction';

export const rdState = atom({
  key: 'rdState',
  default: [],
});

export const rd1State = atom({
  key: 'rd1State',
  default: [],
});

export const rd2State = atom({
  key: 'rd2State',
  default: [],
});

export const rd3State = atom({
  key: 'rd3State',
  default: [],
});

export const rd4State = atom({
  key: 'rd4State',
  default: [],
});
export const rd5State = atom({
  key: 'rd5State',
  default: [],
});

export const YearCodeState = atom({
  key: 'YearCodeState',
  default: '',
});
export const tokenState = atom({
  key: 'tokenState',
  default: '',
});

export const UploadLogicalPathState = atom({
  key: 'UploadLogicalPathState',
  default: '',
});
export const ukeyState = atom({
  key: 'ukeyState',
  default: '',
});
export const salesrdState = atom({
  key: 'salesrdState',
  default: '',
});

function FetchDataComponent() {
  const initTxn = JSON?.parse(localStorage?.getItem('InitTxn'));
  useEffect(() => {
    const fetchData = async () => {
      const responseData = await masterFunctionData();
      localStorage.setItem('tnxemployees', JSON.stringify(responseData.rd));
      localStorage.setItem('tnxjobs', JSON.stringify(responseData.rd2));
      localStorage.setItem('tnxdept', JSON.stringify(responseData.rd4));
      localStorage.setItem('tnxlocation', JSON.stringify(responseData.rd6));
      localStorage.setItem('tnxrmbags', JSON.stringify(responseData.rd8));
      localStorage.setItem('tnxlockerid', JSON.stringify(responseData.rd10));
      localStorage.setItem('tnxmaterialid', JSON.stringify(responseData.rd12));
    };

    if (initTxn?.yearcode && initTxn?.dbUniqueKey) {
      fetchData();
    }
  }, [initTxn]);

  return null;
}

export default FetchDataComponent;


