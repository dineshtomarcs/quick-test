/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import * as request from "supertest";
import { INestApplication, HttpStatus } from "@nestjs/common";
import { Repository } from "typeorm";
import { AppModule } from '../src/app.module';
import { UserEntity } from "../src/service-users/user/user.entity";
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
import { ForgottenPasswordRepository } from "../src/service-users/user/forgotten-passowrd.repository";
import { ForgottenPasswordEntity } from "../src/service-users/user/forgotten-password-reqs.entity";
 
const mockedUser: any = [
    {
        user: {
            firstName: "john",
            lastName: "cena",
            email: "john@gmail.com",
            password: "password"
        }, 
        organization: "crownstack"
    }
];

describe('Auth route e2e test cases', () => {
    let app: INestApplication;
    let repository: Repository<UserEntity>;
    let customerRepository: Repository<CustomerEntity>;
    let subscriptionRepository: Repository<SubscriptionEntity>;
    let invoiceRepository: Repository<InvoiceEntity>;
    let paymentMethodRepository: Repository<PaymentMethodEntity>;
    let emailVerifyTokenRepository : Repository<EmailVerifyTokenEntity>;
    let forgottenPasswordRepository : Repository<ForgottenPasswordEntity>;
    let token = null;


    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [  AppModule]
        }).compile();
        
        app = moduleRef.createNestApplication();
        await app.init();

        repository = await moduleRef.get(UserRepository);
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
        await repository.delete({});
    });

    describe("/auth/register", () => {
        it('should create a new user', async () => {
            const newUser = mockedUser[0];
        
            expect(newUser).toHaveProperty("user");
            expect(newUser.user).toHaveProperty("firstName");
            expect(newUser.user).toHaveProperty("email");
            expect(newUser.user).toHaveProperty("password");
            expect(newUser).toHaveProperty("organization");
            
            const res = await request(app.getHttpServer())
                    .post('/auth/register')
                    .set('Accept', 'application/json')
                    .send(newUser)
                    .expect(HttpStatus.CREATED);
            
            expect(res?.body?.data).toHaveProperty("id");

            const id = res?.body?.data?.id;
            const user: UserEntity = await repository.findOne({
                id
            });
            user.isVerified = true; 
            await repository.save(user);

            expect(user).toHaveProperty("id");
            expect(user.id).toEqual(id);
        });

        it('repsonse should have an error for duplicate email', async () => {
            const newUser = mockedUser[0];
            
            expect(newUser).toHaveProperty("user");
            expect(newUser.user).toHaveProperty("firstName");
            expect(newUser.user).toHaveProperty("email");
            expect(newUser.user).toHaveProperty("password");
            expect(newUser).toHaveProperty("organization");
            
            const res = await request(app.getHttpServer())
                    .post('/auth/register')
                    .set('Accept', 'application/json')
                    .send(newUser)
                    .expect(HttpStatus.CONFLICT);
            
            expect(res?.body?.data).toBeNull();
        });
    });

    describe("/auth/login", () => {

        it('response should have an error for email not found', async () => {
            const { user } = mockedUser[0];
            
            expect(user).toHaveProperty("password");
            
            const { body } = await request(app.getHttpServer())
                    .post('/auth/login')
                    .set('Accept', 'application/json')
                    .send({
                        email: "random@email.com",
                        password: user.password
                    })
                    .expect(HttpStatus.EXPECTATION_FAILED);
            expect(body?.data).toBeNull();
        });

        it('response should have an error for mismatch email/password', async () => {
            const { user } = mockedUser[0];
            
            expect(user).toHaveProperty("email");
            
            const { body } = await request(app.getHttpServer())
                    .post('/auth/login')
                    .set('Accept', 'application/json')
                    .send({
                        email: user.email,
                        password: "randomWrongPassword"
                    })
                    .expect(HttpStatus.EXPECTATION_FAILED);
            expect(body?.data).toBeNull();
        });

        it('response should contain user and token', async () => {
            const { user } = mockedUser[0];
            
            expect(user).toHaveProperty("email");
            expect(user).toHaveProperty("password");
            
            const { body } = await request(app.getHttpServer())
                    .post('/auth/login')
                    .set('Accept', 'application/json')
                    .send({
                        email: user.email,
                        password: user.password
                    })
                    .expect(HttpStatus.OK);
            expect(body?.data).toHaveProperty("token");
            expect(body?.data?.user).toHaveProperty("id");
            
            token = body?.data?.token?.accessToken;
            const checkUser: UserEntity = await repository.findOne({
                id: body?.data?.user?.id
            });
            if(checkUser) {
                expect(body?.data?.user?.id).toEqual(checkUser.id);
            }
        }); 
    });

    describe("/auth/me", () => {

        it('should return Unauthorized', async () => {
            
            const { body } = await request(app.getHttpServer())
                    .get('/auth/me')
                    .set('Accept', 'application/json')
                    .set('authorization', `Bearer some random Token`)
                    .expect(HttpStatus.UNAUTHORIZED);

            expect(body?.data).toBeNull();
        }); 

        it('response should contain user', async () => {
            if(token) {
                const { body } = await request(app.getHttpServer())
                        .get('/auth/me')
                        .set('Accept', 'application/json')
                        .set('authorization', `Bearer ${token}`)
                        .expect(HttpStatus.OK);
                expect(body?.data).toHaveProperty("id");
                
                const user: UserEntity = await repository.findOne({
                    id: body?.data?.id
                });
                if(user) {
                    expect(body?.data?.id).toEqual(user.id);
                }
            }
        }); 
    });

    describe("/auth/resend-verification-link", () => {
        it('should return error for user not found', async () => {
            const randomEmail = "random@email.com";

            const { body } = await request(app.getHttpServer())
                    .post('/auth/resend-verification-link')
                    .set('Accept', 'application/json')
                    .send({
                        email: randomEmail
                    })
                    .expect(HttpStatus.NOT_FOUND);

            expect(body?.data).toBeNull();
        }); 
        
        it('should send verification link on email', async () => {
            const { user } = mockedUser[0];

            expect(user).toHaveProperty('email');

            await request(app.getHttpServer())
                    .post('/auth/resend-verification-link')
                    .set('Accept', 'application/json')
                    .send({
                        email: user.email
                    })
                    .expect(HttpStatus.CREATED);

            const userToken = await emailVerifyTokenRepository.findOne({
                email: user.email
            });
            expect(userToken).toBeTruthy();
            expect(userToken).toHaveProperty('token');
            expect(userToken.token).toBeTruthy();
        });  
    });

    describe("/auth/verify", () => {
        it('should return error for invalid token', async () => {
            const randomToken = "randomtoken";

            const { body } = await request(app.getHttpServer())
                    .post('/auth/verify')
                    .set('Accept', 'application/json')
                    .send({
                        token: randomToken
                    })
                    .expect(HttpStatus.BAD_REQUEST);

            expect(body?.data).toBeNull();
        }); 
        
        it('should verify the user', async () => {
            const { user } = mockedUser[0];
            const userToken = await emailVerifyTokenRepository.findOne({
                email: user.email
            });

            if (userToken) {
                expect(userToken).toHaveProperty('token');
                await request(app.getHttpServer())
                        .post('/auth/verify')
                        .set('Accept', 'application/json')
                        .send({
                            token: userToken.token
                        })
                        .expect(HttpStatus.CREATED);

                const updatedUser = await repository.findOne({
                    email: user.email
                });
                expect(updatedUser).toBeTruthy();
                expect(updatedUser).toHaveProperty('isVerified');
                expect(updatedUser.isVerified).toBeTruthy();
            }
        });  
    });

    describe("/auth/send-reset-link", () => {
        it('should return error for user not found', async () => {
            const randomEmail = "random@email.com";

            const { body } = await request(app.getHttpServer())
                    .post('/auth/send-reset-link')
                    .set('Accept', 'application/json')
                    .send({
                        email: randomEmail
                    })
                    .expect(HttpStatus.NOT_FOUND);

            expect(body?.data).toBeNull();
        }); 
        
        it('should send password reset link on email', async () => {
            const { user } = mockedUser[0];

            expect(user).toHaveProperty('email');

            await request(app.getHttpServer())
                    .post('/auth/send-reset-link')
                    .set('Accept', 'application/json')
                    .send({
                        email: user.email
                    })
                    .expect(HttpStatus.CREATED);

            const userToken = await forgottenPasswordRepository.findOne({
                email: user.email
            });

            expect(userToken).toBeTruthy();
            expect(userToken).toHaveProperty('token');
            expect(userToken.token).toBeTruthy();
        });  
    });

    describe("/auth/reset-password", () => {
        it('should return error for invalid token', async () => {
            const randomToken = "randomtoken";
            const password = "password12";

            const { body } = await request(app.getHttpServer())
                    .post('/auth/reset-password')
                    .set('Accept', 'application/json')
                    .send({
                        token: randomToken,
                        password
                    })
                    .expect(HttpStatus.FORBIDDEN);

            expect(body?.data).toBeNull();
        }); 
        
        it('should update the password of the user', async () => {
            const { user } = mockedUser[0];
            const newPassword = 'password123';
            const userToken = await forgottenPasswordRepository.findOne({
                email: user.email
            });

            if (userToken) {
                expect(userToken).toHaveProperty('token');

                await request(app.getHttpServer())
                        .post('/auth/reset-password')
                        .set('Accept', 'application/json')
                        .send({
                            token: userToken.token,
                            password: newPassword
                        })
                        .expect(HttpStatus.OK);

                const updatedUser = await repository.findOne({
                    email: user.email
                });
                expect(updatedUser).toBeTruthy();
                expect(updatedUser).toHaveProperty('password');
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
        await repository.delete({});
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
