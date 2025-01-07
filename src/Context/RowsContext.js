import React, { createContext, useContext, useState } from 'react';

const RowsContext = createContext();

const initialRows = [
  { id: 1, sr: 1, bagPrepBy: ' ', employee: 'm admin', dept: 'filing', item: 'METAL', mType: 'Mi-01', type: 'GOLD', quality: '22K', color: 'bright', size: '1mm', actualPcs: 0, actualUsed: 5.0, receive: 0.0, supplier: 'company', flag: 1 },
  { id: 2, sr: 2, bagPrepBy: ' ', employee: 'm admin', dept: 'Setting', item: 'MISC', mType: 'PRS', type: 'PD', quality: 'PD', color: 'PD', size: '2mm', actualPcs: 2, actualUsed: 2.0, receive: 0.0, supplier: 'company', flag: 2 },
  { id: 3, sr: 3, bagPrepBy: ' ', employee: 'm admin', dept: 'filing', item: 'FCHAIN', mType: 'GOLD', type: 'GOLD', quality: '22K', color: 'Yellow', size: '2', actualPcs: 2, actualUsed: 2.0, receive: 0.0, supplier: 'company', flag: 1 },
  { id: 4, sr: 4, bagPrepBy: ' ', employee: 'm admin', dept: 'filing', item: 'DIAMOND', mType: 'ASSCH', type: 'ASSCH', quality: 'flashy', color: 'blackgreen', size: 'Any', actualPcs: 2, actualUsed: 2.0, receive: 0.0, supplier: 'company', flag: 0 },
  { id: 5, sr: 5, bagPrepBy: ' ', employee: 'm admin', dept: 'filing', item: 'COLOR STONE', mType: 'CS-3-A', type: 'amethyst', quality: 'white coral', color: 'bluish', size: '6', actualPcs: 2, actualUsed: 2.0, receive: 0.0, supplier: 'company', flag: 0 },
];
export const RowsProvider = ({ children }) => {
  const [rows, setRows] = useState(initialRows);

  const updateFlags = (selectedRows, newFlag) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        selectedRows.includes(row.id) ? { ...row, flag: newFlag } : row
      )
    );
  };

  return (
    <RowsContext.Provider value={{ rows, updateFlags }}>
      {children}
    </RowsContext.Provider>
  );
};

export const useRows = () => useContext(RowsContext);
