
import axios from "axios";
const onlineUrl = 'https://api.optigoapps.com/ReactStore/ReactStore.aspx';
const localUrl = 'http://zen/api/ReactStore.aspx'
const APIURL = (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ?
    onlineUrl :
    onlineUrl;


export const CommonAPI = async (body) => {
    const initTxn = JSON?.parse(localStorage.getItem('InitTxn'));
    try {
        const YearCode = initTxn?.yearcode ?? '';
        const token = initTxn?.dbUniqueKey ?? '';

        const header = {
            Authorization: token ?? '',
            Yearcode: YearCode ?? '',
            Version: "v1",
            sp: '5',
            sv: '0',
            domain: '',
            'Content-Type': 'application/json',
            Cookie: 'ASP.NET_SessionId=i4btgm10k555buulfvmqyeyc',
        };

        const response = await axios.post(APIURL, body, { headers: header });
        return response?.data;

    } catch (error) {
        console.error('error is..', error);
    }
};

