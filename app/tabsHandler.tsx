import Ionicons from '@react-native-vector-icons/ionicons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Feed from './tabs/feed/Feed';
import Map from './tabs/map/Map';
import Profile from './tabs/profile/Profile';
import Snap from './tabs/snap/Snap';
import Welfare from './tabs/welfare/Welfare';

const FeedPage = () => {
  return <Feed/>;
}

const MapPage = () => {
  return <Map/>;
}

const SnapPage = () => {
  return <Snap/>;
}

const WelfarePage = () => {
  return <Welfare/>;
}

const ProfilePage = () => {
  return <Profile/>;
}

const COLORS = {
  primary: '#FF6B35',
  inactive: '#1A1A1A',
  background: '#FFFFFF',
  border: '#1A1A1A',
};

const Tab = createBottomTabNavigator();

const CustomFloatingButton = ({ children, onPress, style }: any) => (
  <View style={style}>
    <TouchableOpacity
      style={styles.floatingButtonWrapper}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.floatingButton}>
        {children}
      </View>
    </TouchableOpacity>
  </View>
);

const TabsHandler = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: 'rgba(26, 26, 26, 0.7)',
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any = "help-circle-outline"; 

            if (route.name === "Map") {
              iconName = focused ? "map" : "map-outline";
            } else if (route.name === "Feed") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Welfare") {
              iconName = focused ? "chatbubbles" : "chatbubbles-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            } 

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Feed" options={{ headerTitle: '' }} component={FeedPage} />
        <Tab.Screen name="Map" options={{ headerTitle: '' }} component={MapPage} />

        <Tab.Screen 
          name="Snap" 
          component={SnapPage}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={{ fontSize: 10, color: '#000000'}}>
                Snap
              </Text>
            ),
            tabBarIcon: () => (
              <Ionicons name="camera" size={28} color="#FFFFFF" />
            ),
            tabBarButton: (props) => (
              <CustomFloatingButton {...props} />
            )
          }} 
        />
        
        <Tab.Screen name="Welfare" options={{ headerTitle: '', tabBarLabel: 'Chat' }} component={WelfarePage} />
        <Tab.Screen name="Profile" options={{ headerTitle: '' }} component={ProfilePage} />
      </Tab.Navigator>
    </>
  );
}

export default TabsHandler;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.background,
    borderTopColor: COLORS.border, 
    borderTopWidth: 2,
    elevation: 10,
    shadowOpacity: 0.1,
    height: 65, 
    paddingBottom: 5,
  },
  floatingButtonWrapper: {
    top: -20, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8, 
  }
});
