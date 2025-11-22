
import request from "supertest";
import prisma from "../setup/setupDB.js";
import app from "../../src/app.js";


/*
router.get('/', getAllReviewsHandler);
router.get('/:id', getReviewByIdHandler);
router.post('/', createReviewHandler);
router.put('/:id', updateReviewHandler);
router.delete('/:id', deleteReviewHandler);
*/

describe("Reviews API", () => {
    let adminToken;
    let loginAdminRes;
    let loginMemberRes;
    let memberToken;

    let adminUser;
    let memberUser;
    let book;
    let adminReview;        
    let memberReview;       
    let memberReviewToDelete;

    beforeAll(async () => {
        adminUser = await prisma.user.findUnique({ where: { username: "admin1@test.net" } }) || await prisma.user.findFirst();
        memberUser = await prisma.user.findUnique({ where: { username: "user1@test.net" } }) || (await prisma.user.findMany({ take: 2 }))[1] || adminUser;
        book = await prisma.book.findFirst();

        adminReview = await prisma.review.create({
            data: {
                title: "admin seeded review",
                content: "admin content",
                rating: 5,
                book_id: book.book_id,
                user_id: adminUser.user_id,
            },
        });

        memberReview = await prisma.review.create({
            data: {
                title: "member seeded review",
                content: "member content",
                rating: 4,
                book_id: book.book_id,
                user_id: memberUser.user_id,
            },
        });

        memberReviewToDelete = await prisma.review.create({
            data: {
                title: "member to delete",
                content: "delete me",
                rating: 3,
                book_id: book.book_id,
                user_id: memberUser.user_id,
            },
        });
    });

    afterAll(async () => {
        const ids = [adminReview, memberReview, memberReviewToDelete].filter(Boolean).map(r => r.review_id);
        if (ids.length) await prisma.review.deleteMany({ where: { review_id: { in: ids } } });
        await prisma.$disconnect();
    });


    beforeEach(async () => {
        loginAdminRes = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "admin1@test.net",
                password: "password"
            })
            .expect(200);

        adminToken = loginAdminRes.body.accessToken;

        loginMemberRes = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "user1@test.net",
                password: "password"
            })
            .expect(200);

        memberToken = loginMemberRes.body.accessToken;
    });

    test ("GET /reviews OK returns all reviews", async () => {
        const response = await request(app)
            .get("/libapi/reviews")
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test ("GET /reviews FAIL does not all reviews", async () => {
        const responseNoAuth = await request(app)
            .get("/libapi/reviews");
        expect(responseNoAuth.status).toBe(401);
        expect(responseNoAuth.body).toHaveProperty("error");
    });

    test ("POST /reviews OK creates a review", async () => {
         const newReview = {
            book_id: book.book_id,
            user_id: adminUser.user_id,
            rating: 5,
            content: "I hate this stupid chungus book!"
        };
        const res = await request(app)
            .post("/libapi/reviews")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(newReview);
        expect(res.status).toBe(201);
    });

    test ("POST /reviews FAIL does not create a review", async () => {
        const newReview = {
            book_id: book.book_id,
            user_id: memberUser.user_id,
            rating: 5,
            content: "I love big chungus!"
        };

        const res = await request(app)
            .post("/libapi/reviews")
            .set("Authorization", `Bearer ${memberToken}`)
            .send(newReview);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");

        const resNoAuth = await request(app)
            .post("/libapi/reviews")
            .send(newReview);
        expect(resNoAuth.status).toBe(401);
        expect(resNoAuth.body).toHaveProperty("error");

        const resNotFound = await request(app)
        .post("/libapi/reviews")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ ...newReview, user_id: Number.MAX_SAFE_INTEGER });
        expect([400, 404]).toContain(resNotFound.status);
        expect(resNotFound.body).toHaveProperty("error");
    });

    test ("PUT /reviews/:id OK updates a review", async () => {
        const updatedReview = {
            rating: 4,
            comment: "I kinda like big chungus."
        };
        const res = await request(app)
            .put(`/libapi/reviews/${adminReview.review_id}`)
            .set("Authorization", `Bearer ${memberToken}`)
            .send(updatedReview);
        expect(res.status).toBe(200);
    });
    test ("PUT /reviews/:id FAIL does not update a review", async () => {
        const updatedReview = {
            rating: 11,
            comment: "Big chungus is life."
        };
        const res = await request(app)
            .put(`/libapi/reviews/${adminReview.review_id}`)
            .set("Authorization", `Bearer ${memberToken}`)
            .send(updatedReview);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");

        const resNoAuth = await request(app)
            .put(`/libapi/reviews/${adminReview.review_id}`)
            .send(updatedReview);
        expect(resNoAuth.status).toBe(401);
        expect(resNoAuth.body).toHaveProperty("error");

        const resNotFound = await request(app)
            .put("/libapi/reviews/9999")
            .set("Authorization", `Bearer ${memberToken}`)
            .send({ rating: 3, comment: "Not found review." });
        expect(resNotFound.status).toBe(404);
        expect(resNotFound.body).toHaveProperty("error");

        const resValidation = await request(app)
            .put(`/libapi/reviews/${adminReview.review_id}`)
            .set("Authorization", `Bearer ${memberToken}`)
            .send({ rating: 0, comment: "Invalid rating." });
        expect(resValidation.status).toBe(400);
        expect(resValidation.body).toHaveProperty("error");
    });

    test ("DELETE /reviews/:id OK deletes a review", async () => {
        const res = await request(app)
            .delete(`/libapi/reviews/${memberReviewToDelete.review_id}`)
            .set("Authorization", `Bearer ${memberToken}`);
        expect(res.status).toBe(204);
    });

    test ("DELETE /reviews/:id FAIL does not delete a review", async () => {
        const res = await request(app)
            .delete(`/libapi/reviews/${memberReview.review_id}`)
            .set("Authorization", `Bearer ${memberToken}`);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");

        const resNoAuth = await request(app)
            .delete(`/libapi/reviews/${adminReview.review_id}`);
        expect(resNoAuth.status).toBe(401);
        expect(resNoAuth.body).toHaveProperty("error");

        const resNotFound = await request(app)
            .delete(`/libapi/reviews/9999`)
            .set("Authorization", `Bearer ${memberToken}`);
        expect(resNotFound.status).toBe(404);
        expect(resNotFound.body).toHaveProperty("error");
    });


});
