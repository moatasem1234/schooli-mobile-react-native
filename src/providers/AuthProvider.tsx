import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // Optionally, you can dispatch actions to update auth state if needed
  // For example, check token validity or refresh it
  useEffect(() => {
    // If you need to perform some async check (e.g., validate token), do it here
    // For now, we're just logging the token state
    console.log('AuthProvider: token=', token);
  }, [token]);

  return <>{children}</>;
};

export default AuthProvider;