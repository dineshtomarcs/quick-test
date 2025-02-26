import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";

import { AbstractDto } from "../../../common/dto/AbstractDto";

import { ContactFormEntity } from "../contact-form.entity";

export class ContactFormDto extends AbstractDto {
  @ApiProperty()
  firstName: string;

  @ApiPropertyOptional()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  phone: string;

  constructor(contact_form: ContactFormEntity) {
    super(contact_form);
    this.firstName = contact_form.firstName;
    this.lastName = contact_form.lastName;
    this.email = contact_form.email;
    this.phone = contact_form.phone;
    this.message = contact_form.message;
  }
}
