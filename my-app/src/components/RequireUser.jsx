import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

// Create Row and Col components for layout
const Row = ({ children, className = '', justifyContent }) => {
    const justifyClass = justifyContent ? `justify-content-${justifyContent}` : '';
    return <div className={`row ${justifyClass} ${className}`}>{children}</div>;
};

const Col = ({ children, md, lg, className = '' }) => {
    const mdClass = md ? `col-md-${md}` : '';
    const lgClass = lg ? `col-lg-${lg}` : '';
    return <div className={`col ${mdClass} ${lgClass} ${className}`}>{children}</div>;
};

const UserSelect = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [newUser, setNewUser] = useState('');
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

        // Ensure we're storing the active user properly
        localStorage.setItem('activeUser', selectedUser);
        console.log('User selected:', selectedUser);

        // Force a page reload to ensure state is updated
        window.location.href = '/';
    };

    const handleAddNewUser = () => {
        if (!newUser.trim() || users.includes(newUser.trim())) return;

        const updatedUsers = [...users, newUser.trim()];
        setUsers(updatedUsers);
        setSelectedUser(newUser.trim());
        setNewUser('');
    };

    return (
        <div className="app-container">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div className="text-center mb-4">
                        <h1>Welcome to SplitCost</h1>
                        <p className="text-gray">Track and split expenses with friends</p>
                    </div>

                    <div className="app-card">
                        <h2 className="h4 mb-4 text-center">Who are you?</h2>

                        <Form onSubmit={handleSubmit}>
                            {users.length > 0 && (
                                <Form.Group className="mb-4">
                                    <Form.Label>Select your name</Form.Label>
                                    <Form.Select
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(e.target.value)}
                                        size="lg"
                                        className="mb-3"
                                    >
                                        <option value="">-- Choose a user --</option>
                                        {users.map((user, idx) => (
                                            <option key={idx} value={user}>
                                                {user}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            )}

                            <Form.Group className="mb-4">
                                <Form.Label>{users.length > 0 ? 'Or enter a new name' : 'Enter your name'}</Form.Label>
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        type="text"
                                        value={newUser}
                                        onChange={(e) => setNewUser(e.target.value)}
                                        placeholder="Your name"
                                    />
                                    <Button
                                        variant="outline-primary"
                                        onClick={handleAddNewUser}
                                        disabled={!newUser.trim()}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </Form.Group>

                            <div className="d-grid">
                                <Button
                                    size="lg"
                                    type="submit"
                                    variant="primary"
                                    disabled={!selectedUser}
                                >
                                    Continue
                                </Button>
                            </div>
                        </Form>

                        {users.length === 0 && (
                            <div className="mt-4 p-3 bg-light rounded">
                                <p className="mb-0 text-center">
                                    <small>No existing users found. Enter your name to get started!</small>
                                </p>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

const RequireUser = ({ children }) => {
    const navigate = useNavigate();
    const [hasUser, setHasUser] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('activeUser');
        if (!user) {
            navigate('/login');
        } else {
            setHasUser(true);
        }
    }, [navigate]);

    if (!hasUser) {
        return <UserSelect />;
    }

    return children;
};

export { UserSelect }; // Export the UserSelect component to be used directly
export default RequireUser;