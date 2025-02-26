import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ALLOWED_LANGUAGES } from "../constants/lang";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private i18n: I18nService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const languageToTranslate = request.headers["accept-language"];

    return next.handle().pipe(
      map(async (data) => {
        if (data) {
          data.message = await this.i18n.translate(data.message, {
            lang: ALLOWED_LANGUAGES.includes(languageToTranslate)
              ? languageToTranslate
              : "en",
          });
          return data;
        }
      }),
    );
  }
}
