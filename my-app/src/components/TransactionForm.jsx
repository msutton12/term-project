import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap";

function TransactionForm() {
    return (
        <>
            <h1 className="text-center">AddTransaction</h1>

            {/* Payer Input */}
            <FloatingLabel
                controlId="floatingPayer"
                label="Payer Name"
                className="mb-3"
            >
                <Form.Control type="text" placeholder="Enter payer name" />
            </FloatingLabel>

            {/* Amount Input */}
            <FloatingLabel
                controlId="floatingAmount"
                label="Amount"
                className="mb-3"
            >
                <Form.Control type="number" placeholder="Enter amount" />
            </FloatingLabel>

            {/* Date Input */}
            <FloatingLabel
                controlId="floatingDate"
                label="AddTransaction Date"
                className="mb-3"
            >
                <Form.Control type="date" />
            </FloatingLabel>

            {/* AddTransaction Details */}
            <FloatingLabel
                controlId="floatingDetails"
                label="AddTransaction Details"
                className="mb-3"
            >
                <Form.Control as="textarea" placeholder="Enter transaction details" />
            </FloatingLabel>

            {/* Submit Button */}
            <Button type="submit">Submit AddTransaction</Button>
        </>
    );
}

export default TransactionForm;
