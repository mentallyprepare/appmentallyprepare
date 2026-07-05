import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export default function SplashScreen({ onNext }) {
  return (
    <View style={styles.container}>
      <Text style={styles.eye}>Mentally Prepare</Text>
      <View style={styles.art}>
        <View style={styles.shape1} />
        <View style={styles.shape2}><Text style={styles.shapeText}>I</Text></View>
      </View>
      <View style={styles.cta}>
        <Text style={styles.title}>Know yourself.{'\n'}<Text style={styles.em}>Finally.</Text></Text>
        <Text style={styles.body}>A psychological operating system for social confidence and emotional resilience.</Text>
        <TouchableOpacity style={styles.btn} onPress={onNext}>
          <Text style={styles.btnText}>Begin the mirror scan →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F8F4', justifyContent: 'space-between', paddingVertical: 60, paddingHorizontal: 32 },
  eye: { color: '#7A7975', fontSize: 10, letterSpacing: 2, textAlign: 'center', textTransform: 'uppercase' },
  art: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  shape1: { position: 'absolute', width: 180, height: 240, borderWidth: 1, borderColor: '#D1C2A3', borderRadius: 120, transform: [{ rotate: '-4deg' }] },
  shape2: { width: 150, height: 210, backgroundColor: '#fff', borderRadius: 100, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.04, shadowRadius: 40 },
  shapeText: { fontFamily: theme.fontSerif, fontSize: 48, fontStyle: 'italic', color: '#2B2A27' },
  cta: { gap: 16, alignItems: 'center' },
  title: { fontFamily: theme.fontSerif, fontSize: 42, color: '#2B2A27', textAlign: 'center', lineHeight: 46 },
  em: { color: '#7A7975', fontStyle: 'italic' },
  body: { color: '#7A7975', fontSize: 14, textAlign: 'center', lineHeight: 22, maxWidth: 280 },
  btn: { backgroundColor: '#2C3E35', paddingVertical: 20, paddingHorizontal: 32, borderRadius: 0, alignItems: 'center', width: '100%', shadowColor: '#2C3E35', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24 },
  btnText: { color: '#F9F8F4', fontFamily: theme.fontSerif, fontSize: 20, fontStyle: 'italic' },
});
