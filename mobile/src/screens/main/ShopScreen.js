import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { theme } from '../../theme';
import { api } from '../../services/api';
import { useToast } from '../../components/Toast';
import { Icon } from '../../components/Icon';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';

const products = [
  { id: 'archetype-pdf', name: 'Archetype PDF Guide', desc: 'Deep-dive into your psychological archetype with personalized insights and growth practices.', price: { inr: 999, usd: 12 }, icon: 'document-text' },
  { id: 'second-cycle', name: 'Second Cycle Pass', desc: 'Extend your journey with a new partner through another 21-day cycle.', price: { inr: 499, usd: 6 }, icon: 'repeat' },
];

export default function ShopScreen({ navigation }) {
  const toast = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null);

  useEffect(() => {
    api.payHistory().then(d => setPayments(d || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const owned = (productId) => payments.some(p => p.product_id === productId && p.status === 'completed');

  const handleStripe = async (product) => {
    setPaying(product.id);
    try {
      const data = await api.createStripeSession(product.id);
      if (data.url) {
        await Linking.openURL(data.url);
      }
    } catch (e) {
      toast.showError(e.message);
    } finally {
      setPaying(null);
    }
  };

  const handleRazorpay = async (product) => {
    setPaying(product.id);
    try {
      const data = await api.createRazorpayOrder(product.id);
      navigation.navigate('RazorpayCheckout', {
        order: data,
        product: product.id,
        onSuccess: () => {
          api.payHistory().then(d => setPayments(d || [])).catch(() => {});
        },
      });
    } catch (e) {
      toast.showError(e.message);
    } finally {
      setPaying(null);
    }
  };

  return (
    <AnimatedScreen>
      <ScrollView contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => api.payHistory().then(d => setPayments(d || [])).catch(() => {})} tintColor={theme.roseL} />}>
        <Text style={styles.title}>Shop</Text>
        <Text style={styles.subtitle}>Enhance your journey</Text>

        {products.map((p) => {
          const isOwned = owned(p.id);
          return (
            <Card key={p.id} padding={20} variant={isOwned ? 'default' : 'highlight'} style={styles.productCard}>
              <View style={styles.productTop}>
                <View style={styles.productIcon}>
                  <Icon name={p.icon} size={24} color={theme.goldL} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{p.name}</Text>
                  <Text style={styles.productDesc}>{p.desc}</Text>
                </View>
              </View>
              {isOwned ? (
                <View style={styles.ownedBadge}>
                  <Icon name="checkmark-circle" size={16} color={theme.green} />
                  <Text style={styles.ownedText}>Owned</Text>
                </View>
              ) : (
                <View style={styles.buyRow}>
                  <Text style={styles.price}>₹{p.price.inr} / ${p.price.usd}</Text>
                  <View style={styles.buyBtns}>
                    <TouchableOpacity
                      style={[styles.buyBtn, paying === p.id && { opacity: 0.5 }]}
                      onPress={() => handleRazorpay(p)}
                      disabled={paying === p.id}
                    >
                      <Text style={styles.buyBtnText}>{paying === p.id ? '...' : 'Razorpay'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buyBtnAlt}
                      onPress={() => handleStripe(p)}
                      disabled={paying === p.id}
                    >
                      <Text style={styles.buyBtnAltText}>{paying === p.id ? '...' : 'Stripe'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Card>
          );
        })}

        {payments.length > 0 && (
          <View style={styles.history}>
            <Text style={styles.historyTitle}>Payment History</Text>
            {payments.map((p, i) => (
              <Card key={i} padding={14} style={{ marginBottom: 8 }}>
                <View style={styles.historyRow}>
                  <Text style={styles.historyProduct}>{p.product_id}</Text>
                  <View style={[styles.statusBadge, p.status === 'completed' ? styles.statusCompleted : p.status === 'pending' ? styles.statusPending : styles.statusFailed]}>
                    <Text style={styles.statusText}>{p.status}</Text>
                  </View>
                </View>
                <Text style={styles.historyDate}>{new Date(p.created_at).toLocaleDateString()}</Text>
              </Card>
            ))}
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingTop: 60 },
  title: { fontFamily: theme.fontSerif, fontSize: 28, color: theme.ink, marginBottom: 4 },
  subtitle: { color: theme.inkS, fontSize: 13, marginBottom: 24 },
  productCard: { marginBottom: 16 },
  productTop: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  productIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(232,200,133,0.1)', alignItems: 'center', justifyContent: 'center' },
  productName: { fontFamily: theme.fontSerif, fontSize: 18, color: theme.ink, marginBottom: 4 },
  productDesc: { color: theme.inkM, fontSize: 13, lineHeight: 18 },
  ownedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: 'rgba(101,145,121,0.1)', borderWidth: 1, borderColor: 'rgba(101,145,121,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: theme.borderRadius.full },
  ownedText: { color: theme.green, fontSize: 12 },
  buyRow: { gap: 12 },
  price: { color: theme.goldL, fontSize: 16, fontFamily: theme.fontSerif },
  buyBtns: { flexDirection: 'row', gap: 8 },
  buyBtn: { flex: 1, backgroundColor: theme.roseD, paddingVertical: 10, borderRadius: theme.borderRadius.full, alignItems: 'center' },
  buyBtnText: { color: '#fff', fontSize: 12 },
  buyBtnAlt: { flex: 1, borderWidth: 1, borderColor: theme.line, paddingVertical: 10, borderRadius: theme.borderRadius.full, alignItems: 'center' },
  buyBtnAltText: { color: theme.inkM, fontSize: 12 },
  history: { marginTop: 24 },
  historyTitle: { color: theme.inkS, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  historyProduct: { color: theme.inkM, fontSize: 13, textTransform: 'capitalize' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100 },
  statusCompleted: { backgroundColor: 'rgba(101,145,121,0.15)' },
  statusPending: { backgroundColor: 'rgba(232,200,133,0.15)' },
  statusFailed: { backgroundColor: 'rgba(212,133,154,0.15)' },
  statusText: { fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: theme.inkM },
  historyDate: { color: theme.inkS, fontSize: 10 },
});
