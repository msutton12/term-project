import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Card from '../components/Card'; // Import Card component

// Hardcoded groups
const groups = [
    { id: 1, name: "Tom & Mauricio" },
    { id: 2, name: "Roommates" },
    { id: 3, name: "Beach Trip" }
];

const Groups = () => {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">My Groups</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Display groups as clickable links inside cards */}
                {groups.map(group => (
                    <Card key={group.id}>
                        <Link to={`/group/${group.id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                            {group.name}
                        </Link>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Groups;
