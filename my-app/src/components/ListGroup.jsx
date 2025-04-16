import React from 'react';
import {Link} from "react-router-dom";

const ListGroup = ({ groups }) => {
    return (
        <ul className="list-group">
            {groups.map((group, index) => (
                <li
                    key={index}
                    className="list-group-item"
                >
                    {group}
                    <button variant="primary" className="md-4">
                        <Link className="nav-link" to="/group">Open</Link>
                    </button>

                </li>

                ))}
        </ul>
    );
};

export default ListGroup;
