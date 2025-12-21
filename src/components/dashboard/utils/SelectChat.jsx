import { Col } from "reactstrap";

const SelectChat = ({ message }) => {
    return (
        <Col
            xs="12"
            sm="6"
            className="d-flex flex-column justify-content-center align-items-center h-100 text-center text-muted overflow-auto bg-white rounded p-2"
            style={{ maxHeight: '100vh' }}
        >
            <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mb-3 opacity-50"
            >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="mb-0">{message || "Select a conversation to view messages"}</p>
        </Col>
    )
}

export default SelectChat
