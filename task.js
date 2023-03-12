const fs = require('fs');

// Define file paths
const taskFilePath = `${__dirname}/task.txt`;
const completedFilePath = `${__dirname}/completed.txt`;

// Define an array to hold the list of tasks
let tasks = [];

// Read tasks from file
function readTasks() {
    try {
      if (fs.existsSync(taskFilePath)) {
        const tasksString = fs.readFileSync(taskFilePath, 'utf8');
        return tasksString;
      } else {
        console.log("There are no pending tasks!");
        tasks = [];
      }
    } catch (error) {
      console.log("Error reading file:", error);
      tasks = [];
    }
  }

function writeTasks(task) {
    try {
      var priority = 0;
      let existingTasks = [];
      if (fs.existsSync(taskFilePath)) {
        const tasksString = fs.readFileSync(taskFilePath, 'utf8');
        existingTasks = tasksString.trim().split('\n').map(taskString => {
          const [index, text] = taskString.split('.');
          priority = text.slice(-1)
          return {index: Number(index), text};
        });
      }
      const startIndex = existingTasks.length + 1;
      if(task.priority == priority){
        console.log(" Already exists")
      }else{
        const taskString = `${startIndex}. ${task.text} [${task.priority}]\n`;
        fs.appendFileSync(taskFilePath, taskString);
      }
      
    } catch (error) {
      console.log("Error writing to file:", error);
    }
  }
  

// Read completed tasks from file
function readCompletedTasks() {
  try {
    if (fs.existsSync(taskFilePath)) {
      const tasksString = fs.readFileSync(completedFilePath, 'utf8');
      return tasksString
    } else {
      console.log("There are no completed tasks!");
      tasks = [];
    }
  } catch (error) {
    console.log("Error reading file:", error);
    tasks = [];
  }
}

function addTask(priority, text) {
    if(!text || !priority){
        console.log("Error: Missing tasks string. Nothing added!")
        //throw new Error("Error: Missing tasks string. Nothing added!")
    }else{
        console.log(`Added task: "${text}" with priority ${priority}`);
        const task = { priority, text, completed: false };
        tasks.push(task);
        writeTasks(task);
    }
}

// Function to list all incomplete tasks in ascending order of priority
function listTasks() {
  let d = readTasks();
  console.log(d)
}

function deleteTask(index) {
    if(!index){
        console.log("Error: Missing NUMBER for deleting tasks.")
    }
    fs.readFile('task.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const tasks = data.split('\n');
        if (index >= 1 && index <= tasks.length) {
            tasks.splice(index - 1, 1);
            const updatedTasks = tasks.join('\n');
            fs.writeFile('task.txt', updatedTasks, 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(`Deleted task #${index}`);
            });
        } else {
            console.log(`Error: task with index #${index} does not exist. Nothing deleted.`);
        }
    });
}

// MAIN ONEEEE

// function completeTask(index){
//     if(!index){
//         console.log("Error: Missing NUMBER for marking tasks as done.")
//     }
//     fs.readFile('task.txt', 'utf8', (err, data) => {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         const tasks = data.split('\n');
//         if (index >= 1 && index <= tasks.length) {
//             let completedTasks = tasks.splice(index - 1, 1);
//             fs.appendFile('completed.txt', completedTasks[0]+'\n', 'utf8', (err) => {
//                 if (err) {
//                     console.error(err);
//                     return;
//                 }
//                 console.log(`Marked item as done.`);
//             });
//             const updatedTasks = tasks.join('\n');
//             fs.writeFile('task.txt', updatedTasks, 'utf8', (err) => {
//                 if (err) {
//                     console.error(err);
//                     return;
//                 }
//                 console.log(`Deleted task #${index}`);
//             });
//         } else {
//             console.log(`Error: no incomplete item with index #${index} exists.`)
//         }
//     });
// }

function completeTask(index) {
    if (index === 0) {
      console.log(`Error: no incomplete item with index #0 exists.`)
    }
    if(!index){
        console.log(`Error: Missing NUMBER for marking tasks as done.`)
    }
  
    fs.readFile('task.txt', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      while (data[data.length - 1] === '\n') {
        data = data.slice(0, data.length - 1);
      }
      const tasks = data.split(/\s*\n\s*/);
      if (index >= 1 && index <= tasks.length) {
        let completedTask = tasks.splice(index - 1, 1)[0];

        fs.appendFileSync('completed.txt', completedTask + '\n', 'utf8', (err) => {
          if (err) {
            console.error(err);
            return;
          }
  
          console.log(`Marked item as done.`);
  
        });
        // Re-index the remaining tasks in task.txt
        for (let i = index - 1; i < tasks.length; i++) {
        let parts = tasks[i].split(" ");
        parts[0] = (i + 1) + ".";
        tasks[i] = parts.join(" ") + "\n"; // Add newline character after task
        }

        const updatedTasks = tasks.join('\n');
        fs.writeFile('task.txt', updatedTasks, 'utf8', (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`Marked item as done.`);
        });
      } else {
        console.log(`Error: no incomplete item with index #${index} exists.`)
      }
    });
  }
  
  
function showHelp() {
console.log(`Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`)
}

function showReport() {
    const pendingTasksString = readTasks();
    const completedTasksString = readCompletedTasks();

    const pendingTasks = pendingTasksString.trim().split('\n');
    const completedTasks = completedTasksString.trim().split('\n');
    console.log(`Pending: ${pendingTasks.length}\n${pendingTasks.map((task, i) => `${i+1}. ${task}`).join('\n')}·\nCompleted: ${completedTasks.length}\n${completedTasks.join('\n').replace(/\s*\[\d+\]/g, "")}\n`);
}

// Parse command-line arguments
const args = process.argv.slice(2);
const command = args[0];
const args1 = args[1];
const args2 = args[2];

// Execute the command based on the input
switch (command) {
  case "add":
    addTask(parseInt(args1), args2);
    break;
  case "ls":
    listTasks();
    break;
  case "del":
    deleteTask(parseInt(args1));
    break;
  case "done":
    completeTask(parseInt(args1));
    break;
  case "help":
    showHelp();
    break;
  case "report":
    showReport();
    break;
  default:
    showHelp();
}