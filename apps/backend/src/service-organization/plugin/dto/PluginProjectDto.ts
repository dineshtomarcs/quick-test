import { ApiProperty } from "@nestjs/swagger";

export class PluginProjectDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  url: string;

  constructor(project) {
    this.name = project?.name;
    this.id = project?.id;
    this.key = project?.key;
    this.url = project?.self;
  }
}
