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

describe('TestCase route e2e test cases', () => {
    let app: INestApplication;
    let userRepository: Repository<UserEntity>;
    let forgottenPasswordRepository: Repository<ForgottenPasswordEntity>;
    let projectRepository: Repository<ProjectEntity>;
    let sectionRepository: Repository<SectionEntity>;
    let testCaseRepository: Repository<TestCaseEntity>;
    let customerRepository: Repository<CustomerEntity>;
    let subscriptionRepository: Repository<SubscriptionEntity>;
    let invoiceRepository: Repository<InvoiceEntity>;
    let paymentMethodRepository: Repository<PaymentMethodEntity>;
    let emailVerifyTokenRepository : Repository<EmailVerifyTokenEntity>;
    let token = null;
    
    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [  AppModule]
        }).compile();
        
        app = moduleRef.createNestApplication();
        await app.init();

        userRepository = await moduleRef.get(UserRepository);       
        forgottenPasswordRepository = await moduleRef.get(ForgottenPasswordRepository);
        projectRepository = await moduleRef.get(ProjectRepository);
        sectionRepository = await moduleRef.get(SectionRepository); 
        customerRepository = await moduleRef.get(CustomerRepository);
        subscriptionRepository = await moduleRef.get(SubscriptionRepository);
        invoiceRepository = await moduleRef.get(InvoiceRepository);
        paymentMethodRepository = await moduleRef.get(PaymentMethodRepository);
        emailVerifyTokenRepository = await moduleRef.get(EmailVerifyTokenRepository);
        testCaseRepository = await moduleRef.get(TestCaseRepository);
    });
    
    beforeAll(async () => {
        await paymentMethodRepository.delete({});
        await invoiceRepository.delete({});
        await subscriptionRepository.delete({});
        await customerRepository.delete({});
        await emailVerifyTokenRepository.delete({});
        await forgottenPasswordRepository.delete({});
        await testCaseRepository.delete({});
        await sectionRepository.delete({});
        await projectRepository.delete({});
        await userRepository.delete({});
    });

    describe("POST /projects/:id/test-cases", () => {
        it('should create a test case in unassigned section', async () => {
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
            
            token = body?.data?.token?.accessToken;
            
            const projectRes = await request(app.getHttpServer())
                .post('/projects')
                .set('authorization', `Bearer ${token}`)
                .send(mockedProject[0])
                .expect(HttpStatus.CREATED);

            mockedProject[0].id = projectRes?.body?.data?.id;

            const res = await request(app.getHttpServer())
                .post(`/projects/${mockedProject[0].id}/test-cases`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    testcase: mockedTestCases[0]
                })
                .expect(HttpStatus.CREATED);
            
            expect(res.body.data).toHaveProperty("id");

            const testCase = await testCaseRepository.findOne({
                id: res.body.data.id
            });

            expect(res?.body?.data?.id).toEqual(testCase.id);
            expect(res?.body?.data?.title).toEqual(testCase.title);
            expect(res?.body?.data?.preconditions).toEqual(testCase.preconditions);
            expect(res?.body?.data?.steps).toEqual(testCase.steps);
            expect(res?.body?.data?.expectedResults).toEqual(testCase.expectedResults);
        });
    });

    describe("GET /projects/:id/test-cases/:testCaseId", () => {
        it('should return error for project not found', async () => {
            
            const { body } = await request(app.getHttpServer())
                .get(`/projects/99999999-9156-4c26-9c29-d43cfbe6fff3/test-cases/99999999-9156-4c26-9c29-d43cfbe6fff3`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.NOT_FOUND);
            
            expect(body?.data).toBeNull();
        });
        
        it('should return error for test case not found', async () => {
            
            const { body } = await request(app.getHttpServer())
                .get(`/projects/${mockedProject[0].id}/test-cases/99999999-9156-4c26-9c29-d43cfbe6fff3`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.NOT_FOUND);
            expect(body?.data).toBeNull();
        });

        it('should find the test case', async () => {
            const testCase = await testCaseRepository.findOne({
                title: mockedTestCases[0].title
            });

            expect(testCase).toHaveProperty("id");

            const { body } = await request(app.getHttpServer())
                .get(`/projects/${mockedProject[0].id}/test-cases/${testCase.id}`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.OK);
                
            expect(body?.data?.id).toEqual(testCase.id);
            expect(body?.data?.title).toEqual(testCase.title);
            expect(body?.data?.preconditions).toEqual(testCase.preconditions);
            expect(body?.data?.steps).toEqual(testCase.steps);
            expect(body?.data?.expectedResults).toEqual(testCase.expectedResults);
        });
    });

    describe("PUT /projects/:id/test-cases/:testCaseId", () => {
        
        it('should return error for test case not found', async () => {
            const updateDoc = {
                steps: "updated steps",
                expectedResults: "updated expected results" 
            }
            const { body } = await request(app.getHttpServer())
                .put(`/projects/${mockedProject[0].id}/test-cases/99999999-9156-4c26-9c29-d43cfbe6fff3`)
                .set('authorization', `Bearer ${token}`)
                .send(updateDoc)
                .expect(HttpStatus.NOT_FOUND);
            expect(body?.data).toBeNull();
        });

        it('should update the test case details', async () => {
            const updateDoc = {
                steps: "updated steps",
                expectedResults: "updated expected results" 
            }
            
            const testCase = await testCaseRepository.findOne({
                title: mockedTestCases[0].title
            });

            expect(testCase).toHaveProperty("id");

            const { body } = await request(app.getHttpServer())
                .put(`/projects/${mockedProject[0].id}/test-cases/${testCase.id}`)
                .set('authorization', `Bearer ${token}`)
                .send(updateDoc)
                .expect(HttpStatus.OK);
                
            expect(body?.data?.id).toEqual(testCase.id);
            expect(body?.data?.title).toEqual(testCase.title);
            expect(body?.data?.preconditions).toEqual(testCase.preconditions);
            expect(body?.data?.steps).toEqual(updateDoc.steps);
            expect(body?.data?.expectedResults).toEqual(updateDoc.expectedResults);
        });
    });

    describe("GET /projects/:id/test-cases", () => {

        it('should get all the test cases for the project', async () => {
            
            await request(app.getHttpServer())
                .post(`/projects/${mockedProject[0].id}/test-cases`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    testcase: mockedTestCases[1]
                })
                .expect(HttpStatus.CREATED);
            
            await request(app.getHttpServer())
                .post(`/projects/${mockedProject[0].id}/test-cases`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    testcase: mockedTestCases[2]
                })
                .expect(HttpStatus.CREATED);

            const { body } = await request(app.getHttpServer())
                .get(`/projects/${mockedProject[0].id}/test-cases`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.OK);
            
            expect(body?.data[0]?.testcases?.length).toEqual(mockedTestCases.length);

            const testCases = body.data[0].testcases;
            testCases.forEach(testCase => {
                const checkTestCase = mockedTestCases.find(mockTestCase => mockTestCase.title === testCase.title);
                expect(checkTestCase).toBeTruthy();
            });
        });
    });

    describe("DELETE /test-cases/:testCaseId", () => {
        it('should return error for test case not found', async () => {
            
            const { body } = await request(app.getHttpServer())
                .delete(`/test-cases/99999999-9156-4c26-9c29-d43cfbe6fff3`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.NOT_FOUND);
            expect(body?.data).toBeNull();
        });

        it('should delete the test case', async () => {
            
            const testCase = await testCaseRepository.findOne({
                title: mockedTestCases[0].title
            });

            expect(testCase).toHaveProperty("id");

            await request(app.getHttpServer())
                .delete(`/test-cases/${testCase.id}`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.OK);
            
            const deletedTestCase = await testCaseRepository.findOne({
                id: testCase.id
            });
            expect(deletedTestCase).toBeUndefined();
        });
    });

    afterAll(async () => {
        await paymentMethodRepository.delete({});
        await invoiceRepository.delete({});
        await subscriptionRepository.delete({});
        await customerRepository.delete({});
        await emailVerifyTokenRepository.delete({});
        await forgottenPasswordRepository.delete({});
        await testCaseRepository.delete({});
        await sectionRepository.delete({});
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
