/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import * as request from "supertest";
import { INestApplication, HttpStatus } from "@nestjs/common";
import { Repository } from "typeorm";
import { AppModule } from '../src/app.module';
import { OrganizationEntity } from "../src/service-organization/organization/organization.entity";
import { OrganizationRepository } from "../src/service-organization/organization/organization.repository";
import { UserEntity } from "../src/service-users/user/user.entity";
import { UserRepository } from '../src/service-users/user/user.repository';
import { ForgottenPasswordRepository } from "../src/service-users/user/forgotten-passowrd.repository";
import { ForgottenPasswordEntity } from '../src/service-users/user/forgotten-password-reqs.entity';
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

const mockedMember: any = [
    {
        firstName: "Alan",
        lastName: "walker",
        email: "alan@gmail.com"
    }
];

describe('Organization route e2e test cases', () => {
    let app: INestApplication;
    let userRepository: Repository<UserEntity>;
    let organizationRepository: Repository<OrganizationEntity>;
    let forgottenPasswordRepository: Repository<ForgottenPasswordEntity>;
    let customerRepository: Repository<CustomerEntity>;
    let subscriptionRepository: Repository<SubscriptionEntity>;
    let invoiceRepository: Repository<InvoiceEntity>;
    let paymentMethodRepository: Repository<PaymentMethodEntity>;
    let emailVerifyTokenRepository : Repository<EmailVerifyTokenEntity>;
    let organization = null;
    let token = null;
    
    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [  AppModule]
        }).compile();
        
        app = moduleRef.createNestApplication();
        await app.init();

        userRepository = await moduleRef.get(UserRepository);       
        organizationRepository = await moduleRef.get(OrganizationRepository);
        customerRepository = await moduleRef.get(CustomerRepository);
        subscriptionRepository = await moduleRef.get(SubscriptionRepository);
        invoiceRepository = await moduleRef.get(InvoiceRepository);
        paymentMethodRepository = await moduleRef.get(PaymentMethodRepository);
        emailVerifyTokenRepository = await moduleRef.get(EmailVerifyTokenRepository);
        forgottenPasswordRepository = await moduleRef.get(ForgottenPasswordRepository);
    });
    
    beforeAll(async () => {
        await paymentMethodRepository.delete({});
        await invoiceRepository.delete({});
        await subscriptionRepository.delete({});
        await customerRepository.delete({});
        await emailVerifyTokenRepository.delete({});
        await forgottenPasswordRepository.delete({});
        await userRepository.delete({});
        await organizationRepository.delete({});
    });

    describe("/organizations", () => {
        it('should create a new organization', async () => {
            const { user } = mockedUser[0];
            // create new orgadmin
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
            
            organization = await organizationRepository.findOne({
                id: newUser.organization_id
            }); 

            expect(organization).toBeTruthy();
            expect(organization.id).toEqual(newUser.organization_id);
        });
    }); 

    describe("/organizations/members", () => {
        it('should add a new member', async () => {

            const member = mockedMember[0];
            expect(member).toHaveProperty("firstName");
            expect(member).toHaveProperty("email");
            
            const { body } = await request(app.getHttpServer())
                .post('/organizations/members')
                .set('Accept', 'application/json')
                .set('authorization', `Bearer ${token}`)
                .send(member)
                .expect(HttpStatus.CREATED);
            expect(body.data).toHaveProperty("id");

            const id = body?.data?.id;
            const newMember = await userRepository.findOne({
                id
            });
            
            expect(newMember).toBeTruthy();
            expect(newMember.id).toEqual(id);
            expect(newMember?.organization.id).toEqual(organization.id);
        });
    });

    describe("/organizations/members/:id", () => {
        it('should update the member information', async () => {

            const member = await userRepository.findOne({
                email: mockedMember[0].email
            });
            
            if(member) {
                const newInfo = {
                    lastName: "Bruce"
                };
            
                const { body } = await request(app.getHttpServer())
                    .put(`/organizations/members/${member.id}`)
                    .set('Accept', 'application/json')
                    .set('authorization', `Bearer ${token}`)
                    .send(newInfo)
                    .expect(HttpStatus.OK);
                
                expect(body.data).toHaveProperty("id");

                const id = body?.data?.id;
                const updatedMember = await userRepository.findOne({
                    id
                });
                
                expect(updatedMember).toBeTruthy();
                expect(updatedMember.id).toEqual(id);
                expect(updatedMember.lastName).toEqual(newInfo.lastName);
            }
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
        await organizationRepository.delete({});
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
