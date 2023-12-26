// ERROR
import { ApiError } from "..";
import { IApiCustomError } from "../../../models/error/types";

/**
 * Creates a custom API error using the provided custom error object.
 * 
 * @param customError - An object representing the custom error details.
 * @returns An `ApiError` instance based on the custom error details.
 */
export const customErrorHandler = (customError: IApiCustomError) => {
    return new ApiError(customError, true)
}