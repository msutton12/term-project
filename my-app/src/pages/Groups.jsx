import React from 'react';

import ListGroup from "../components/ListGroup.jsx";

const groups = [
    "Tom & Mauricio",
    "Roommates",
    "Beach Trip"
]

const Groups = () => {
    return (
        <div className="p-4">
        <h2 className="mb-3">My Groups</h2>
        <ListGroup items={groups}/>
        </div>
    );
};