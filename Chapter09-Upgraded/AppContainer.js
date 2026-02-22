import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import Game from './Screens/Game';
import LeaderBoard from './Screens/LeaderBoard';
import Start from './Screens/Start';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Start"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Start') {
            iconName = `${Platform.OS === 'ios' ? 'ios' : 'md'}-home`;
          } else if (route.name === 'LeaderBoard') {
            iconName = `${Platform.OS === 'ios' ? 'ios' : 'md'}-star`;
          }
          return <Ionicons name={iconName} size={20} color={color} />;
        },
        tabBarActiveTintColor: 'purple',
        tabBarInactiveTintColor: '#556',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Start" component={Start} />
      <Tab.Screen name="LeaderBoard" component={LeaderBoard} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Start"
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}
    >
      <Stack.Screen name="Start" component={Tabs} />
      <Stack.Screen name="Game" component={Game} />
    </Stack.Navigator>
  );
}

export default function AppContainer() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}