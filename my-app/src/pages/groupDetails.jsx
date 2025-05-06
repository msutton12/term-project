import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/Card';
import { Button, Row, Col, Badge, Alert } from 'react-bootstrap';

const GroupDetailPage = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [activeUser, setActiveUser] = useState('');
    const [balances, setBalances] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem('activeUser');
        setActiveUser(user);

        const groups = JSON.parse(localStorage.getItem('groups')) || {};
        const txs = JSON.parse(localStorage.getItem('groupTransactions')) || {};

        if (groups[groupId]) {
            setGroup(groups[groupId]);
            setTransactions(txs[groupId] || []);
        }
    }, [groupId]);

    useEffect(() => {
        if (!group || !transactions.length) {
            setBalances([]);
            return;
        }

        // Calculate balances
        const debtMap = {};
        const epsilon = 0.01;

        // Initialize all members to 0 balance
        group.members.forEach(member => {
            debtMap[member] = 0;
        });

        // Process transactions: payer gets credited, others get debited
        transactions.forEach(tx => {
            const amount = parseFloat(tx.amount.replace('$', ''));
            const members = group.members;
            const share = amount / members.length;

            members.forEach(member => {
                if (member === tx.payer) return;
                debtMap[member] -= share;
                debtMap[tx.payer] += share;
            });
        });

        // Simplify debts
        const owes = [];
        const balanceData = Object.entries(debtMap);
        balanceData.sort((a, b) => a[1] - b[1]); // ascending by net balance

        let i = 0, j = balanceData.length - 1;
        while (i < j) {
            const [debtor, debtAmt] = balanceData[i];
            const [creditor, creditAmt] = balanceData[j];

            const amount = Math.min(-debtAmt, creditAmt);
            if (amount > epsilon) {
                owes.push({
                    debtor,
                    creditor,
                    amount: amount.toFixed(2),
                    isActiveUserDebtor: debtor === activeUser,
                    isActiveUserCreditor: creditor === activeUser
                });
                balanceData[i][1] += amount;
                balanceData[j][1] -= amount;
            }

            if (Math.abs(balanceData[i][1]) < epsilon) i++;
            if (Math.abs(balanceData[j][1]) < epsilon) j--;
        }

        setBalances(owes);
    }, [group, transactions, activeUser]);

    const handleDelete = (indexToRemove) => {
        const updated = [...transactions];
        updated.splice(indexToRemove, 1);
        setTransactions(updated);

        const allGroups = JSON.parse(localStorage.getItem('groupTransactions')) || {};
        allGroups[groupId] = updated;
        localStorage.setItem('groupTransactions', JSON.stringify(allGroups));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!group) return (
        <div className="app-container">
            <Alert variant="warning">Group not found</Alert>
            <Link to="/groups" className="btn btn-primary mt-3">Back to Groups</Link>
        </div>
    );

    return (
        <div className="app-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">{group.name}</h1>
                    <p className="text-gray mb-0">{group.members.length} members</p>
                </div>
                <Link to="/groups" className="btn btn-outline-secondary">
                    Back to Groups
                </Link>
            </div>

            <Row>
                <Col lg={5}>
                    <Card title="Members" className="mb-4">
                        <ul className="list-group list-group-flush">
                            {group.members.map((member, idx) => (
                                <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                    {member}
                                    {member === activeUser &&
                                        <Badge bg="primary" pill>You</Badge>
                                    }
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <Card title="Balances" className="mb-4">
                        {balances.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-settled">Everyone is settled up ✅</p>
                            </div>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {balances.map((balance, idx) => (
                                    <li key={idx} className="list-group-item">
                                        <div className={`d-flex justify-content-between align-items-center ${
                                            balance.isActiveUserDebtor ? 'text-you-owe' :
                                                balance.isActiveUserCreditor ? 'text-owed-to-you' : ''
                                        }`}>
                                            <span>
                                                <strong>
                                                    {balance.isActiveUserDebtor ? 'You' : balance.debtor}
                                                </strong> owes <strong>
                                                    {balance.isActiveUserCreditor ? 'you' : balance.creditor}
                                                </strong>
                                            </span>
                                            <Badge
                                                bg={balance.isActiveUserDebtor ? 'danger' :
                                                    balance.isActiveUserCreditor ? 'success' : 'secondary'}
                                                className="p-2"
                                            >
                                                ${balance.amount}
                                            </Badge>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    <div className="d-grid gap-2">
                        <Link to={`/add-transaction?groupId=${groupId}`} className="btn btn-success">
                            Add New Transaction
                        </Link>
                    </div>
                </Col>

                <Col lg={7}>
                    <Card title="Transactions">
                        {transactions.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="text-gray mb-4">No transactions yet</p>
                                <Link to={`/add-transaction?groupId=${groupId}`} className="btn btn-success">
                                    Add Your First Transaction
                                </Link>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Paid By</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {transactions.map((t, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                {t.payer === activeUser ? (
                                                    <strong className="text-primary">You</strong>
                                                ) : t.payer}
                                            </td>
                                            <td className="font-weight-bold">{t.amount}</td>
                                            <td>{formatDate(t.date)}</td>
                                            <td>{t.description || '-'}</td>
                                            <td className="text-center">
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(idx)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default GroupDetailPage;