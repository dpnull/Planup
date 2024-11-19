// AuthScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // handles user login by sending a POST request to the server
  const handleLogin = async () => {
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    // store to asyncStorage
    const data = await response.json();
    if (response.ok) {
      await AsyncStorage.setItem("userToken", data.token);
      navigation.navigate("Welcome");
    } else {
      alert(data.message || "Login failed");
    }
  };

  // navigate to the register screen
  const handleGoToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          Welcome to <Text style={styles.greenText}>Planup!</Text>
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.footerContainer}>
        <Button
          title="Login"
          buttonStyle={styles.authButton}
          onPress={handleLogin}
        />
        <Button
          title="Register"
          buttonStyle={styles.authButton}
          onPress={handleGoToRegister}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  headerContainer: {
    paddingTop: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  greenText: {
    color: "darkgreen",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  footerContainer: {
    paddingBottom: 16,
  },
  authButton: {
    minHeight: 45,
    justifyContent: "center",
    marginBottom: 10,
  },
});

export default AuthScreen;
