import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import HistoryPage from './HistoryPage';
import StatusPage from './StatusPage';

const Stack = createNativeStackNavigator();

function InnerPage(props) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Munkaidő Nyilvántartó">
          {navigatorProps => (
            <StatusPage
              {...navigatorProps}
              setUserData={props.setUserData}
              userData={props.userData}
              toggleUserState={props.toggleUserState}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Napló">
          {navigatorProps => (
            <HistoryPage
              {...navigatorProps}
              userData={props.userData}
              toggleUserState={props.toggleUserState}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default InnerPage;
