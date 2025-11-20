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

describe("Users API", async () => {
    test("GET /users OK returns all users", async () => {
        // TODO: Only admins can get all users, update test
        // TODO: Potentially needs changed, assumes DB is empty before test

        const loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                email: "user1@test.net",
                password: "password"
            })
            .expect(200);

        const token = loginRes.body.accessToken;

        const res = await request(app)
            .get("/libapi/users")
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);

        expect(res.body[0]).toHaveProperty("email");
        expect(res.body[1]).toHaveProperty("email");

        expect(res.body[0]).not.toHaveProperty("password");
        expect(res.body[1]).not.toHaveProperty("password");

    })

    test("GET /users FAIL does not return users", async () => {

        // Not authenticated
        const res = await request(app).get("/libapi/users");
        expect(res.statusCode).toBe(401);

        // Not authorized
        const loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                email: "user1@test.net",
                password: "password"
            })
            .expect(200);

        const token = loginRes.body.accessToken;

        res = await request(app)
            .get("/libapi/users")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(403);
    })

    test("POST /signup OK creates a new user", async () => {
        const res = await request(app)
            .post("/libapi/users/signup")
            .send({
                email: "newuser@test.net",
                password: "password",
                role: "USER"
            })
            .expect(201);

        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("email", "newuser@test.net");
        expect(res.body).toHaveProperty("role", "USER");
        expect(res.body).not.toHaveProperty("password");

        res = await request(app)
            .post("/libapi/users/signup")
            .send({
                email: "newadmin@test.net",
                password: "password",
                role: "ADMIN"
            })
            .expect(201);

        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("email", "newadmin@test.net");
        expect(res.body).toHaveProperty("role", "ADMIN");
        expect(res.body).not.toHaveProperty("password");
    })

    test("POST /signup FAIL does not create a new user", async () => {
        const res = await request(app)
            .post("/libapi/users/signup")
            .send({
                email: null,
                password: null,
                role: null
            })
            .expect(404);

        expect(res.body).toHaveProperty("error");
    })

    test("POST /login OK logs in an existing user", async () => {
        const res = await request(app)
            .post("/libapi/users/login")
            .send({
                email: "user1@test.net",
                password: "password"
            })
            .expect(200);

        expect(res.body).toHaveProperty("accessToken");
    })

    test("POST /login FAIL does not log in a user", async () => {
        const res = await request(app)
            .post("/libapi/users/login")
            .send({
                email: "user1@test.net",
                password: "wrongpassword"
            })
            .expect(401);

        expect(res.body).toHaveProperty("error");

        res = await request(app)
            .post("/libapi/users/login")
            .send({
                email: "invaliduser@test.net",
                password: "password"
            })
            .expect(401);

        expect(res.body).toHaveProperty("error");
    })

    test("PUT /users/:id OK updates an existing users details", async () => {
        const loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                email: "admin1@test.net",
                password: "password"
            })
            .expect(200);

        const token = loginRes.body.accessToken;
        
        const res = await request(app)
            .put("/libapi/users/1")
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: "updateduser@test.net",
                password: "newpassword",
            })
            .expect(200);

        const resGet = await request(app)
            .get("/libapi/users/1")
            .set("Authorization", `Bearer ${token}`)

        expect(resGet.statusCode).toBe(200);
        expect(resGet.body).toHaveProperty("email");
        expect(resGet.body.email).toBe("updateduser@test.net");
    })

    test("PUT /users/:id FAIL does not update an existing users details", async () => {
        const loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                email: "admin1@test.net",
                password: "password"
            })
            .expect(200);

        const token = loginRes.body.accessToken;

        // User doesn't exist
        const res = await request(app)
            .put("/libapi/users/9999") 
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: "updateduser@test.net",
                password: "password",
            })
            .expect(404);

        expect(res.body).toHaveProperty("error");

        // Validation failed
        res = await request(app)
            .put("/libapi/users/1") 
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: "updateduser@test.net",
                password: "test", // password needs to be 8+ 
            })
            .expect(400);

        expect(res.body).toHaveProperty("error");

        // Email not unique
        res = await request(app)
            .put("/libapi/users/1") 
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: "user2@test.net",
                password: "password",
            })
            .expect(409);

        expect(res.body).toHaveProperty("error");

        // Not authorized
        loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                email: "user1@test.net",
                password: "password"
            })
            .expect(200);

        token = loginRes.body.accessToken;
        
        res = await request(app)
            .put("/libapi/users/1") 
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: "user2@test.net",
                password: "password",
            })
            .expect(403);

        expect(res.body).toHaveProperty("error");

        // Not authenticated
        res = await request(app)
            .put("/libapi/users/1") 
            .send({
                email: "user2@test.net",
                password: "password",
            })
            .expect(401);

        expect(res.body).toHaveProperty("error");

    })

    test("PATCH /users/:id OK updates an existing users details", async () => {
        const loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                email: "admin1@test.net",
                password: "password"
            })
            .expect(200);

        const token = loginRes.body.accessToken;

        const res = await request(app)
            .patch("/libapi/users/2")
            .set("Authorization", `Bearer ${token}`)
            .send({
                role: "ADMIN",
            })
            .expect(200);

        expect(res.body).toHaveProperty("id", 2);
        expect(res.body).toHaveProperty("role", "ADMIN");
    })

    test("PATCH /users/:id FAIL does not update an existing users details", async () => {
        // Not Found
        const loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                email: "admin1@test.net",
                password: "password"
            })
            .expect(200);

        const token = loginRes.body.accessToken;

        let res = await request(app)
            .patch("/libapi/users/9999")
            .set("Authorization", `Bearer ${token}`)
            .send({
                role: "ADMIN",
            })
            .expect(404);

        expect(res.body).toHaveProperty("error");

        // Validation Failed
        res = await request(app)
            .patch("/libapi/users/2")
            .set("Authorization", `Bearer ${token}`)
            .send({
                role: "INVALIDROLE",
            })
            .expect(400);

        expect(res.body).toHaveProperty("error");

        // Not Authorized
        loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                email: "user1@test.net",
                password: "password"
            })
            .expect(200);

        token = loginRes.body.accessToken;

        res = await request(app)
            .patch("/libapi/users/2")
            .set("Authorization", `Bearer ${token}`)
            .send({
                role: "ADMIN",
            })
            .expect(403);
            
        expect(res.body).toHaveProperty("error");

        // Not Authenticated
        res = await request(app)
            .patch("/libapi/users/2")
            .send({
                role: "ADMIN",
            })
            .expect(401);

        expect(res.body).toHaveProperty("error");
    })

    test("DELETE /users/:id OK deletes an existing users details", async () => {
        const loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                email: "admin1@test.net",
                password: "password"
            })
            .expect(200);

        const token = loginRes.body.accessToken;

        const res = await request(app)
            .delete("/libapi/users/2")
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
            
        const resGet = await request(app)
            .get("/libapi/users/2")
            .set("Authorization", `Bearer ${token}`);

        expect(resGet.statusCode).toBe(404);
    })

    test("DELETE /users/:id FAIL does not delete an existing users details", async () => {
        const loginRes = await request(app)
            .post("/libapi/users/login")
            .send({
                email: "user1@test.net",
                password: "password"
            })
            .expect(200);

        const token = loginRes.body.accessToken;

        // User Not Found
        let res = await request(app)
            .delete("/libapi/users/9999")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
            
        expect(res.body).toHaveProperty("error");

        // Not Authorized
        res = await request(app)
            .delete("/libapi/users/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(403);
            
        expect(res.body).toHaveProperty("error");

        // Not Authenticated
        res = await request(app)
            .delete("/libapi/users/1")
            .expect(401);
            
        expect(res.body).toHaveProperty("error");
    })
})
