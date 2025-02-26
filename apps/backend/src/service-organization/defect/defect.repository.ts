import { Repository } from "typeorm";
import { EntityRepository } from "typeorm/decorator/EntityRepository";

import { DefectEntity } from "./defect.entity";

@EntityRepository(DefectEntity)
export class DefectRepository extends Repository<DefectEntity> {}
