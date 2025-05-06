import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import Card from '../components/Card';

const Groups = () => {
    const [groups, setGroups] = useState({});
    const [activeUser, setActiveUser] = useState('');

    useEffect(() => {
        const user = localStorage.getItem('activeUser');
        setActiveUser(user);

        const stored = JSON.parse(localStorage.getItem('groups')) || {};
        setGroups(stored);
    }, []);

    // Convert groups object to array and sort by recent activity
    const groupsArray = Object.values(groups).sort((a, b) => {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    // Filter groups that the active user is a member of
    const userGroups = groupsArray.filter(group =>
        group.members && group.members.includes(activeUser)
    );

    return (
        <div className="app-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Your Groups</h1>
                <Link to="/create-group">
                    <Button variant="success">+ New Group</Button>
                </Link>
            </div>

            {userGroups.length === 0 ? (
                <Card>
                    <div className="text-center py-5">
                        <h3 className="mb-3">You don't have any groups yet</h3>
                        <p className="text-gray mb-4">Create a group to start tracking expenses with friends</p>
                        <Link to="/create-group">
                            <Button variant="success" size="lg">Create Your First Group</Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <Row>
                    {userGroups.map(group => (
                        <Col key={group.id} md={6} lg={4} className="mb-4">
                            <Link to={`/groups/${group.id}`} className="text-decoration-none">
                                <Card className="h-100">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h2 className="h4 mb-0">{group.name}</h2>
                                        <Badge bg="light" text="dark" pill>
                                            {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                                        </Badge>
                                    </div>

                                    <div className="text-gray mb-3">
                                        {group.members.slice(0, 3).join(', ')}
                                        {group.members.length > 3 && ` +${group.members.length - 3} more`}
                                    </div>

                                    <div className="d-flex mt-auto">
                                        <Button variant="outline-primary" className="w-100">
                                            View Details
                                        </Button>
                                    </div>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

// Create a Badge component since it's not imported
const Badge = ({ children, bg, text, pill, className = '' }) => {
    const pillClass = pill ? 'rounded-pill' : 'rounded';
    const bgClass = `bg-${bg}`;
    const textClass = text ? `text-${text}` : '';

    return (
        <span className={`badge ${bgClass} ${textClass} ${pillClass} ${className}`}>
            {children}
        </span>
    );
};

export default Groups;