import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import { masterFunctionData } from '../Utils/MasterFunction';
import { EmplistApi } from '../Api/EmplistApi';
import { SerialJobListApi } from '../Api/SerialJobList';
import { RmbagListApi } from '../Api/Rmbaglist';

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

export const tnxemployees = atom({
  key: 'tnxemployees',
  default: [],
});

export const tnxjobs = atom({
  key: 'tnxjobs',
  default: [],
});

export const tnxrmbags = atom({
  key: 'tnxrmbags',
  default: [],
});

function FetchDataComponent() {
  const initTxn = JSON?.parse(localStorage?.getItem('InitTxn'));
  const setEmplist = useSetRecoilState(tnxemployees);
  const setSerialJoblist = useSetRecoilState(tnxjobs);
  const setRmBaglist = useSetRecoilState(tnxrmbags);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallelize API calls
        const [resEmpData, resSerialJobData, resRmBagData, resMasterData] = await Promise.all([
          EmplistApi(),
          SerialJobListApi(),
          RmbagListApi(),
          masterFunctionData(),
        ]);

        // Utility to set state and localStorage
        const handleApiResponse = (response, setState, storageKey) => {
          if (response) {
            setState(response?.rd);
            localStorage.setItem(storageKey, JSON.stringify(response?.rd));
          }
        };

        // Process individual API responses
        handleApiResponse(resEmpData, setEmplist, 'tnxemployees');
        handleApiResponse(resSerialJobData, setSerialJoblist, 'tnxjobs');
        handleApiResponse(resRmBagData, setRmBaglist, 'tnxrmbags');

        // Handle master API response
        if (resMasterData) {
          const { rd, rd2, rd4, rd6 } = resMasterData;
          localStorage.setItem('tnxdept', JSON.stringify(rd));
          localStorage.setItem('tnxlocation', JSON.stringify(rd2));
          localStorage.setItem('tnxlockerid', JSON.stringify(rd4));
          localStorage.setItem('tnxmaterialid', JSON.stringify(rd6));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (initTxn?.yearcode && initTxn?.dbUniqueKey) {
      fetchData();
    }
  }, [initTxn, setEmplist, setSerialJoblist, setRmBaglist]);

  return null;
}


export default FetchDataComponent;


