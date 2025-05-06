import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

const UserSelect = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const groups = JSON.parse(localStorage.getItem('groups')) || {};
        const memberSet = new Set();

        Object.values(groups).forEach(group => {
            group.members.forEach(member => memberSet.add(member));
        });

        setUsers(Array.from(memberSet));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        localStorage.setItem('activeUser', selectedUser);
        navigate('/'); // go to dashboard
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Who are you?</h1>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Select your name</Form.Label>
                    <Form.Select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        required
                    >
                        <option value="">-- Choose a user --</option>
                        {users.map((user, idx) => (
                            <option key={idx} value={user}>
                                {user}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Button type="submit" disabled={!selectedUser}>
                    Continue
                </Button>
            </Form>
        </div>
    );
};

export default UserSelect;
