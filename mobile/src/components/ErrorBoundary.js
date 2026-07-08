import { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.sub}>{this.state.error?.message || 'An unexpected error occurred'}</Text>
          <TouchableOpacity style={styles.btn} onPress={() => this.setState({ hasError: false, error: null })}>
            <Text style={styles.btnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08050F', alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontFamily: 'Georgia', fontSize: 22, color: '#F8F2FF', textAlign: 'center', marginBottom: 8 },
  sub: { color: 'rgba(248,242,255,0.62)', fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  btn: { backgroundColor: '#9B4F66', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 100 },
  btnText: { color: '#fff', fontSize: 14, letterSpacing: 0.5 },
});
