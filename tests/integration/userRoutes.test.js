import request from "supertest";
import prisma from "../setup/setupDB.js";
import app from '../../src/server.js'

/*
router.post('/signup', signUpHandler);
router.post('/login', loginHandler);
*/

describe("Users API", () => {
    test("GET /users OK returns all users", () => {
        
    })

    test("GET /users FAIL does not return users", () => {
        
    })

    test("POST /signup OK creates a new user", () => {

    })

    test("POST /signup FAIL does not create a new user", () => {

    })

    test("POST /login OK logs in an existing user", () => {

    })

    test("POST /signup FAIL does not log in a user", () => {

    })

    test("PUT /users/:id OK updates an existing users details", () => {

    })

    test("PUT /users/:id FAIL does not update an existing users details", () => {

    })

    test("PATCH /users/:id OK updates an existing users details", () => {

    })

    test("PATCH /users/:id FAIL does not update an existing users details", () => {

    })

    test("DELETE /users/:id OK deletes an existing users details", () => {

    })

    test("DELETE /users/:id FAIL does not delete an existing users details", () => {

    })
})
