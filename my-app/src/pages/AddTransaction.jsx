import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AddTransaction = () => {
    const { search } = useLocation();
    const groupId = new URLSearchParams(search).get('groupId'); // Retrieve the groupId from query params

    const [amount, setAmount] = useState('');
    const [payer, setPayer] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Auto set date to today's date (YYYY-MM-DD)

    const navigate = useNavigate(); // To navigate after form submission

    const handleSubmit = (e) => {
        e.preventDefault();

        // Log the transaction (replace this with your actual logic to save the transaction)
        console.log({
            amount,
            payer,
            date,
            groupId, // Include groupId with the transaction
        });

        // Optionally, reset the form after submission
        setAmount('');
        setPayer('');
        setDate(new Date().toISOString().split('T')[0]);

        // Navigate back to the group details page after adding the transaction
        navigate(`/group/${groupId}`);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Add Transaction</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>

                <div>
                    <label htmlFor="payer" className="block text-sm font-medium text-gray-700">Payer</label>
                    <input
                        type="text"
                        id="payer"
                        value={payer}
                        onChange={(e) => setPayer(e.target.value)}
                        required
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>

                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1 p-2 border rounded-md w-full"
                        disabled // Disable date input, as it's auto-filled with today's date
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 rounded-md mt-4 hover:bg-blue-700"
                >
                    Add Transaction
                </button>
            </form>
        </div>
    );
};

export default AddTransaction;
