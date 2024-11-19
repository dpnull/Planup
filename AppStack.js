// AppStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./WelcomeScreen";
import TimeManagementScreen from "./TimeManagementScreen";
import StartTimeScreen from "./StartTimeScreen";
import TodosScreen from "./TodosScreen";
import AuthScreen from "./AuthScreen";
import RegistrationScreen from "./RegistrationScreen";
import ScheduleScreen from "./ScheduleScreen";

const Stack = createStackNavigator();

// sets up the navigation stack for the Planup app
// including screens for authentication, registration, welcome, time management,
// task initialization, todo list management, and schedule viewing.
function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegistrationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TimeManagement"
        component={TimeManagementScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StartTime"
        component={StartTimeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TodosScreen"
        component={TodosScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ScheduleScreen"
        component={ScheduleScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default AppStack;
