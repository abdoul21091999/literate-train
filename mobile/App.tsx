import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./src/lib/AuthProvider";
import type { RootStackParamList } from "./src/types";
import TabsNavigator from "./src/navigation/TabsNavigator";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import TripDetailScreen from "./src/screens/TripDetailScreen";
import PaymentScreen from "./src/screens/PaymentScreen";
import { colors } from "./src/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    text: colors.foreground,
    primary: colors.brand,
  },
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.foreground,
          }}
        >
          <Stack.Screen
            name="Tabs"
            component={TabsNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Connexion" }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ title: "Inscription" }}
          />
          <Stack.Screen
            name="TripDetail"
            component={TripDetailScreen}
            options={{ title: "Détails du trajet" }}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ title: "Paiement" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
