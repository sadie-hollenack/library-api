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
        const responseForbid = await request(app)
            .get("/libapi/reviews")
            .set("Authorization", `Bearer ${memberToken}`);
        expect(responseForbid.status).toBe(403);
        expect(responseForbid.body).toHaveProperty("error");

        const responseNoAuth = await request(app)
            .get("/libapi/reviews");
        expect(responseNoAuth.status).toBe(401);
        expect(responseNoAuth.body).toHaveProperty("error");
    });

    test ("POST /reviews OK creates a review", async () => {
        const newReview = {
            book_id: 1,
            user_id: 2,
            rating: 5,
            comment: "I hate this stupid chungus book!"
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
    });

    test ("POST /reviews FAIL does not create a review", async () => {
        const newReview = {
                book_id: 1,
                user_id: 2,
                rating: 5,
                comment: "I love big chungus!"
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
    });

    test ("PUT /reviews/:id OK updates a review", async () => {
        const updatedReview = {
            rating: 4,
            comment: "I kinda like big chungus."
        };
        const res = await request(app)
            .put("/libapi/reviews/1")
            .set("Authorization", `Bearer ${memberToken}`)
            .send(updatedReview);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");

        const resNoAuth = await request(app)
            .put("/libapi/reviews/1")
            .send(updatedReview);
        expect(resNoAuth.status).toBe(401);
        expect(resNoAuth.body).toHaveProperty("error");
    });
    test ("PUT /reviews/:id FAIL does not update a review", async () => {
        const updatedReview = {
            rating: 6,
            comment: "Big chungus is life."
        };
        const res = await request(app)
            .put("/libapi/reviews/1")
            .set("Authorization", `Bearer ${memberToken}`)
            .send(updatedReview);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");

        const resNoAuth = await request(app)
            .put("/libapi/reviews/1")
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
            .put("/libapi/reviews/1")
            .set("Authorization", `Bearer ${memberToken}`)
            .send({ rating: 0, comment: "Invalid rating." });
        expect(resValidation.status).toBe(400);
        expect(resValidation.body).toHaveProperty("error");
    });

    test ("DELETE /reviews/:id OK deletes a review", async () => {
        const res = await request(app)
            .delete("/libapi/reviews/1")
            .set("Authorization", `Bearer ${memberToken}`);
        expect(res.status).toBe(204);
    });

    test ("DELETE /reviews/:id FAIL does not delete a review", async () => {
        const res = await request(app)
            .delete("/libapi/reviews/1")
            .set("Authorization", `Bearer ${memberToken}`);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");

        const resNoAuth = await request(app)
            .delete("/libapi/reviews/1");
        expect(resNoAuth.status).toBe(401);
        expect(resNoAuth.body).toHaveProperty("error");

        const resNotFound = await request(app)
            .delete("/libapi/reviews/9999")
            .set("Authorization", `Bearer ${memberToken}`);
        expect(resNotFound.status).toBe(404);
        expect(resNotFound.body).toHaveProperty("error");
    });


});