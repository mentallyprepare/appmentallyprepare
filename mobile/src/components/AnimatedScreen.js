import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';

export default function AnimatedScreen({ children, style, fade = true, slide = true }) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(slide ? 20 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      fade && Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      slide && Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
    ].filter(Boolean)).start();
  }, [fade, slide, opacity, translateY]);

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }], paddingTop: insets.top }, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
});
