import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/Card';
import { Button } from "react-bootstrap";

// Hardcoded base group details (initial)
const groupDetails = {
    1: {
        name: "Tom & Mauricio",
        members: ["Tom", "Mauricio"],
        transactions: [
            { payer: "Tom", amount: "$30", date: "Apr 12, 2025", status: "Paid" },
            { payer: "Mauricio", amount: "$20", date: "Apr 11, 2025", status: "Paid" }
        ],
    },
    2: {
        name: "Roommates",
        members: ["Alice", "Bob", "Charlie"],
        transactions: [
            { payer: "Alice", amount: "$50", date: "Apr 10, 2025", status: "Paid" },
            { payer: "Bob", amount: "$30", date: "Apr 9, 2025", status: "Pending" }
        ],
    },
    3: {
        name: "Beach Trip",
        members: ["Eve", "Lily", "Grace"],
        transactions: [
            { payer: "Eve", amount: "$60", date: "Apr 8, 2025", status: "Paid" },
            { payer: "Lily", amount: "$40", date: "Apr 7, 2025", status: "Paid" }
        ],
    },
};

const GroupDetailPage = () => {
    const { groupId } = useParams();

    // ✅ Defensive check for invalid group ID
    if (!groupDetails[groupId]) {
        return <div>Group not found.</div>;
    }

    const baseGroup = groupDetails[groupId];

    // ✅ Merge localStorage transactions with hardcoded ones
    const [group] = useState(() => {
        const stored = JSON.parse(localStorage.getItem('groupTransactions')) || {};
        const storedTxs = stored[groupId] || [];

        return {
            ...baseGroup,
            transactions: [...storedTxs, ...baseGroup.transactions]
        };
    });

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{group.name} - Group Details</h1>

            <Card title="Members">
                <ul>
                    {group.members.map((member, index) => (
                        <li key={index} className="mb-2">{member}</li>
                    ))}
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
                    </tr>
                    </thead>
                    <tbody>
                    {group.transactions.map((transaction, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{transaction.payer}</td>
                            <td className="border px-4 py-2">{transaction.amount}</td>
                            <td className="border px-4 py-2">{transaction.date}</td>
                            <td className="border px-4 py-2">{transaction.status}</td>
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
