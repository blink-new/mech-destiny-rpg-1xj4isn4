import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { router } from 'expo-router';
import { blink } from '@/src/blink/client';

const { width } = Dimensions.get('window');

interface OriginStory {
  id: string;
  title: string;
  description: string;
  bonuses: string;
  color: string;
}

const originStories: OriginStory[] = [
  {
    id: 'military',
    title: 'MILITARY VETERAN',
    description: 'Former elite soldier with extensive combat training and tactical expertise.',
    bonuses: '+10 Attack, +5 Defense, Assault Mech',
    color: '#FF6B35',
  },
  {
    id: 'engineer',
    title: 'TECH ENGINEER',
    description: 'Brilliant mechanic who understands mech systems better than anyone.',
    bonuses: '+15 Tech, +10 Repair, Support Mech',
    color: '#00D4FF',
  },
  {
    id: 'scavenger',
    title: 'WASTELAND SCAVENGER',
    description: 'Survivor who learned to adapt and overcome in the harsh post-apocalyptic world.',
    bonuses: '+10 Speed, +5 Luck, Sniper Mech',
    color: '#9D4EDD',
  },
  {
    id: 'noble',
    title: 'CORPORATE HEIR',
    description: 'Born into wealth and privilege, trained in the finest mech academies.',
    bonuses: '+1000 Credits, +10 Charisma, Tank Mech',
    color: '#FFD700',
  },
];

export default function CharacterCreationScreen() {
  const [step, setStep] = useState(1);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [pilotName, setPilotName] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState<OriginStory | null>(null);
  const [creating, setCreating] = useState(false);

  // Animation values
  const stepScale = useSharedValue(1);

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setSelectedGender(gender);
    stepScale.value = withSpring(1.05, {}, () => {
      stepScale.value = withSpring(1);
    });
  };

  const handleOriginSelect = (origin: OriginStory) => {
    setSelectedOrigin(origin);
    stepScale.value = withSpring(1.05, {}, () => {
      stepScale.value = withSpring(1);
    });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      createCharacter();
    }
  };

  const createCharacter = async () => {
    if (!selectedGender || !selectedOrigin || !pilotName.trim()) return;

    setCreating(true);
    try {
      // For now, just simulate character creation and navigate to home
      // In a real implementation, this would save to the database
      setTimeout(() => {
        router.replace('/home');
      }, 2000);
    } catch (error) {
      console.error('Error creating character:', error);
      setCreating(false);
    }
  };

  const stepAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: stepScale.value }],
  }));

  const canProceed = () => {
    if (step === 1) return selectedGender !== null;
    if (step === 2) return pilotName.trim().length > 0;
    if (step === 3) return selectedOrigin !== null;
    return false;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0E1A', '#1A1F2E']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.duration(600)}
      >
        <Text style={styles.headerTitle}>NEURAL INTERFACE SETUP</Text>
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((stepNum) => (
            <View
              key={stepNum}
              style={[
                styles.progressDot,
                stepNum <= step && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: Gender Selection */}
        {step === 1 && (
          <Animated.View 
            style={[styles.stepContainer, stepAnimatedStyle]}
            entering={FadeInRight.duration(600)}
          >
            <Text style={styles.stepTitle}>SELECT PILOT AVATAR</Text>
            <Text style={styles.stepDescription}>
              Choose your pilot's appearance for neural interface synchronization
            </Text>

            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  selectedGender === 'male' && styles.genderOptionSelected,
                ]}
                onPress={() => handleGenderSelect('male')}
              >
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>♂</Text>
                </View>
                <Text style={styles.genderLabel}>MALE PILOT</Text>
                <Text style={styles.genderDescription}>
                  Enhanced physical conditioning and combat reflexes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderOption,
                  selectedGender === 'female' && styles.genderOptionSelected,
                ]}
                onPress={() => handleGenderSelect('female')}
              >
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>♀</Text>
                </View>
                <Text style={styles.genderLabel}>FEMALE PILOT</Text>
                <Text style={styles.genderDescription}>
                  Superior neural synchronization and tactical awareness
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Step 2: Name Input */}
        {step === 2 && (
          <Animated.View 
            style={[styles.stepContainer, stepAnimatedStyle]}
            entering={FadeInRight.duration(600)}
          >
            <Text style={styles.stepTitle}>PILOT IDENTIFICATION</Text>
            <Text style={styles.stepDescription}>
              Enter your callsign for mission records and neural link registration
            </Text>

            <View style={styles.nameInputContainer}>
              <Text style={styles.inputLabel}>PILOT CALLSIGN</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputPrefix}>PILOT:</Text>
                <TextInput
                  style={styles.nameInput}
                  value={pilotName}
                  onChangeText={setPilotName}
                  placeholder="Enter callsign"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  maxLength={20}
                  autoCapitalize="characters"
                />
              </View>
              <Text style={styles.inputHint}>
                This name will appear in mission logs and leaderboards
              </Text>
            </View>

            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>NEURAL LINK PREVIEW</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewAvatar}>
                  <Text style={styles.previewAvatarText}>
                    {selectedGender === 'male' ? '♂' : '♀'}
                  </Text>
                </View>
                <View style={styles.previewInfo}>
                  <Text style={styles.previewName}>
                    {pilotName.trim() || 'UNNAMED PILOT'}
                  </Text>
                  <Text style={styles.previewGender}>
                    {selectedGender?.toUpperCase()} PILOT
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Step 3: Origin Story */}
        {step === 3 && (
          <Animated.View 
            style={[styles.stepContainer, stepAnimatedStyle]}
            entering={FadeInRight.duration(600)}
          >
            <Text style={styles.stepTitle}>ORIGIN PROTOCOL</Text>
            <Text style={styles.stepDescription}>
              Select your background to determine starting equipment and abilities
            </Text>

            <View style={styles.originContainer}>
              {originStories.map((origin) => (
                <TouchableOpacity
                  key={origin.id}
                  style={[
                    styles.originOption,
                    selectedOrigin?.id === origin.id && styles.originOptionSelected,
                  ]}
                  onPress={() => handleOriginSelect(origin)}
                >
                  <View style={[styles.originIcon, { backgroundColor: origin.color }]} />
                  <View style={styles.originContent}>
                    <Text style={styles.originTitle}>{origin.title}</Text>
                    <Text style={styles.originDescription}>{origin.description}</Text>
                    <View style={styles.originBonuses}>
                      <Text style={styles.bonusLabel}>STARTING BONUSES:</Text>
                      <Text style={styles.bonusText}>{origin.bonuses}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Footer */}
      <Animated.View 
        style={styles.footer}
        entering={FadeInDown.duration(600).delay(400)}
      >
        <TouchableOpacity
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed() || creating}
        >
          <LinearGradient
            colors={canProceed() ? ['#00D4FF', '#0099CC'] : ['#666666', '#444444']}
            style={styles.buttonGradient}
          >
            <Text style={styles.nextButtonText}>
              {creating ? 'INITIALIZING...' : step === 3 ? 'COMPLETE SETUP' : 'CONTINUE'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {step > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep(step - 1)}
            disabled={creating}
          >
            <Text style={styles.backButtonText}>← PREVIOUS</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 212, 255, 0.3)',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: '#00D4FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    paddingVertical: 30,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },
  stepDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
  genderContainer: {
    gap: 20,
  },
  genderOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  genderOptionSelected: {
    borderColor: '#00D4FF',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    color: '#00D4FF',
  },
  genderLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  genderDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
  },
  nameInputContainer: {
    marginBottom: 40,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00D4FF',
    marginBottom: 12,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    height: 56,
  },
  inputPrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
    marginRight: 8,
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  inputHint: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.6,
    marginTop: 8,
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9D4EDD',
    marginBottom: 16,
    letterSpacing: 1,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(157, 78, 221, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(157, 78, 221, 0.3)',
    gap: 16,
  },
  previewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewAvatarText: {
    fontSize: 24,
    color: '#00D4FF',
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  previewGender: {
    fontSize: 12,
    color: '#9D4EDD',
    fontWeight: '600',
  },
  originContainer: {
    gap: 16,
  },
  originOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  originOptionSelected: {
    borderColor: '#00D4FF',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },
  originIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 4,
  },
  originContent: {
    flex: 1,
  },
  originTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  originDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 12,
  },
  originBonuses: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  bonusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 4,
  },
  bonusText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    gap: 12,
  },
  nextButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  backButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9D4EDD',
  },
});