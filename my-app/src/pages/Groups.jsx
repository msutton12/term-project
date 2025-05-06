import React, { useEffect, useState } from 'react';
import ListGroup from '../components/ListGroup';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Groups = () => {
    const [groups, setGroups] = useState({});

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('groups')) || {};
        setGroups(stored);
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Groups</h1>

            <Link to="/create-group">
                <Button variant="success" className="mb-3">+ New Group</Button>
            </Link>

            <ListGroup groups={Object.values(groups)} />
        </div>
    );
};

export default Groups;
