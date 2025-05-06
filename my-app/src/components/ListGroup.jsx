import React from 'react';
import { Link } from "react-router-dom";

const ListGroup = ({ groups }) => {
    return (
        <ul className="list-group">
            {groups.map((group) => (
                <li key={group.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {group.name}
                    <Link className="btn btn-primary btn-sm" to={`/group/${group.id}`}>
                        Open
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default ListGroup;
