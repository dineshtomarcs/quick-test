import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
export class DeleteMemberDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  projectId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  userId: string;
}
