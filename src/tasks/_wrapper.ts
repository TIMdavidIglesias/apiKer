// CORE
import { Log } from "../ker/core/log";

/**
 * Creates a new task and schedules it to run at specified intervals.
 * 
 * @param task The task function to be executed.
 * @param timeOut The time interval (in milliseconds) between task executions.
 * @param maxExecutions The maximum number of times the task should be executed (0 for unlimited).
 */
export const newTask = (
  task: () => void | Promise<void>,
  timeOut: number,
  maxExecutions: number = 0
) => {
  let executions = 0;

  // Define an async function to execute the task
  async function executeTask() {
    // Check if the maximum number of executions has not been reached
    if (maxExecutions === 0 || executions < maxExecutions) {
      try {
        // Execute the task
        await task();
        executions++;

        // Schedule the next execution if the maximum executions limit has not been reached
        if (maxExecutions === 0 || executions < maxExecutions) {
          setTimeout(executeTask, timeOut);

          // Log that the task has been completed
          Log.logAddEntry('Task complete: ' + task.name);
        }
      } catch (error) {
        // Log and handle errors that occur during task execution
        console.error(`Error in the task: ${error}`);
      }
    }
  }

  // Start the initial execution of the task
  executeTask();
};
