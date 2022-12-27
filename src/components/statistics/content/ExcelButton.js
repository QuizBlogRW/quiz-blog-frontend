import React from 'react'
import * as XLSX from 'xlsx';
import { Button } from 'reactstrap'


const ExcelButton = ({ data, filename }) => {

    // CONVERT THE OBJECTS TO ARRAYS
    const dataArr = data && data.map(obj => Object.values(obj))

    // GET THE HEADERS
    const headers = data && Object.keys(data[0])

    // ADD THE HEADERS TO THE ARRAY
    dataArr.unshift(headers)

    const handleExport = () => {
        // Assume that the data you want to export is stored in a 2D array called "data"
        // Convert the 2D array to a worksheet
        const ws = XLSX.utils.aoa_to_sheet(dataArr);

        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Write the workbook to a file
        XLSX.writeFile(wb, `${filename}.xlsx`);
    }


    return (
        <Button outline color="success" onClick={handleExport} className="my-3">
            Export to Excel
        </Button>
    )
}

export default ExcelButton
