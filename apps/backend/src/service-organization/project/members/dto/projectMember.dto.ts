import { AbstractDto } from "../../../../common/dto/AbstractDto";
import { ProjecMemberEntity } from "../projectMember.entity";

export class ProjectMemberDto extends AbstractDto {
  projectId: string;

  userId: string;

  organizationId: string;

  constructor(member: ProjecMemberEntity) {
    super(member);
    this.userId = member.userId;
    this.projectId = member.projectId;
    this.organizationId = member.organizationId;
  }
}
