import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Pages
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import AddTransaction from './pages/AddTransaction';
import GroupDetail from './pages/groupDetails';
import CreateGroup from './pages/CreateGroup';
import RequireUser, { UserSelect } from './components/RequireUser';

// Components
import Navbar from './components/Navigation';

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
                members: ["Tom", "Mauricio"],
                createdAt: new Date().toISOString()
            };

            const defaultTxs = [
                {
                    payer: "Tom",
                    amount: "$50",
                    date: "2025-05-01",
                    description: "Initial setup tools"
                },
                {
                    payer: "Mauricio",
                    amount: "$8",
                    date: "2025-05-02",
                    description: "Coffee Run"
                }
            ];

            groups[groupId] = defaultGroup;
            transactions[groupId] = defaultTxs;

            localStorage.setItem("groups", JSON.stringify(groups));
            localStorage.setItem("groupTransactions", JSON.stringify(transactions));
        }
    }, []);

    // Check if user is logged in
    const isUserLoggedIn = () => {
        return localStorage.getItem('activeUser') !== null;
    };

    return (
        <Router>
            <div className="min-h-screen bg-light">
                <Navbar />
                <Routes>
                    <Route path="/login" element={<UserSelect />} />
                    <Route path="/" element={
                        <RequireUser>
                            <Dashboard />
                        </RequireUser>
                    } />
                    <Route path="/groups" element={
                        <RequireUser>
                            <Groups />
                        </RequireUser>
                    } />
                    <Route path="/create-group" element={
                        <RequireUser>
                            <CreateGroup />
                        </RequireUser>
                    } />
                    <Route path="/groups/:groupId" element={
                        <RequireUser>
                            <GroupDetail />
                        </RequireUser>
                    } />
                    <Route path="/add-transaction" element={
                        <RequireUser>
                            <AddTransaction />
                        </RequireUser>
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;