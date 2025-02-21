import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import { auth } from './../firebase/firebase.init';

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state

  const signInWithGoogle = () => {
    setLoading(true); // Start loading when signing in
    return signInWithPopup(auth, googleProvider).finally(() =>
      setLoading(false)
    ); // Stop loading after sign-in attempt
  };

  const signOutUser = () => {
    setLoading(true); // Start loading when signing out
    return signOut(auth)
      .then(() => setUser(null))
      .finally(() => setLoading(false)); // Stop loading after sign-out
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false); // Stop loading when user state is determined
    });

    return () => {
      unSubscribe();
    };
  }, []);
  console.log(user);
  const userInfo = {
    user,
    loading,
    signInWithGoogle,
    signOutUser,
  };

  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
