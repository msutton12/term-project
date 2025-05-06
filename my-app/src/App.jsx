import React from 'react';
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
