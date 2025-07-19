import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { createClient } from '@blinkdotnew/sdk';

const blink = createClient({
  projectId: 'mech-destiny-rpg-1xj4isn4',
  authRequired: true
});

export default function RootLayout() {
  useFrameworkReady();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user);
      setLoading(state.isLoading);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0E1A', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#00D4FF', fontSize: 18, fontFamily: 'monospace' }}>
          INITIALIZING MECH SYSTEMS...
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="character-creation" />
        <Stack.Screen name="home" />
        <Stack.Screen name="base" />
        <Stack.Screen name="mechs" />
        <Stack.Screen name="combat" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" backgroundColor="#0A0E1A" />
    </>
  );
}