import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';

export default function WriteScreen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <View style={styles.wordCount}>
        <Ionicons name="diamond" size={10} color={theme.inkPaperM} />
        <Text style={styles.wordCountText}>0 words</Text>
      </View>

      <View style={styles.paperSheet}>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Write what the stars already know..."
          placeholderTextColor={theme.inkPaperM}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        style={styles.sealButton}
        onPress={() => navigation.navigate('SealConfirm')}
        activeOpacity={0.8}
      >
        <Ionicons name="lock-closed" size={16} color="#fff" />
        <Text style={styles.sealText}>Seal tonight's note</Text>
      </TouchableOpacity>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg },
  wordCount: {
    flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs,
    marginTop: theme.spacing.lg, marginBottom: theme.spacing.md,
  },
  wordCountText: { fontFamily: theme.fontSans, fontSize: 12, color: theme.inkPaperM },
  paperSheet: {
    backgroundColor: theme.paper,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    minHeight: 320,
    ...theme.shadow.md,
  },
  input: {
    fontFamily: theme.fontSerif,
    fontSize: 17,
    color: theme.inkPaper,
    lineHeight: 26,
    flex: 1,
  },
  sealButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.roseD,
    borderRadius: theme.borderRadius.full,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: theme.spacing.xl,
    ...theme.shadow.glow(theme.roseD),
  },
  sealText: { fontFamily: theme.fontSans, fontSize: 15, color: '#fff', letterSpacing: 0.5 },
});
