import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';

const ToastContext = createContext(null);
export function useToast() { return useContext(ToastContext); }

const typeConfig = {
  error: { bg: '#6B2D3E', icon: '\u26A0', iconBg: 'rgba(255,255,255,0.2)' },
  success: { bg: '#2D5A3E', icon: '\u2713', iconBg: 'rgba(255,255,255,0.2)' },
  info: { bg: '#2D3A5A', icon: '\u2139', iconBg: 'rgba(255,255,255,0.2)' },
  warning: { bg: '#5A4A2D', icon: '\u26A0', iconBg: 'rgba(255,255,255,0.2)' },
};

function ToastItem({ toast, onRemove }) {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -10, duration: 200, useNativeDriver: true }),
      ]).start(() => onRemove(toast.id));
    }, toast.duration - 200);
    return () => clearTimeout(timer);
  }, []);

  const cfg = typeConfig[toast.type] || typeConfig.info;

  return (
    <Animated.View
      style={[styles.toast, { backgroundColor: cfg.bg, opacity, transform: [{ translateY }] }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <View style={[styles.iconWrap, { backgroundColor: cfg.iconBg }]}>
        <Text style={styles.icon}>{cfg.icon}</Text>
      </View>
      <Text style={styles.text} numberOfLines={2}>{toast.message}</Text>
    </Animated.View>
  );
}

export function ToastProvider({ children }) {
  const insets = useSafeAreaInsets();
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const showError = useCallback((message) => showToast(message, 'error'), [showToast]);
  const showSuccess = useCallback((message) => showToast(message, 'success'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showError, showSuccess }}>
      {children}
      <View style={[styles.container, { bottom: insets.bottom + 80 }]} pointerEvents="box-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 16, right: 16, alignItems: 'stretch', gap: 8 },
  toast: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: theme.borderRadius.md, gap: 10 },
  iconWrap: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 11, color: '#F8F2FF', lineHeight: 14 },
  text: { color: '#F8F2FF', fontSize: 13, flex: 1, lineHeight: 18 },
});
