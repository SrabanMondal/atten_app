import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#191919', 
        tabBarInactiveTintColor: '#424242', 
        tabBarBackground: () => (
          <ImageBackground
            source={require('@/assets/images/tbbg.jpg')}
            style={styles.tabbg}
            resizeMode="cover"
          />
        ),
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Login',
          headerShown:true ,
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={25} color={color} />,
          header: () => (
            <ImageBackground
            source={require('@/assets/images/hbg.jpg')}
                  style={styles.background}
                >
            <Text style={styles.headerText}>Attendance App</Text>
                </ImageBackground>
          
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Attendance',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="check-circle" size={25} color={color} />,
        }}
      />
      
    </Tabs>
  );
}
const styles = StyleSheet.create({
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    padding:10,
  },
  tabbg:{
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    flex:1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    padding:10,
    borderBottomColor:'#191919',
    borderBottomWidth:2,
    shadowColor:'#434343',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'medium',
    color: 'white',
    fontFamily: 'fantasy',
    textShadowColor:'black',
    textDecorationColor: 'black',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 2,
  },
});
