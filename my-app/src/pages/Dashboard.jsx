import React from 'react';
import Card from '../components/Card';

const Dashboard = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            <Card title="Upcoming Payments">
                <p>Pay Alice $30 by Apr 12</p>
                <p>Installment: $25 — Due Apr 13</p>
            </Card>

            <Card title="Recent Activity">
                <p>You paid Bob $20 [✓]</p>
                <p>Split $60 dinner with Group: Foodies</p>
            </Card>
        </div>
    );
};

export default Dashboard;
