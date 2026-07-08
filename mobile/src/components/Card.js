import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function Card({ children, style, variant = 'default', padding = 16 }) {
  return (
    <View style={[
      styles.base,
      variant === 'elevated' && styles.elevated,
      variant === 'highlight' && styles.highlight,
      { padding },
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.line,
    borderRadius: theme.borderRadius.lg,
  },
  elevated: {
    ...theme.shadow.md,
    borderColor: 'transparent',
  },
  highlight: {
    backgroundColor: 'rgba(212,133,154,0.06)',
    borderColor: 'rgba(212,133,154,0.13)',
  },
});
