import prisma from '../../config/db.js';
import app from '../../src/server.js'

beforeAll(async () => {
    await prisma.$connect();
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