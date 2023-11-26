// TYPES
import { IRouterParamValidationProps } from "../../../models/router/types";

/**
 * Performs type validation for a given parameter value.
 * 
 * @param val The expected type for validation.
 * @param paramVal The value to be validated.
 * @returns True if the value matches the expected type, otherwise false.
 */
const typeValidation = (val: string, paramVal: any) => {
  switch (val) {
    case 'integer':
    case 'number':
      // Check if the parameter value is a valid number
      if (Number.isNaN(Number(paramVal))) return false;
      break;
    case 'boolean':
      // Check if the parameter value is a valid boolean
      if (paramVal !== 'true' &&
        paramVal !== 'false' &&
        paramVal !== true &&
        paramVal !== false) return false;
      break;
    case 'array':
      // Check if the parameter value is a non-empty array
      if (!Array.isArray(paramVal) || paramVal.length === 0) return false;
      break;
    default:
      // Check if the parameter value matches the expected type
      if (typeof paramVal !== val) return false;
  }

  return true;
}

/**
 * Validates a parameter value based on specified validation options.
 * 
 * @param paramVal The parameter value to be validated.
 * @param validationOptions Validation options for the parameter.
 * @returns An error message if validation fails, otherwise undefined.
 */
export const validateParam = (paramVal: any,
  validationOptions: IRouterParamValidationProps) => {
  // Check if the parameter is required and not provided
  if (validationOptions.isRequired?.val === true) {
    if (paramVal &&
      (typeof paramVal === 'object' && Object.keys(paramVal).length === 0 ||
        Array.isArray(paramVal) && paramVal.length === 0)) {
      return validationOptions.isRequired.error;
    }
  }

  // Skip further validation if the parameter is not provided and not required
  if (!paramVal && !validationOptions.isRequired?.val) return;

  // Validate the parameter type if specified
  if (validationOptions.paramType) {
    if (!typeValidation(validationOptions.paramType.val, paramVal)) {
      return validationOptions.paramType.error;
    }
  }

  // Validate min and max constraints if specified
  if (validationOptions.max || validationOptions.min) {
    const ln = paramVal.length;
    switch (validationOptions.paramType?.val) {
      case 'string':
        if (validationOptions.min?.val) {
          if (!(ln >= validationOptions.min?.val)) {
            return validationOptions.min.error;
          }
        }

        if (validationOptions.max?.val) {
          if (!(ln <= validationOptions.max?.val)) {
            return validationOptions.max.error;
          }
        }
        break;

      case 'number':
      case 'integer':
        if (validationOptions.min?.val) {
          if (!(paramVal >= validationOptions.min?.val)) {
            return validationOptions.min.error;
          }
        }

        if (validationOptions.max?.val) {
          if (!(paramVal <= validationOptions.max?.val)) {
            return validationOptions.max.error;
          }
        }
        break;

      case 'date':
        if (validationOptions.min?.val) {
          if (!(paramVal >= validationOptions.min?.val)) {
            return validationOptions.min.error;
          }
        }

        if (validationOptions.max?.val) {
          if (!(paramVal <= validationOptions.max?.val)) {
            return validationOptions.max.error;
          }
        }
    }
  }

  // Validate email format if specified
  if (validationOptions.isEmail) {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!regex.test(paramVal)) {
      return validationOptions.isEmail.error;
    }
  }

  // Validate URL format if specified
  if (validationOptions.isURL) {
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    if (!regex.test(paramVal)) {
      return validationOptions.isURL.error;
    }
  }

  // Validate positive number if specified
  if (validationOptions.isPositive) {
    if (!(paramVal > 0)) {
      return validationOptions.isPositive.error;
    }
  }

  // Validate integer if specified
  if (validationOptions.isInteger) {
    if (!(Number.isInteger(paramVal))) {
      return validationOptions.isInteger.error;
    }
  }

  // Validate array element types if specified
  if (validationOptions.of && Array.isArray(paramVal)) {
    if (!(paramVal as Array<any>).every((arrEl) => typeValidation(validationOptions.of?.val, arrEl))) {
      return validationOptions.of.error;
    }
  }
}
