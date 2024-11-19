import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Button } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AppContext } from "./AppContext";

const StartTimeScreen = ({ navigation }) => {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const { setAppState } = useContext(AppContext);

  // called when user changes time in date time picker
  // when the user picks a time
  const handleChangeTime = (event, selectedDate) => {
    const currentTime = selectedDate || selectedTime;
    setSelectedTime(currentTime);
    setAppState((prevState) => ({
      ...prevState,
      startTime: currentTime.toISOString(),
    }));
  };

  const handleNextPress = () => {
    navigation.navigate("TodosScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subHeader}>
        What time do you wish to start your day?
      </Text>
      <DateTimePicker
        value={selectedTime}
        mode="time"
        display="spinner"
        onChange={handleChangeTime}
      />
      <Button
        title="Next"
        buttonStyle={styles.nextButton}
        onPress={handleNextPress}
        containerStyle={styles.nextButtonContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#F0F4F8",
    padding: 16,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#1C2938",
  },
  nextButton: {
    minHeight: 45,
    justifyContent: "center",
    backgroundColor: "#34C759",
  },
  nextButtonContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});

export default StartTimeScreen;
