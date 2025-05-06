import React from 'react';

const Card = ({ title, children, className = '' }) => {
    return (
        <div className={`app-card ${className}`}>
            {title && <h2 className="app-card-title">{title}</h2>}
            <div className="app-card-body">
                {children}
            </div>
        </div>
    );
};

export default Card;