import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { theme } from '../../theme';

export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoArea}>
        <Text style={styles.logoText}>Mentally Prepare</Text>
      </View>
      <View style={styles.moon}>
        <View style={styles.moonInner}>
          <Text style={{ fontSize: 44 }}>🌙</Text>
        </View>
      </View>
      <View style={styles.ctaArea}>
        <Text style={styles.title}>Know yourself.{'\n'}<Text style={styles.titleEm}>Finally.</Text></Text>
        <Text style={styles.subtitle}>
          A psychological operating system for social confidence and emotional resilience.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.btnText}>Begin the mirror scan →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, justifyContent: 'space-between', paddingVertical: 60, paddingHorizontal: 28 },
  logoArea: { alignItems: 'center' },
  logoText: { color: theme.inkS, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' },
  moon: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  moonInner: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#C9A96E', alignItems: 'center', justifyContent: 'center', shadowColor: '#C9A96E', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 50 },
  ctaArea: { gap: 16 },
  title: { fontFamily: theme.fontSerif, fontSize: 40, color: theme.ink, textAlign: 'center', lineHeight: 44 },
  titleEm: { color: theme.inkM, fontStyle: 'italic' },
  subtitle: { color: theme.inkM, fontSize: 14, textAlign: 'center', lineHeight: 22, maxWidth: 300, alignSelf: 'center' },
  btn: { backgroundColor: theme.roseD, paddingVertical: 18, borderRadius: 100, alignItems: 'center', shadowColor: theme.roseD, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 32 },
  btnText: { color: '#fff', fontSize: 15, letterSpacing: 0.5 },
  linkBtn: { alignItems: 'center', paddingVertical: 8 },
  linkText: { color: theme.inkS, fontSize: 13 },
});
