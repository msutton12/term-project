import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { Link } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const Dashboard = () => {
    const [user, setUser] = useState('');
    const [balance, setBalance] = useState(0);
    const [activity, setActivity] = useState([]);
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        const activeUser = localStorage.getItem('activeUser');
        setUser(activeUser);

        const groups = JSON.parse(localStorage.getItem('groups')) || {};
        const groupTransactions = JSON.parse(localStorage.getItem('groupTransactions')) || {};

        const activityFeed = [];
        const pieDataMap = {};
        let netBalance = 0;

        Object.values(groups).forEach(group => {
            const members = group.members;
            const transactions = groupTransactions[group.id] || [];

            transactions.forEach(tx => {
                const amount = parseFloat(tx.amount.replace('$', '')) || 0;
                const share = amount / members.length;

                // Net balance calculation
                if (tx.payer === activeUser) {
                    netBalance += share * (members.length - 1);
                } else if (members.includes(activeUser)) {
                    netBalance -= share;
                }

                // Pie data balance map
                if (tx.payer === activeUser) {
                    members.forEach(m => {
                        if (m !== activeUser) {
                            pieDataMap[m] = (pieDataMap[m] || 0) + share;
                        }
                    });
                } else if (members.includes(activeUser)) {
                    pieDataMap[tx.payer] = (pieDataMap[tx.payer] || 0) - share;
                }

                // Activity feed
                activityFeed.push({
                    groupName: group.name,
                    payer: tx.payer,
                    amount: tx.amount,
                    date: tx.date
                });
            });
        });

        setBalance(netBalance);
        setActivity(activityFeed.sort((a, b) => new Date(b.date) - new Date(a.date)));

        const formattedPieData = Object.entries(pieDataMap).map(([name, value]) => ({
            name,
            value: Math.abs(value),
            direction: value > 0 ? 'theyOweYou' : 'youOweThem'
        }));
        setPieData(formattedPieData);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8884d8', '#6366f1'];

    return (
        <div className="app-container">
            <div className="mb-4">
                <h1 className="mb-3">Welcome back, {user}!</h1>
                <p className="text-gray">Here's your expense summary and recent activity</p>
            </div>

            <Row>
                <Col lg={4}>
                    <Card title="Your Balance" className="balance-card">
                        <div className={`balance-amount ${balance === 0
                            ? 'text-settled'
                            : balance > 0
                                ? 'text-owed-to-you'
                                : 'text-you-owe'}`}>
                            {balance === 0
                                ? '$0.00'
                                : balance > 0
                                    ? `+$${balance.toFixed(2)}`
                                    : `-$${Math.abs(balance).toFixed(2)}`}
                        </div>
                        <p>
                            {balance === 0
                                ? 'You are all settled up!'
                                : balance > 0
                                    ? 'You are owed money'
                                    : 'You owe money'}
                        </p>
                    </Card>

                    <Card title="Recent Activity">
                        {activity.length === 0 ? (
                            <p className="text-center py-4 text-gray">No transactions yet.</p>
                        ) : (
                            <ul className="list-unstyled">
                                {activity.slice(0, 5).map((tx, idx) => (
                                    <li key={idx} className="activity-item">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <strong>{tx.payer === user ? 'You' : tx.payer}</strong> paid <span className="text-primary">{tx.amount}</span>
                                                <div>in <span className="text-secondary">{tx.groupName}</span></div>
                                            </div>
                                            <span className="activity-date">{formatDate(tx.date)}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="text-center mt-3">
                            <Link to="/groups" className="btn btn-outline-primary btn-sm">
                                View All Groups
                            </Link>
                        </div>
                    </Card>
                </Col>

                <Col lg={8}>
                    <Card title="Balance Overview">
                        {pieData.length === 0 ? (
                            <div className="text-center py-5 text-gray">
                                <p>No balances to show yet.</p>
                                <p className="mt-3">
                                    <Link to="/create-group" className="btn btn-success">
                                        Create Your First Group
                                    </Link>
                                </p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={150}
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                stroke="#fff"
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name, props) => [
                                            `$${value.toFixed(2)}`,
                                            props.payload.direction === 'youOweThem'
                                                ? `You owe ${name}`
                                                : `${name} owes you`
                                        ]}
                                    />
                                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </Card>

                    <div className="d-flex gap-2 mt-4 justify-content-center">
                        <Link to="/groups">
                            <Button variant="primary">View All Groups</Button>
                        </Link>
                        <Link to="/create-group">
                            <Button variant="success">Create New Group</Button>
                        </Link>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;