import React, { useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "./AppContext";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ProfileModal from "./ProfileModal";

// defines a component to render individual schedule items with completion functionality
const ScheduleItem = ({ item, onCompleteTask, onCompleteSubTask }) => {
  let bgColor;
  let textColor;

  switch (item.priority) {
    case "low":
      bgColor = "#E0E0E0";
      textColor = "#1C2938";
      break;
    case "medium":
      bgColor = "#FFC107";
      textColor = "#1C2938";
      break;
    case "high":
      bgColor = "#FF9800";
      textColor = "#1C2938";
      break;
    case "very_high":
      bgColor = "#FF5722";
      textColor = "#1C2938";
      break;
    default:
      bgColor = "#FFFFFF";
      textColor = "#1C2938";
  }

  // checks if the provided time is valid
  const isValidTime = (time) => time !== "NaN:NaN";

  return (
    <View style={[styles.item, { backgroundColor: bgColor }]}>
      <View style={styles.itemContentContainer}>
        <View style={styles.itemTextContainer}>
          <Text style={[styles.itemHeader, { color: textColor }]}>
            {item.taskName}
            {isValidTime(item.startTime) && (
              <Text style={styles.taskTimeText}> at {item.startTime}</Text>
            )}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => onCompleteTask(item)}
        >
          <Icon name="check-circle" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      {item.subTasks && item.subTasks.length > 0 && (
        <>
          <Text style={styles.subTaskHeader}>Sub-tasks:</Text>
          {item.subTasks.map((subTask, index) => (
            <View key={index} style={styles.subTaskContainer}>
              <View
                style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
              >
                <Text style={styles.subTaskText}>{subTask.name}</Text>
                <Text style={styles.subTaskDuration}>
                  {" "}
                  - {subTask.duration} mins
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => onCompleteSubTask(item, subTask)}
              >
                <Icon name="check-circle" size={24} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}
    </View>
  );
};

// displays the user's schedule
const ScheduleScreen = ({ navigation }) => {
  const { scheduleData, setScheduleData } = useContext(AppContext);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  console.log("Schedule Data:", scheduleData);

  // logs out the user and navigates to the auth screen
  const logout = async () => {
    await AsyncStorage.removeItem("userToken"); // using userToken to handle login status
    navigation.navigate("Auth");
    setIsProfileModalVisible(false);
  };

  const openProfileModal = () => {
    setIsProfileModalVisible(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalVisible(false);
  };

  // navigates to the welcome screen to allow the user to create a new schedule
  const createNewSchedule = () => {
    navigation.navigate("Welcome");
  };

  // parses the schedule data from JSON string to an array
  let parsedSchedule = [];
  parsedSchedule = JSON.parse(scheduleData.schedule).schedule;

  // filter out the task with a matching taskName from parsedSchedule
  // then update GLOBAL STATE with the new list
  // marks a task as complete and updates the global schedule state
  const handleCompleteTask = (completedTask) => {
    const updatedSchedule = parsedSchedule.filter(
      (task) => task.taskName !== completedTask.taskName
    );
    setScheduleData({
      ...scheduleData,
      schedule: JSON.stringify({ schedule: updatedSchedule }),
    });
  };

  // marks a sub-task as complete and updates the global schedule state
  const handleCompleteSubTask = (parentTask, completedSubTask) => {
    // UPDATE GLOBAL STATE TOO
    // update parent task and refresh global schedule state
    const updatedSchedule = parsedSchedule.map((task) => {
      if (task.taskName === parentTask.taskName) {
        const updatedSubTasks = task.subTasks.filter(
          (subTask) => subTask.name !== completedSubTask.name
        );
        return { ...task, subTasks: updatedSubTasks };
      }
      return task;
    });
    setScheduleData({
      ...scheduleData,
      schedule: JSON.stringify({ schedule: updatedSchedule }),
    });
  };

  const renderScheduleItem = ({ item }) => (
    <ScheduleItem
      item={item}
      onCompleteTask={handleCompleteTask}
      onCompleteSubTask={handleCompleteSubTask}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Schedule</Text>
      {parsedSchedule.length === 0 ? (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>
            No schedule data available. Please generate a schedule first.
          </Text>
        </View>
      ) : (
        <FlatList
          data={parsedSchedule}
          renderItem={renderScheduleItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={createNewSchedule}
        >
          <Icon name="event" size={24} color="#1C2938" />
          <Text style={styles.footerButtonText}>New Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={openProfileModal}
        >
          <Icon name="person" size={24} color="#1C2938" />
          <Text style={styles.footerButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
      <ProfileModal
        isVisible={isProfileModalVisible}
        onClose={closeProfileModal}
        onLogout={logout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F4F8",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C2938",
    marginBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListText: {
    fontSize: 18,
    color: "#8A9BA8",
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "#FFFFFF",
  },
  itemContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1C2938",
  },
  taskTimeText: {
    fontSize: 14,
    color: "#0E2144",
  },
  subTaskHeader: {
    fontSize: 14,
    color: "#3A4750",
    marginTop: 10,
    marginBottom: 5,
  },
  subTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    paddingHorizontal: 20,
  },
  subTaskText: {
    fontSize: 14,
    color: "#0E2144",
  },
  completeButton: {
    padding: 5,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#8A9BA8",
  },
  footerButton: {
    alignItems: "center",
  },
  footerButtonText: {
    fontSize: 12,
    color: "#1C2938",
    marginTop: 5,
  },
  subTaskDuration: {
    fontSize: 14,
    color: "#0E2144",
    marginLeft: 5, // Adjust spacing between name and duration
  },
});

export default ScheduleScreen;
