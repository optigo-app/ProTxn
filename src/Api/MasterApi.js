import { CommonAPI } from "./CommanApi/CommonAPI";

export const fetchMasterApi = async () => {
    try {
        let userId = "kp23@gmail.com";
        const combinedValue = JSON.stringify({
            "PackageId": "1",
            "FrontEnd_RegNo": "80kgizbiduw5e7gg",
            "Customerid": "10",
        });

        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            con: `{\"id\":\"\",\"mode\":\"GETMASTER\",\"appuserid\":\"${userId}\"}`,
            f: "Header (getCartData)",
            p: encodedCombinedValue,
            dp: combinedValue
        };

        const response = await CommonAPI(body);

        return response?.Data;
    } catch (error) {
        console.error("Error fetching cart details:", error);
        throw error;
    }
};
