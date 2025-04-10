import React from 'react';

const Card = ({ title, children }) => {
    return (
        <div className="bg-white shadow-md rounded-xl p-4 mb-4">
            {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
            <div>{children}</div>
        </div>
    );
};

export default Card;
