import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';

const archetypes = ['The Quiet Storm', 'The Mirror Breaker', 'The Night Architect', 'The Depth Keeper'];

export default function ArchetypeTeaseScreen({ onNext, onBack }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.line} />
        <Text style={styles.eye}>The Framework</Text>
        <Text style={styles.title}>Your archetype{'\n'}<Text style={styles.em}>awaits.</Text></Text>
        <Text style={styles.body}>Seven questions. Deep psychological framing. One precise mirror reflecting your core.</Text>

        <View style={styles.archetypeBlock}>
          <Text style={styles.blockTitle}>The Archetypes</Text>
          {archetypes.map((name, i) => (
            <View key={i} style={styles.archetypeRow}>
              <Text style={styles.archetypeNum}>0{i + 1}</Text>
              <Text style={styles.archetypeName}>{name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.btns}>
        <TouchableOpacity style={styles.btn} onPress={onNext}>
          <Text style={styles.btnText}>Continue →</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.cancel}>Go back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F8F4', paddingBottom: 48 },
  scroll: { flex: 1, paddingHorizontal: 32 },
  scrollContent: { paddingTop: 52 },
  line: { width: 1, height: 40, backgroundColor: '#D1C2A3', marginBottom: 32 },
  eye: { color: '#7A7975', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  title: { fontFamily: theme.fontSerif, fontSize: 34, color: '#2B2A27', lineHeight: 40, marginBottom: 16 },
  em: { fontStyle: 'italic' },
  body: { color: '#7A7975', fontSize: 14, lineHeight: 22, marginBottom: 40 },
  archetypeBlock: { borderLeftWidth: 1, borderLeftColor: '#D1C2A3', paddingLeft: 24 },
  blockTitle: { fontFamily: theme.fontSerif, fontSize: 22, color: '#2B2A27', marginBottom: 16, lineHeight: 28 },
  archetypeRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  archetypeNum: { color: '#B8B7B2', fontFamily: theme.fontSerif, fontStyle: 'italic', fontSize: 14 },
  archetypeName: { fontSize: 15, color: '#2B2A27' },
  btns: { paddingHorizontal: 32, gap: 16 },
  btn: { backgroundColor: '#2C3E35', paddingVertical: 20, alignItems: 'center' },
  btnText: { color: '#F9F8F4', fontFamily: theme.fontSerif, fontSize: 18, fontStyle: 'italic' },
  cancel: { color: '#7A7975', fontSize: 11, textAlign: 'center', padding: 8, textTransform: 'uppercase', letterSpacing: 1 },
});
