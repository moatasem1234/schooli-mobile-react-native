import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
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
import {hasPermission, hasRole, selectUser} from './store/authSlice';
import StudentScreen from './screens/StudentScreen';
import ProfileScreen from './screens/ProfileSrceen';
import ParentScreen from './screens/ParentScreen';
import ConversationsScreen from './screens/chat/ConversationsScreen';
import StartConversationScreen from './screens/chat/StartConversationScreen';
import ChatScreen from './screens/chat/ChatScreen';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

function MyApp(): React.JSX.Element {
  // Combine all selectors into a single useSelector call
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector(selectUser);

  // For role checks
  const isParent = useSelector((state: RootState) => hasRole(state, 'parent'));
  const isAdmin = useSelector((state: RootState) => hasRole(state, 'admin'));
  const isTeacher = useSelector((state: RootState) =>
    hasRole(state, 'teacher'),
  );

  // For permission checks
  const canViewStudents = useSelector((state: RootState) =>
    hasPermission(state, 'view-students'),
  );
  const canViewParentStudents = useSelector((state: RootState) =>
    hasPermission(state, 'view-parent_students'),
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  // Sync isAuthenticated with token
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAuthenticated(!!token);
    }, 100); // 1000 milliseconds = 1 second

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [token]);

  // Memoize MainTabNavigator to prevent re-creation on every render
  const MainTabNavigator = useMemo(() => {
    return () => (
      <Tab.Navigator
        initialRouteName="profile"
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
            } else if (route.name === 'parents') {
              iconName = 'people';
            } else if (route.name === 'profile') {
              iconName = 'person';
            } else if (route.name === 'Chat') {
              iconName = 'chat';
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

        {canViewStudents && isTeacher && (
          <Tab.Screen
            name="students"
            component={StudentScreen}
            options={{title: 'الطلاب'}}
          />
        )}
        {canViewParentStudents && isTeacher && (
          <Tab.Screen
            name="parents"
            component={ParentScreen}
            options={{title: 'الآباء'}}
          />
        )}
        {isParent && (
          <>
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
              name="Home"
              component={HomeScreen}
              options={{title: 'الرئيسية'}}
            />
            <Tab.Screen
              name="Calendar"
              component={CalendarScreen}
              options={{title: 'التقويم'}}
            />
          </>
        )}
        {(isParent || isTeacher) && (
          <Tab.Screen
            name="Chat"
            component={ChatStackNavigator}
            options={{title: 'المحادثات'}}
          />
        )}
      </Tab.Navigator>
    );
  }, [canViewStudents, canViewParentStudents, isParent, isTeacher]); // Re-create if permissions or roles change

  // Define Chat Stack Navigator
  const ChatStackNavigator = () => (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="ConversationsScreen"
        component={ConversationsScreen}
      />
      <Stack.Screen
        name="StartConversationScreen"
        component={StartConversationScreen}
      />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );

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
