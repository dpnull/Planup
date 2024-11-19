import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppProvider } from "./AppContext";
import AppStack from "./AppStack";

// sets up the navigation container wrapped with the AppProvider for global state management
export default function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);

  useEffect(() => {
    // checks if user is logged in by looking for a token
    const checkLoginStatus = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      setIsUserLoggedIn(!!userToken);
    };

    checkLoginStatus();
  }, []);

  return (
    <AppProvider>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </AppProvider>
  );
}
