

# CSE316 Final Project : Day Logger

-   Hyerin Choi
-   Yool Bi Lee

## Deployment


#### Deployed on MongoDB Atlas

-
mongodb+srv://yoolbi:yoolbi716@cluster0.mcvce.mongodb.net/local_library?retryWrites=true&w=majority

#### Deployed on Heroku(backend)
-   https://cse-316-day-logger-backend.herokuapp.com/api

#### Deployed on Netlify(frontend)
-    https://316daylogger.netlify.app/



## Sample user(data)

- Name : test
- email: test@test.com
- password : Test1234


## Testing
1. cd CSE-316-Day-Logger-Backend
2. npm test


## Structure

```
cse316-daylogger
├── frontend/ 
│   ├── public/              # static files
│   │   ├── __redirect       # link for heroku
│   │   ├── index.html       # html template
│   │   ├── manifest.json    # manifest info
│   │   └── robots.txt
│   │
│   ├── src/                 # project root
│   │   ├── api/             # APIs
│   │   │   └── client.js
│   │   │
│   │   ├── components/      # layout containers
│   │   │   ├── Edit.js      # Edit Questions page 
│   │   │   ├── Logday.js    # Logday(data) page
│   │   │   ├── Login.js     # verifies valid user
│   │   │   ├── Nav.js       # Nav with menu options
│   │   │   ├── Profile.js   # modifies Profile
│   │   │   ├── Question.js  # auxiliary page for Edit, View
│   │   │   ├── Signup.js    # Creates new account
│   │   │   ├── View.js      # View Data logs
│   │   │   └── ViewData.js  # auxiliary page for View
│   │   │
│   │   ├── App.css
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── ...
│   └── package.json
│
└── backend/
    │
    ├── model/               # DB schemes
    │   ├── address.js       
    │   ├── question.js      
    │   ├── response.js
    │   └── user.js
    │   
    ├── test/                # automated test
    │   └── user.test.js     # check valid User
    │   
    ├── uploads/             # 
    │
    ├── app.js               # Express server w/ mongoose
    │
    ├── ...
    ├── package.json
    └── Procfile             # additional for heroku deploy

```
 