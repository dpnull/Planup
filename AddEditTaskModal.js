import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddEditTaskModal = ({ isVisible, onClose, onSubmit, task }) => {
  const [taskName, setTaskName] = useState("");
  const [subTasks, setSubTasks] = useState([]);
  const [taskPriority, setTaskPriority] = useState("medium");
  const [isTimeSpecified, setIsTimeSpecified] = useState(false);
  const [taskTime, setTaskTime] = useState(new Date());

  // useEffect for logging purposes
  useEffect(() => {
    console.log("AddEditTaskModal Props:", { isVisible, task });
  }, [isVisible, task]);

  useEffect(() => {
    if (isVisible && task) {
      setTaskName(task.taskName || "");
      setSubTasks(task.subTasks || []);
      setTaskPriority(task.priority || "medium");

      const timeWasSpecified = task.taskTime && task.taskTime !== "flex";
      setIsTimeSpecified(timeWasSpecified);

      // If a specific time was set parse it into a date object
      // else leave it as the default
      setTaskTime(timeWasSpecified ? new Date(task.taskTime) : new Date());
    } else {
      // resetting the form when closing the modal or when it's used for adding a new task
      setTaskName("");
      setSubTasks([]);
      setTaskPriority("medium");
      setIsTimeSpecified(false);
      setTaskTime(new Date());
    }
  }, [isVisible, task]);

  // handles task priority selection
  const handlePrioritySelect = (priority) => {
    setTaskPriority(priority);
  };

  // toggles whether time is specified for the task
  const toggleTimeSpecified = () => {
    setIsTimeSpecified(!isTimeSpecified);
    if (!isTimeSpecified) {
      // initialise with 8:00 AM
      const defaultTime = new Date();
      defaultTime.setHours(8, 0, 0, 0);
      setTaskTime(defaultTime);
    }
  };

  // handles adding or editing the task
  const handleAddEditTask = () => {
    if (taskName.trim()) {
      const newTask = {
        id: task ? task.id : Date.now().toString(),
        taskName,
        subTasks,
        priority: taskPriority,
        taskTime: isTimeSpecified ? taskTime.toISOString() : "flex", // Saving as ISO string for consistency
      };

      onSubmit(newTask);
      onClose();
    }
  };

  // adds a new subtask to the list
  const addSubTask = () => {
    setSubTasks([...subTasks, { id: Date.now().toString(), name: "" }]);
  };

  // deletes a subtask from the list
  const deleteSubTask = (id) => {
    setSubTasks(subTasks.filter((subTask) => subTask.id !== id));
  };

  // handles changing the subtask name
  const handleSubTaskNameChange = (id, name) => {
    const updatedSubTasks = subTasks.map((subTask) => {
      if (subTask.id === id) {
        return { ...subTask, name };
      }
      return subTask;
    });
    setSubTasks(updatedSubTasks);
  };

  // input view
  const renderSubTask = (subTask) => (
    <View key={subTask.id} style={styles.subTaskContainer}>
      <TextInput
        style={styles.subTaskInput}
        placeholder="Sub-task name"
        value={subTask.name}
        onChangeText={(name) => handleSubTaskNameChange(subTask.id, name)}
      />
      <TouchableOpacity onPress={() => deleteSubTask(subTask.id)}>
        <Icon name="minus" type="font-awesome" />
      </TouchableOpacity>
    </View>
  );

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
            {task ? "Edit your task" : "Add a new task"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Task Name"
            value={taskName}
            onChangeText={setTaskName}
            maxLength={32}
          />

          <View style={styles.subTaskHeaderContainer}>
            <Text style={styles.subTaskHeader}>Sub-Tasks:</Text>
            <TouchableOpacity onPress={addSubTask}>
              <Icon name="plus" type="font-awesome" color="#007AFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.subTaskScrollView}>
            {subTasks.map(renderSubTask)}
          </ScrollView>

          <View style={styles.specifyTimeSection}>
            <View style={styles.specifyTimeLabelSwitchContainer}>
              <Text style={styles.specifyTimeText}>Specify time:</Text>
              <Switch
                style={styles.specifyTimeSwitch}
                value={isTimeSpecified}
                onValueChange={toggleTimeSpecified}
                trackColor={{ false: "#8A9BA8", true: "#007AFF" }}
              />
            </View>
            {isTimeSpecified && (
              <DateTimePicker
                style={styles.timePicker}
                mode="time"
                display="default"
                value={taskTime}
                onChange={(event, selectedTime) => {
                  const newTime = selectedTime || taskTime;
                  setTaskTime(newTime);
                }}
                textColor="#1C2938"
              />
            )}
          </View>

          <Text style={styles.priorityHeader}>Priority:</Text>
          <View style={styles.priorityContainer}>
            {["low", "medium", "high", "veryhigh"].map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityButton,
                  taskPriority === priority &&
                    styles[
                      `priorityButton${
                        priority.charAt(0).toUpperCase() + priority.slice(1)
                      }`
                    ],
                ]}
                onPress={() => handlePrioritySelect(priority)}
              >
                <Text
                  style={[
                    styles.priorityText,
                    taskPriority === priority && { color: "#FFFFFF" },
                  ]}
                >
                  {priority === "veryhigh"
                    ? "Very High"
                    : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footerContainer}>
            <Button
              title="Cancel"
              onPress={onClose}
              buttonStyle={styles.cancelButton}
            />
            <Button
              title={task ? "Save" : "Add"}
              onPress={handleAddEditTask}
              buttonStyle={styles.saveButton}
            />
          </View>
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
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C2938",
    marginBottom: 20,
  },
  subTaskHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  subTaskHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C2938",
  },
  subTaskScrollView: {
    width: "100%",
    maxHeight: "40%",
  },
  subTaskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  subTaskInput: {
    flex: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 5,
    height: 40,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#1C2938",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#1C2938",
  },
  priorityHeader: {
    alignSelf: "flex-start",
    paddingLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C2938",
    marginBottom: 10,
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  priorityButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginHorizontal: 5,
  },
  priorityButtonLow: {
    backgroundColor: "#E0E0E0",
  },
  priorityButtonMedium: {
    backgroundColor: "#FFC107",
  },
  priorityButtonHigh: {
    backgroundColor: "#FF9800",
  },
  priorityButtonVeryhigh: {
    backgroundColor: "#FF5722",
  },
  priorityText: {
    fontSize: 16,
    color: "#1C2938",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#BDBDBD",
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  specifyTimeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  specifyTimeLabelSwitchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  specifyTimeText: {
    fontSize: 16,
    color: "#1C2938",
  },
  specifyTimeSwitch: {
    marginHorizontal: 8,
  },
  timePicker: {
    width: "50%",
  },
});

export default AddEditTaskModal;
