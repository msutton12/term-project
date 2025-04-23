import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap";

function TransactionForm() {
    const [searchParams] = useSearchParams();
    const groupId = searchParams.get("groupId");

    const [payer, setPayer] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [details, setDetails] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const newTransaction = {
            payer,
            amount: `$${amount}`,
            date,
            status: 'Pending',
            details,
        };

        // ✅ Save to localStorage
        const allTransactions = JSON.parse(localStorage.getItem('groupTransactions')) || {};
        allTransactions[groupId] = allTransactions[groupId] || [];
        allTransactions[groupId].unshift(newTransaction);
        localStorage.setItem('groupTransactions', JSON.stringify(allTransactions));

        // ✅ Navigate to group detail page
        navigate(`/group/${groupId}`);
    };


    return (
        <>
            <h1 className="text-center">Add Transaction</h1>

            <Form onSubmit={handleSubmit}>
                <FloatingLabel controlId="floatingPayer" label="Payer Name" className="mb-3">
                    <Form.Control
                        type="text"
                        value={payer}
                        onChange={(e) => setPayer(e.target.value)}
                        placeholder="Enter payer name"
                    />
                </FloatingLabel>

                <FloatingLabel controlId="floatingAmount" label="Amount" className="mb-3">
                    <Form.Control
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                </FloatingLabel>

                <FloatingLabel controlId="floatingDate" label="Transaction Date" className="mb-3">
                    <Form.Control
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </FloatingLabel>

                <FloatingLabel controlId="floatingDetails" label="Transaction Details" className="mb-3">
                    <Form.Control
                        as="textarea"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Enter transaction details"
                    />
                </FloatingLabel>

                <Button type="submit">Submit Transaction</Button>
            </Form>
        </>
    );
}

export default TransactionForm;
