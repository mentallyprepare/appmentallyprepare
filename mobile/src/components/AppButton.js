import { useCallback, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

export default function AppButton({ title, onPress, variant = 'primary', loading, disabled, icon, style, textStyle, accessibilityLabel }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(async () => {
    if (disabled || loading) return;
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, ...theme.animation.spring }).start(() => {
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...theme.animation.spring }).start();
    });
    onPress?.();
  }, [disabled, loading, onPress, scale]);

  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.base,
          isPrimary && styles.primary,
          isDanger && styles.danger,
          isGhost && styles.ghost,
          (disabled || loading) && styles.disabled,
          style,
        ]}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityState={{ disabled: disabled || loading }}
      >
        {loading ? (
          <ActivityIndicator color={isGhost ? theme.inkM : '#fff'} size="small" />
        ) : (
          <>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text style={[
              styles.text,
              isPrimary && styles.textPrimary,
              isDanger && styles.textDanger,
              isGhost && styles.textGhost,
              textStyle,
            ]}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.full,
    gap: 8,
  },
  primary: {
    backgroundColor: theme.roseD,
    ...theme.shadow.glow(theme.roseD),
  },
  danger: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(212,133,154,0.2)',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  icon: { fontSize: 16 },
  text: { fontSize: 15, letterSpacing: 0.5 },
  textPrimary: { color: '#fff' },
  textDanger: { color: theme.rose },
  textGhost: { color: theme.inkS },
});
