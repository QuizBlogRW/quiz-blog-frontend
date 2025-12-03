import { FormGroup, Label, Col, Input } from 'reactstrap';

const SelectField = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = '-- Select --',
    disabledValue = '',
    required = false,
    smLabel = 3,
    smInput = 7,
    smDisabled = 2,
}) => {
    return (
        <FormGroup row className="mx-0">
            <Label sm={smLabel}>{label}</Label>
            <Col sm={smInput}>
                <Input type="select" value={value || ''} onChange={onChange} required={required}>
                    <option>{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt._id || opt} value={opt._id || opt}>
                            {opt.title || opt}
                        </option>
                    ))}
                </Input>
            </Col>
            <Col sm={smDisabled}>
                <Input disabled type="text" value={disabledValue} />
            </Col>
        </FormGroup>
    );
};

export default SelectField;
