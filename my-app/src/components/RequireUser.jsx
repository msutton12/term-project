import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireUser = ({ children }) => {
    const user = localStorage.getItem('activeUser');
    if (!user) return <Navigate to="/whoami" replace />;
    return children;
};

export default RequireUser;
