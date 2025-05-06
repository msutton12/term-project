import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap";

function TransactionForm() {
    const [searchParams] = useSearchParams();
    const groupId = searchParams.get("groupId");

    const [members, setMembers] = useState([]);
    const [payer, setPayer] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // format YYYY-MM-DD
    });
    const [details, setDetails] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const groups = JSON.parse(localStorage.getItem('groups')) || {};
        if (groups[groupId]) {
            setMembers(groups[groupId].members);
        }
    }, [groupId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newTransaction = {
            payer,
            amount: `$${amount}`,
            date,
            status: 'Pending',
            details,
        };

        const allTransactions = JSON.parse(localStorage.getItem('groupTransactions')) || {};
        allTransactions[groupId] = allTransactions[groupId] || [];
        allTransactions[groupId].unshift(newTransaction);
        localStorage.setItem('groupTransactions', JSON.stringify(allTransactions));

        navigate(`/group/${groupId}`);
    };

    return (
        <>
            <h1 className="text-center mb-4">Add Transaction</h1>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Payer</Form.Label>
                    <Form.Select value={payer} onChange={(e) => setPayer(e.target.value)} required>
                        <option value="">-- Select a member --</option>
                        {members.map((member, idx) => (
                            <option key={idx} value={member}>
                                {member}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <FloatingLabel controlId="floatingAmount" label="Amount" className="mb-3">
                    <Form.Control
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        required
                    />
                </FloatingLabel>

                <FloatingLabel controlId="floatingDate" label="Transaction Date" className="mb-3">
                    <Form.Control
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
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