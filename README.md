run npm init in terminal
install all dependencies using npm i bcryptjs dotenv express mongoose validator jsonwebtoken
and development dependencies npm i nodemon --save-dev

use postman for checking all routes as
/register - 127.0.0.1:3000/users/register
/login - 127.0.0.1:3000/users/login
use jwt token for below routes as authorization -> Bearer -> Token value
/newNote - 127.0.0.1:3000/notes/newNote
/getNotes - 127.0.0.1:3000/notes/getNotes
/editNote - 127.0.0.1:3000/notes/editNote/5e88729b307ae62dc4230774
/deleteNote - 127.0.0.1:3000/notes/deleteNote/5e885555b41e2e218c546199

if mongodb atlas database doesnot work then change DB of line 8 of server.js to process.env.DATABASE_LOCAL to connect to local database