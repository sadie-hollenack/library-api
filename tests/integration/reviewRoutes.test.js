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

    });

    test ("GET /reviews FAIL does not all reviews", async () => {
        
    });

    test ("POST /reviews OK creates a review", async () => {

    });

    test ("POST /reviews FAIL does not create a review", async () => {

    });

    test ("PUT /reviews/:id OK updates a review", async () => {

    });
    test ("PUT /reviews/:id FAIL does not update a review", async () => {
    
    });

    test ("DELETE /reviews/:id OK deletes a review", async () => {

    });

    test ("DELETE /reviews/:id FAIL does not delete a review", async () => {

    });


});