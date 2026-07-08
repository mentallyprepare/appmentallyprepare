import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { theme } from '../../theme';
import { Icon } from '../../components/Icon';
import AppButton from '../../components/AppButton';

export default function LandingScreen({ navigation }) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, [fadeIn, slideUp]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoArea, { opacity: fadeIn }]}>
        <Text style={styles.logoText}>Mentally Prepare</Text>
      </Animated.View>
      <Animated.View style={[styles.moon, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
        <View style={styles.moonInner}>
          <Icon name="moon" size={44} color={theme.accentL} />
        </View>
      </Animated.View>
      <Animated.View style={[styles.ctaArea, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
        <Text style={styles.title}>Prepare for{'\n'}<Text style={styles.titleEm}>what's ahead.</Text></Text>
        <Text style={styles.subtitle}>
          A guided space to get ready — for conversations, decisions, and moments that matter.
        </Text>
        <AppButton
          title="Start preparing"
          onPress={() => navigation.navigate('Register')}
        />
        <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, justifyContent: 'space-between', paddingVertical: 60, paddingHorizontal: 28 },
  logoArea: { alignItems: 'center' },
  logoText: { color: theme.inkS, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' },
  moon: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  moonInner: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.accentL, alignItems: 'center', justifyContent: 'center', ...theme.shadow.glow(theme.accentL) },
  ctaArea: { gap: 16 },
  title: { fontFamily: theme.fontSerif, fontSize: 40, color: theme.ink, textAlign: 'center', lineHeight: 44 },
  titleEm: { color: theme.inkM, fontStyle: 'italic' },
  subtitle: { color: theme.inkM, fontSize: 14, textAlign: 'center', lineHeight: 22, maxWidth: 300, alignSelf: 'center' },
  linkBtn: { alignItems: 'center', paddingVertical: 8 },
  linkText: { color: theme.inkS, fontSize: 13 },
});
