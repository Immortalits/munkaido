import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, Image } from 'react-native';

import { loginStatus, signOutUser } from '../auth';
import { getUserDataByEmail, saveHistoryOnFirebase } from '../database';
import { storeUserData, removeUserData } from '../localStorage';

export default function SettingsPage(props) {
  const handleLogout = async () => {
    await signOutUser();
    await removeUserData();
    props.setUserData(null);
  };

  useEffect(() => {
    (async () => {
      const firebaseUser = await loginStatus();
      const userData = await getUserDataByEmail(firebaseUser.email);
      await storeUserData(userData);
      console.log(`${userData.name} received when innerpage loaded`);
      props.setUserData(userData);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoutSection}>
        <TouchableOpacity style={[styles.button, styles.shadow]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Kijelentkezés</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 50,
    alignSelf: 'stretch',
    textAlign: 'center',
    paddingVertical: '5%',
    paddingHorizontal: '7%',
    borderRadius: 20,
    color: 'blue',
    backgroundColor: '#0091ff',
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 15,
    color: 'white',
  },
});
