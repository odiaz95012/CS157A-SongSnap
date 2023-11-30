import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoutes: React.FC = () => {
    // Check if the user is authenticated to navigate to protected routes
    const isAuthenticated = !!Cookies.get('userID');
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;