import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';

// Dummy data for groups, transactions, and members
const groupDetails = {
    1: {
        name: "Tom & Mauricio",
        members: ["Tom", "Mauricio"],
        transactions: [
            { id: 1, payer: "Tom", amount: "$30", date: "Apr 12, 2025", status: "Paid" },
            { id: 2, payer: "Mauricio", amount: "$20", date: "Apr 11, 2025", status: "Paid" }
        ],
        expenses: {
            Tom: "$45",
            Mauricio: "$25"
        }
    },
    2: {
        name: "Roommates",
        members: ["Alice", "Bob", "Charlie"],
        transactions: [
            { id: 1, payer: "Alice", amount: "$50", date: "Apr 10, 2025", status: "Paid" },
            { id: 2, payer: "Bob", amount: "$30", date: "Apr 9, 2025", status: "Pending" }
        ],
        expenses: {
            Alice: "$80",
            Bob: "$60",
            Charlie: "$40"
        }
    },
    3: {
        name: "Beach Trip",
        members: ["Eve", "Lily", "Grace"],
        transactions: [
            { id: 1, payer: "Eve", amount: "$60", date: "Apr 8, 2025", status: "Paid" },
            { id: 2, payer: "Lily", amount: "$40", date: "Apr 7, 2025", status: "Paid" }
        ],
        expenses: {
            Eve: "$100",
            Lily: "$80",
            Grace: "$60"
        }
    }
};

const GroupDetails = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);

    useEffect(() => {
        // Simulating an API call to fetch group details based on groupId
        const selectedGroup = groupDetails[groupId];
        setGroup(selectedGroup);
    }, [groupId]);

    if (!group) return <div>Loading...</div>;

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
                    {group.transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-t">
                            <td className="px-4 py-2">{transaction.payer}</td>
                            <td className="px-4 py-2">{transaction.amount}</td>
                            <td className="px-4 py-2">{transaction.date}</td>
                            <td className="px-4 py-2">{transaction.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Card>

            <Card title="Member Expenses">
                <ul>
                    {Object.keys(group.expenses).map((member, index) => (
                        <li key={index} className="mb-2">
                            {member}: {group.expenses[member]}
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default GroupDetails;
