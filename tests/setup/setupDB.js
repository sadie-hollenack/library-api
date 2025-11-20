import prisma from '../../config/db.js';

beforeAll(async () => {
    await prisma.$connect();


    await prisma.user.create({
            data: {
                email: "user1@test.net",
                password: "password",
                role: "USER"
            }
        });

    await prisma.user.create({
        data: {
            email: "user2@test.net",
            password: "password",                
            role: "USER"
        }
    });

    await prisma.user.create({
        data: {
            email: "admin1@test.net",
            password: "password",                
            role: "ADMIN"
        }
    });
})

afterEach(async () => {
    await prisma.review.deleteMany({
        where: { title: {contains: "[TEST]"} }
    });

    await prisma.book.deleteMany({
        where: { title: {contains: "[TEST]"} }
    });

    await prisma.author.deleteMany({
        where: { name: {contains: "[TEST]"} }
    });

    await prisma.user.deleteMany({
        where: { email: {contains: "@test.net"} }
    });
})

afterAll(async () => {
    await prisma.$disconnect();
})

export default prisma;