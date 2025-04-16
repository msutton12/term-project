import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

// Hardcoded groups
const groups = [
    { id: 1, name: "Tom & Mauricio" },
    { id: 2, name: "Roommates" },
    { id: 3, name: "Beach Trip" }
];

const Groups = () => {
    return (
        <div>
            <h2>My Groups</h2>
            {/* Display groups as clickable links */}
            <ul>
                {groups.map(group => (
                    <li key={group.id}>
                        <Link to={`/group/${group.id}`} className="text-blue-600 hover:underline">
                            {group.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Groups;
