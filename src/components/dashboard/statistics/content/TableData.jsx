import { Table } from 'reactstrap';
import ExcelButton from './ExcelButton';

const TableData = ({ data, filename }) => {

    const titles = Object.keys(data[0]);
    const content = data;

    return (
        <div>
            <ExcelButton data={content} filename={filename} />

            <Table bordered hover responsive size="sm" striped>

                <thead>
                    <tr>
                        <th>
                            #
                        </th>
                        {
                            titles?.map((title, index) => {
                                return (
                                    <th key={index} className="text-uppercase">
                                        {title}
                                    </th>
                                );
                            })

                        }
                    </tr>
                </thead>

                <tbody>
                    {
                        // Content of the table
                        content?.map((item, index) => (
                            <tr key={index}>

                                {/* Row number */}
                                <th scope="row">
                                    {index + 1}
                                </th>

                                {
                                    // Values of the row
                                    Object.keys(item).map((key, index) => {
                                        return (
                                            <td key={index}>
                                                {item[key]}
                                            </td>
                                        );
                                    })}
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </div>
    );
};

export default TableData;
