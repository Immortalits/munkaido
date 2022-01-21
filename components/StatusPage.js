import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, Image } from 'react-native';

import { loginStatus, signOutUser } from '../auth';
import { getUserDataByEmail, saveHistoryOnFirebase } from '../database';
import { storeUserData, removeUserData } from '../localStorage';

export default function StatusPage(props) {
  // const [currentStatus, setCurrentStatus] = useState(false);

  const toggleSwitch = () => {
    const newState = props.toggleUserState();
    // a props.userData.currentState itt még nem használható ezért inkább a toggleUserState
    // visszatérési értékét használjuk!
    saveHistoryOnFirebase(props.userData.email, newState);
    // setCurrentStatus(previousState => !previousState);
  };

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
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Kijelentkezés</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.appTitle}>Szia {props.userData.name}!</Text>
      <Text style={styles.statusText}>
        Jelenlegi státuszod: {props.userData.currentState === 'in' ? 'bejött' : 'távozott'}
      </Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={props.userData.currentState === 'in' ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={props.userData.currentState === 'in'}
      />
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Napló')}
        style={[styles.button, styles.shadow]}>
        <Text style={styles.buttonText}>Napló megtekintése</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    // https://stackoverflow.com/a/59183680/9004180
    // fixing the scrolling of the FlatList
    // flex: 1 just means "take up the entire space" (whatever "entire" that may be).
    flex: 1,
  },
  appTitle: {
    textAlign: 'center',
    fontSize: 30,
    marginVertical: 30,
  },
  logoutSection: {
    alignSelf: 'stretch',
  },
  logoutButton: {
    alignSelf: 'stretch',
  },
  logoutButtonText: {
    marginRight: 'auto',
    fontStyle: 'italic',
    color: 'blue',
  },
  statusText: {
    fontSize: 18,
    margin: 15,
  },
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
  buttonText: {
    textAlign: 'center',
    fontSize: 15,
    color: 'white',
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
