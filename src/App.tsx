import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from './store/store';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import HomeScreen from './screens/HomeScreen';
import TimetableScreen from './screens/TimetableScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import CalendarScreen from './screens/CalendarScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import {I18nManager, StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AuthProvider from './providers/AuthProvider';
import {hasPermission, hasRole} from './store/authSlice';
import StudentScreen from './screens/StudentScreen';
import ProfileScreen from './screens/ProfileSrceen';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

function MyApp(): React.JSX.Element {
  // Combine all selectors into a single useSelector call
  const authState = useSelector((state: RootState) => state);
  const token = authState.auth.token;
  const isParent = hasRole(authState, 'parent');
  const isAdmin = hasRole(authState, 'admin');
  const isTeacher = hasRole(authState, 'teacher');
  const canViewStudents = hasPermission(authState, 'view-students');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  // Sync isAuthenticated with token
  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  // Memoize MainTabNavigator to prevent re-creation on every render
  const MainTabNavigator = useMemo(() => {
    return () => (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Calendar') {
              iconName = 'calendar-today';
            } else if (route.name === 'Attendance') {
              iconName = 'how-to-reg';
            } else if (route.name === 'Timetable') {
              iconName = 'schedule';
            } else if (route.name === 'students') {
              iconName = 'people';
            } else if (route.name === 'profile') {
              iconName = 'person';
            }
            //@ts-ignore
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#00C4B4',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: '#1A2526',
            borderTopColor: '#2A3A3B',
            height: 70,
            paddingBottom: 14,
          },
          headerShown: false,
        })}>
        <Tab.Screen
          name="profile"
          component={ProfileScreen}
          options={{title: 'الملف الشخصي'}}
        />
        {canViewStudents && (
          <Tab.Screen
            name="students"
            component={StudentScreen}
            options={{title: 'الطلاب'}}
          />
        )}
        <Tab.Screen
          name="Timetable"
          component={TimetableScreen}
          options={{title: 'الجدول'}}
        />
        <Tab.Screen
          name="Attendance"
          component={AttendanceScreen}
          options={{title: 'الحضور'}}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{title: 'التقويم'}}
        />
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'الرئيسية'}}
        />
      </Tab.Navigator>
    );
  }, [canViewStudents]); // Only re-create if canViewStudents changes

  return (
    <>
      <StatusBar backgroundColor="#1A2526" barStyle="light-content" />
      <NavigationContainer>
        <AuthProvider>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {!isAuthenticated ? (
              <>
                <Stack.Screen name="Login">
                  {props => (
                    <LoginScreen
                      {...props}
                      setIsAuthenticated={setIsAuthenticated}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="Register">
                  {props => (
                    <RegisterScreen
                      {...props}
                      setIsAuthenticated={setIsAuthenticated}
                    />
                  )}
                </Stack.Screen>
              </>
            ) : (
              <Stack.Screen name="Main" component={MainTabNavigator} />
            )}
          </Stack.Navigator>
        </AuthProvider>
      </NavigationContainer>
    </>
  );
}

export default MyApp;
