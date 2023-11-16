// MODULES
import moment from 'moment';

export class ApiTimer {
  // Private property to store the Unix timestamp
  private unixDate: number;
  // Private property to store the Date object
  private dateObject: Date

  /**
   * Constructor
   * -------------------------
   * Initializes the ApiTimer with the specified date, which can be provided as a string, number (Unix timestamp),
   * or a Date object. The optional inputFormat parameter is used when the date is provided as a string to parse it
   * using moment.js. The resulting Unix timestamp is stored in the private property 'unixDate'.
   *
   * @param date The date to initialize the ApiTimer with. It can be a string, number, or Date object. Default is "now".
   * @param inputFormat The format to parse the date when it is provided as a string (used with moment.js). Default is "YYYYMMDD".
   */
  constructor(date: string | number | Date = "now", inputFormat: string = "YYYYMMDD") {
    let usingDate: number | Date; // Variable to hold the processed date

    if (date === "now") {
      // If date is "now", set usingDate to the current date and time
      usingDate = moment().valueOf() as number;
      this.dateObject = moment().toDate()
    } else if (typeof date === "number") {
      // If date is a number (Unix timestamp), use it directly
      usingDate = date;
      this.dateObject = moment(date).toDate()
    } else if (typeof date === "string") {
      // If date is a string, parse it using the provided inputFormat and convert it to a Unix timestamp
      usingDate = moment(date, inputFormat).valueOf() as number;
      this.dateObject = moment(date, inputFormat).toDate()
    } else {
      // Handle the case where 'date' is of type Date (no need to process, use it directly)
      usingDate = date;
      this.dateObject = moment(date).toDate()
    }

    // Assign the final value of usingDate to the private property unixDate
    this.unixDate = this.dateObject.valueOf() as number;
  }

  /**
   * getDate
   * -------------------------
   * Retrieves the stored Unix timestamp and optionally formats it using moment.js, returning it as a string or a number.
   *
   * @param outputFormat Optional. The format to use when formatting the Unix timestamp using moment.js.
   * If not provided, the Unix timestamp is returned as a number. If "ISO" is provided,
   * the timestamp is returned in ISO 8601 format.
   * @returns The Unix timestamp as either a string (formatted) or a number (unformatted).
   */
  public getDate(outputFormat: string | undefined = undefined): string | number {
    if (outputFormat) {
      // If outputFormat is specified, format the Unix timestamp using moment.js and return as a string
      return moment(this.unixDate).format(outputFormat === "ISO" ? undefined : outputFormat);
    } else {
      // If outputFormat is not specified, return the Unix timestamp as a number
      return this.unixDate;
    }
  }

  /**
   * getDateObject
   * -------------------------
   * Retrieves the stored Date object ready to get used
   *
   */
  public getDateObject(): Date {
    return this.dateObject
  }
}
