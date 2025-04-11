import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 p-4">
                {/* Insert <Navbar Here/> */}
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/groups" element={<Groups />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
