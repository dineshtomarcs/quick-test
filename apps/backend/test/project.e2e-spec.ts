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
    },
    {
        name: "Project 2",
        description: "Project description"
    },
    {
        name: "Project 3",
        description: "Project description"
    }
]

describe('Project route e2e test cases', () => {
    let app: INestApplication;
    let userRepository: Repository<UserEntity>;
    let forgottenPasswordRepository: Repository<ForgottenPasswordEntity>;
    let projectRepository: Repository<ProjectEntity>;
    let sectionRepository: Repository<SectionEntity>;
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
    });
    
    beforeAll(async () => {
        await paymentMethodRepository.delete({});
        await invoiceRepository.delete({});
        await subscriptionRepository.delete({});
        await customerRepository.delete({});
        await emailVerifyTokenRepository.delete({});
        await forgottenPasswordRepository.delete({});
        await userRepository.delete({});
        await sectionRepository.delete({});
        await projectRepository.delete({});
    });

    describe("POST /projects", () => {
        it('should create a new project', async () => {
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
            
            const res = await request(app.getHttpServer())
                .post('/projects')
                .set('authorization', `Bearer ${token}`)
                .send(mockedProject[0])
                .expect(HttpStatus.CREATED);

            expect(res?.body?.data).toHaveProperty("id");

            const project = await projectRepository.findOne({
                id: res?.body?.data?.id
            });

            expect(project.id).toEqual(res?.body?.data?.id);
            expect(project.name).toEqual(res?.body?.data?.name);
        });
    });
    
    describe("GET /projects/:id", () => {
        it('should return error for project not found', async () => {       
            const { body } = await request(app.getHttpServer())
                .get('/projects/99999999-9156-4c26-9c29-d43cfbe6fff3')
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.NOT_FOUND);
            expect(body?.data).toBeNull();
        });

        it('should find the project', async () => {   
            const project = await projectRepository.findOne({
                name: mockedProject[0].name
            });

            const { body } = await request(app.getHttpServer())
                .get(`/projects/${project.id}`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.OK);

            expect(body?.data?.id).toEqual(project.id);
            expect(body?.data?.name).toEqual(project.name);
        });
    });

    describe("GET /projects", () => {
        it('should return error for unauthorized user', async () => {       
            const { body } = await request(app.getHttpServer())
                .get('/projects')
                .set('authorization', `Bearer 6516887685135465`)
                .send()
                .expect(HttpStatus.UNAUTHORIZED);
            
            expect(body?.message).toEqual("Unauthorized");
        });

        it('should find all the projects viewable by the user', async () => {  
            // create some sample projects 
            await request(app.getHttpServer())
                .post('/projects')
                .set('authorization', `Bearer ${token}`)
                .send(mockedProject[1])
                .expect(HttpStatus.CREATED);

            await request(app.getHttpServer())
                .post('/projects')
                .set('authorization', `Bearer ${token}`)
                .send(mockedProject[2])
                .expect(HttpStatus.CREATED);

            const { body } = await request(app.getHttpServer())
                .get(`/projects`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.OK);

            expect(body?.data?.meta?.itemCount).toEqual(mockedProject.length);
            
            const projects = body.data.data;
            projects.forEach(project => {
                const checkProject = mockedProject.find(mockProject => mockProject.name === project.name);
                expect(checkProject).toBeTruthy();
            });
        });
    });

    describe("PUT /projects/:id", () => {
        it('should return error for project not found', async () => {       
            const { body } = await request(app.getHttpServer())
                .put('/projects/99999999-9156-4c26-9c29-d43cfbe6fff3')
                .set('authorization', `Bearer ${token}`)
                .send({
                    project: {
                        description: "Temp description"
                    }
                })
                .expect(HttpStatus.NOT_FOUND);

            expect(body.data).toBeNull();
        });

        it('should update the project description', async () => {   
            const project = await projectRepository.findOne({
                name: mockedProject[0].name
            });

            const updateDoc = {
                description: "Temp description"
            }

            const { body } = await request(app.getHttpServer())
                .put(`/projects/${project.id}`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    project: updateDoc
                })
                .expect(HttpStatus.OK);

            expect(body?.data?.id).toEqual(project.id);
            expect(body?.data?.name).toEqual(project.name);
            expect(body?.data?.description).toEqual(updateDoc.description);
        });
    });

    describe("DELETE /projects/:id", () => {
        it('should return error for unauthorized user', async () => {       
            const { body } = await request(app.getHttpServer())
                .delete('/projects/99999999-9156-4c26-9c29-d43cfbe6fff3')
                .set('authorization', `Bearer 6516887685135465`)
                .send()
                .expect(HttpStatus.UNAUTHORIZED);
            
            expect(body?.message).toEqual("Unauthorized");
        });

        it('should return error for project not found', async () => {   
            const { body } = await request(app.getHttpServer())
                .delete(`/projects/99999999-9156-4c26-9c29-d43cfbe6fff3`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.NOT_FOUND);

            expect(body?.data).toBeNull();
        });

        it('should return error for project not found', async () => {   
            const project = await projectRepository.findOne({
                name: mockedProject[0].name
            });

            const { body } = await request(app.getHttpServer())
                .delete(`/projects/${project.id}`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.OK);
            
            expect(body?.message).toEqual("Project deleted successfully");
        });
    });

    afterAll(async () => {
        await paymentMethodRepository.delete({});
        await invoiceRepository.delete({});
        await subscriptionRepository.delete({});
        await customerRepository.delete({});
        await emailVerifyTokenRepository.delete({});
        await forgottenPasswordRepository.delete({});
        await userRepository.delete({});
        await sectionRepository.delete({});
        await projectRepository.delete({});
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
