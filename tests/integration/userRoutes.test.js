import request from "supertest";
import prisma from "../setup/setupDB.js";
import app from "../../src/app.js";

/*
router.get('/', getAllUsersHandler);
router.get('/:id', getUserByIDHandler);
router.put('/:id', updateUserHandler);
router.delete('/:id', deleteUserHandler);
router.patch('/:id/role', updateUserRoleHandler);
router.post('/signup', signUpHandler);
router.post('/login', loginHandler);
*/

// TODO: User IDs are tricky since its dependent on DB, likely fail on other systems
// Figure out way to dynamically get user IDs for tests

describe("Users API", () => {
    test("GET /users OK returns all users", async () => {
        let loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "admin1@test.net",
                password: "password"
            })
            .expect(200);

        let token = loginRes.body.accessToken;

        let res = await request(app)
            .get("/libapi/users")
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(2);

        expect(res.body[0]).toHaveProperty("username");
        expect(res.body[1]).toHaveProperty("username");

        expect(res.body[0]).not.toHaveProperty("password");
        expect(res.body[1]).not.toHaveProperty("password");

    })

    test("GET /users FAIL does not return users", async () => {

        // Not authenticated
        let res = await request(app).get("/libapi/users");
        expect(res.statusCode).toBe(401);

        // Not authorized
        let loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "user1@test.net",
                password: "password"
            })
            .expect(200);

        let token = loginRes.body.accessToken;

        res = await request(app)
            .get("/libapi/users")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(403);

        let resNotFound = await request(app)
            .get("/libapi/users/9999")
            .set("Authorization", `Bearer ${token}`);
        expect(resNotFound.statusCode).toBe(404);
    })

    test("POST /signup OK creates a new user", async () => {
        let res = await request(app)
            .post("/libapi/users/signup")
            .send({
                username: "newuser@test.net",
                password: "password",
                role: "member"
            })
            .expect(201);

        expect(res.body).toHaveProperty("message");

        let res2 = await request(app)
            .post("/libapi/users/signup")
            .send({
                username: "newadmin@test.net",
                password: "password",
                role: "admin"
            })
            .expect(201);

        expect(res2.body).toHaveProperty("message");

    })

    test("POST /signup FAIL does not create a new user", async () => {
        let res = await request(app)
            .post("/libapi/users/signup")
            .send({
                username: null,
                password: null,
            })
            .expect(400);

        expect(res.body).toHaveProperty("error");

        let resDuplicate = await request(app)
            .post("/libapi/users/signup")
            .send({
                username: "newuser@test.net",
                password: "password",
                role: "member"
            })
            .expect(409);
    })

    test("POST /login OK logs in an existing user", async () => {
        let res = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "user1@test.net",
                password: "password"
            })
            .expect(200);

        expect(res.body).toHaveProperty("accessToken");
    })

    test("POST /login FAIL does not log in a user", async () => {
        let res = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "user1@test.net",
                password: "wrongpassword"
            })
            .expect(401);

        expect(res.body).toHaveProperty("error");

        let res2 = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "invaliduser@test.net",
                password: "password"
            })
            .expect(401);

        expect(res2.body).toHaveProperty("error");
    })

    test("PUT /users/:id OK updates an existing users details", async () => {
        let loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "admin2@test.net",
                password: "password"
            })
            .expect(200);

        let token = loginRes.body.accessToken;

        let userId = await prisma.user.findUnique({ where: { username: "admin2@test.net" } }) || await prisma.user.findFirst();

        let res = await request(app)
            .put(`/libapi/users/${userId.user_id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: "updateduser@test.net",
                password: "newpassword",
            })
            .expect(200);

        let resGet = await request(app)
            .get(`/libapi/users/${userId.user_id}`)
            .set("Authorization", `Bearer ${token}`)

        expect(resGet.statusCode).toBe(200);
    })

    test("PUT /users/:id FAIL does not update an existing users details", async () => {
        let loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "admin1@test.net",
                password: "password"
            })
            .expect(200);

        let userId = await prisma.user.findUnique({ where: { username: "admin1@test.net" } }) || await prisma.user.findFirst();


        let token = loginRes.body.accessToken;

        // User doesn't exist
        let res = await request(app)
            .put("/libapi/users/9999") 
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: "updateduser@test.net",
                password: "password",
            })
            .expect(404);

        expect(res.body).toHaveProperty("error");

        // Validation failed
        let res2 = await request(app)
            .put(`/libapi/users/${userId.user_id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: "notcurrentuser@test.net",
                password: "tes", // password needs to be 8+ 
            })
            .expect(400);

        expect(res2.body).toHaveProperty("error");

        // username not unique
        let res3 = await request(app)
            .put(`/libapi/users/${userId.user_id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: "user2@test.net",
                password: "password",
            })
            .expect(409);

        expect(res3.body).toHaveProperty("error");

        // Not authorized
        let loginResAuth = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "user1@test.net",
                password: "password"
            })
            .expect(200);

        token = loginResAuth.body.accessToken;

        let loginResNotAuth = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "user2@test.net",
                password: "password"
            })
            .expect(200);
        let userIdNoAuth = await prisma.user.findUnique({ where: { username: "user2@test.net" } }) || await prisma.user.findFirst();

        let tokenNotAuth = loginResNotAuth.body.accessToken;
        let res4 = await request(app)
            .put(`/libapi/users/${userIdNoAuth.user_id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: "user2@test.net",
                password: "password",
            })
            .expect(403);

        expect(res4.body).toHaveProperty("error");

        // Not authenticated
        let res5 = await request(app)
            .put(`/libapi/users/${userId.user_id}`)
            .send({
                username: "user2@test.net",
                password: "password",
            })
            .expect(401);

        expect(res5.body).toHaveProperty("error");

    })

    test("PATCH /users/:id OK updates an existing users details", async () => {
        let loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "admin1@test.net",
                password: "password"
            })
            .expect(200);

        let token = loginRes.body.accessToken;

        let userId = await prisma.user.findUnique({ where: { username: "admin1@test.net" } });

        let res = await request(app)
            .patch(`/libapi/users/${userId.user_id}/role`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                role: "admin",
            })
            .expect(200);

        expect(res.body).toHaveProperty("role", "admin");
    })

    test("PATCH /users/:id FAIL does not update an existing users details", async () => {
        // Not Found
        let loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "admin1@test.net",
                password: "password"
            })
            .expect(200);

        let userId = await prisma.user.findUnique({ where: { username: "admin1@test.net" } });

        let token = loginRes.body.accessToken;

        let res = await request(app)
            .patch(`/libapi/users/99999999/role`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                role: "admin",
            })
            .expect(404);

        // Validation Failed
        let res2 = await request(app)
            .patch(`/libapi/users/${userId.user_id}/role`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                role: "INVALIDROLE",
            })
            .expect(400);

        // Not Authorized
        let loginResNotAuth = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "user1@test.net",
                password: "password"
            })
            .expect(200);

        token = loginResNotAuth.body.accessToken;

        // Not Authenticated
        let res3 = await request(app)
            .patch(`/libapi/users/${userId.user_id}/role`)
            .send({
                role: "admin",
            })
            .expect(401);
    })

    test("DELETE /users/:id OK deletes an existing users details", async () => {
        let loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "admin1@test.net",
                password: "password"
            })
            .expect(200);

        let userId = await prisma.user.findUnique({ where: { username: "admin1@test.net" } });
        let token = loginRes.body.accessToken;

        let res = await request(app)
            .delete(`/libapi/users/${userId.user_id}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
        
    })

    test("DELETE /users/:id FAIL does not delete an existing users details", async () => {
        let loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "user1@test.net",
                password: "password"
            })
            .expect(200);

        let userId = await prisma.user.findUnique({ where: { username: "user1@test.net" } });            
        let token = loginRes.body.accessToken;

        let loginResNotAuth = await request(app)
            .post("/libapi/users/login")
            .send({
                username: "user2@test.net",
                password: "password"
            })
            .expect(200);
        let tokenNotAuth = loginResNotAuth.body.accessToken;

        // User Not Found
        let res = await request(app)
            .delete("/libapi/users/9999")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
            
        expect(res.body).toHaveProperty("error");

        // Not Authorized
        res = await request(app)
            .delete(`/libapi/users/${userId.user_id}`)
            .set("Authorization", `Bearer ${tokenNotAuth}`)
            .expect(403);
            
        expect(res.body).toHaveProperty("error");

        // Not Authenticated
        res = await request(app)
            .delete(`/libapi/users/${userId.user_id}`)
            .expect(401);
            
        expect(res.body).toHaveProperty("error");
    })
})
