import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {

    const { user } = useAuth();

    // Check if user is logged in and has the 'Admin' role.
    // The role name must match exactly what is in the JWT token.
    if (!user || user.role !== 'Admin') {
        // If not, redirect to the home page or a 'not authorized' page.
        return <Navigate to="/" replace />;
    }

    // If authorized, render the children passed to the component.
    return children;

};

export default AdminRoute;