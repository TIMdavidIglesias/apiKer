export class ApiCommandConsole {
    /**
     * silentLevel
     * -------------------------
     * A static property representing the silent level for the console messages. Messages with a silent level greater than
     * this value will not be displayed on the console.
     */
    public static silentLevel: number = 0;

    /**
     * showConsoleMessage
     * -------------------------
     * Displays a console message if its specified messageSilentLevel is less than or equal to the class's silentLevel.
     *
     * @param message The message to be displayed on the console.
     * @param messageSilentLevel The silent level of the message. Messages with a higher silent level will not be shown.
     */
    public static showConsoleMessage(message: any, messageSilentLevel: number = 0) {
        // Check if the message's silent level is less than or equal to the class's silentLevel
        if (messageSilentLevel >= ApiCommandConsole.silentLevel) {
            console.log(message);
        }
    }
}
