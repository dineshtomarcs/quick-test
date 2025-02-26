import { BadRequestException } from "@nestjs/common";

export class FileNotImageException extends BadRequestException {
  constructor(message?: string) {
    super(message);
  }
}
