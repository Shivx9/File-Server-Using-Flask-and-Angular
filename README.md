# File Server using Flask and Angular

 ## Introduction

 ## Functionalities

 

## Backend -
- Flask-based app : 'routing.py' refers to the main executable flask base
- Uses flask-sqlalchemy for database communication
- Ensure all required python libraries used are installed
- Create your own **credentials.json** file<br>
  **Eg.**<br>
```
{
    "driver"            :   "mysql",<br>
    "user"              :   "root",<br>
    "pas"               :   "root",<br>
    "host"              :   "127.0.0.1",<br>
    "port"              :   "3306",<br>
    "database"          :   "mydb",<br>
    "JWT_SECRET_KEY"    :   "someSecret",<br>
    "HASH_SECRET"       :   "anotherSecret",<br>
    "sender_email"      :   "abc@gmail.com",<br>
    "sender_pass"       :   "password123"<br>
    "frontend_url"      :   "http://localhost:4200"
}
```

- Create a corresponding databse to connect with
- After configuring credentials.json, creating the corresponding database, and setting up SMTP credentials, run the following commands in the terminal to automatically set up database :
```
# <------ For Windows -------->

cd backend
$env:FLASK_APP='routing.py'
flask db init
flask db migrate
flask db upgrade



# <------- For Linux -------->

cd backend export FLASK_APP='routing.py'
flask db init
flask db migrate
flask db upgrade
```

## Frontend
