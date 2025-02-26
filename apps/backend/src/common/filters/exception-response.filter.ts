import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  BadRequestException,
} from "@nestjs/common";
import { Response } from "express";
import { I18nService } from "nestjs-i18n";
import { ResponseError } from "../dto/ErrorResponseDto";
import { ALLOWED_LANGUAGES } from "../constants/lang";

@Catch(HttpException, BadRequestException)
export class ExceptionResponseFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async msg_validation(msg_key: string): Promise<string> {
    const validation = await this.i18n.translate(`translations.${msg_key}`, {
      lang: "en",
    });
    if (validation?.length < 12) return validation;
    if (
      validation?.length >= 12 &&
      validation?.substring(0, 12) !== "translations"
    )
      return validation;
    return msg_key;
  }

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const r = <any>exception.getResponse();
    const languageToTranslate = ctx.getRequest().headers["accept-language"];
    let message;
    if (exception.message) {
      if (typeof r === "string") {
        message = await this.msg_validation(r);
      } else if (typeof r.message === "string") {
        message = await this.msg_validation(r.message);
      } else {
        const firstNonEmptyMessage = r.message?.find((msg) => msg.length !== 0);
        message = await this.msg_validation(firstNonEmptyMessage);
      }
    }
    message = await this.i18n.translate(message?.toString() ?? "", {
      lang: ALLOWED_LANGUAGES.includes(languageToTranslate)
        ? languageToTranslate
        : "en",
    });
    response.status(status).send(new ResponseError(message, null, status));
  }
}
