import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Button } from "react-native-elements";
import { AppContext } from "./AppContext";

// time management techniques with description
const techniques = [
  {
    key: "pomodoro",
    title: "Pomodoro Technique",
    description:
      "Breaks down work into intervals, traditionally 25 minutes in length, separated by short breaks.",
    detailedDescription:
      "The Pomodoro Technique can help individuals develop more efficient work habits. Through effective time management, they can get more done in less time, while achieving a sense of accomplishment and reducing the potential for burnout.",
  },
  {
    key: "eisenhower",
    title: "Eisenhower Matrix",
    description:
      "Prioritizes tasks based on urgency and importance, across four quadrants.",
    detailedDescription:
      "The Eisenhower Matrix is a simple decision-making tool that helps you make the distinction between tasks that are important, not important, urgent, and not urgent. It splits tasks into four boxes that prioritize which tasks you should focus on first and which you should delegate or delete.",
  },
];

const TimeManagementScreen = ({ navigation }) => {
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const { setAppState } = useContext(AppContext); // IMPORTANT
  // shows an alert with the detailed description of a technique
  const handleQuestionPress = (technique) => {
    Alert.alert(technique.title, technique.detailedDescription, [
      { text: "OK" },
    ]);
  };

  // // sets the selected technique and updates global state
  const handleTechniqueSelect = (selectedTechnique) => {
    setSelectedTechnique(selectedTechnique);

    // update the global state
    setAppState((prevState) => ({
      ...prevState,
      timeManagementTechnique: selectedTechnique,
    }));
  };

  // navigates to the next screen if a technique is selected
  const handleNextPress = () => {
    if (selectedTechnique) {
      navigation.navigate("StartTime");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.subHeader}>
          Choose your time management technique
        </Text>

        <View style={styles.techniquesList}>
          {techniques.map((technique) => (
            <TouchableOpacity
              style={[
                styles.techniqueButton,
                selectedTechnique === technique.key &&
                  styles.techniqueButtonSelected,
              ]}
              key={technique.key}
              onPress={() => handleTechniqueSelect(technique.key)}
            >
              <View style={styles.techInfoContainer}>
                <Text style={styles.techTitle}>{technique.title}</Text>
                <Text style={styles.techDescription}>
                  {technique.description}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.questionMark}
                onPress={() => handleQuestionPress(technique)}
              >
                <Text style={styles.questionMarkText}>?</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.moreInfo}>
          Press <Text style={styles.redText}>?</Text> for more information
        </Text>
      </ScrollView>

      <Button
        title="Next"
        buttonStyle={[
          styles.nextButton,
          selectedTechnique
            ? styles.nextButtonActive
            : styles.nextButtonInactive,
        ]}
        onPress={handleNextPress}
        disabled={!selectedTechnique}
        containerStyle={styles.nextButtonContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    marginHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: "#F0F4F8",
  },
  scrollView: {
    flexGrow: 1,
  },
  subHeader: {
    paddingTop: 32,
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
    marginTop: 20,
    color: "#1C2938",
  },
  techniquesList: {
    flex: 1,
  },
  techniqueButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  nextButtonContainer: {
    paddingHorizontal: 10,
  },
  techInfoContainer: {
    flex: 1,
    padding: 10,
  },
  techTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C2938",
  },
  techDescription: {
    fontSize: 14,
    color: "#737480",
  },
  questionMark: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  questionMarkText: {
    fontSize: 16,
    color: "#D32F2F",
  },
  nextButton: {
    minHeight: 45,
    justifyContent: "center",
    backgroundColor: "#34C759",
  },
  nextButtonInactive: {
    backgroundColor: "#A9A9A9",
  },
  nextButtonActive: {
    backgroundColor: "#34C759",
  },
  nextButtonContainer: {
    paddingVertical: 10,
  },
  moreInfo: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1C2938",
    marginTop: 10,
  },
  redText: {
    color: "#D32F2F",
  },
});

export default TimeManagementScreen;
