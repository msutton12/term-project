import React from 'react';

const ListGroup = ({ groups }) => {
    return (
        <ul className="list-group">
            {groups.map((group, index) => (
                <li
                    key={index}
                    className="list-group-item"
                >
                    {group}
                </li>
            ))}
        </ul>
    );
};

export default ListGroup;
