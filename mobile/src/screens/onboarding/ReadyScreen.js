import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';

const intentMap = ['social confidence', 'identity clarity', 'emotional resilience', 'a total reset'];
const intentShort = ['Confidence', 'Clarity', 'Resilience', 'Reset'];

export default function ReadyScreen({ onFinish, name, intention }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.lineWrap}><View style={styles.line} /></View>

        <Text style={styles.eye}>Preparation complete</Text>
        <Text style={styles.title}>{name ? `${name}, let's` : "Let's"} go{'\n'}<Text style={styles.em}>deeper.</Text></Text>
        <Text style={styles.body}>The mirror is ready. We will build towards {intentMap[intention ?? 3]} together.</Text>

        <View style={styles.manifest}>
          <Text style={styles.manifestEye}>Manifest</Text>
          <View style={styles.manifestRow}>
            <Text style={styles.manifestLabel}>Subject</Text>
            <Text style={styles.manifestValue}>{name || 'Anonymous'}</Text>
          </View>
          <View style={styles.manifestRow}>
            <Text style={styles.manifestLabel}>Objective</Text>
            <Text style={styles.manifestValue}>{intentShort[intention ?? 3]}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.btns}>
        <TouchableOpacity style={styles.btn} onPress={onFinish}>
          <Text style={styles.btnText}>Start the scan →</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>7 questions · Deep analysis</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F8F4', paddingBottom: 48 },
  scrollContent: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 80, paddingBottom: 32 },
  lineWrap: { marginBottom: 40 },
  line: { width: 1, height: 60, backgroundColor: '#D1C2A3', marginHorizontal: 'auto' },
  eye: { color: '#7A7975', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  title: { fontFamily: theme.fontSerif, fontSize: 34, color: '#2B2A27', textAlign: 'center', lineHeight: 40, marginBottom: 24 },
  em: { fontStyle: 'italic' },
  body: { color: '#7A7975', fontSize: 14, textAlign: 'center', lineHeight: 22, maxWidth: 280, marginBottom: 48 },
  manifest: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E6E4DF', padding: 24, width: '100%' },
  manifestEye: { fontFamily: theme.fontSerif, fontSize: 14, fontStyle: 'italic', color: '#7A7975', marginBottom: 16 },
  manifestRow: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E6E4DF', borderStyle: 'dotted', marginBottom: 12 },
  manifestLabel: { fontSize: 13, color: '#7A7975' },
  manifestValue: { fontFamily: theme.fontSerif, fontSize: 17, color: '#2B2A27' },
  btns: { paddingHorizontal: 32, gap: 16, alignItems: 'center' },
  btn: { backgroundColor: '#2C3E35', paddingVertical: 20, alignItems: 'center', width: '100%' },
  btnText: { color: '#F9F8F4', fontFamily: theme.fontSerif, fontSize: 18, fontStyle: 'italic' },
  hint: { fontSize: 11, color: '#B8B7B2', textTransform: 'uppercase', letterSpacing: 1 },
});
