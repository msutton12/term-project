import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { Link } from 'react-router-dom';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
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

    const COLORS = ['#00C49F', '#FF8042', '#FFBB28', '#8884d8', '#82ca9d'];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Hello, {user}</h1>

            <Card title="Your Balance">
                <p className={balance < 0 ? 'text-red-600' : 'text-green-600'}>
                    {balance === 0
                        ? 'You are settled up ✅'
                        : balance > 0
                            ? `You are owed $${balance.toFixed(2)}`
                            : `You owe $${Math.abs(balance).toFixed(2)}`}
                </p>
            </Card>

            <Card title="Recent Activity">
                {activity.length === 0 ? (
                    <p>No transactions yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {activity.slice(0, 5).map((tx, idx) => (
                            <li key={idx}>
                                {tx.payer === user ? 'You' : tx.payer} paid {tx.amount} in <strong>{tx.groupName}</strong>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            <Card title="Balance Overview (Who Owes Who)">
                {pieData.length === 0 ? (
                    <p>No balances to show yet.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={({ name, direction, value }) =>
                                    direction === 'youOweThem'
                                        ? `You owe ${name}: $${value.toFixed(2)}`
                                        : `${name} owes you: $${value.toFixed(2)}`
                                }
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </Card>

            <Link to="/groups" className="btn btn-primary mt-4">
                View All Groups
            </Link>
        </div>
    );
};

export default Dashboard;
