import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import Login from './pages/Login';
import Transactions from "./pages/Transactions.jsx";

// Components
import Navbar from './components/Navigation.jsx';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 p-4">
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/groups" element={<Groups />} />
                    <route path="/transactions" element={<Transactions />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

