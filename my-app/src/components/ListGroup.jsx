import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';

const ListGroup = ({ groups }) => {
    if (!groups || groups.length === 0) {
        return (
            <Card>
                <div className="text-center py-4">
                    <p className="text-gray">No groups found</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="list-group">
            {groups.map(group => (
                <Link
                    key={group.id}
                    to={`/groups/${group.id}`}
                    className="list-group-item list-group-item-action"
                >
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{group.name}</h5>
                        <small>{group.members.length} members</small>
                    </div>
                    <p className="mb-1 text-gray">
                        {group.members.slice(0, 3).join(', ')}
                        {group.members.length > 3 && ` +${group.members.length - 3} more`}
                    </p>
                </Link>
            ))}
        </div>
    );
};

export default ListGroup;