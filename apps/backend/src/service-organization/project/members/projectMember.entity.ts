import { AbstractEntity } from "../../../common/abstract.entity";
import { Column, Entity } from "typeorm";
import { ProjectMemberDto } from "./dto/projectMember.dto";

@Entity({ name: "project_members" })
export class ProjecMemberEntity extends AbstractEntity<ProjectMemberDto> {
  @Column({ name: "project_id", type: "uuid" })
  projectId: string;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @Column({ name: "organization_id", type: "uuid" })
  organizationId: string;

  dtoClass = ProjectMemberDto;

  constructor(partial: Partial<ProjecMemberEntity>) {
    super();
    Object.assign(this, partial);
  }
}
