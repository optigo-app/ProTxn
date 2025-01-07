const LocalSet = (key, value) => {
    if (typeof key !== 'string' || key.trim() === '') {
        return 'Please provide a valid key';
    }

    if (value === undefined) {
        return 'Please provide a value';
    }

    try {
        const serializedValue = JSON.stringify(value);

        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return 'Failed to save data';
    }
}

const LocalGet = (key) => {
    if (typeof key !== 'string' || key.trim() === '') {
        return 'Please provide a valid key';
    }

    try {
        const res = localStorage.getItem(key);
        if (res === null) {
            return 'No data found for the provided key';
        }
        const data = JSON.parse(res);
        return data;
    } catch (error) {
        console.error('Error retrieving from localStorage:', error);
        return 'Failed to retrieve data';
    }
}
export { LocalSet, LocalGet };
