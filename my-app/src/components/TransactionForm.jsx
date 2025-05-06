import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from './Card';

const TransactionForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const groupId = queryParams.get('groupId');

    const [groups, setGroups] = useState({});
    const [selectedGroup, setSelectedGroup] = useState(groupId || '');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [payer, setPayer] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [activeUser, setActiveUser] = useState('');

    useEffect(() => {
        const user = localStorage.getItem('activeUser');
        setActiveUser(user);
        setPayer(user);

        const allGroups = JSON.parse(localStorage.getItem('groups')) || {};
        setGroups(allGroups);

        if (groupId && allGroups[groupId]) {
            setSelectedGroup(groupId);
            setGroupMembers(allGroups[groupId].members);
        }
    }, [groupId]);

    const handleGroupChange = (e) => {
        const id = e.target.value;
        setSelectedGroup(id);

        if (id && groups[id]) {
            setGroupMembers(groups[id].members);
        } else {
            setGroupMembers([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedGroup || !amount || !payer) return;

        const transaction = {
            amount: amount.startsWith('$') ? amount : `$${amount}`,
            payer,
            date,
            description,
            status: 'pending'
        };

        const groupTransactions = JSON.parse(localStorage.getItem('groupTransactions')) || {};
        if (!groupTransactions[selectedGroup]) {
            groupTransactions[selectedGroup] = [];
        }

        groupTransactions[selectedGroup].push(transaction);
        localStorage.setItem('groupTransactions', JSON.stringify(groupTransactions));

        navigate(`/groups/${selectedGroup}`);
    };

    const formatCurrency = (value) => {
        if (!value) return '';

        // Remove any non-digit characters except decimal point
        const digitsOnly = value.replace(/[^\d.]/g, '');

        // Ensure only one decimal point
        const parts = digitsOnly.split('.');
        let formatted = parts[0];

        if (parts.length > 1) {
            // Keep at most 2 decimal places
            formatted += '.' + parts[1].slice(0, 2);
        }

        return `$${formatted}`;
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        const formatted = formatCurrency(value);
        setAmount(formatted);
    };

    return (
        <div className="app-container">
            <h1 className="mb-4">Add a New Transaction</h1>

            <Row>
                <Col md={8} lg={6}>
                    <Card>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Group</Form.Label>
                                <Form.Select
                                    value={selectedGroup}
                                    onChange={handleGroupChange}
                                    required
                                    disabled={!!groupId}
                                >
                                    <option value="">Select a group</option>
                                    {Object.values(groups).map(group => (
                                        <option key={group.id} value={group.id}>
                                            {group.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    placeholder="$0.00"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description (optional)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g., Dinner, Movie tickets, etc."
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Paid by</Form.Label>
                                <Form.Select
                                    value={payer}
                                    onChange={(e) => setPayer(e.target.value)}
                                    required
                                >
                                    <option value="">Select who paid</option>
                                    {groupMembers.map((member, idx) => (
                                        <option key={idx} value={member}>
                                            {member} {member === activeUser ? '(You)' : ''}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-between">
                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    onClick={() => navigate(groupId ? `/groups/${groupId}` : '/groups')}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                    Save Transaction
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

// Create a Row and Col components since they're not imported
const Row = ({ children, className = '' }) => (
    <div className={`row ${className}`}>{children}</div>
);

const Col = ({ children, md, lg, className = '' }) => {
    const mdClass = md ? `col-md-${md}` : '';
    const lgClass = lg ? `col-lg-${lg}` : '';

    return (
        <div className={`col ${mdClass} ${lgClass} ${className}`}>{children}</div>
    );
};

export default TransactionForm;