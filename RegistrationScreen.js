// RegistrationScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

const RegistrationScreen = ({ navigation }) => {
  // state hooks for form inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // input validation feedback for username, email, and password fields
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  // handle the user registration process
  const handleRegister = async () => {
    const response = await fetch("http://localhost:3000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      // any error is possible
      alert(data.msg || "An error occurred during registration");
    } else {
      alert("Registration successful");
      navigation.navigate("Welcome");
    }
  };
  // validate the input fields
  const validateInput = () => {
    let isValid = true;
    let errors = { username: "", email: "", password: "" };

    // provided by ChatGPT
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const usernameRegex = /^[a-z]+$/;

    if (!emailRegex.test(email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    if (!passwordRegex.test(password)) {
      errors.password =
        "Password must be minimum 8 characters long, contain a number, and a capital letter";
      isValid = false;
    }

    if (!usernameRegex.test(username)) {
      errors.username = "Username can only contain lowercase letters";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
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
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        {errors.username !== "" && (
          <Text style={styles.errorText}>{errors.username}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {errors.email !== "" && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.password !== "" && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      <View style={styles.footerContainer}>
        <Button
          title="Register"
          buttonStyle={styles.registerButton}
          onPress={() => {
            if (validateInput()) {
              handleRegister();
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#F0F4F8",
    paddingHorizontal: 16,
  },
  headerContainer: {
    paddingTop: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C2938",
    textAlign: "center",
  },
  greenText: {
    color: "#34C759",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    color: "#1C2938",
  },
  errorText: {
    marginBottom: 10,
    color: "#D32F2F",
  },
  footerContainer: {
    paddingBottom: 16,
  },
  registerButton: {
    minHeight: 45,
    justifyContent: "center",
    backgroundColor: "#34C759",
  },
});

export default RegistrationScreen;
