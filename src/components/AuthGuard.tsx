import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useStore();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login but save the current location to redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AuthGuard;
