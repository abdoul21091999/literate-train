import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { TabsParamList } from "../types";
import SearchScreen from "../screens/SearchScreen";
import PublishScreen from "../screens/PublishScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { colors } from "../theme";

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.foreground,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: "SenTrajet",
          tabBarLabel: "Rechercher",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="Publish"
        component={PublishScreen}
        options={{
          title: "Publier",
          tabBarLabel: "Publier",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>➕</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profil",
          tabBarLabel: "Profil",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
