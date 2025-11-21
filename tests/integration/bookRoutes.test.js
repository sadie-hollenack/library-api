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
        const response = await request(app)
            .get("/libapi/books")
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test ("GET /books FAIL does not all books", async () => {
        const responseForbid = await request(app)
            .get("/libapi/books")
            .set("Authorization", `Bearer ${memberToken}`);
        expect(responseForbid.status).toBe(403);
        expect(responseForbid.body).toHaveProperty("error");

        const responseNoAuth = await request(app)
            .get("/libapi/books");
        expect(responseNoAuth.status).toBe(401);
        expect(responseNoAuth.body).toHaveProperty("error");
    });

    test ("POST /books OK creates a book", async () => {
        const newBook = {
            title: "[TEST] New Book",
            author_id: 1,
            published_year: 2024,
            genre: "Test Genre",
            summary: "This is a test book."
        };
        const res = await request(app)
            .post("/libapi/books")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(newBook);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("book_id");
        expect(res.body.title).toBe(newBook.title);
    });

    test ("POST /books FAIL does not create a book", async () => {
        const newBook = {
            title: "[TEST] New Book",
            author_id: 1,
            published_year: 2024,
            genre: "Test Genre",
            summary: "This is a test book."
        };
        const res = await request(app)
            .post("/libapi/books")
            .set("Authorization", `Bearer ${memberToken}`)
            .send(newBook);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");

        const resNoAuth = await request(app)
            .post("/libapi/books")
            .send(newBook);
        expect(resNoAuth.status).toBe(401);
        expect(resNoAuth.body).toHaveProperty("error");
    });

    test ("PUT /books/:id OK updates a book", async () => {
        const updatedBook = {
            title: "[TEST] Updated Book",
            genre: "Updated Genre"
        };
        const res = await request(app)
            .put("/libapi/books/1")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(updatedBook);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("book_id");
        expect(res.body.title).toBe(updatedBook.title);
    });
    test ("PUT /books/:id FAIL does not update a book", async () => {
        const updatedBook = {
            title: "[TEST] Updated Book",
            genre: "Updated Genre"
        };
        const res = await request(app)
            .put("/libapi/books/1")
            .set("Authorization", `Bearer ${memberToken}`)
            .send(updatedBook);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");

        const resNoAuth = await request(app)
            .put("/libapi/books/1")
            .send(updatedBook);
        expect(resNoAuth.status).toBe(401);
        expect(resNoAuth.body).toHaveProperty("error");

        const resValidation = await request(app)
            .put("/libapi/books/1")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ ...updatedBook, title: "hi" });
        expect(resValidation.status).toBe(400);
        expect(resValidation.body).toHaveProperty("error");
    });

    test ("DELETE /books/:id OK deletes a book", async () => {
        const res = await request(app)
            .delete("/libapi/books/1")
            .set("Authorization", `Bearer ${adminToken}`);
        expect(res.status).toBe(204);
    });

    test ("DELETE /books/:id FAIL does not delete a book", async () => {
        const res = await request(app)
            .delete("/libapi/books/1")
            .set("Authorization", `Bearer ${memberToken}`);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");
        
        const resNoAuth = await request(app)
            .delete("/libapi/books/1");
        expect(resNoAuth.status).toBe(401);
        expect(resNoAuth.body).toHaveProperty("error");
    });


});