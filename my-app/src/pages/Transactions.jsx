import React from 'react';
import Card from '../components/Card';

const transactions = [
    { id: 1, payer: "Tom", amount: "$30", date: "Apr 12, 2025", status: "Paid" },
    { id: 2, payer: "Maurice", amount: "$20", date: "Apr 10, 2025", status: "Paid" },
];

const Transactions = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Transactions</h1>

            <Card title="Recent Payments">
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
                    {transactions.map((transaction) => (
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
        </div>
    );
};

export default Transactions;
