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
