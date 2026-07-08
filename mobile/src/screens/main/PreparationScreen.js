import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Animated, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme, emotions, situations } from '../../theme';
import { api } from '../../services/api';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';
import { Icon } from '../../components/Icon';
import { useToast } from '../../components/Toast';

const { width } = Dimensions.get('window');
const STEP_COUNT = 4;

const stepLabels = ['Situation', 'Emotions', 'Write', 'Finish'];

export default function PreparationScreen() {
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [journalText, setJournalText] = useState('');
  const [outcome, setOutcome] = useState(null);
  const [saving, setSaving] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateStep = useCallback((direction = 1) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -direction * 20, duration: 0, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const goNext = useCallback(() => {
    if (step < STEP_COUNT - 1) {
      setStep(s => s + 1);
      animateStep(1);
    }
  }, [step, animateStep]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setStep(s => s - 1);
      animateStep(-1);
    }
  }, [step, animateStep]);

  const toggleEmotion = useCallback((id) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setSelectedEmotions(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  }, []);

  const handleSave = useCallback(async (privacy) => {
    setSaving(true);
    setOutcome(privacy);
    try {
      await api.entry({
        situation: selectedSituation,
        emotions: selectedEmotions,
        text: journalText,
        privacy,
      });
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
      showToast(privacy === 'exchange' ? 'Shared for exchange' : 'Saved to your journal');
      setSelectedSituation(null);
      setSelectedEmotions([]);
      setJournalText('');
      setOutcome(null);
      setStep(0);
    } catch (e) {
      showToast(e.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }, [selectedSituation, selectedEmotions, journalText, showToast]);

  const canProceed = () => {
    switch (step) {
      case 0: return selectedSituation !== null;
      case 1: return selectedEmotions.length > 0;
      case 2: return journalText.trim().length > 0;
      default: return true;
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepsRow}>
      {stepLabels.map((label, i) => (
        <TouchableOpacity
          key={label}
          onPress={() => { if (i < step) { setStep(i); animateStep(-1); } }}
          style={[styles.stepDot, i === step && styles.stepDotActive, i < step && styles.stepDotPast]}
          accessibilityLabel={`Step ${i + 1}: ${label}`}
        >
          {i < step ? (
            <Icon name="checkmark" size={12} color={theme.accent} />
          ) : (
            <Text style={[styles.stepDotText, i === step && styles.stepDotTextActive]}>{i + 1}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSituationStep = () => (
    <Animated.View style={[styles.stepContent, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
      <Text style={styles.heading}>What are you preparing for?</Text>
      <Text style={styles.subheading}>Pick the situation that feels closest</Text>
      <View style={styles.chipsWrap}>
        {situations.map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, selectedSituation === s && styles.chipActive]}
            onPress={() => { try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}; setSelectedSituation(s); }}
            accessibilityLabel={s}
          >
            <Text style={[styles.chipText, selectedSituation === s && styles.chipTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderEmotionStep = () => (
    <Animated.View style={[styles.stepContent, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
      <Text style={styles.heading}>How are you feeling?</Text>
      <Text style={styles.subheading}>Choose all that apply</Text>
      <View style={styles.emotionGrid}>
        {emotions.map(e => {
          const active = selectedEmotions.includes(e.id);
          return (
            <TouchableOpacity
              key={e.id}
              style={[styles.emotionCard, active && styles.emotionCardActive]}
              onPress={() => toggleEmotion(e.id)}
              accessibilityLabel={e.label}
            >
              <Icon name={e.icon} size={22} color={active ? theme.accent : theme.inkM} />
              <Text style={[styles.emotionLabel, active && styles.emotionLabelActive]}>{e.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );

  const renderWriteStep = () => (
    <Animated.View style={[styles.stepContent, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
      <Text style={styles.heading}>What's on your mind?</Text>
      <Text style={styles.subheading}>
        {selectedSituation ? `About "${selectedSituation.toLowerCase()}"` : 'Write freely'}
      </Text>
      <TextInput
        style={styles.textInput}
        value={journalText}
        onChangeText={setJournalText}
        placeholder="There's no right or wrong way to do this. Just write what comes to mind..."
        placeholderTextColor={theme.inkS}
        multiline
        textAlignVertical="top"
        autoFocus
      />
    </Animated.View>
  );

  const renderOutcomeStep = () => (
    <Animated.View style={[styles.stepContent, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
      <Text style={styles.heading}>You're done preparing</Text>
      <Text style={styles.subheading}>
        You're preparing for "{selectedSituation?.toLowerCase()}"
        {selectedEmotions.length > 0 && `, feeling ${selectedEmotions.map(id => emotions.find(e => e.id === id)?.label).join(', ')}`}
      </Text>
      <Card variant="elevated" style={styles.summaryCard}>
        <Text style={styles.summaryText} numberOfLines={6}>{journalText}</Text>
      </Card>
      <View style={styles.outcomeButtons}>
        <AppButton
          title="Save to my journal"
          variant="ghost"
          onPress={() => handleSave('private')}
          loading={saving && outcome === 'private'}
          icon="lock-closed-outline"
          style={styles.outcomeBtn}
        />
        <AppButton
          title="Share for exchange"
          variant="primary"
          onPress={() => handleSave('exchange')}
          loading={saving && outcome === 'exchange'}
          icon="paper-plane-outline"
          style={styles.outcomeBtn}
        />
      </View>
    </Animated.View>
  );

  return (
    <AnimatedScreen>
      <View style={styles.container}>
        {renderStepIndicator()}
        <View style={styles.body}>
          {step === 0 && renderSituationStep()}
          {step === 1 && renderEmotionStep()}
          {step === 2 && renderWriteStep()}
          {step === 3 && renderOutcomeStep()}
        </View>
        <View style={styles.footer}>
          {step > 0 && step < 3 && (
            <AppButton title="Back" variant="ghost" onPress={goBack} style={styles.footerBtn} />
          )}
          {step < 2 && (
            <AppButton
              title="Continue"
              variant="primary"
              onPress={goNext}
              disabled={!canProceed()}
              style={styles.footerBtn}
            />
          )}
          {step === 2 && (
            <AppButton
              title="Finish & review"
              variant="primary"
              onPress={goNext}
              disabled={!canProceed()}
              style={styles.footerBtn}
            />
          )}
        </View>
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg },
  stepsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.md },
  stepDot: { width: 28, height: 28, borderRadius: theme.borderRadius.full, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.line },
  stepDotActive: { borderColor: theme.accent, backgroundColor: 'rgba(196,148,94,0.15)' },
  stepDotPast: { borderColor: theme.accent, backgroundColor: theme.accent },
  stepDotText: { fontSize: 12, color: theme.inkM, fontFamily: theme.fontSans },
  stepDotTextActive: { color: theme.accent },
  body: { flex: 1, justifyContent: 'center' },
  stepContent: { flex: 1, justifyContent: 'center' },
  heading: { fontSize: 24, fontFamily: theme.fontSerif, color: theme.ink, marginBottom: theme.spacing.sm },
  subheading: { fontSize: 15, color: theme.inkM, marginBottom: theme.spacing.lg, fontFamily: theme.fontSans },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  chip: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm + 2, borderRadius: theme.borderRadius.full, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line },
  chipActive: { borderColor: theme.accent, backgroundColor: 'rgba(196,148,94,0.15)' },
  chipText: { fontSize: 14, color: theme.inkM, fontFamily: theme.fontSans },
  chipTextActive: { color: theme.accent },
  emotionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  emotionCard: { width: (width - theme.spacing.lg * 2 - theme.spacing.sm * 2) / 3, paddingVertical: theme.spacing.md, borderRadius: theme.borderRadius.md, backgroundColor: theme.card, alignItems: 'center', borderWidth: 1, borderColor: theme.line, gap: theme.spacing.xs },
  emotionCardActive: { borderColor: theme.accent, backgroundColor: 'rgba(196,148,94,0.12)' },
  emotionLabel: { fontSize: 12, color: theme.inkM, fontFamily: theme.fontSans },
  emotionLabelActive: { color: theme.accent },
  textInput: { flex: 1, fontSize: 16, color: theme.ink, fontFamily: theme.fontSans, lineHeight: 24, paddingTop: theme.spacing.md },
  summaryCard: { padding: theme.spacing.md, marginBottom: theme.spacing.lg },
  summaryText: { fontSize: 15, color: theme.inkM, fontFamily: theme.fontSans, lineHeight: 22 },
  outcomeButtons: { gap: theme.spacing.sm },
  outcomeBtn: { width: '100%' },
  footer: { flexDirection: 'row', gap: theme.spacing.sm, paddingTop: theme.spacing.lg },
  footerBtn: { flex: 1 },
});
