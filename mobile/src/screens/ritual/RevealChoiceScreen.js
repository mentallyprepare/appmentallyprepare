import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';

const options = [
  { key: 'name', label: 'Share your name', icon: 'person-outline' },
  { key: 'photo', label: 'Share a photo', icon: 'camera-outline' },
  { key: 'voice', label: 'Share a voice note', icon: 'mic-outline' },
  { key: 'letter', label: 'Share a letter', icon: 'mail-outline' },
];

export default function RevealChoiceScreen({ navigation }) {
  const [selected, setSelected] = useState([]);

  const toggle = (key) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <AnimatedScreen style={styles.container}>
      <Text style={styles.heading}>What would you like to reveal?</Text>

      {options.map((opt) => {
        const isOn = selected.includes(opt.key);
        return (
          <TouchableOpacity
            key={opt.key}
            style={[styles.optionRow, isOn && styles.optionRowOn]}
            onPress={() => toggle(opt.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isOn ? 'checkbox' : 'square-outline'}
              size={22}
              color={isOn ? theme.gold : theme.inkS}
            />
            <Ionicons name={opt.icon} size={20} color={theme.inkM} />
            <Text style={styles.optionLabel}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}

      <AppButton
        title="Confirm choice"
        disabled={selected.length === 0}
        onPress={() => navigation.navigate('RevealWaiting')}
        style={styles.btn}
      />
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg },
  heading: { fontFamily: theme.fontSerif, fontSize: 22, color: theme.ink, textAlign: 'center', marginTop: theme.spacing['2xl'], marginBottom: theme.spacing.xl },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md,
    paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line,
  },
  optionRowOn: { borderColor: theme.gold, backgroundColor: 'rgba(208,178,120,0.06)' },
  optionLabel: { fontFamily: theme.fontSans, fontSize: 15, color: theme.ink, flex: 1 },
  btn: { marginTop: theme.spacing.xl },
});
