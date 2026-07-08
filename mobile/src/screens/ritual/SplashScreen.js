import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export default function SplashScreen({ navigation }) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 1200, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -8, duration: 2000, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
    const timer = setTimeout(() => navigation.replace('Onboarding'), 2200);
    return () => clearTimeout(timer);
  }, []);

  const stars = Array.from({ length: 20 }, (_, i) => (
    <View key={i} style={[styles.star, {
      top: `${5 + (i * 5) % 90}%`, left: `${3 + (i * 11) % 94}%`,
      width: 1 + (i % 3), height: 1 + (i % 3),
      opacity: 0.15 + (i % 6) * 0.1,
    }]} />
  ));

  return (
    <View style={styles.container}>
      {stars}
      <View style={styles.nebula1} />
      <Animated.View style={{ transform: [{ translateY: float }] }}>
        <View style={styles.logoRing}>
          <View style={styles.logoOrb}>
            <View style={styles.logoCore} />
          </View>
          <View style={styles.orbitDot} />
        </View>
      </Animated.View>
      <Animated.View style={[styles.textWrap, { opacity: fadeIn }]}>
        <Text style={styles.logo}>mentally</Text>
        <Text style={styles.logoSub}>prepare</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' },
  star: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.5)' },
  nebula1: {
    position: 'absolute', top: '10%', right: '-10%',
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(123,94,167,0.08)',
  },
  logoRing: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 1.5, borderColor: 'rgba(200,180,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  logoOrb: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(200,180,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoCore: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: theme.lavender,
  },
  orbitDot: {
    position: 'absolute', top: -4, left: 36,
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(200,180,255,0.5)',
  },
  textWrap: { position: 'absolute', bottom: '20%', alignItems: 'center' },
  logo: { fontFamily: theme.fontSerif, fontSize: 34, color: theme.text, letterSpacing: 2 },
  logoSub: { fontFamily: theme.fontSerif, fontSize: 18, fontStyle: 'italic', color: theme.lavender, marginTop: 4, letterSpacing: 4 },
});
