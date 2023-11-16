import { Response } from "express";

export const setCookie = (res:Response,name:string,value:any,options:any)=>{
    res.cookie(name,value ,options)

}