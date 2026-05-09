import { utils, writeFile } from 'xlsx';
import { Button } from 'reactstrap';
import { formatDateTime } from '@/utils/dateFormat';

const ExcelButton = ({ data, filename }) => {

    const handleExport = () => {
        const modifiedData = data && data.map((obj) => {
            const modifiedObj = { ...obj };

            Object.keys(modifiedObj).forEach((key) => {
                if (modifiedObj[key] === '') {
                    modifiedObj[key] = null;
                }
            });

            return modifiedObj;
        });

        const dataArr = modifiedData && modifiedData.map((obj) => Object.values(obj));
        const headers = modifiedData && Object.keys(modifiedData[0]);

        headers && headers.forEach((header, index) => {
            headers[index] = header.toUpperCase();
        });

        dataArr?.unshift(headers);

        dataArr && dataArr.forEach((arr) => {
            arr.forEach((item, index) => {
                if (item instanceof Date && !isNaN(item)) {
                    arr[index] = formatDateTime(item);
                }

                if (typeof item === 'object' && item !== null) {
                    if (Object.prototype.hasOwnProperty.call(item, 'title')) {
                        arr[index] = item.title;
                    }
                    else if (Object.prototype.hasOwnProperty.call(item, 'name')) {
                        arr[index] = item.name;
                    }
                    else {
                        arr[index] = null;
                    }
                }
            });
        });

        // Data to export stored in a 2D array
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
