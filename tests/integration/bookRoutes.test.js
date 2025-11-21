import request from "supertest";
import prisma from "../setup/setupDB.js";
import app from "../../src/app.js";


/*
router.get('/', getAllBooksHandler);
router.get('/:id', getBookByIdHandler);
router.post('/', createBookHandler);
router.put('/:id', updateBookHandler);
router.delete('/:id', deleteBookHandler);
*/

describe("Books API", () => {
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

    test ("GET /books OK returns all books", async () => {

    });

    test ("GET /books FAIL does not all books", async () => {
        
    });

    test ("POST /books OK creates a book", async () => {

    });

    test ("POST /books FAIL does not create a book", async () => {

    });

    test ("PUT /books/:id OK updates a book", async () => {

    });
    test ("PUT /books/:id FAIL does not update a book", async () => {
    
    });

    test ("DELETE /books/:id OK deletes a book", async () => {

    });

    test ("DELETE /books/:id FAIL does not delete a book", async () => {

    });


});