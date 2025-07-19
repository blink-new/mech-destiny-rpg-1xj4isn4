import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';
import { blink } from '@/src/blink/client';

const { width } = Dimensions.get('window');

interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  rewards: string;
  isCompleted: boolean;
}

const difficultyColors: { [key: string]: string } = {
  easy: '#00FF88',
  medium: '#FFD700',
  hard: '#FF6B35',
  extreme: '#FF0066',
};

const sampleMissions = [
  {
    id: 'mission_1',
    title: 'Wasteland Patrol',
    description: 'Clear hostile mechs from the northern sector',
    difficulty: 'easy',
    rewards: '100 Credits, 50 XP',
    isCompleted: false,
  },
  {
    id: 'mission_2',
    title: 'Supply Convoy Escort',
    description: 'Protect supply convoy through dangerous territory',
    difficulty: 'medium',
    rewards: '250 Credits, 100 XP, Materials',
    isCompleted: false,
  },
  {
    id: 'mission_3',
    title: 'Faction Stronghold Assault',
    description: 'Infiltrate and destroy enemy command center',
    difficulty: 'hard',
    rewards: '500 Credits, 200 XP, Rare Equipment',
    isCompleted: false,
  },
  {
    id: 'mission_4',
    title: 'Ancient Titan Awakening',
    description: 'Face the legendary mech from the old world',
    difficulty: 'extreme',
    rewards: '1000 Credits, 500 XP, Legendary Mech',
    isCompleted: false,
  },
];

export default function CombatScreen() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [inCombat, setInCombat] = useState(false);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  
  // Animation values
  const missionScale = useSharedValue(1);
  const combatOpacity = useSharedValue(0);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      const user = await blink.auth.me();
      
      // Check if user has missions, if not create sample missions
      const existingMissions = await blink.db.missions.list({
        where: { userId: user.id },
      });

      if (existingMissions.length === 0) {
        // Create sample missions
        for (const mission of sampleMissions) {
          await blink.db.missions.create({
            id: `${mission.id}_${Date.now()}`,
            userId: user.id,
            title: mission.title,
            description: mission.description,
            difficulty: mission.difficulty,
            rewards: mission.rewards,
            isCompleted: false,
            createdAt: new Date().toISOString()
          });
        }
      }

      // Load all missions
      const allMissions = await blink.db.missions.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' }
      });

      setMissions(allMissions);
    } catch (error) {
      console.error('Error loading missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMissionSelect = (mission: Mission) => {
    setSelectedMission(mission);
    missionScale.value = withSpring(1.05, {}, () => {
      missionScale.value = withSpring(1);
    });
  };

  const handleStartCombat = () => {
    if (!selectedMission) return;
    
    setInCombat(true);
    setCombatLog([]);
    combatOpacity.value = withTiming(1, { duration: 500 });
    
    // Simulate combat sequence
    simulateCombat();
  };

  const simulateCombat = () => {
    const combatSequence = [
      'NEURAL LINK ESTABLISHED',
      'MECH SYSTEMS ONLINE',
      'ENEMY CONTACTS DETECTED',
      'ENGAGING HOSTILE TARGETS',
      'WEAPONS SYSTEMS ACTIVATED',
      'TAKING DAMAGE - SHIELDS AT 75%',
      'COUNTER-ATTACK SUCCESSFUL',
      'ENEMY MECH DESTROYED',
      'MISSION OBJECTIVES COMPLETE',
      'RETURNING TO BASE',
    ];

    combatSequence.forEach((message, index) => {
      setTimeout(() => {
        setCombatLog(prev => [...prev, message]);
        
        if (index === combatSequence.length - 1) {
          setTimeout(() => {
            completeMission();
          }, 1000);
        }
      }, index * 1000);
    });
  };

  const completeMission = async () => {
    if (!selectedMission) return;

    try {
      // Mark mission as completed
      await blink.db.missions.update(selectedMission.id, {
        isCompleted: true,
        completedAt: new Date().toISOString()
      });

      // Award rewards (simplified)
      const user = await blink.auth.me();
      const pilots = await blink.db.pilots.list({
        where: { userId: user.id },
        limit: 1
      });

      if (pilots.length > 0) {
        const pilot = pilots[0];
        const rewardCredits = selectedMission.difficulty === 'easy' ? 100 :
                            selectedMission.difficulty === 'medium' ? 250 :
                            selectedMission.difficulty === 'hard' ? 500 : 1000;
        
        await blink.db.pilots.update(pilot.id, {
          credits: pilot.credits + rewardCredits,
          experience: pilot.experience + (rewardCredits / 2)
        });
      }

      // Reset combat state
      setInCombat(false);
      combatOpacity.value = withTiming(0, { duration: 500 });
      setSelectedMission(null);
      
      // Reload missions
      loadMissions();
    } catch (error) {
      console.error('Error completing mission:', error);
    }
  };

  const missionAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: missionScale.value }],
  }));

  const combatAnimatedStyle = useAnimatedStyle(() => ({
    opacity: combatOpacity.value,
  }));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>ACCESSING MISSION CONTROL...</Text>
      </View>
    );
  }

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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MISSION CONTROL</Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      {/* Combat Overlay */}
      {inCombat && (
        <Animated.View style={[styles.combatOverlay, combatAnimatedStyle]}>
          <View style={styles.combatContainer}>
            <Text style={styles.combatTitle}>COMBAT IN PROGRESS</Text>
            <ScrollView style={styles.combatLogContainer} showsVerticalScrollIndicator={false}>
              {combatLog.map((message, index) => (
                <Animated.Text
                  key={index}
                  style={styles.combatLogText}
                  entering={FadeInRight.duration(300).delay(index * 100)}
                >
                  &gt; {message}
                </Animated.Text>
              ))}
            </ScrollView>
          </View>
        </Animated.View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mission Briefing */}
        <Animated.View 
          style={styles.briefingContainer}
          entering={FadeInRight.duration(600).delay(200)}
        >
          <Text style={styles.sectionTitle}>MISSION BRIEFING</Text>
          <View style={styles.briefingCard}>
            <Text style={styles.briefingText}>
              Commander, multiple hostile contacts have been detected across various sectors. 
              Your mech is needed to neutralize these threats and secure our territory.
            </Text>
            <View style={styles.briefingStats}>
              <View style={styles.briefingStat}>
                <Text style={styles.briefingStatValue}>
                  {missions.filter(m => Number(m.isCompleted) > 0).length}
                </Text>
                <Text style={styles.briefingStatLabel}>COMPLETED</Text>
              </View>
              <View style={styles.briefingStat}>
                <Text style={styles.briefingStatValue}>
                  {missions.filter(m => Number(m.isCompleted) === 0).length}
                </Text>
                <Text style={styles.briefingStatLabel}>AVAILABLE</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Available Missions */}
        <Animated.View 
          style={styles.missionsContainer}
          entering={FadeInRight.duration(600).delay(400)}
        >
          <Text style={styles.sectionTitle}>AVAILABLE MISSIONS</Text>
          <View style={styles.missionsList}>
            {missions.filter(m => Number(m.isCompleted) === 0).map((mission) => (
              <TouchableOpacity
                key={mission.id}
                style={[
                  styles.missionCard,
                  selectedMission?.id === mission.id && styles.selectedMissionCard
                ]}
                onPress={() => handleMissionSelect(mission)}
              >
                <View style={styles.missionHeader}>
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <View style={[styles.difficultyBadge, { backgroundColor: difficultyColors[mission.difficulty] }]}>
                    <Text style={styles.difficultyText}>{mission.difficulty.toUpperCase()}</Text>
                  </View>
                </View>
                
                <Text style={styles.missionDescription}>{mission.description}</Text>
                
                <View style={styles.missionRewards}>
                  <Text style={styles.rewardsLabel}>REWARDS:</Text>
                  <Text style={styles.rewardsText}>{mission.rewards}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Selected Mission Details */}
        {selectedMission && (
          <Animated.View 
            style={[styles.selectedMissionContainer, missionAnimatedStyle]}
            entering={FadeInRight.duration(600).delay(600)}
          >
            <Text style={styles.sectionTitle}>MISSION DETAILS</Text>
            <View style={styles.selectedMissionCard}>
              <View style={styles.selectedMissionHeader}>
                <Text style={styles.selectedMissionTitle}>{selectedMission.title}</Text>
                <View style={[styles.selectedDifficultyBadge, { backgroundColor: difficultyColors[selectedMission.difficulty] }]}>
                  <Text style={styles.selectedDifficultyText}>
                    {selectedMission.difficulty.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.selectedMissionDescription}>
                {selectedMission.description}
              </Text>

              <View style={styles.missionObjectives}>
                <Text style={styles.objectivesTitle}>OBJECTIVES:</Text>
                <Text style={styles.objectiveText}>• Eliminate all hostile targets</Text>
                <Text style={styles.objectiveText}>• Secure mission area</Text>
                <Text style={styles.objectiveText}>• Return to base safely</Text>
              </View>

              <View style={styles.selectedRewards}>
                <Text style={styles.selectedRewardsLabel}>MISSION REWARDS:</Text>
                <Text style={styles.selectedRewardsText}>{selectedMission.rewards}</Text>
              </View>

              <TouchableOpacity style={styles.deployButton} onPress={handleStartCombat}>
                <LinearGradient
                  colors={['#FF6B35', '#CC5529']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.deployButtonText}>DEPLOY MECH</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Completed Missions */}
        {missions.filter(m => Number(m.isCompleted) > 0).length > 0 && (
          <Animated.View 
            style={styles.completedContainer}
            entering={FadeInRight.duration(600).delay(800)}
          >
            <Text style={styles.sectionTitle}>COMPLETED MISSIONS</Text>
            <View style={styles.completedList}>
              {missions.filter(m => Number(m.isCompleted) > 0).map((mission) => (
                <View key={mission.id} style={styles.completedMissionCard}>
                  <Text style={styles.completedMissionTitle}>{mission.title}</Text>
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>COMPLETED</Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        )}
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
    backgroundColor: '#0A0E1A',
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
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 212, 255, 0.3)',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#00D4FF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 2,
  },
  headerSpacer: {
    width: 60,
  },
  combatOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  combatContainer: {
    width: width * 0.9,
    height: '60%',
    backgroundColor: '#0A0E1A',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B35',
    padding: 20,
  },
  combatTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 2,
  },
  combatLogContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
  },
  combatLogText: {
    fontSize: 14,
    color: '#00D4FF',
    fontFamily: 'monospace',
    marginBottom: 8,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    marginTop: 20,
    letterSpacing: 1,
  },
  briefingContainer: {
    marginBottom: 20,
  },
  briefingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(157, 78, 221, 0.3)',
  },
  briefingText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 16,
  },
  briefingStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  briefingStat: {
    alignItems: 'center',
  },
  briefingStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#9D4EDD',
    marginBottom: 4,
  },
  briefingStatLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  missionsContainer: {
    marginBottom: 20,
  },
  missionsList: {
    gap: 16,
  },
  missionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedMissionCard: {
    borderColor: '#00D4FF',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
  },
  missionDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 12,
    lineHeight: 20,
  },
  missionRewards: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
  },
  rewardsText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  selectedMissionContainer: {
    marginBottom: 20,
  },
  selectedMissionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#00D4FF',
  },
  selectedMissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedMissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  selectedDifficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  selectedDifficultyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  selectedMissionDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 20,
    lineHeight: 20,
  },
  missionObjectives: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  objectivesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
    marginBottom: 12,
  },
  objectiveText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  selectedRewards: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  selectedRewardsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },
  selectedRewardsText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  deployButton: {
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deployButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  completedContainer: {
    marginBottom: 40,
  },
  completedList: {
    gap: 12,
  },
  completedMissionCard: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
  },
  completedMissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  completedBadge: {
    backgroundColor: '#00FF88',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
  },
});