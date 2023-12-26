// UTILS
import { ApiTimer } from "../../utils/timer";

// ERROR & GLOSSARY
import { ErrorGlossary } from "./glossary";
import { IApiCustomError, IApiError, IApiErrorSummary } from "../../models/error/types";
// - types
import { IApiErrorDefinition } from "../../models/error/glossary/types";

export class ApiError {
    // Error name referred to in the error glossary
    private errorName: string;

    // HTTP error code for the error - API response error
    private errorCode: number;

    // Glossary error message
    private errorMessage: string;

    // Message ready to show to the user
    private errorPublicMessage: string;

    // Additional information for user and tracking
    private additionalInfo: string;

    // Exception thrown by a process
    private errorException: any;

    // Error time for error logging
    private errorTime: number;

    // Error definition obtained from the glossary
    private errorDefinition: IApiErrorDefinition ;

    /**
     * Creates a new instance of the ApiError class.
     * @param error - An object containing error information.
     * @property error.name - The name of the error as defined in the error glossary.
     * @property error.additionalInfo - Additional information related to the error.
     * @property error.exception - The exception object associated with the error, if any.
     * The constructor fetches the error definition from the glossary and sets up the error properties accordingly.
     */
    constructor(error: IApiError | IApiCustomError, isCustomError: boolean = false) {
        // Get the error definition from the glossary
        if(!isCustomError){
            this.errorDefinition = ErrorGlossary.getErrorDefinitionByName(error.name);
            this.errorName = this.errorDefinition.name;
            this.errorCode = this.errorDefinition.errorCode;
            this.errorMessage = this.errorDefinition.message;
            this.errorPublicMessage = this.errorDefinition.publicMessage ?? '';
            this.errorException = (error as IApiError).exception || undefined;
            this.additionalInfo = error.additionalInfo ?? '';
        }else{
            const customError = error as IApiCustomError
            this.errorDefinition = {
                name:customError.name,
                errorCode: customError.code,
                message: customError.message,
                publicMessage: customError.publicMessage,
                additionalInfo: customError.additionalInfo
            };
            this.errorName = this.errorDefinition.name;
            this.errorCode = this.errorDefinition.errorCode;
            this.errorMessage = this.errorDefinition.message;
            this.errorPublicMessage = customError.publicMessage;
            this.errorException = (error as IApiError).exception || undefined;
            this.additionalInfo = error.additionalInfo ?? '';


        }

        // Fill in error data
        this.errorTime = new ApiTimer().getDate() as number;
    }

    /**
     * Get Error Summary
     * Returns a summary of the API error including the error name, exception (if present), error message,
     * public-facing error message, error time, additional information, and HTTP error code.
     * @returns An object containing the error summary information.
     */
    public getErrorSummary(): IApiErrorSummary {
        return {
            name: this.errorName,
            exception: this.errorException,
            message: this.errorMessage,
            publicMessage: this.errorPublicMessage,
            time: this.errorTime,
            additionalInfo: this.additionalInfo,
            code: this.errorCode
        };
    }
}
