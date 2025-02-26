import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
export class AddMemberDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  projectId: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ type: Array })
  users: string[];
}
