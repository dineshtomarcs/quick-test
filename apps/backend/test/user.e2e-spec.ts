/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import * as request from "supertest";
import { INestApplication, HttpStatus } from "@nestjs/common";
import { Repository } from "typeorm";

import { AppModule } from '../src/app.module';
import { UserEntity } from "../src/service-users/user/user.entity";
import { ForgottenPasswordEntity } from '../src/service-users/user/forgotten-password-reqs.entity';
import { SubscriptionRepository } from "../src/service-organization/payment/repositories/subscription.repository";
import { SubscriptionEntity } from "../src/service-organization/payment/entities/subscription.entity";
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
    },
    {
        user: {
            firstName: "Monty",
            email: "monty@gmail.com"
        }
    },
    {   
        user: {
            firstName: "johnny",
            email: "johnny@gmail.com"
        }
    }
];

describe('User route e2e test cases', () => {
    let app: INestApplication;
    let userRepository: Repository<UserEntity>;
    let forgottenPasswordRepository: Repository<ForgottenPasswordEntity>;
    let subscriptionRepository: Repository<SubscriptionEntity>;
    let emailVerifyTokenRepository : Repository<EmailVerifyTokenEntity>;
    let token = null;
    
    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [  AppModule]
        }).compile();
        
        app = moduleRef.createNestApplication();
        await app.init();

        userRepository = await moduleRef.get(UserRepository);       
        subscriptionRepository = await moduleRef.get(SubscriptionRepository);
        emailVerifyTokenRepository = await moduleRef.get(EmailVerifyTokenRepository);
        forgottenPasswordRepository = await moduleRef.get(ForgottenPasswordRepository);
    });
    
    beforeAll(async () => {
        await subscriptionRepository.delete({});
        await emailVerifyTokenRepository.delete({});
        await forgottenPasswordRepository.delete({});
        await userRepository.delete({});
    });

    describe("GET /users", () => {
        it('should find all users in the organization', async () => {
            const { user } = mockedUser[0];

            // create some users and login to get token
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
                    email: user.email,
                    password: user.password
                })
                .expect(HttpStatus.OK);
            
            token = body?.data?.token?.accessToken;
            
            const res = await request(app.getHttpServer())
                .get('/users')
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.OK);

            const itemCount = res?.body?.data?.meta?.itemCount;
            const users = res?.body?.data?.data;

            expect(itemCount).toEqual(1);
            expect(users[0].email).toEqual(user.email);
        });
    }); 

    describe("GET and PUT /users/:id", () => {
        it('should find the user with given userId', async () => {
            
            const user = await userRepository.findOne({
                email: mockedUser[0].user.email
            });
            
            const res = await request(app.getHttpServer())
                .get(`/users/${user.id}`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.OK);
            
            expect(res?.body?.data?.id).toEqual(user.id);
            expect(res?.body?.data?.email).toEqual(user.email);
        });

        it('should return user not found error', async () => {
            
            const res = await request(app.getHttpServer())
                .get(`/users/99999999-9156-4c26-9c29-d43cfbe6fff3`)
                .set('authorization', `Bearer ${token}`)
                .send()
                .expect(HttpStatus.OK);

            expect(res?.body?.data).toBeNull();
        });

        it('should update the user information', async () => {
            
            const user = await userRepository.findOne({
                email: mockedUser[0].user.email
            });
            
            const updateDoc = {
                lastName: "Potter"
            };
            await request(app.getHttpServer())
                .put(`/users/${user.id}`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    organization: "randomOrg",
                    user: updateDoc
                })
                .expect(HttpStatus.OK);
            
            const updatedUser = await userRepository.findOne({
                email: mockedUser[0].user.email
            });
            expect(updatedUser.id).toEqual(user.id);
            expect(updatedUser.email).toEqual(user.email);
            expect(updatedUser.lastName).toEqual(updateDoc.lastName);
        });
    });

    describe("PUT /users/update-password", () => {
        it('should return error old and new password cannot be same', async () => {
            
            const res = await request(app.getHttpServer())
                .put(`/users/update-password`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    oldPassword: "password",
                    newPassword: "password"
                })
                .expect(HttpStatus.BAD_REQUEST);
            expect(res?.body?.data).toBeNull();
        });

        it('should return error old password is incorrect', async () => {
            
            const res = await request(app.getHttpServer())
                .put(`/users/update-password`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    oldPassword: "123456789",
                    newPassword: "password"
                })
                .expect(HttpStatus.EXPECTATION_FAILED);

            expect(res?.body?.data).toBeNull();
        });

        it('should update the user password', async () => {
            
            await request(app.getHttpServer())
                .put(`/users/update-password`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    oldPassword: "password",
                    newPassword: "123456789"
                })
                .expect(HttpStatus.OK);
        });
    });

    describe("PUT /users/:id/status", () => {
        it('should update the status of user to inactive', async () => {
            const user = await userRepository.findOne({
                email: mockedUser[0].user.email
            });

            const res = await request(app.getHttpServer())
                .put(`/users/${user.id}/status`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    status: false
                })
                .expect(HttpStatus.OK);

            expect(res?.body?.data?.id).toEqual(user.id);
            expect(res?.body?.data?.email).toEqual(user.email);
        });
    });

    afterAll(async () => {
        await subscriptionRepository.delete({});
        await emailVerifyTokenRepository.delete({});
        await forgottenPasswordRepository.delete({});
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
