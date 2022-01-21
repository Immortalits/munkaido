import React, { useState, useEffect } from 'react';

import InnerPage from './components/InnerPage';
import LoginPage from './components/LoginPage';
import { toggleStateOnFirebase } from './database';
import { getUserData } from './localStorage';

export default function App() {
  const [userData, setUserData] = useState(null);
  const toggleUserState = () => {
    let newState = '';
    if (userData.currentState === 'in') {
      newState = 'out';
    } else {
      newState = 'in';
    }
    setUserData(currentUserData => {
      return { ...currentUserData, currentState: newState };
    });
    toggleStateOnFirebase(userData.email, newState);
    console.log(userData.name, 'is now', newState);
    return newState;
  };

  useEffect(() => {
    (async () => {
      const storedUser = await getUserData();
      if (storedUser) {
        console.log('STORED USER FROM ASYNCSTORAGE:', storedUser);
        setUserData(storedUser);
      }
    })();
  }, []);

  if (userData === null) {
    return <LoginPage setUserData={setUserData} />;
  }
  return (
    <InnerPage setUserData={setUserData} userData={userData} toggleUserState={toggleUserState} />
  );
}
