import React from 'react';

import ListGroup from "../components/ListGroup.jsx";

// this would change to the groups in the database
const groups = [
    "Tom & Mauricio",
    "Roommates",
    "Beach Trip"
]

const Groups = () => {
    return (
        <div>
        <h2>My Groups</h2>
        <ListGroup groups={groups}/>{/* this would have to change to the groups database */}
        </div>
    );
};

export default Groups;