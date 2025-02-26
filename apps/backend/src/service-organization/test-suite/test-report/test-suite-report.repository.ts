import { Repository } from "typeorm";
import { EntityRepository } from "typeorm/decorator/EntityRepository";

import { TestSuiteReportEntity } from "./test-suite-report.entity";

@EntityRepository(TestSuiteReportEntity)
export class TestSuiteReportRepository extends Repository<TestSuiteReportEntity> {}
