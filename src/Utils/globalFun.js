export const mergeKeyobj = (responseData) => {
    let mergedData = {};
    const keys = Object?.keys(responseData);

    for (let i = 0; i < keys?.length; i += 2) {
        const keyEven = keys[i];
        const keyOdd = keys[i + 1];

        if (responseData[keyEven] && responseData[keyOdd]) {
            const merged = responseData[keyOdd]?.map(item => {
                let newObj = {};
                responseData[keyEven].forEach(field => {
                    for (const [fieldKey, matchKey] of Object.entries(field)) {
                        if (item[matchKey] !== undefined) {
                            newObj[fieldKey] = item[matchKey];
                        }
                    }
                });
                return newObj;
            });

            mergedData[keyEven] = merged; 
        }
    }

    return mergedData;
}