/* eslint-disable max-classes-per-file */
import { Logger } from "@nestjs/common";
import { ResponseFormatter } from "../interfaces/response.interface";

export class ResponseError implements ResponseFormatter {
  constructor(infoMessage: string, data?: any, errCode?: number) {
    this.success = false;
    this.message = infoMessage;
    this.data = data;
    this.errCode = errCode;
  }

  message: string;

  data: any[];

  errorMessage: any;

  error: any;

  success: boolean;

  errCode: number;
}

export class ResponseSuccess implements ResponseFormatter {
  constructor(infoMessage: string, data?: any, notLog?: boolean) {
    this.success = true;
    this.message = infoMessage;
    this.data = data;
    if (!notLog) {
      try {
        const offuscateRequest = JSON.parse(JSON.stringify(data));
        if (offuscateRequest && offuscateRequest.token) {
          offuscateRequest.token = "*******";
        }
      } catch (error) {
        Logger.error(error);
      }
    }
  }

  message: string;

  data: any[];

  errorMessage: any;

  error: any;

  success: boolean;

  errCode: number;
}
