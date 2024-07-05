# My Servers: Backend exercise

## Server 1: Authorization

**Step One**: Set up project

1. Install packages:
   `npm install express bcryptjs jsonwebtoken mongoose dotenv`
2. Create a server with express and start it (server.js)
3. Create MongoDB connection (libs/database.js)
4. Create a `.env` file with the following contents:

- `MONGODB_CONNECTION_STRING`
- `JWT_KEY`

**Step Two**: User Registration and Password Hashing with Mongoose

1. Create a User model with Mongoose.
2. Create a registration endpoint (POST). This endpoint:

- Hashes the password with bcrypt.
- Uses the User model to save the new user in the database.

**Step Three**: User Login and JWT Generation

Create a login endpoint (POST) to handle user login:

1. Receive login data: The username and password are provided in req.body.
2. Check if the user exists: Search the database for a user with the provided username.
3. Verify the password: Compare the entered password with the hashed password stored in the database.
4. Create a JWT: Generate a token with the user's ID and username, signed with a secret key.
5. Send the token: Return the generated token as a JSON response to the client.

**Step Four**: Create Middleware for Token Verification (tokenCheck.js)

This middleware checks the JWT sent by the client in the Authorization header of each request.
If the token is valid, the request continues.
If the token is invalid, an error message is returned.

- Test it with a protected route `app.get("/protected", checkToken, (req, res) => {...`
  Steps to access the protected route:

1. POST request to the registration endpoint 'http://localhost:3000/register' (with username and password)
2. POST request to the login endpoint 'http://localhost:3000/login' (with the same username and password)
   The response from login endpoint will include JWT. Copy the token!
3. GET request to the protected route 'http://localhost:3000/protected' and put the copied token in the
   **Authorization header**.
