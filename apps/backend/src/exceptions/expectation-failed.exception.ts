import { HttpException, HttpStatus } from "@nestjs/common";

export class ExpectationFailedException extends HttpException {
  constructor(message?: string) {
    super(message, HttpStatus.EXPECTATION_FAILED);
  }
}
