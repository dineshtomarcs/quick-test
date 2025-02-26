/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import * as request from "supertest";
import { INestApplication, HttpStatus } from "@nestjs/common";
import { Repository } from "typeorm";

import { AppModule } from '../src/app.module';
import { UserEntity } from "../src/service-users/user/user.entity";
import { UserRepository } from '../src/service-users/user/user.repository';
import { ForgottenPasswordRepository } from "../src/service-users/user/forgotten-passowrd.repository";
import { ForgottenPasswordEntity } from '../src/service-users/user/forgotten-password-reqs.entity';
import { ProjectRepository } from "../src/service-organization/project/project.repository";
import { ProjectEntity } from "../src/service-organization/project/project.entity";
import { SectionRepository } from "../src/service-organization/test-case/section/section.repository";
import { SectionEntity } from "../src/service-organization/test-case/section/section.entity";
import { TestCaseRepository } from "../src/service-organization/test-case/test-case.repository";
import { TestCaseEntity } from "../src/service-organization/test-case/test-case.entity";
import { TestSuiteEntity } from "../src/service-organization/test-suite/test-suite.entity";
import { TestSuiteRepository } from "../src/service-organization/test-suite/test-suite.repository";
import { TestCaseResultEntity } from "../src/service-organization/test-suite/test-case-result/test-case-result.entity";
import { TestCaseResultRepository } from "../src/service-organization/test-suite/test-case-result/test-case-result.repository";
import { TestSuiteReportEntity } from "../src/service-organization/test-suite/test-report/test-suite-report.entity";
import { TestSuiteReportRepository } from "../src/service-organization/test-suite/test-report/test-suite-report.repository";
import { TestSuiteStatus } from "../src/common/enums/test-suite-status";
import { ActivityEntity } from "../src/service-organization/project/activity/activity.entity";
import { ActivityRepository } from "../src/service-organization/project/activity/activity.repository";
import { TestCaseResultStatus } from "../src/common/enums/test-case-result-status";
import { ExecutionPriority } from "../src/common/enums/execution-priority";
import { CustomerRepository } from "../src/service-organization/payment/repositories/customer.repository";
import { InvoiceRepository } from "../src/service-organization/payment/repositories/invoice.repository";
import { SubscriptionRepository } from "../src/service-organization/payment/repositories/subscription.repository";
import { PaymentMethodRepository } from "../src/service-organization/payment/repositories/paymentMethod.repository";
import { CustomerEntity } from "../src/service-organization/payment/entities/customer.entity";
import { InvoiceEntity } from "../src/service-organization/payment/entities/invoice.entity";
import { SubscriptionEntity } from "../src/service-organization/payment/entities/subscription.entity";
import { PaymentMethodEntity } from "../src/service-organization/payment/entities/paymentMethod.entity";
import { EmailVerifyTokenEntity } from "../src/service-users/user/email-verify-token.entity";
import { EmailVerifyTokenRepository } from "../src/service-users/user/email-verify-token.repository";

const mockedUser: any = [
    {
        user: {
            firstName: "temp",
            lastName: "user",
            email: "temp@gmail.com",
            password: "password"
        }, 
        organization: "crownstack"
    }
];

const mockedProject: any = [
    {
        name: "Project 1",
        description: "Project description"
    }
];

const mockedTestSuites: any = [
    {       
        name: "Test run 1",
        description: "Test run description"
    },
    {   
        name: "Test run 2",
        description: "Test run description"
    },
    {   
        name: "Test run 3",
        description: "Test run description"
    }
]

const mockedTestCases: any = [
    {
        title: "Test case 1",
        preconditions: "preconditions",
        steps: "steps",
        expectedResults: "expected results"
    },
    {
        title: "Test case 2",
        preconditions: "preconditions",
        steps: "steps",
        expectedResults: "expected results"
    },
    {
        title: "Test case 3",
        preconditions: "preconditions",
        steps: "steps",
        expectedResults: "expected results"
    }
]


describe('Test suite route e2e test cases', () => {
    let app: INestApplication;
    let userRepository: Repository<UserEntity>;
    let forgottenPasswordRepository: Repository<ForgottenPasswordEntity>;
    let projectRepository: Repository<ProjectEntity>;
    let sectionRepository: Repository<SectionEntity>;
    let testCaseRepository: Repository<TestCaseEntity>;
    let testSuiteRepository: Repository<TestSuiteEntity>;
    let testCaseResultRepository: Repository<TestCaseResultEntity>;
    let testSuiteReportRepository: Repository<TestSuiteReportEntity>;
    let activityRepository: Repository<ActivityEntity>;
    let customerRepository: Repository<CustomerEntity>;
    let subscriptionRepository: Repository<SubscriptionEntity>;
    let invoiceRepository: Repository<InvoiceEntity>;
    let paymentMethodRepository: Repository<PaymentMethodEntity>;
    let emailVerifyTokenRepository : Repository<EmailVerifyTokenEntity>;
    let token = null;
    
    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [ AppModule]
        }).compile();
        
        app = moduleRef.createNestApplication();
        await app.init();

        userRepository = await moduleRef.get(UserRepository);       
        forgottenPasswordRepository = await moduleRef.get(ForgottenPasswordRepository);
        projectRepository = await moduleRef.get(ProjectRepository);
        sectionRepository = await moduleRef.get(SectionRepository); 
        testCaseRepository = await moduleRef.get(TestCaseRepository);
        testSuiteRepository = await moduleRef.get(TestSuiteRepository);
        testSuiteReportRepository = await moduleRef.get(TestSuiteReportRepository);
        testCaseResultRepository = await moduleRef.get(TestCaseResultRepository);
        activityRepository = await moduleRef.get(ActivityRepository);
        customerRepository = await moduleRef.get(CustomerRepository);
        subscriptionRepository = await moduleRef.get(SubscriptionRepository);
        invoiceRepository = await moduleRef.get(InvoiceRepository);
        paymentMethodRepository = await moduleRef.get(PaymentMethodRepository);
        emailVerifyTokenRepository = await moduleRef.get(EmailVerifyTokenRepository);
    });
    
    beforeAll(async () => {
        await paymentMethodRepository.delete({});
        await invoiceRepository.delete({});
        await subscriptionRepository.delete({});
        await customerRepository.delete({});
        await emailVerifyTokenRepository.delete({});
        await forgottenPasswordRepository.delete({});
        await activityRepository.delete({});
        await forgottenPasswordRepository.delete({});
        await testCaseRepository.delete({});
        await sectionRepository.delete({});
        await testSuiteReportRepository.delete({});
        await testCaseResultRepository.delete({});
        await testSuiteRepository.delete({});
        await projectRepository.delete({});
        await userRepository.delete({});
    });

    describe("POST /projects/:id/test-suites", () => {
        it('should return error for test cases not found for the test suite', async () => {
            const { user } = mockedUser[0];
            
            // create user and login to get token
            await request(app.getHttpServer())
                .post('/auth/register')
                .set('Accept', 'application/json')
                .send(mockedUser[0])
                .expect(HttpStatus.CREATED);

            const newUser = await userRepository.findOne({
                email: user.email
            });
            newUser.isVerified = true;
            await userRepository.save(newUser);

            const { body } = await request(app.getHttpServer())
                .post('/auth/login')
                .set('Accept', 'application/json')
                .send({
                    email: mockedUser[0].user.email,
                    password: mockedUser[0].user.password
                })
                .expect(HttpStatus.OK);
            
            token = body.data.token.accessToken;
            
            const projectRes = await request(app.getHttpServer())
                .post('/projects')
                .set('authorization', `Bearer ${token}`)
                .send(mockedProject[0])
                .expect(HttpStatus.CREATED);

            mockedProject[0].id = projectRes.body.data.id;

            const res = await request(app.getHttpServer())
                .post(`/projects/${mockedProject[0].id}/test-suites`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    testSuite: mockedTestSuites[0]
                })
                .expect(HttpStatus.NOT_FOUND);
            
            expect(res.body.data).toBeNull();
        });

        it('should return error for project not found', async () => {
            const randomProjectId = "11111111-9156-4c26-9c29-d43cfbe6fff3";

            const res = await request(app.getHttpServer())
                .post(`/projects/${randomProjectId}/test-suites`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    testSuite: mockedTestSuites[0]
                })
                .expect(HttpStatus.NOT_FOUND);
            
            expect(res.body.data).toBeNull();
        });

        it('should create a new test suite', async () => {
            const mockedProjectId = mockedProject[0].id;

            // add some test cases
            await request(app.getHttpServer())
                .post(`/projects/${mockedProjectId}/test-cases`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    testcase: mockedTestCases[0]
                })
                .expect(HttpStatus.CREATED);

            await request(app.getHttpServer())
                .post(`/projects/${mockedProjectId}/test-cases`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    testcase: mockedTestCases[1]
                })
                .expect(HttpStatus.CREATED);

            const res = await request(app.getHttpServer())
                .post(`/projects/${mockedProjectId}/test-suites`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    testSuite: mockedTestSuites[0]
                })
                .expect(HttpStatus.CREATED);
            
            const newTestSuite = res.body.data;
            expect(newTestSuite).toHaveProperty("id");
            mockedTestSuites[0].id = newTestSuite.id;   

            const testSuite = await testSuiteRepository.findOne({
                id: res.body.data.id
            });

            expect(testSuite).toBeTruthy();
            expect(testSuite.id).toEqual(newTestSuite.id);
            expect(testSuite.name).toEqual(newTestSuite.name);
            expect(testSuite.status).toEqual(TestSuiteStatus.PENDING);
        });
    });

    describe("PUT /projects/:id/test-suite/:testSuiteId", () => {
        it('should return error for testsuite not found', async () => {
            const randomTestSuiteId = "11111111-9156-4c26-9c29-d43cfbe6fff3";

            const res = await request(app.getHttpServer())
                .post(`/projects/${mockedProject[0].id}/test-suite/${randomTestSuiteId}`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    status: TestSuiteStatus.INPROGRESS
                })
                .expect(HttpStatus.NOT_FOUND);
            
            expect(res.body.data).toBeUndefined();
        });

        it('should update the test suite', async () => {
            const mockedTestSuite = mockedTestSuites[0];
            
            const res = await request(app.getHttpServer())
                .put(`/projects/${mockedProject[0].id}/test-suite/${mockedTestSuite.id}`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    status: TestSuiteStatus.INPROGRESS
                })
                .expect(HttpStatus.CREATED);
           
            const updatedTestSuite = res.body.data;
            expect(updatedTestSuite).toHaveProperty("status");

            const testSuite = await testSuiteRepository.findOne({
                id: mockedTestSuite.id
            });

            expect(testSuite).toBeTruthy();
            expect(updatedTestSuite.status).toEqual(TestSuiteStatus.INPROGRESS);
            expect(updatedTestSuite.status).toEqual(testSuite.status);
        });
    });

    describe("GET /projects/:id/test-suite-detail/:testSuiteId", () => {
        it('should return error for testsuite not found', async () => {
            const randomTestSuiteId = "11111111-9156-4c26-9c29-d43cfbe6fff3";

            const res = await request(app.getHttpServer())
                .get(`/projects/${mockedProject[0].id}/test-suite-detail/${randomTestSuiteId}`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.NOT_FOUND);
            
            expect(res.body.data).toBeNull();
        });

        it('should find the testsuite details', async () => {
            const mockedTestSuite = mockedTestSuites[0];
            
            const res = await request(app.getHttpServer())
                .get(`/projects/${mockedProject[0].id}/test-suite-detail/${mockedTestSuite.id}`)
                .set('authorization', `Bearer ${token}`)
                .send();
           
            const testSuite = await testSuiteRepository.findOne({
                id: mockedTestSuite.id
            });
            expect(testSuite).toBeTruthy();
            expect(testSuite.id).toEqual(res.body.data.id);
            expect(testSuite.name).toEqual(res.body.data.name);
            expect(testSuite.status).toEqual(res.body.data.status);
        });
    });

    describe("GET /projects/:id/test-suites", () => {
        it('should find all the testsuites for a project', async () => {
            // create some test suites
            await request(app.getHttpServer())
                .post(`/projects/${mockedProject[0].id}/test-suites`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    testSuite: mockedTestSuites[1]
                })
                .expect(HttpStatus.CREATED);

            await request(app.getHttpServer())
                .post(`/projects/${mockedProject[0].id}/test-suites`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    testSuite: mockedTestSuites[2]
                })
                .expect(HttpStatus.CREATED);

            const res = await request(app.getHttpServer())
                .get(`/projects/${mockedProject[0].id}/test-suites`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.OK);
            
            const testSuitesResponse = res.body.data.data;

            const testSuites = await testSuiteRepository.find({
                project_id: mockedProject[0].id
            });
            
            expect(testSuitesResponse).toBeTruthy();
            expect(testSuites).toBeTruthy();
            expect(testSuites).toHaveLength(testSuitesResponse.length);

            testSuitesResponse.forEach(testSuite => {
                const checktTestSuite = testSuites.find(element => element.id === testSuite.id);
                expect(checktTestSuite).toBeTruthy();
            });
        });
    });

    describe("GET /test-suites/:id/test-results", () => {
        it('should return error for testsuite not found', async () => {
            const randomTestSuiteId = "11111111-9156-4c26-9c29-d43cfbe6fff3";

            const res = await request(app.getHttpServer())
                .get(`/test-suites/${randomTestSuiteId}/test-results`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.NOT_FOUND);
            
            expect(res.body.data).toBeNull();
        });

        it('should find all the test results for a test suite', async () => {
            const mockedTestSuite = mockedTestSuites[0];

            const res = await request(app.getHttpServer())
                .get(`/test-suites/${mockedTestSuite.id}/test-results`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.OK);
            
            const testResults = res.body.data.data;

            testResults.forEach(testResult => {
                expect(testResult).toHaveProperty("id");
                expect(testResult.status).toEqual(TestCaseResultStatus.UNTESTED);
                expect(testResult.testCaseExecutionPriority).toEqual(ExecutionPriority.MEDIUM);
            });
        });
    });

    describe("GET /test-suites/:id/test-result", () => {
        it('should return error for test result not found', async () => {
            const randomTestResultId = "11111111-9156-4c26-9c29-d43cfbe6fff3";

            const res = await request(app.getHttpServer())
                .get(`/test-suites/${randomTestResultId}/test-result`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.NOT_FOUND);
            
            expect(res.body.data).toBeNull();
        });

        it('should find the details of a test result', async () => {
            const mockedTestSuite = mockedTestSuites[0];

            // find test result id
            const testResult = await testCaseResultRepository.findOne({
                where: {
                    testSuiteId: mockedTestSuite.id
                }
            });
            expect(testResult).toBeTruthy();
            expect(testResult).toHaveProperty("id");

            const res = await request(app.getHttpServer())
                .get(`/test-suites/${testResult.id}/test-result`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.OK);
            
            const testResultData = res.body.data;

            expect(testResultData).toBeTruthy();
            expect(testResultData.id).toEqual(testResult.id);
            expect(testResultData.status).toEqual(testResult.status);
            expect(testResultData.comment).toEqual(testResult.comment);
            expect(testResultData.testCaseTitle).toEqual(testResult.testCaseTitle);
            expect(testResultData.testCasePreconditions).toEqual(testResult.testCasePreconditions);
            expect(testResultData.testCaseExpectedResults).toEqual(testResult.testCaseExpectedResults);
            expect(testResultData.testCaseSteps).toEqual(testResult.testCaseSteps);
            expect(testResultData.sectionName).toEqual(testResult.sectionName);
            expect(testResultData.testCaseId).toEqual(testResult.testCaseId);
            expect(testResultData.testCaseExecutionPriority).toEqual(testResult.testCaseExecutionPriority);
        });
    });

    describe("PUT /test-suites/test-results/:testResultId", () => {
        it('should return error for test result not found', async () => {
            const randomTestResultId = "11111111-9156-4c26-9c29-d43cfbe6fff3";

            const res = await request(app.getHttpServer())
                .put(`/test-suites/test-results/${randomTestResultId}`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.NOT_FOUND);
            
            expect(res.body.data).toBeNull();
        });

        it('should update the status of test result from untested to passed', async () => {
            const mockedTestSuite = mockedTestSuites[0];

            // find test result id
            const testResult = await testCaseResultRepository.findOne({
                where: {
                    testSuiteId: mockedTestSuite.id
                }
            });
            expect(testResult).toBeTruthy();
            expect(testResult).toHaveProperty("id");
            expect(testResult.status).toEqual(TestCaseResultStatus.UNTESTED);

            const updateDoc = {
                status: TestCaseResultStatus.PASSED
            }
            const res = await request(app.getHttpServer())
                .put(`/test-suites/test-results/${testResult.id}`)
                .set('authorization', `Bearer ${token}`)
                .send(updateDoc)
                .expect(HttpStatus.CREATED);
            
            const updatedTestCaseResult = res.body.data;

            expect(updatedTestCaseResult.id).toEqual(testResult.id);
            expect(updatedTestCaseResult.status).toEqual(TestCaseResultStatus.PASSED);
        });
    });

    describe("DELETE /test-suites/:id", () => {
        it('should return error for test suite not found', async () => {
            const randomTestResultId = "11111111-9156-4c26-9c29-d43cfbe6fff3";

            const res = await request(app.getHttpServer())
                .delete(`/test-suites/${randomTestResultId}`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.NOT_FOUND);
            
            expect(res.body.data).toBeNull();
        });

        it('should delete the test suite', async () => {
            const mockedTestSuite = mockedTestSuites[0];

            expect(mockedTestSuite).toHaveProperty("id");

            await request(app.getHttpServer())
                .delete(`/test-suites/${mockedTestSuite.id}`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.OK);

            const testSuite = await testSuiteRepository.findOne({
                id: mockedTestSuite.id
            });

            expect(testSuite).toBeUndefined();
        });
    });

    afterAll(async () => {
        await paymentMethodRepository.delete({});
        await invoiceRepository.delete({});
        await subscriptionRepository.delete({});
        await customerRepository.delete({});
        await emailVerifyTokenRepository.delete({});
        await forgottenPasswordRepository.delete({});
        await activityRepository.delete({});
        await forgottenPasswordRepository.delete({});
        await testCaseRepository.delete({});
        await sectionRepository.delete({});
        await testSuiteReportRepository.delete({});
        await testCaseResultRepository.delete({});
        await testSuiteRepository.delete({});
        await projectRepository.delete({});
        await userRepository.delete({});
    });

    afterAll(async () => {
        await app.close();
    });

    afterAll(async () => {
        await new Promise<void>(
            resolve => setTimeout(() => resolve(), 500)
        ); 
    });
});
