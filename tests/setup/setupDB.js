import prisma from '../../config/db.js';
import bcrypt from "bcrypt";

const hashedPassword = await bcrypt.hash("password", 10);

beforeAll(async () => {
    await prisma.$connect();


    await prisma.user.create({
            data: {
                username: "user1@test.net",
                password: hashedPassword,
                role: "member"
            }
        });

    await prisma.user.create({
        data: {
            username: "user2@test.net",
            password: hashedPassword,                
            role: "member"
        }
    });

    await prisma.user.create({
        data: {
            username: "admin1@test.net",
            password: hashedPassword,                
            role: "admin"
        }
    });

    await prisma.user.create({
        data: {
            username: "admin2@test.net",
            password: hashedPassword,                
            role: "admin"
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

    
})

afterAll(async () => {
    await prisma.user.deleteMany({
        where: { username: {contains: "@test.net"} }
    });

    
    await prisma.$disconnect();
})

export default prisma;