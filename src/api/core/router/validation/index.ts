import { NextFunction, Response } from "express";
import { IRouterParamValidationProps } from "../../../models/router/types";

export const validateParam = (paramVal: any,
  validationOptions: IRouterParamValidationProps) => {
  if (validationOptions.isRequired?.val === true) {
    if (paramVal &&
      (typeof paramVal === 'object' && Object.keys(paramVal).length === 0 ||
        Array.isArray(paramVal) && paramVal.length === 0)) {
      return validationOptions.isRequired.error
    }
  }

  if(!paramVal && !validationOptions.isRequired?.val) return
  if (validationOptions.paramType) {
    if (typeof paramVal !== validationOptions.paramType.val) {
      return validationOptions.paramType.error
    }
  }

  if (validationOptions.max || validationOptions.min) {
    const ln = paramVal.length;
    switch (validationOptions.paramType?.val) {
      case 'string':
        if (validationOptions.min?.val) {
          if (!(ln >= validationOptions.min?.val)) {
            return validationOptions.min.error
          }
        }

        if (validationOptions.max?.val) {
          if (!(ln <= validationOptions.max?.val)) {
            return validationOptions.max.error
          }
        }
        break;

      case 'number':
        if (validationOptions.min?.val) {
          if (!(paramVal >= validationOptions.min?.val)) {
            return validationOptions.min.error
          }
        }

        if (validationOptions.max?.val) {
          if (!(paramVal <= validationOptions.max?.val)) {
            return validationOptions.max.error
          }
        }
        break;

      case 'date':
        if (validationOptions.min?.val) {
          if (!(paramVal >= validationOptions.min?.val)) {
            return validationOptions.min.error
          }
        }

        if (validationOptions.max?.val) {
          if (!(paramVal <= validationOptions.max?.val)) {
            return validationOptions.max.error
          }
        }
    }
  }

  if (validationOptions.isEmail) {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!regex.test(paramVal)) {
      return validationOptions.isEmail.error
    }
  }

  if (validationOptions.isURL) {
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    if (!regex.test(paramVal)) {
      return validationOptions.isURL.error
    }
  }

  if (validationOptions.isPositive) {
    if (!(paramVal > 0)) {
      return validationOptions.isPositive.error
    }
  }

  if (validationOptions.isInteger) {
    if (!(Number.isInteger(paramVal))) {
      return validationOptions.isInteger.error
    }
  }

  if (validationOptions.of) {
    if (!(paramVal as Array<any>).every((arrEl) => typeof arrEl === validationOptions.of?.val)) {
      return validationOptions.of.error
    }
  }
}
