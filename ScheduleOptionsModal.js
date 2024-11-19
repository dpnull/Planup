import React from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Button } from "react-native-elements";

// displays schedule options in a modal used in TodosScreen
const ScheduleOptionsModal = ({
  isVisible,
  onClose,
  onContinue,
  options,
  setOptions,
}) => {
  const toggleOption = (key) => {
    setOptions((prevState) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        selected: !prevState[key].selected,
      },
    }));
  };

  // gets the style of an option based on its selection state
  const getOptionStyle = (isSelected) => ({
    backgroundColor: isSelected ? "#007AFF" : "#E5E5E5",
    ...styles.option,
  });

  // show an alert with the description of an option
  const showDescription = (title, description) => {
    Alert.alert(title, description, [{ text: "OK" }]);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Customize your schedule generation
          </Text>
          {Object.entries(options).map(([key, value]) => (
            <View key={key} style={getOptionStyle(value.selected)}>
              <TouchableOpacity
                style={styles.optionTouchable}
                onPress={() => toggleOption(key)}
              >
                <Text>{value.text}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                // pass title and desc
                onPress={() => showDescription(value.text, value.description)}
              >
                <Text style={styles.questionMark}>?</Text>
              </TouchableOpacity>
            </View>
          ))}
          <Button title="Continue" onPress={onContinue} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    color: "#1C2938",
    marginBottom: 15,
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#F0F4F8",
    borderColor: "#E5E5E5",
    borderWidth: 1,
  },
  optionTouchable: {
    flex: 1,
  },
  questionMark: {
    marginLeft: 10,
    fontSize: 18,
    color: "#007AFF",
  },
});

export default ScheduleOptionsModal;
