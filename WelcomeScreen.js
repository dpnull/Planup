// components and hooks
import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "react-native-elements";
// for managing global state
import { AppContext } from "./AppContext";

// defines the WelcomeScreen omponent with navigation prop passed for navigating between screens
const WelcomeScreen = ({ navigation }) => {
  // manage selection state, starts with no option chosen
  const [selectedOption, setSelectedOption] = useState(null);
  // !!USE THIS!! to access and set global states
  const { setAppState } = useContext(AppContext);

  // array of options for the user to select their purpose of using the app
  const options = [
    { key: "studying", text: "Studying" },
    { key: "workLifeBalance", text: "Work-life balance" },
    { key: "selfImprovement", text: "Self-improvement" },
  ];

  // handles option selection
  const optionSelect = (key) => {
    setSelectedOption(key); // Set local state

    setAppState((prevState) => ({
      // keep other state values unaltered
      ...prevState,
      purpose: options.find((o) => o.key === key), // find and sel by key
    }));
  };

  // handle pressing the 'Next' button
  const handleNextPress = () => {
    if (selectedOption) {
      navigation.navigate("TimeManagement");
    }
  };

  // render the UI
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          Welcome to <Text style={styles.greenText}>Planup!</Text>
        </Text>
      </View>

      <View style={styles.subHeaderContainer}>
        <Text style={styles.subHeader}>
          What do you want to use the app for?
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOption === option.key && styles.optionButtonSelected,
            ]}
            key={option.key}
            onPress={() => optionSelect(option.key)}
          >
            <Text style={styles.optionText}>{option.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footerContainer}>
        <Button
          title="Next"
          buttonStyle={[
            styles.nextButton,
            selectedOption
              ? styles.nextButtonActive
              : styles.nextButtonInactive,
          ]}
          onPress={handleNextPress}
          disabled={!selectedOption}
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
  subHeader: {
    fontSize: 18,
    textAlign: "center",
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  optionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: "#C8E6C9",
  },
  optionText: {
    fontSize: 16,
  },
  footerContainer: {
    paddingBottom: 16,
  },
  nextButton: {
    minHeight: 45,
    justifyContent: "center",
  },
  nextButtonInactive: {
    backgroundColor: "#A9A9A9",
  },
  nextButtonActive: {
    backgroundColor: "#34C759",
  },
});

export default WelcomeScreen;
