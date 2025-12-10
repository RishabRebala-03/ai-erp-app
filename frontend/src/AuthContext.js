import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [userId, setUserId] = useState(null); 
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);

  return (
    <AuthContext.Provider value={{
      sessionId,
      setSessionId,
      userId,        // <-- ADD THIS
      setUserId,  
      userRole,
      setUserRole,
      userEmail,
      setUserEmail,
      userName,
      setUserName
    }}>
      {children}
    </AuthContext.Provider>
  );
}