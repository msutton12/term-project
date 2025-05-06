import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/Card';
import { Button } from 'react-bootstrap';

const GroupDetailPage = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const groups = JSON.parse(localStorage.getItem('groups')) || {};
        const txs = JSON.parse(localStorage.getItem('groupTransactions')) || {};

        console.log("LOADED GROUP:", groups[groupId]);

        if (groups[groupId]) {
            setGroup(groups[groupId]);
            setTransactions(txs[groupId] || []);
        }
    }, [groupId]);

    const handleDelete = (indexToRemove) => {
        const updated = [...transactions];
        updated.splice(indexToRemove, 1);
        setTransactions(updated);

        const allGroups = JSON.parse(localStorage.getItem('groupTransactions')) || {};
        allGroups[groupId] = updated;
        localStorage.setItem('groupTransactions', JSON.stringify(allGroups));
    };

    if (!group) return <div className="p-4">Group not found.</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{group.name} - Group Details</h1>

            <Card title="Balances">
                <ul>
                    {(() => {
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

                            console.log(`TX: ${tx.payer} paid $${amount}`);
                            console.log("Members:", members);
                            console.log("Share per member:", share);

                            members.forEach(member => {
                                if (member === tx.payer) return;
                                debtMap[member] -= share;
                                debtMap[tx.payer] += share;
                            });
                        });

                        // Simplify debts
                        const owes = [];
                        const balances = Object.entries(debtMap);
                        balances.sort((a, b) => a[1] - b[1]); // ascending by net balance

                        let i = 0, j = balances.length - 1;
                        while (i < j) {
                            const [debtor, debtAmt] = balances[i];
                            const [creditor, creditAmt] = balances[j];

                            const amount = Math.min(-debtAmt, creditAmt);
                            if (amount > epsilon) {
                                owes.push(`${debtor} owes ${creditor} $${amount.toFixed(2)}`);
                                balances[i][1] += amount;
                                balances[j][1] -= amount;
                            }

                            if (Math.abs(balances[i][1]) < epsilon) i++;
                            if (Math.abs(balances[j][1]) < epsilon) j--;
                        }

                        if (owes.length === 0) return <li>Everyone is settled up ✅</li>;
                        return owes.map((line, i) => <li key={i}>{line}</li>);
                    })()}
                </ul>
            </Card>

            <Card title="Recent Transactions">
                <table className="w-full table-auto border-collapse">
                    <thead>
                    <tr>
                        <th className="border px-4 py-2">Payer</th>
                        <th className="border px-4 py-2">Amount</th>
                        <th className="border px-4 py-2">Date</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((t, idx) => (
                        <tr key={idx}>
                            <td className="border px-4 py-2">{t.payer}</td>
                            <td className="border px-4 py-2">{t.amount}</td>
                            <td className="border px-4 py-2">{t.date}</td>
                            <td className="border px-4 py-2">{t.status}</td>
                            <td className="border px-4 py-2 text-center">
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
            </Card>

            <Link to={`/add-transaction?groupId=${groupId}`} className="text-decoration-none">
                <Button className="bg-blue-600 text-white p-2 rounded-md mt-4 hover:bg-blue-700">
                    Add New Transaction
                </Button>
            </Link>
        </div>
    );
};

export default GroupDetailPage;
