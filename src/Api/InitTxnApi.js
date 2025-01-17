import axios from "axios";

const onlineUrl = 'https://api.optigoapps.com/ReactStore/ReactStore.aspx';
const localUrl = 'http://zen/api/ReactStore.aspx';
const APIURL = (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ?
    localUrl :
    onlineUrl;

const encodeToBase64 = (data) => {
    return btoa(JSON.stringify(data));
};

export const InitTxnApi = async ({ companyCode, password }) => {
    try {
        const header = {
            Authorization: "proqc_json_api",
            Version: "v1",
            sp: "5",
            domain: "",
            sv: '0',
            "Content-Type": "application/json",
        };

        const p = {
            "PackageId1": "1"
        };

        const dp = {
            "empbarcode": "",
            "deviceid": "DeviceID_SMIT1",
            "deviceName": "DeviceName_SMIT1",
            "brand": "mybrand",
            "model": "mymodel",
            "manufacturer": "mymanufacturer",
            "appver": "appver1",
            "appvercode": "22",
            "device_type": "android/ios",
            "onesignal_uid": "abc123_onesignal_uid",
            "companycode": `${companyCode ?? ''}`,
            "companypass": `${password ?? ''}`
        };

        const body = {
            "con": "{\"id\":\"\",\"mode\":\"INITTXN\",\"appuserid\":\"kp23@gmail.com\"}",
            "p": encodeToBase64(p),
            "dp": JSON?.stringify(dp)
        };

        const response = await axios.post(APIURL, body, { headers: header });
        if (response.data.Data.rd[0].stat === 1) {
            let initRes = response.data.Data.rd[0]
            const yearcode = initRes?.yearcode;
            const dbUniqueKey = initRes?.dbUniqueKey;
            const UploadLogicalPathData = initRes?.UploadLogicalPath;
            const ukeyData = initRes?.ukey;
            localStorage.setItem('InitTxn', JSON?.stringify(initRes));
            localStorage.setItem('UploadLogicalPath', UploadLogicalPathData);
            localStorage.setItem('ukey', ukeyData);
            localStorage.setItem('yearcode', yearcode);
            localStorage.setItem('proqctoken', dbUniqueKey);
        }
        return response?.data;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
};
