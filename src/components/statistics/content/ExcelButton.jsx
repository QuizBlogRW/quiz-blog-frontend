import React from 'react'
import * as XLSX from 'xlsx';
import { Button } from 'reactstrap'
// import moment from 'moment'

const ExcelButton = ({ data, filename }) => {

    // CONVERT THE FIELDS WITH EMPTY STRINGS TO NULL - DONE INPLACE
    data && data.map((obj, index) => {

        Object.keys(obj).map(key => {
            if (obj[key] === "") {
                data[index][key] = null
            }
            return null
        })
        return null
    })

    // CONVERT THE OBJECTS TO ARRAYS
    const dataArr = data && data.map(obj => Object.values(obj))

    // GET THE HEADERS
    const headers = data && Object.keys(data[0])

    // CHANGE THE HEADERS TO UPPER CASE LETTERS - INPLACE
    headers && headers.map((header, index) => headers[index] = header.toUpperCase())

    // ADD THE HEADERS TO THE ARRAY
    dataArr.unshift(headers)

    // IF THE VALUE IN dataArr IS AN OBJECT, AND HAS PROPERTY title, THEN CHANGE THE VALUE TO title
    dataArr && dataArr.map((arr) => {
        arr.map((item, index) => {

            // // CHECK IF IT IS A DATE
            // if (Date.parse(item)) {
            //     arr[index] = moment(item).format('DD-MM-YYYY, HH:mm:ss')
            // }

            if (typeof item === 'object' && item !== null) {

                if(item.hasOwnProperty('title')) {
                    arr[index] = item.title
                }
                else if(item.hasOwnProperty('name')) {
                    arr[index] = item.name
                }

                // IF IT IS AN ARRAY
                else if (Array.isArray(item)) {
                    arr[index] = item.map(interest => interest.favorite).join('; ')
                }

                // IF IT IS NULL
                else arr[index] = null
            }
            return null
        })
        return null
    })

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
