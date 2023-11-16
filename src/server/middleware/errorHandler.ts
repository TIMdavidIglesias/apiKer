// modules
import express, { Request, Response, NextFunction } from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from 'cors'

// // DOCS
// import { runDocs } from "../rest/docs";

// CORE
import { Cache } from "../../ker/core/cache";

// API
import { ApiResponse } from "../../api/core/response";
import { appGetAppsAllowedOrigins } from "../../api/core/apps";

// ERROR
import { ApiError } from "../../ker/core/error";

/**
 * Middleware para manejar errores en las solicitudes.
 * Este middleware toma un error de tipo ApiError y lo convierte en una respuesta de error.
 * @param err El error que se va a manejar.
 * @param req El objeto Request de Express.
 * @param res El objeto Response de Express.
 * @param next La función que llama al siguiente middleware en la cadena.
 */
export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    const newResponse = res.locals.ApiResponse as ApiResponse;
    newResponse.isError = true;
    newResponse.error = err;

    // Tracks error response
    newResponse.track();
    return newResponse.sendResponse();
};