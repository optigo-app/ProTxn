import axios from 'axios';
import { atom, useRecoilState } from 'recoil';
import { useEffect } from 'react';

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
  const [token, settoken] = useRecoilState(tokenState);
  const [rd, setRd] = useRecoilState(rdState);
  const [rd1, setRd1] = useRecoilState(rd1State);
  const [rd2, setRd2] = useRecoilState(rd2State);
  const [rd3, setRd3] = useRecoilState(rd3State);
  const [rd4, setRd4] = useRecoilState(rd4State);
  const [rd5, setRd5] = useRecoilState(rd5State);
  const [yearCode, setYearCode] = useRecoilState(YearCodeState);
  const [uploadLogicalPath, setUploadLogicalPath] = useRecoilState(UploadLogicalPathState);
  const [ukey, setUkey] = useRecoilState(ukeyState);
  const [salesrd, setSalesrd] = useRecoilState(salesrdState);


  const yc = localStorage.getItem('yearcode');
  const proqctoken = localStorage.getItem('proqctoken');
  

  useEffect(() => {
    const headers = {
      Authorization: proqctoken,
      Yearcode: yc,
      Version: "v1",
      sp: '5',
      sv:'0',
      domain: '',
      'Content-Type': 'application/json',
      Cookie: 'ASP.NET_SessionId=i4btgm10k555buulfvmqyeyc',
    };

    const data = {
      con: '{"id":"","mode":"GETMASTER","appuserid":"kp23@gmail.com"}',
      p: 'eyJQYWNrYWdlSWQxIjoiMSIsIkZyb250RW5kX1JlZ05vMSI6Ijgwa2dpemJpZHV3NWU3Z2ciLCJDdXN0b21lcmlkMSI6IjEwIn0=',
      dp: '{"PackageId":"1","FrontEnd_RegNo":"80kgizbiduw5e7gg","Customerid":"10"}',
    };

    axios
      .post('https://api.optigoapps.com/ReactStore/ReactStore.aspx', data, { headers })
      .then((response) => {
        const responseData = response.data.Data;

        setRd(responseData.rd);
        setRd1(responseData.rd1);
        setRd2(responseData.rd2);
        setRd3(responseData.rd3);
        setRd4(responseData.rd4);
        setRd5(responseData.rd5);

        localStorage.setItem('tnxemployees', JSON.stringify(responseData.rd1));
        localStorage.setItem('tnxjobs', JSON.stringify(responseData.rd3));
        localStorage.setItem('tnxdept', JSON.stringify(responseData.rd5));
        localStorage.setItem('tnxlocation', JSON.stringify(responseData.rd7));
        localStorage.setItem('tnxrmbags', JSON.stringify(responseData.rd9));
        localStorage.setItem('tnxlockerid', JSON.stringify(responseData.rd11));
        localStorage.setItem('tnxmaterialid', JSON.stringify(responseData.rd13));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [yearCode, setRd, setRd1, setRd2, setRd3, ,setRd4,setRd5]);
}

export default FetchDataComponent;


 