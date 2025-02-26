import { Injectable } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateContactFormDto } from "./dto/createContactFormDto";
import { UtilsService } from "../../_helpers/utils.service";
import { AuthService } from "../../service-auth/auth/auth.service";
import { ContactFormEntity } from "./contact-form.entity";

@Injectable()
export class ContactFormService {
  constructor(
    @InjectRepository(ContactFormEntity)
    private readonly contactFormRespository: Repository<ContactFormEntity>,
    private readonly authService: AuthService,
  ) {}

  /**
   * Add inquiry from new organizations
   */
  async addContactForm(
    createContactFormDto: CreateContactFormDto,
    lang: string,
  ): Promise<boolean> {
    createContactFormDto.firstName = UtilsService.titleCase(
      createContactFormDto.firstName,
    );
    createContactFormDto.lastName = UtilsService.titleCase(
      createContactFormDto.lastName,
    );
    createContactFormDto.email = UtilsService.lowerCase(
      createContactFormDto.email,
    );

    const contact_form =
      await this.contactFormRespository.create(createContactFormDto);

    await this.contactFormRespository.save(contact_form);
    await this.authService.sendContactFormAcknowledgementEmail(
      contact_form,
      lang,
    );

    return true;
  }
}
