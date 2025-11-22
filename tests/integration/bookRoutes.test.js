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

    let adminUser;
    let memberUser;
    let author1;
    let author2;
    let book1;        
    let book2;       
    let bookToDelete1;
    let bookToDelete2;

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
        
        adminUser = await prisma.user.findUnique({ where: { username: "admin1@test.net" } }) || await prisma.user.findFirst();
        memberUser = await prisma.user.findUnique({ where: { username: "user1@test.net" } }) || (await prisma.user.findMany({ take: 2 }))[1] || adminUser;

        author1 = await prisma.author.create({
            data: {
                name: "[TEST] Author 1",
                biography: "test"
            }
        });

        author2 = await prisma.author.create({
            data: {
                name: "[TEST] Author 2",
                biography: "test test"
            }
        });

        
        book1 = await prisma.book.create({
            data: {
                title: "[TEST] Book 1",
                author_id: author1.author_id,
                published_year: 2021,
                genre: "Fiction",
            }
        });

        book2 = await prisma.book.create({
            data: {
                title: "[TEST] Book 2",
                author_id: author1.author_id,
                published_year: 2022,
                genre: "Non-Fiction",
            }
        });

        bookToDelete1 = await prisma.book.create({
            data: {
                title: "[TEST] Book 3",
                author_id: author1.author_id,
                published_year: 2023,
                genre: "Science Fiction",
            }
        });

        bookToDelete2 = await prisma.book.create({
            data: {
                title: "[TEST] Book 4",
                author_id: author1.author_id,
                published_year: 2024,
                genre: "Fantasy",
            }
        });

    });

    test ("GET /books OK returns all books", async () => {
        const response = await request(app)
            .get("/libapi/books")
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test ("GET /books FAIL does not all books", async () => {
        const responseNoAuth = await request(app)
            .get("/libapi/books");
        expect(responseNoAuth.status).toBe(401);
        expect(responseNoAuth.body).toHaveProperty("error");
    });

    test ("POST /books OK creates a book", async () => {

        const res = await request(app)
            .post("/libapi/books")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(book1);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("book_id");
        expect(res.body.title).toBe(book1.title);
    });

    test ("POST /books FAIL does not create a book", async () => {
        const res = await request(app)
            .post("/libapi/books")
            .set("Authorization", `Bearer ${memberToken}`)
            .send(book2);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");

        const resNoAuth = await request(app)
            .post("/libapi/books")
            .send(book2);
        expect(resNoAuth.status).toBe(401);
        expect(resNoAuth.body).toHaveProperty("error");
    });

    // TODO: This test will continuly break until dynamic id is added
    test ("PUT /books/:id OK updates a book", async () => {
        const updatedBook = {
            title: "[TEST] Updated Book",
            genre: "[TEST] Updated Genre"
        };
        const res = await request(app)
            .put(`/libapi/books/${book1.book_id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(updatedBook);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("book_id");
        expect(res.body.title).toBe(updatedBook.title);
    });

    // TODO: This test will continuly break until dynamic id is added
    test ("PUT /books/:id FAIL does not update a book", async () => {
        const updatedBook = {
            title: "[TEST] Updated Book",
            genre: "Updated Genre"
        };
        const res = await request(app)
            .put(`/libapi/books/${book2.book_id}`)
            .set("Authorization", `Bearer ${memberToken}`)
            .send(updatedBook);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");

        const resNoAuth = await request(app)
            .put(`/libapi/books/${book1.book_id}`)
            .send(updatedBook);
        expect(resNoAuth.status).toBe(401);
        expect(resNoAuth.body).toHaveProperty("error");

        const resValidation = await request(app)
            .put(`/libapi/books/${book1.book_id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ ...updatedBook, title: "hi" });
        expect(resValidation.status).toBe(400);
        expect(resValidation.body).toHaveProperty("error");
    });

    // TODO: This test will continuly break until dynamic id is added
    test ("DELETE /books/:id OK deletes a book", async () => {
        const res = await request(app)
            .delete(`/libapi/books/${bookToDelete1.book_id}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(res.status).toBe(204);
    });

    // TODO: This test will continuly break until dynamic id is added
    test ("DELETE /books/:id FAIL does not delete a book", async () => {
        const res = await request(app)
            .delete(`/libapi/books/${bookToDelete2.book_id}`)
            .set("Authorization", `Bearer ${memberToken}`);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");

        const resNoAuth = await request(app)
            .delete(`/libapi/books/${book1.book_id}`);
        expect(resNoAuth.status).toBe(401);
        expect(resNoAuth.body).toHaveProperty("error");
    });


});