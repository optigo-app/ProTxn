import { mergeKeyobj } from "../Utils/globalFun";
import { CommonAPI } from "./CommanApi/CommonAPI";

export const EmplistApi = async () => {
    try {
        let userId = "kp23@gmail.com";
        const combinedValue = JSON.stringify({
            "PackageId": "1",
            "FrontEnd_RegNo": "80kgizbiduw5e7gg",
            "Customerid": "10",
        });

        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            con: `{\"id\":\"\",\"mode\":\"EMPLIST\",\"appuserid\":\"${userId}\"}`,
            f: "Header (getCartData)",
            p: encodedCombinedValue,
            dp: combinedValue
        };

        const response = await CommonAPI(body);
        let responseData = response?.Data;
       
        if (responseData) {
            let data = mergeKeyobj(responseData)
            console.log('data: ', data);
            return data;
        }

    } catch (error) {
        console.error("Error fetching cart details:", error);
        throw error;
    }
};
