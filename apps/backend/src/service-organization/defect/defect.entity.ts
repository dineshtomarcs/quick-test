import { Entity, Column, ManyToOne, OneToMany } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { PluginConfigEntity } from "../plugin/pluginConfig.entity";
import { DefectDto } from "./dto/DefectDto";
import { TestCaseEntity } from "../test-case/test-case.entity";
import { TestCaseResultEntity } from "../test-suite/test-case-result/test-case-result.entity";
import { Relation } from "typeorm";

@Entity({ name: "defects" })
export class DefectEntity extends AbstractEntity<DefectDto> {
  @Column({ default: null })
  pluginKey: string;

  @Column({ default: null })
  pluginId: string;

  @OneToMany(() => TestCaseEntity, (testcases) => testcases.defect)
  testcases: TestCaseEntity[];

  @OneToMany(
    () => TestCaseResultEntity,
    (testCaseResults) => testCaseResults.defect,
  )
  testCaseResults: TestCaseResultEntity[];

  @ManyToOne(() => PluginConfigEntity, (pluginConfig) => pluginConfig.defects)
  pluginConfig: Relation<PluginConfigEntity>;

  dtoClass = DefectDto;
}
