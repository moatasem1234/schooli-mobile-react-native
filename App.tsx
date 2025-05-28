/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux'; // Add this to access Redux state
import {RootState} from './src/store/store'; // Import RootState

import {Colors} from 'react-native/Libraries/NewAppScreen';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import TimetableScreen from './src/screens/TimetableScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';

import {I18nManager, StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Provider} from 'react-redux';
import {store} from './src/store/store';
import AuthProvider from './src/providers/AuthProvider';
import MyApp from './src/App';



function App(): React.JSX.Element {
  return (
    <>
      <Provider store={store}>
        <MyApp />
      </Provider>
    </>
  );
}

export default App;