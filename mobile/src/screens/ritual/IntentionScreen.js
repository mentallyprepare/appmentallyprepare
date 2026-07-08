import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';

const options = [
  'To understand myself better',
  'To feel less alone',
  'To process something difficult',
  'To write regularly',
  'Just curious',
];

export default function IntentionScreen({ navigation }) {
  const [selected, setSelected] = useState(null);

  return (
    <AnimatedScreen style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.heading}>Why are you here?</Text>
        <Text style={styles.subheading}>Choose what resonates most right now.</Text>
        <View style={styles.optionsWrap}>
          {options.map((opt) => {
            const active = selected === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.option, active && styles.optionActive]}
                onPress={() => setSelected(opt)}
                activeOpacity={0.7}
              >
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.optionText, active && styles.optionTextActive]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.footer}>
        <AppButton
          title="Continue"
          onPress={() => navigation.navigate('Safety')}
          disabled={!selected}
        />
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, justifyContent: 'space-between' },
  body: { flex: 1, justifyContent: 'center', paddingTop: theme.spacing.xl },
  heading: { fontFamily: theme.fontSerif, fontSize: 28, color: theme.ink, marginBottom: theme.spacing.sm },
  subheading: { color: theme.inkM, fontSize: 14, marginBottom: theme.spacing.xl, fontFamily: theme.fontSans },
  optionsWrap: { gap: theme.spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.line,
  },
  optionActive: {
    borderColor: theme.mauve,
    backgroundColor: 'rgba(174,139,194,0.08)',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: theme.inkS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: theme.mauve },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.mauve,
  },
  optionText: { fontSize: 15, color: theme.inkM, fontFamily: theme.fontSans, flex: 1 },
  optionTextActive: { color: theme.ink },
  footer: { paddingBottom: theme.spacing.xl },
});
