import { Column, Entity } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";

import { ContactFormDto } from "./dto/contactFormDto";

@Entity({
  name: "contact_forms",
})
export class ContactFormEntity extends AbstractEntity<ContactFormDto> {
  @Column()
  firstName: string;

  @Column({ default: null })
  lastName: string;

  @Column()
  email: string;

  @Column()
  message: string;

  @Column({ default: null })
  phone: string;

  dtoClass = ContactFormDto;
}
