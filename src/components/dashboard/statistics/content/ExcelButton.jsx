import { utils, writeFile } from 'xlsx';
import { Button } from 'reactstrap';
import moment from 'moment';

const ExcelButton = ({ data, filename }) => {

    // CONVERT THE FIELDS WITH EMPTY STRINGS TO NULL - DONE INPLACE
    // Create a new array with modified values
    const modifiedData = data && data.map((obj) => {
        // Create a new object with modified values
        const modifiedObj = { ...obj };
        Object.keys(modifiedObj).forEach(key => {
            if (modifiedObj[key] === '') {
                modifiedObj[key] = null;
            }
        });
        return modifiedObj;
    });

    // CONVERT THE OBJECTS TO ARRAYS
    const dataArr = modifiedData && modifiedData.map(obj => Object.values(obj));

    // GET THE HEADERS
    const headers = modifiedData && Object.keys(modifiedData[0]);

    // CHANGE THE HEADERS TO UPPER CASE LETTERS - INPLACE
    headers && headers.map((header, index) => headers[index] = header.toUpperCase());

    // ADD THE HEADERS TO THE ARRAY
    dataArr.unshift(headers);

    // IF THE VALUE IN dataArr IS AN OBJECT, AND HAS PROPERTY title, THEN CHANGE THE VALUE TO title
    dataArr && dataArr.map((arr) => {
        arr.map((item, index) => {

            if (item instanceof Date && !isNaN(item)) {
                arr[index] = moment(item, 'DD-MM-YYYY, HH:mm:ss').format('DD-MM-YYYY, HH:mm:ss');
            }

            if (typeof item === 'object' && item !== null) {

                if (Object.prototype.hasOwnProperty.call(item, 'title')) {
                    arr[index] = item.title;
                }
                else if (Object.prototype.hasOwnProperty.call(item, 'name')) {
                    arr[index] = item.name;
                }

                // IF IT IS AN ARRAY
                else if (Array.isArray(item)) {
                    arr[index] = item.map(interest => interest.favorite).join('; ');
                }

                // IF IT IS NULL
                else arr[index] = null;
            }
            return null;
        });
        return null;
    });

    const handleExport = () => {
        // Assume that the data you want to export is stored in a 2D array called "data"
        // Convert the 2D array to a worksheet
        const ws = utils.aoa_to_sheet(dataArr);

        // Create a new workbook
        const wb = utils.book_new();

        // Add the worksheet to the workbook
        utils.book_append_sheet(wb, ws, 'Sheet1');

        // Write the workbook to a file
        writeFile(wb, `${filename}.xlsx`);
    };

    return (
        <Button outline color="success" onClick={handleExport} className="my-3">
            Export to Excel
        </Button>
    );
};

export default ExcelButton;
