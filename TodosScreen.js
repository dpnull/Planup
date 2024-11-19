import React, { useState, useContext } from "react";
import { AppContext } from "./AppContext";

import ScheduleOptionsModal from "./ScheduleOptionsModal";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { Button } from "react-native-elements";

import Feather from "react-native-vector-icons/Feather";

import AddEditTaskModal from "./AddEditTaskModal";

const TodoItem = ({ item, onEdit, onDelete }) => {
  let bgColor;
  let textColor;
  // dynamically set colour based on priority
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

    case "veryhigh":
      bgColor = "#FF5722";
      textColor = "#1C2938";
      break;

    default:
      bgColor = "#FFFFFF";
      textColor = "#1C2938";
  }

  return (
    <View style={[styles.item, { backgroundColor: bgColor }]}>
      <View style={styles.itemTextContainer}>
        <View style={styles.itemHeaderContainer}>
          <Text style={[styles.itemHeader, { color: textColor }]}>
            {item.taskName}
          </Text>
          {/* show task time if we have it */}
          {item.taskTime && formatTime(item.taskTime) && (
            <Text style={styles.taskTimeText}>
              {" "}
              {/* hiding it */}
              at {formatTime(item.taskTime)}
            </Text>
          )}
        </View>

        {item.subTasks && item.subTasks.length > 0 && (
          <>
            <Text style={styles.subTaskHeader}>Sub-tasks:</Text>

            {item.subTasks.map((subTask) => (
              <Text style={styles.subTaskText} key={subTask.id}>
                {subTask.name}
              </Text>
            ))}
          </>
        )}
      </View>

      <View style={styles.itemButtonsContainer}>
        <TouchableOpacity onPress={() => onEdit(item.id)}>
          <Feather name="edit" size={20} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Feather name="trash-2" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// converts a time string to hhmm format unless marked 'flex'
const formatTime = (time) => {
  if (!time || time === "flex") return "";
  const date = new Date(time);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const TodosScreen = ({ navigation }) => {
  const [todos, setTodos] = useState([]); // use to hold tasks
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const { appState, setScheduleData } = useContext(AppContext);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [options, setOptions] = useState({
    subTaskDuration: {
      selected: false,
      text: "Approximate sub-tasks duration",
      description:
        "Estimate the duration of sub-tasks based on the average time typically required for similar actions, ensuring a more accurate schedule.",
    },
    studyHours: {
      selected: false,
      text: "Fill up your schedule with study hours",
      description:
        "Add dedicated study hours to your schedule to ensure you have enough time for learning and skill development.",
    },
    wellbeingHours: {
      selected: false,
      text: "Fill up your schedule with wellbeing hours",
      description:
        "Include time for self-care, exercise, and relaxation to maintain a healthy work-life balance.",
    },
  });

  // sends the schedule data to the backend server and updates the
  // app context with the response from the server. Also navigates to the
  // ScheduleScreen where the generated schedule is displayed
  async function submitScheduleData(scheduleData) {
    try {
      const response = await fetch(
        // local machine
        "http://localhost:3000/gpt3/generate-schedule",
        {
          // use POST to create and update data to server
          method: "POST",
          headers: {
            // payload will be json
            "Content-Type": "application/json",
          },
          body: JSON.stringify(scheduleData),
        }
      );

      const jsonResponse = await response.json();
      console.log(jsonResponse);

      // store it to appcontext
      setScheduleData(jsonResponse);

      navigation.navigate("ScheduleScreen");
    } catch (error) {
      console.error("FAILED TO SUBMIT DATA:", error);
    }
  }

  // when the add button is pressed, clears the current task
  // (if any) and shows the modal for adding a new task
  const handleAddButtonPress = () => {
    setCurrentTask(null); // set current task to null to clear it

    setIsModalVisible(true);
  };

  // finds the task by id, sets it as the current task, and opens the modal for editing the task
  const handleEditButtonPress = (id) => {
    const task = todos.find((task) => task.id === id);
    console.log("Current task:", task);
    setCurrentTask(task);
    setIsModalVisible(true);
  };

  // opens the modal that contains options to customize the generated schedule
  const handlePreSubmitData = () => {
    setIsOptionsModalVisible(true);
  };

  // update todos list with new or edited task
  const handleFinalSubmitTask = (task) => {
    if (currentTask) {
      setTodos(todos.map((t) => (t.id === task.id ? task : t)));
    } else {
      setTodos([
        ...todos,

        { ...task, id: Date.now().toString(), subTasks: task.subTasks || [] },
      ]);
    }

    setIsModalVisible(false);
  };

  // deletes a task from the todos list based on the given id
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // renders a todo item by passing necessary props to the TodoItem component
  const renderTodoItem = ({ item }) => (
    <TodoItem
      item={item}
      onEdit={() => handleEditButtonPress(item.id)}
      onDelete={() => handleDeleteTodo(item.id)}
    />
  );

  // handles the final submission of data to the backend for schedule generation.
  // it combines the current app state with the tasks and selected options, then creates a GPT3 prompt
  // and sends the data to the server
  const handleSubmitData = async () => {
    console.log("handle submit data");
    // combine appstate with current task for sending
    const scheduleData = {
      ...appState,
      tasks: todos,
      options,
    };

    // dbug
    console.log(
      "Final data to be submitted:",
      JSON.stringify(scheduleData, null, 2)
    );

    // get the prompt
    const gptPrompt = createGPT3Prompt(scheduleData);

    // should be fine
    await submitScheduleData({ prompt: gptPrompt });

    navigation.navigate("ScheduleScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Tasks</Text>

      {todos.length === 0 ? (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>
            No tasks added yet. Start by adding a new task.
          </Text>
        </View>
      ) : (
        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <View style={styles.buttonsContainer}>
        <Button
          title="Add Task"
          onPress={handleAddButtonPress}
          buttonStyle={styles.addButton}
          titleStyle={styles.addButtonText}
          icon={<Feather name="plus" size={20} color="#fff" />}
        />

        <Button
          title="Submit"
          onPress={handlePreSubmitData} // DONT MESS UP THE NAMEEEEEEEE
          disabled={todos.length === 0}
          buttonStyle={styles.submitButton}
          titleStyle={styles.submitButtonText}
          icon={<Feather name="send" size={20} color="#fff" />}
        />
      </View>

      <AddEditTaskModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleFinalSubmitTask}
        task={currentTask}
      />

      <ScheduleOptionsModal
        isVisible={isOptionsModalVisible}
        onClose={() => setIsOptionsModalVisible(false)}
        onContinue={() => {
          setIsOptionsModalVisible(false);
          handleSubmitData(); // DONT MESS UP THE NAMEEEEEEEE
        }}
        options={options}
        setOptions={setOptions}
      />
    </View>
  );
};

function createGPT3Prompt(scheduleData) {
  let purposeSpecificInstructions = "";
  switch (scheduleData.purpose.text.toLowerCase()) {
    case "studying":
      purposeSpecificInstructions = `
                - Tasks with keywords 'study', 'studying' should be given high priority.
                `;
      break;
    case "work-life balance":
      purposeSpecificInstructions = `
                
                `;
      break;
    case "self-improvement":
      purposeSpecificInstructions = `
                - Set tasks related to meditation or exercise/workout to have 'high' priority.
                - Tasks with keywords 'exercise', 'workout', 'meditate', 'jog' should have high priority.
                `;
      break;
  }

  let optionSpecificInstructions = "";
  if (scheduleData.options.subTaskDuration.selected) {
    optionSpecificInstructions += `
            - To your best ability, estimate the duration of sub-tasks based on the average time typically required for those actions based on their name and assign them duration.
            `;
  }

  if (scheduleData.options.studyHours.selected) {
    if (scheduleData.timeManagementTechnique.toLowerCase() === "pomodoro") {
      optionSpecificInstructions += `
            - Add a two hour long task that is going to follow the pomodoro technique. It will consist of subtasks which are 25 minute study, 5 minute break, alternating until the total time adds up to two hours.
            - The names of breaks and pomodoro sessions should have incrementing numbers, eg Pomodoro 1, Pomodoro 2, Break 1, Break 2 etc...
            `;
    } else {
      optionSpecificInstructions += `
            - Add two additional hours of study which should be added as a task with another task which is a 30 minute break right after.
            `;
    }
  }

  if (scheduleData.options.wellbeingHours.selected) {
    optionSpecificInstructions += `
            - Add 2 hours of wellbeing activities, broken down into 30-minute sessions with high priority.
            `;
  }

  let prompt = `
You are an AI within the "Planup" app focusing on ${scheduleData.purpose.text.toLowerCase()}.

- The user's day initiates at ${formatTime(
    new Date(scheduleData.startTime)
  )} with a starting task named "Start of your day".

${purposeSpecificInstructions}

${optionSpecificInstructions}
    
Time Management Technique: ${scheduleData.timeManagementTechnique}

Tasks:
`;

  scheduleData.tasks.forEach((task, index) => {
    const time =
      task.taskTime === "flex"
        ? "flexible time"
        : `at ${formatTime(task.taskTime)}`;

    prompt += `
${index + 1}. Task: ${task.taskName}
Priority: ${task.priority}
Time: ${time}
${task.subTasks && task.subTasks.length > 0 ? "Sub-tasks:" : ""}
${
  task.subTasks
    ? task.subTasks
        .map(
          (subTask, subIndex) => `
${subIndex + 1}. ${subTask.name}`
        )
        .join("")
    : ""
}
`;
  });

  prompt += `
Please create a schedule using the following JSON format:
{
  "schedule": [
    {
      "taskName": "string",
      "startTime": "string (HH:mm format)",
      "endTime": "string (HH:mm format)",
      "duration": "number (in minutes)",
      "priority": "low | medium | high | very_high",
      "subTasks": [
        {
          "name": "string",
          "startTime": "string (HH:mm format)",
          "endTime": "string (HH:mm format)",
          "duration": "number (in minutes)"
        }
      ]
   }
 ]
}
The tasks should be sorted in ascending order of time. Remember, the JSON output must include all main tasks and any specified sub-tasks, ensuring accurate representation of the schedule as described.
This output has to solely contain the parseable JSON code as per the outlined format, without any extraneous characters or backticks that could interfere with JSON parsing.
This means that the message should solely contain the JSON code, eg you cannot begin the message with "Schedule Data:". 
`;

  console.log(prompt);
  return prompt;
}

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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
  },
  addButtonText: {
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: "#34C759",
    paddingHorizontal: 30,
  },
  submitButtonText: {
    marginLeft: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  itemHeader: {
    fontSize: 14,
    fontWeight: "bold",
  },
  taskTimeText: {
    fontSize: 14,
    color: "#0E2144",
  },
  itemButtonsContainer: {
    flexDirection: "row",
  },
  subTaskHeader: {
    fontSize: 14,
    color: "#3A4750",
    marginTop: 10,
    marginBottom: 5,
  },
  subTaskText: {
    fontSize: 14,
    color: "#0E2144",
  },
});

export default TodosScreen;
