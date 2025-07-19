import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { router } from 'expo-router';
import { blink } from '@/src/blink/client';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Animation values
  const titleGlow = useSharedValue(0.5);
  const logoScale = useSharedValue(1);

  useEffect(() => {
    // Start animations
    titleGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0.5, { duration: 2000 })
      ),
      -1,
      true
    );

    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 3000 }),
        withTiming(1, { duration: 3000 })
      ),
      -1,
      true
    );

    // Simple loading simulation
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleStartGame = () => {
    router.push('/character-creation');
  };

  const titleGlowStyle = useAnimatedStyle(() => ({
    opacity: titleGlow.value,
  }));

  const logoScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#0A0E1A', '#1A1F2E']}
          style={StyleSheet.absoluteFillObject}
        />
        <Text style={styles.loadingText}>INITIALIZING NEURAL LINK...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0E1A', '#1A1F2E', '#0A0E1A']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Background Effects */}
      <View style={styles.backgroundEffects}>
        {[...Array(20)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.star,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                opacity: Math.random() * 0.8 + 0.2,
              }
            ]}
            entering={FadeInUp.duration(2000).delay(i * 100)}
          />
        ))}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo/Title Section */}
        <Animated.View 
          style={[styles.logoContainer, logoScaleStyle]}
          entering={FadeInDown.duration(1000)}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>MD</Text>
          </View>
          
          <Animated.View style={titleGlowStyle}>
            <Text style={styles.title}>MECH DESTINY</Text>
          </Animated.View>
          
          <Text style={styles.subtitle}>POST-APOCALYPTIC RPG</Text>
        </Animated.View>

        {/* Story Introduction */}
        <Animated.View 
          style={styles.storyContainer}
          entering={FadeInUp.duration(1000).delay(500)}
        >
          <Text style={styles.storyText}>
            In the year 2157, humanity's last hope lies in the hands of elite mech pilots.
            The world has been shattered by the Great Collapse, and only those brave enough
            to pilot the ancient war machines can reclaim our future.
          </Text>
          
          <View style={styles.factionContainer}>
            <Text style={styles.factionTitle}>Choose Your Destiny</Text>
            <View style={styles.factionList}>
              <View style={styles.factionItem}>
                <View style={[styles.factionIcon, { backgroundColor: '#00D4FF' }]} />
                <Text style={styles.factionName}>AZURE COALITION</Text>
              </View>
              <View style={styles.factionItem}>
                <View style={[styles.factionIcon, { backgroundColor: '#FF6B35' }]} />
                <Text style={styles.factionName}>CRIMSON LEGION</Text>
              </View>
              <View style={styles.factionItem}>
                <View style={[styles.factionIcon, { backgroundColor: '#9D4EDD' }]} />
                <Text style={styles.factionName}>VOID SYNDICATE</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View 
          style={styles.buttonContainer}
          entering={FadeInUp.duration(1000).delay(1000)}
        >
          <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
            <LinearGradient
              colors={['#00D4FF', '#0099CC']}
              style={styles.buttonGradient}
            >
              <Text style={styles.startButtonText}>BEGIN MISSION</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.secondaryButtonText}>CONTINUE EXISTING SAVE</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Version Info */}
        <Animated.View 
          style={styles.versionContainer}
          entering={FadeInUp.duration(1000).delay(1500)}
        >
          <Text style={styles.versionText}>NEURAL INTERFACE v2.157.3</Text>
          <Text style={styles.versionSubtext}>QUANTUM ENCRYPTION ENABLED</Text>
        </Animated.View>
      </View>

      {/* Ambient Particles */}
      <View style={styles.particleContainer}>
        {[...Array(10)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: Math.random() * width,
                top: Math.random() * height,
              }
            ]}
            entering={FadeInUp.duration(3000).delay(i * 200)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#00D4FF',
    fontSize: 18,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  backgroundEffects: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#00D4FF',
    borderRadius: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    borderWidth: 3,
    borderColor: '#00D4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#00D4FF',
    letterSpacing: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 8,
    textShadowColor: '#00D4FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
    textAlign: 'center',
    letterSpacing: 2,
  },
  storyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(157, 78, 221, 0.3)',
  },
  storyText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  factionContainer: {
    alignItems: 'center',
  },
  factionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9D4EDD',
    marginBottom: 16,
    letterSpacing: 1,
  },
  factionList: {
    gap: 12,
  },
  factionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  factionIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  factionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.8,
    letterSpacing: 1,
  },
  buttonContainer: {
    gap: 16,
  },
  startButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  secondaryButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9D4EDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9D4EDD',
    letterSpacing: 1,
  },
  versionContainer: {
    alignItems: 'center',
    gap: 4,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00D4FF',
    opacity: 0.7,
    letterSpacing: 1,
  },
  versionSubtext: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.5,
    letterSpacing: 1,
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
    opacity: 0.6,
  },
});