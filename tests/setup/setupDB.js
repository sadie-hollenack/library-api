import prisma from '../../config/db.js';

beforeAll(async () => {
    await prisma.$connect();


    await prisma.user.create({
            data: {
                username: "user1@test.net",
                password: "password",
                role: "member"
            }
        });

    await prisma.user.create({
        data: {
            username: "user2@test.net",
            password: "password",                
            role: "member"
        }
    });

    await prisma.user.create({
        data: {
            username: "admin1@test.net",
            password: "password",                
            role: "member"
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
        where: { username: {contains: "@test.net"} }
    });
})

afterAll(async () => {
    await prisma.$disconnect();
})

export default prisma;