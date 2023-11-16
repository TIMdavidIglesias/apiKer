// CORE
import { Log } from "../ker/core/log";

export const newTask = (
    task: () => void | Promise<void>,
    timeOut: number,
    maxExecutions: number = 0
  ) => {
    let executions = 0;
  
    async function executeTask() {
      if (maxExecutions === 0 || executions < maxExecutions) {
        try {
          await task(); // Ejecuta la tarea
          executions++;
  
          if (maxExecutions === 0 || executions < maxExecutions) {
            setTimeout(executeTask, timeOut); // Espera el tiempo especificado y ejecuta la tarea nuevamente

            Log.logAddEntry('Task complete: ' + task.name);
          } 
        } catch (error) {
          console.error(`Error en la tarea: ${error}`);
        }
      }
    }
  
    executeTask();
  };
  