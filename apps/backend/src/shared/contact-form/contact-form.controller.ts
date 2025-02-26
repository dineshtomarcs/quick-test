import {
  Controller,
  HttpCode,
  HttpStatus,
  Body,
  Post,
  UseFilters,
  Req,
  Request,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ExceptionResponseFilter } from "../../common/filters/exception-response.filter";
import { ContactFormService } from "./contact-form.service";
import { CreateContactFormDto } from "./dto/createContactFormDto";
import { ResponseSuccess } from "../../common/dto/SuccessResponseDto";

@Controller("contacts")
@ApiTags("contacts")
@UseFilters(ExceptionResponseFilter)
@ApiBearerAuth()
export class ContactFormController {
  constructor(private contactFormService: ContactFormService) {}

  /**
   *  Create the contact form
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Create the contact form",
    type: CreateContactFormDto,
  })
  async addContactForm(
    @Req() request: Request,
    @Body() createContactFormDto: CreateContactFormDto,
  ): Promise<ResponseSuccess> {
    const lang = request.headers["accept-language"];
    await this.contactFormService.addContactForm(createContactFormDto, lang);

    return new ResponseSuccess("translations.CONTACT_FORM_SUBMITTED", {});
  }
}
