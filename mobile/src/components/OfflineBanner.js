import { View, Text, StyleSheet } from 'react-native';
import useNetworkStatus from '../hooks/useNetworkStatus';
import { theme } from '../theme';

export default function OfflineBanner() {
  const isOnline = useNetworkStatus();
  if (isOnline) return null;
  return (
    <View style={styles.banner} accessibilityRole="alert" accessibilityLiveRegion="assertive">
      <Text style={styles.text}>No internet connection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: '#6B2D3E', paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center' },
  text: { color: '#F8F2FF', fontSize: 11, letterSpacing: 0.3 },
});
