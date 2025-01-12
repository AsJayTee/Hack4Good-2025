import React, { useState } from 'react';
import * as XLSX from '../Assets/Dataset.xlsx';

const ExcelImport = () => {
    const [data, setData] = useState([]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            setData(jsonData);
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div>
            <input type="file" onChange={handleFileUpload} />
            <ul>
                {data.map((row, index) => (
                    <li key={index}>
                        {row.Product_Name} - {row.Quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExcelImport;
