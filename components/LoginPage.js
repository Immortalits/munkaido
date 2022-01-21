import React, { useState } from 'react';
import {
  View,
  Text,
  Keyboard,
  StyleSheet,
  TextInput,
  Platform,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { signIn, signUp, resetPassword } from '../auth';
import { createUserOnFirebase, getUserDataByEmail } from '../database';
import { storeUserData } from '../localStorage';

const LoginPage = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [userName, setUserName] = useState('');
  const [isSignUpActive, setIsSignUpActive] = useState(false);

  const login = async () => {
    // log in to firebase
    console.log('login process started...');
    const user = await signIn(email, password);
    // get user data from firebase
    console.log('logged in: ', user.email);
    const userDataFromFirebase = await getUserDataByEmail(user.email);
    // store the user in localStorage:
    storeUserData(userDataFromFirebase);
    props.setUserData(userDataFromFirebase);
  };

  const register = async () => {
    if (password === passwordConfirm) {
      await signUp(email, password);
      const initialUserData = {
        name: userName,
        email: email.toLocaleLowerCase(),
        currentState: 'out',
      };
      createUserOnFirebase(initialUserData);
      storeUserData(initialUserData);
      props.setUserData(initialUserData);
      console.log(`${userName} is stored during register process`);
    } else {
      window.alert('A jelszavak nem egyeznek!');
    }
  };

  const validate = text => {
    console.log(text);
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      console.log('Email is Not Correct');
      return false;
    } else {
      console.log('Email is Correct');
      return true;
    }
  };

  const resPass = async () => {
    if (!email) {
      window.alert('Add meg az e-mail címed!');
    } else {
      if (validate(email)) {
        resetPassword(email);
      } else {
        window.alert('Az e-mail cím nem megfelelő!');
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButtonLeft, !isSignUpActive && styles.active]}
            onPress={() => {
              setIsSignUpActive(false);
            }}>
            <Text style={[styles.toggleButtonText, !isSignUpActive && styles.activeText]}>
              Bejelentkezés
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButtonRight, isSignUpActive && styles.active]}
            onPress={() => {
              setIsSignUpActive(true);
            }}>
            <Text style={[styles.toggleButtonText, isSignUpActive && styles.activeText]}>
              Regisztráció
            </Text>
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          style={{ alignSelf: 'stretch' }}>
          <View style={styles.formContainer} showsHorizontalScrollIndicator={false}>
            {isSignUpActive ? (
              <Text style={styles.title}>Regisztráció</Text>
            ) : (
              <Text style={styles.title}>Bejelentkezés</Text>
            )}
            <TextInput style={styles.input} placeholder="e-mail cím" onChangeText={setEmail} />
            {isSignUpActive && (
              <TextInput style={styles.input} placeholder="Név" onChangeText={setUserName} />
            )}
            <TextInput
              style={styles.input}
              placeholder="jelszó"
              secureTextEntry={true}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={resPass}>
              <Text style={styles.forget_pass}>Elfelejtett jelszó</Text>
            </TouchableOpacity>
            {isSignUpActive && (
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder="jelszó mégegyszer"
                onChangeText={setPasswordConfirm}
              />
            )}
            {isSignUpActive ? (
              <Button title="Regisztráció" onPress={register} />
            ) : (
              <Button title="Bejelentkezés" onPress={login} />
            )}
          </View>
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    alignItems: 'center',
    // https://stackoverflow.com/a/59183680/9004180
    // fixing the scrolling of the FlatList
    // flex: 1 just means "take up the entire space" (whatever "entire" that may be).
    flex: 1,
    alignSelf: 'stretch',
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    marginVertical: 30,
  },
  input: {
    height: 40,
    // width: 190,
    margin: 12,
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 20,
    color: '#000000',
  },
  formContainer: {
    paddingHorizontal: 40,
    alignSelf: 'stretch',
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'ios' ? 20 : 20,
  },
  toggleButtonLeft: {
    marginTop: 20,
    paddingHorizontal: 50,
    paddingVertical: 14,
    borderWidth: 1,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
  },
  toggleButtonRight: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderWidth: 1,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
  },
  toggleButtonText: {
    fontSize: 17,
    color: 'black',
  },
  active: {
    backgroundColor: '#0851c7',
  },
  activeText: {
    color: '#ffffff',
  },
  forget_pass: {
    marginLeft: 'auto',
    fontSize: 10,
    fontStyle: 'italic',
    paddingBottom: 20,
    paddingRight: 10,
  },
});
export default LoginPage;
