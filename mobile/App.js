import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, Animated, Pressable, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { theme } from './src/theme';
import { navigationRef } from './src/utils/navigationRef';

SplashScreen.preventAutoHideAsync();

import SplashScreenView from './src/screens/ritual/SplashScreen';
import OnboardingScreen from './src/screens/ritual/OnboardingScreen';
import TonightScreen from './src/screens/ritual/TonightScreen';
import RoomsScreen from './src/screens/ritual/RoomsScreen';
import SilentRoomScreen from './src/screens/ritual/SilentRoomScreen';
import TasteScreen from './src/screens/ritual/TasteScreen';
import MatchScreen from './src/screens/ritual/MatchScreen';

const RootStack = createNativeStackNavigator();
const OnboardStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIconMap = {
  Tonight: { focused: 'moon', unfocused: 'moon-outline' },
  Rooms: { focused: 'grid', unfocused: 'grid-outline' },
  Silent: { focused: 'remove', unfocused: 'remove-outline' },
  Taste: { focused: 'star', unfocused: 'star-outline' },
  Match: { focused: 'heart-circle', unfocused: 'heart-circle-outline' },
};

function TabIcon({ routeName, focused }) {
  const scale = useRef(new Animated.Value(1)).current;
  const icon = tabIconMap[routeName] || { focused: 'ellipse', unfocused: 'ellipse-outline' };

  useEffect(() => {
    Animated.spring(scale, { toValue: focused ? 1 : 0.92, useNativeDriver: true, ...theme.animation.spring }).start();
  }, [focused]);

  return (
    <View style={tabStyles.iconWrap}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons name={focused ? icon.focused : icon.unfocused} size={20} color={focused ? theme.lavender : theme.textFaint} />
      </Animated.View>
      <Text style={[tabStyles.tabLabel, focused && tabStyles.tabLabelActive]}>{routeName}</Text>
    </View>
  );
}

function TabNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon routeName={route.name} focused={focused} />,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(8,7,20,0.98)',
          borderTopColor: 'rgba(255,255,255,0.03)',
          borderTopWidth: 0.5,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
          elevation: 0,
        },
        tabBarButton: (props) => <Pressable {...props} android_ripple={{ color: 'transparent' }} />,
      })}
    >
      <Tab.Screen name="Tonight" component={TonightScreen} />
      <Tab.Screen name="Rooms" component={RoomsScreen} />
      <Tab.Screen name="Silent" component={SilentRoomScreen} />
      <Tab.Screen name="Taste" component={TasteScreen} />
      <Tab.Screen name="Match" component={MatchScreen} />
    </Tab.Navigator>
  );
}

function OnboardingFlow() {
  return (
    <OnboardStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <OnboardStack.Screen name="Splash" component={SplashScreenView} />
      <OnboardStack.Screen name="Onboarding" component={OnboardingScreen} />
    </OnboardStack.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync().then(() => setAppReady(true));
  }, []);

  if (!appReady || loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={theme.lavender} size="large" />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="MainTabs" component={TabNav} />
      ) : (
        <RootStack.Screen name="OnboardingFlow" component={OnboardingFlow} />
      )}
    </RootStack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const tabStyles = StyleSheet.create({
  iconWrap: { alignItems: 'center', gap: 2 },
  tabLabel: { fontSize: 9, color: theme.textFaint, letterSpacing: 0.5 },
  tabLabelActive: { color: theme.lavender, fontWeight: '600' },
});
