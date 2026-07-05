import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { theme } from './src/theme';
import { api } from './src/services/api';

// Auth screens
import LandingScreen from './src/screens/auth/LandingScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';

// Onboarding screens
import SplashScreen from './src/screens/onboarding/SplashScreen';
import PromiseScreen from './src/screens/onboarding/PromiseScreen';
import NameScreen from './src/screens/onboarding/NameScreen';
import IntentionScreen from './src/screens/onboarding/IntentionScreen';
import ArchetypeTeaseScreen from './src/screens/onboarding/ArchetypeTeaseScreen';
import PermissionsScreen from './src/screens/onboarding/PermissionsScreen';
import ReadyScreen from './src/screens/onboarding/ReadyScreen';

// Quiz
import QuizScreen from './src/screens/quiz/QuizScreen';
import ResultScreen from './src/screens/quiz/ResultScreen';

// Main tabs
import JournalScreen from './src/screens/main/JournalScreen';
import PartnerScreen from './src/screens/main/PartnerScreen';
import AboutScreen from './src/screens/main/AboutScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';
import SettingsScreen from './src/screens/main/SettingsScreen';
import RevealScreen from './src/screens/main/RevealScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }) {
  const icons = {
    Journal: '📝',
    Partner: '🌙',
    About: '🪞',
    Profile: '👤',
    Settings: '⚙️',
    Reveal: '🔓',
  };
  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.4 }}>{icons[label] || '○'}</Text>
      <Text style={{ fontSize: 8, color: focused ? theme.roseL : theme.inkS, letterSpacing: 1, textTransform: 'uppercase' }}>
        {label}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(8,5,15,0.92)',
          borderTopColor: 'rgba(248,242,255,0.07)',
          borderTopWidth: 1,
          paddingBottom: 12,
          paddingTop: 12,
          height: 72,
        },
      })}
    >
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Partner" component={PartnerScreen} />
      <Tab.Screen name="Reveal" component={RevealScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function OnboardingFlow({ navigation }) {
  const [screen, setScreen] = useState(0);
  const [name, setName] = useState('');
  const [intention, setIntention] = useState(null);
  const TOTAL = 7;

  const next = () => {
    if (screen < TOTAL - 1) setScreen(s => s + 1);
  };
  const back = () => {
    if (screen > 0) setScreen(s => s - 1);
  };

  const screenProps = { onNext: next, onBack: back, name, setName, intention, setIntention, pick: intention, setPick: setIntention };

  const screens = [
    <SplashScreen {...screenProps} />,
    <PromiseScreen {...screenProps} />,
    <NameScreen {...screenProps} />,
    <IntentionScreen {...screenProps} />,
    <ArchetypeTeaseScreen {...screenProps} />,
    <PermissionsScreen {...screenProps} />,
    <ReadyScreen {...screenProps} onFinish={() => navigation.navigate('Quiz', {
      onComplete: (result) => navigation.replace('Result', result)
    })} />,
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F8F4' }}>
      {screen > 0 && screen < TOTAL && (
        <View style={{ paddingHorizontal: 32, paddingTop: 28 }}>
          <View style={{ height: 1, backgroundColor: '#E6E4DF', position: 'relative' }}>
            <View style={{ height: '100%', backgroundColor: '#2B2A27', width: `${(screen / (TOTAL - 1)) * 100}%` }} />
          </View>
        </View>
      )}
      <View style={{ flex: 1 }} key={screen}>
        {screens[screen]}
      </View>
    </View>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={theme.roseL} size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }}>
      {user ? (
        <>
          <Stack.Screen name="Onboarding" component={OnboardingFlow} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </>
      ) : (
        <>
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="light" />
      </NavigationContainer>
    </AuthProvider>
  );
}
