import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { router } from 'expo-router';
import { blink } from '@/src/blink/client';

const { width } = Dimensions.get('window');

interface Pilot {
  id: string;
  name: string;
  level: number;
  experience: number;
  credits: number;
  gender: string;
  originStory: string;
}

interface Mech {
  id: string;
  name: string;
  class: string;
  level: number;
  health: number;
  attack: number;
  defense: number;
  speed: number;
}

export default function HomeScreen() {
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [equippedMech, setEquippedMech] = useState<Mech | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(3);

  // Animation values
  const energyPulse = useSharedValue(0.8);
  const mechRotation = useSharedValue(0);

  useEffect(() => {
    // Start animations
    energyPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0.8, { duration: 2000 })
      ),
      -1,
      true
    );

    mechRotation.value = withRepeat(
      withTiming(360, { duration: 20000 }),
      -1,
      false
    );

    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Simulate loading with mock data
      setTimeout(() => {
        setPilot({
          id: 'pilot_1',
          name: 'COMMANDER NOVA',
          level: 5,
          experience: 1250,
          credits: 2500,
          gender: 'female',
          originStory: 'military'
        });

        setEquippedMech({
          id: 'mech_1',
          name: 'MILITARY MK-I',
          class: 'assault',
          level: 3,
          health: 100,
          attack: 65,
          defense: 40,
          speed: 45
        });

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading user data:', error);
      setLoading(false);
    }
  };

  const energyPulseStyle = useAnimatedStyle(() => ({
    opacity: energyPulse.value,
  }));

  const mechRotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${mechRotation.value}deg` }],
  }));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#0A0E1A', '#1A1F2E']}
          style={StyleSheet.absoluteFillObject}
        />
        <Text style={styles.loadingText}>ACCESSING COMMAND BRIDGE...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0E1A', '#1A1F2E', '#0A0E1A']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.duration(600)}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.welcomeText}>WELCOME BACK</Text>
          <Text style={styles.pilotName}>{pilot?.name || 'PILOT'}</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationIcon}>
              <Text style={styles.notificationText}>!</Text>
              {notifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>{notifications}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Panel */}
        <Animated.View 
          style={styles.statusPanel}
          entering={FadeInRight.duration(600).delay(200)}
        >
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>COMMAND STATUS</Text>
            <Animated.View style={[styles.statusIndicator, energyPulseStyle]}>
              <Text style={styles.statusText}>ONLINE</Text>
            </Animated.View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pilot?.level || 1}</Text>
              <Text style={styles.statLabel}>LEVEL</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pilot?.credits || 0}</Text>
              <Text style={styles.statLabel}>CREDITS</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pilot?.experience || 0}</Text>
              <Text style={styles.statLabel}>EXP</Text>
            </View>
          </View>
        </Animated.View>

        {/* Mech Display */}
        <Animated.View 
          style={styles.mechPanel}
          entering={FadeInRight.duration(600).delay(400)}
        >
          <Text style={styles.sectionTitle}>ACTIVE MECH UNIT</Text>
          
          <View style={styles.mechContainer}>
            <View style={styles.mechDisplay}>
              <Animated.View style={[styles.mechIcon, mechRotationStyle]}>
                <Text style={styles.mechIconText}>🤖</Text>
              </Animated.View>
              
              <View style={styles.mechInfo}>
                <Text style={styles.mechName}>{equippedMech?.name || 'NO MECH EQUIPPED'}</Text>
                <Text style={styles.mechClass}>
                  {equippedMech?.class?.toUpperCase() || 'UNKNOWN'} CLASS
                </Text>
                <Text style={styles.mechLevel}>LEVEL {equippedMech?.level || 1}</Text>
              </View>
            </View>

            {equippedMech && (
              <View style={styles.mechStats}>
                <View style={styles.mechStat}>
                  <Text style={styles.mechStatLabel}>HP</Text>
                  <View style={styles.mechStatBar}>
                    <View style={[styles.mechStatFill, { width: '100%', backgroundColor: '#00FF88' }]} />
                  </View>
                  <Text style={styles.mechStatValue}>{equippedMech.health}</Text>
                </View>
                
                <View style={styles.mechStat}>
                  <Text style={styles.mechStatLabel}>ATK</Text>
                  <View style={styles.mechStatBar}>
                    <View style={[styles.mechStatFill, { width: '80%', backgroundColor: '#FF6B35' }]} />
                  </View>
                  <Text style={styles.mechStatValue}>{equippedMech.attack}</Text>
                </View>
                
                <View style={styles.mechStat}>
                  <Text style={styles.mechStatLabel}>DEF</Text>
                  <View style={styles.mechStatBar}>
                    <View style={[styles.mechStatFill, { width: '60%', backgroundColor: '#00D4FF' }]} />
                  </View>
                  <Text style={styles.mechStatValue}>{equippedMech.defense}</Text>
                </View>
                
                <View style={styles.mechStat}>
                  <Text style={styles.mechStatLabel}>SPD</Text>
                  <View style={styles.mechStatBar}>
                    <View style={[styles.mechStatFill, { width: '70%', backgroundColor: '#9D4EDD' }]} />
                  </View>
                  <Text style={styles.mechStatValue}>{equippedMech.speed}</Text>
                </View>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          style={styles.actionsPanel}
          entering={FadeInRight.duration(600).delay(600)}
        >
          <Text style={styles.sectionTitle}>MISSION CONTROL</Text>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/combat')}
            >
              <LinearGradient
                colors={['#FF6B35', '#CC5529']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>⚔️</Text>
                <Text style={styles.actionLabel}>COMBAT</Text>
                <Text style={styles.actionSubtext}>Deploy for missions</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/hangar')}
            >
              <LinearGradient
                colors={['#00D4FF', '#0099CC']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>🔧</Text>
                <Text style={styles.actionLabel}>HANGAR</Text>
                <Text style={styles.actionSubtext}>Manage mechs</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/base')}
            >
              <LinearGradient
                colors={['#9D4EDD', '#7B2CBF']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>🏭</Text>
                <Text style={styles.actionLabel}>BASE</Text>
                <Text style={styles.actionSubtext}>Upgrade facilities</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/summon')}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>✨</Text>
                <Text style={styles.actionLabel}>SUMMON</Text>
                <Text style={styles.actionSubtext}>Recruit units</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Daily Missions */}
        <Animated.View 
          style={styles.dailyPanel}
          entering={FadeInRight.duration(600).delay(800)}
        >
          <Text style={styles.sectionTitle}>DAILY OBJECTIVES</Text>
          
          <View style={styles.dailyList}>
            <View style={styles.dailyItem}>
              <View style={styles.dailyIcon}>
                <Text style={styles.dailyIconText}>✓</Text>
              </View>
              <View style={styles.dailyContent}>
                <Text style={styles.dailyTitle}>Complete 3 Missions</Text>
                <Text style={styles.dailyProgress}>2/3 Complete</Text>
              </View>
              <Text style={styles.dailyReward}>+100 Credits</Text>
            </View>

            <View style={styles.dailyItem}>
              <View style={styles.dailyIcon}>
                <Text style={styles.dailyIconText}>○</Text>
              </View>
              <View style={styles.dailyContent}>
                <Text style={styles.dailyTitle}>Upgrade Mech</Text>
                <Text style={styles.dailyProgress}>0/1 Complete</Text>
              </View>
              <Text style={styles.dailyReward}>+50 XP</Text>
            </View>

            <View style={styles.dailyItem}>
              <View style={styles.dailyIcon}>
                <Text style={styles.dailyIconText}>○</Text>
              </View>
              <View style={styles.dailyContent}>
                <Text style={styles.dailyTitle}>Collect Resources</Text>
                <Text style={styles.dailyProgress}>0/5 Complete</Text>
              </View>
              <Text style={styles.dailyReward}>+Materials</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 212, 255, 0.3)',
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 12,
    color: '#00D4FF',
    fontWeight: '600',
    letterSpacing: 1,
  },
  pilotName: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  notificationText: {
    fontSize: 18,
    color: '#FF6B35',
    fontWeight: '700',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF0066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(157, 78, 221, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9D4EDD',
  },
  settingsIcon: {
    fontSize: 18,
    color: '#9D4EDD',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: 1,
  },
  statusPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  statusIndicator: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00FF88',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00FF88',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#00D4FF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
    fontWeight: '600',
  },
  mechPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(157, 78, 221, 0.3)',
  },
  mechContainer: {
    gap: 20,
  },
  mechDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  mechIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(157, 78, 221, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#9D4EDD',
  },
  mechIconText: {
    fontSize: 36,
  },
  mechInfo: {
    flex: 1,
  },
  mechName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  mechClass: {
    fontSize: 14,
    color: '#9D4EDD',
    fontWeight: '600',
    marginBottom: 2,
  },
  mechLevel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  mechStats: {
    gap: 12,
  },
  mechStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mechStatLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    width: 30,
  },
  mechStatBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  mechStatFill: {
    height: '100%',
    borderRadius: 4,
  },
  mechStatValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    width: 30,
    textAlign: 'right',
  },
  actionsPanel: {
    marginBottom: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: (width - 52) / 2,
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 1,
  },
  actionSubtext: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  dailyPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  dailyList: {
    gap: 16,
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dailyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  dailyIconText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '700',
  },
  dailyContent: {
    flex: 1,
  },
  dailyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  dailyProgress: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  dailyReward: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
  },
});