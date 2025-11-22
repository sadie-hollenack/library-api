import request from "supertest";
import prisma from "../setup/setupDB.js";
import app from "../../src/app.js";

/*
router.get('/', getAllAuthorsHandler);
router.get('/:id', getAuthorByIdHandler);
router.post('/', createAuthorHandler);
router.put('/:id', updateAuthorHandler);
router.delete('/:id', deleteAuthorHandler);
*/

describe("Authors API", () => {
    let adminToken;
    let loginAdminRes;
    let loginMemberRes;
    let memberToken;

    let existingAuthorId;
    let existingAuthorId2;
    let nonExistentAuthorId;

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

        let author1 = await request(app).post("/libapi/authors")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "[TEST] Alice Smith",
                biography: "test bio"
            })
            .expect(201);

        let author2 = await request(app).post("/libapi/authors")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "[TEST] Author 2",
                biography: "test test"
            })
            .expect(201);


        const firstAuthor = await prisma.author.findFirst({ where: { name: author1.name } });
        const secondAuthor = await prisma.author.findFirst({ where: { name: author2.name } });

        const maxAuthor = await prisma.author.findFirst({ orderBy: { author_id: 'desc' } });

        existingAuthorId = firstAuthor.author_id;
        
        nonExistentAuthorId = (maxAuthor ? maxAuthor.author_id : existingAuthorId) + 9999;
    });
        
    test ("GET /authors OK returns all authors", async () => {
        const response = await request(app)
            .get("/libapi/authors")
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test ("GET /authors OK with query parameters - sortBy and sortOrder", async () => {
        const response = await request(app)
            .get("/libapi/authors")
            .query({ sortBy: "name", sortOrder: "asc", limit: 10, offset: 0 });
        expect(response.status).toBe(200);
        const returnedNames = response.body.map(a => a.name);

        const expected = ["Alice Smith", "Alice Walker", "Bob Author"].sort(); 

        const sorted = [...returnedNames].sort((x,y) => x.localeCompare(y));
        expect(returnedNames).toEqual(sorted);
    });

    test ("GET /authors OK with query parameters - limit & offset (pagination)", async () => {
        const full = await request(app).get("/libapi/authors").query({ sortBy: "name", sortOrder: "asc" });
        expect(full.status).toBe(200);
        const fullNames = full.body.map(a => a.name);

        const paged = await request(app)
            .get("/libapi/authors")
            .query({ sortBy: "name", sortOrder: "asc", limit: 1, offset: 1 });
        expect(paged.status).toBe(200);
        expect(Array.isArray(paged.body)).toBe(true);
        expect(paged.body.length).toBe(1);
        expect(paged.body[0].name).toBe(fullNames[1]);
    });

    test ("GET /authors/:id OK returns an author", async () => {
        const res = await request(app).get(`/libapi/authors/${existingAuthorId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("author_id", existingAuthorId);
    });

    test ("GET /authors/:id FAIL does not return an author", async () => {
        const res = await request(app).get(`/libapi/authors/${nonExistentAuthorId}`);
        expect(res.status).toBe(404);
    });

    test ("POST /authors OK creates an author", async () => {
        const newAuthor = { name: "[TEST] New Author", biography: "A new author for testing" };
        const res = await request(app)
            .post("/libapi/authors")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(newAuthor);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("author_id");
        expect(res.body.name).toBe(newAuthor.name);
    });

    test ("POST /authors FAIL does not create an author", async () => {
        const newAuthor = { name: null };
        const res = await request(app)
            .post("/libapi/authors")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(newAuthor);
        expect(res.status).toBe(400);

        const resForbidden = await request(app)
            .post("/libapi/authors")
            .set("Authorization", `Bearer ${memberToken}`)
            .send({ name: "[TEST] Another Author" });
        expect(resForbidden.status).toBe(403);

        const resNoAuth = await request(app)
            .post("/libapi/authors")
            .send({ name: "[TEST] Another Author" });
        expect(resNoAuth.status).toBe(401);
    });

    test ("PUT /authors/:id OK updates an author", async () => {
        const updatedAuthor = { name: "[TEST] Updated Author", biography: "Updated biography" };
        const res = await request(app)
            .put(`/libapi/authors/${existingAuthorId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(updatedAuthor);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("author_id");
        expect(res.body.name).toBe(updatedAuthor.name);
    });

    test ("PUT /authors/:id FAIL does not update an author", async () => {
        const resForbidden = await request(app)
            .put(`/libapi/authors/${existingAuthorId}`)
            .set("Authorization", `Bearer ${memberToken}`)
            .send({ name: "[TEST] Another Update" });
        expect(resForbidden.status).toBe(403);

        const resNoAuth = await request(app)
            .put(`/libapi/authors/${existingAuthorId}`)
            .send({ name: "[TEST] Another Update" });
        expect(resNoAuth.status).toBe(401);

        const resNotFound = await request(app)
            .put(`/libapi/authors/${nonExistentAuthorId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "[TEST] Another Update" });
        expect(resNotFound.status).toBe(404);
    });

    test ("DELETE /authors/:id OK deletes an author", async () => {
        const newAuthor = { name: "[TEST] Author To Delete", biography: "To be deleted" };
        const createRes = await request(app)
            .post("/libapi/authors")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(newAuthor);
        expect(createRes.status).toBe(201);
        const authorId = createRes.body.author_id;
        
        const deleteRes = await request(app)
            .delete(`/libapi/authors/${authorId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(deleteRes.status).toBe(204);
    });

    test ("DELETE /authors/:id FAIL does not delete an author", async () => {
        const resForbidden = await request(app)
            .delete(`/libapi/authors/${existingAuthorId}`)
            .set("Authorization", `Bearer ${memberToken}`);
        expect(resForbidden.status).toBe(403);

        const resNoAuth = await request(app)
            .delete(`/libapi/authors/${nonExistentAuthorId}`);
        expect(resNoAuth.status).toBe(401);

        const resNotFound = await request(app)
            .delete(`/libapi/authors/${nonExistentAuthorId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(resNotFound.status).toBe(404);
    });
});