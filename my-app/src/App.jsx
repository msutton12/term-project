import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import AddTransaction from './pages/AddTransaction.jsx';
import GroupDetail from './pages/groupDetails.jsx';
import CreateGroup from './pages/CreateGroup.jsx';
import UserSelect from './pages/UserSelect.jsx';

// Components
import Navbar from './components/Navigation.jsx';
import RequireUser from './components/RequireUser.jsx';

function App() {
    useEffect(() => {
        const groups = JSON.parse(localStorage.getItem('groups')) || {};
        const transactions = JSON.parse(localStorage.getItem('groupTransactions')) || {};

        // If no groups exist, insert a default one
        if (Object.keys(groups).length === 0) {
            const groupId = "dev-001";

            const defaultGroup = {
                id: groupId,
                name: "Developers",
                members: ["Tom", "Mauricio"]
            };

            const defaultTxs = [
                {
                    payer: "Tom",
                    amount: "$50",
                    date: "2025-05-01",
                    status: "Paid",
                    details: "Initial setup tools"
                },
                {
                    payer: "Mauricio",
                    amount: "$8",
                    date: "2025-05-02",
                    status: "Paid",
                    details: "Coffee Run"
                }
            ];

            groups[groupId] = defaultGroup;
            transactions[groupId] = defaultTxs;

            localStorage.setItem("groups", JSON.stringify(groups));
            localStorage.setItem("groupTransactions", JSON.stringify(transactions));
        }
    }, []);

    return (
        <Router>
            <div className="min-h-screen bg-gray-100 p-4">
                <Navbar />
                <Routes>
                    <Route path="/whoami" element={<UserSelect />} />
                    <Route
                        path="/*"
                        element={
                            <RequireUser>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/groups" element={<Groups />} />
                                    <Route path="/create-group" element={<CreateGroup />} />
                                    <Route path="/group/:groupId" element={<GroupDetail />} />
                                    <Route path="/add-transaction" element={<AddTransaction />} />
                                </Routes>
                            </RequireUser>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
