import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Conversations from './Screens/Conversations';
import Conversation from './Screens/Conversation';
import Settings from './Screens/Settings';
import Login from './Screens/Login';
import AuthLoading from './Screens/AuthLoading';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

const ConversationsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Conversations" component={Conversations} options={{ title: 'All conversations' }} />
    <Stack.Screen name="Conversation" component={Conversation} options={{ title: 'Conversation' }} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Conversations"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color }) => {
        let iconName;
        if (route.name === 'Conversations') {
          iconName = `${Platform.OS === 'ios' ? 'ios' : 'md'}-chatbubbles`;
        } else if (route.name === 'Settings') {
          iconName = `${Platform.OS === 'ios' ? 'ios' : 'md'}-star`;
        }
        return <Ionicons name={iconName} size={20} color={color} />;
      },
      tabBarActiveTintColor: 'green',
      tabBarInactiveTintColor: '#556',
    })}
  >
    <Tab.Screen name="Conversations" component={ConversationsStack} options={{ headerShown: false }} />
    <Tab.Screen name="Settings" component={Settings} />
  </Tab.Navigator>
);

const AppContainer = () => (
  <NavigationContainer>
    <RootStack.Navigator initialRouteName="AuthLoading" screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="AuthLoading" component={AuthLoading} />
      <RootStack.Screen name="Login" component={Login} />
      <RootStack.Screen name="Main" component={TabNavigator} />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default AppContainer;