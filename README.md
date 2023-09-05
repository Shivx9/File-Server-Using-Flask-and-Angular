# File Server using Flask and Angular

 ## Introduction
 
This is intended as an open-source web-app for real-time shared access to files on a system, with scoped user access 

![fileserver_demo](https://github.com/Shivx9/File-Server-Using-Flask-and-Angular/assets/61614409/67293b90-6d99-47e0-93c8-3da8f118f627)

 ## Functionalities 

- Basic user registration, login & password-recovery with email-based auth
- A user may be assigned multiple directory sessions - i.e. restricted access within specified system paths
- Within a scoped domain session, a user can upload, edit, relocate and download files, folders & documents
- CRUD operations with multi-targeting available
- Internal clipboard system for file modification operations
- Security measures, thus far, include :
  - JWT-based authentication for requests, including cross-verification for priority access purposes, with appropriate blacklisting for force-expiry (eg. in case of logout)
  - Protection against path traversal attacks; filter mechanisms to reject suspicious requests - 
    - Checks for data coherency
    - Strict access denial to paths pointing directly or indirectly to directories out of assigned scope
    - Time-limited access for fresh user logins
    - User registration using email-based 2FA
    - Limited attempts for incorrect password entries before requiring email re-authentication
    - <p id='domain-entry'>For security purposes, current management of domain sessions can only be modified via direct database interactions</p>
    - <b>IMPORTANT : </b>use <b>"#"</b> as standard safe directory separator substitute when storing domain paths in the database<br>
    Eg. a standard set of data entries for domain sessions in the table 'user_directory_sessions' is <br>
    
    <table>
      <tr>
      <th>id</th>
      <th>user_id</th>
      <th>directory</th>
      </tr>
      
      <tr>
        <td>1</td>
        <td>1</td>
        <td>C:#Users#Shivendra#Documents#SomeOtherFolder</td>
      </tr>

      <tr>
        <td>2</td>
        <td>1</td>
        <td>C:#Users#Shivendra#Downloads#SomeProgram</td>
      </tr>
    </table>




 

## Backend -
- Flask-based app : 'routing.py' refers to the main executable flask base
- Uses flask-sqlalchemy for database communication
- After installing Python & Pip, ensure all required python libraries used are installed by running the following command in the **backend** folder
```
pip install -r requirements.txt
```
- Create your own **credentials.json** file<br>
  **Eg.**<br>
```
{
    "driver"            :   "mysql",
    "user"              :   "root",
    "pas"               :   "root",
    "host"              :   "127.0.0.1",
    "port"              :   "3306",
    "database"          :   "mydb",
    "JWT_SECRET_KEY"    :   "someSecret",
    "HASH_SECRET"       :   "anotherSecret",
    "sender_email"      :   "abc@gmail.com",
    "sender_pass"       :   "password123"
    "frontend_url"      :   "http://localhost:4200"
}
```

- Create a corresponding databse to connect with
- After configuring credentials.json, creating the corresponding database, and setting up SMTP credentials.
- Run the following commands in the terminal to automatically set up database :
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
- After registering a user on your locally hosted db, manually assign domain sessions in the table 'user_directort_sessions'. Refer to [Functionalities](#domain-entry)
- Launch your database and run routing.py to fully get the server working live


## Frontend

- Initialize a direct angular app setup by running the following command in the **ang_test_1** directory, which should automatically set up the required dependencies from **package.json** 
`npm install`
- Ensure TailwindCSS is installed and configured properly
- Open a terminal in this directory & run the frontend angular app (assuming the backend components have gone live)
`ng serve`


## DIY
Much of the UI and functionalities published here are intended for generic prototyping purposes. There are some functionalities & changes you might like to keep in mind when adopting this for personal use<br>
<table>
<tr>
 <th>Action</th>
 <th>Reference</th>
</tr>
 
 <tr>
  <td>Modify user access token expiry (currently 1 hour)</td>
  <td>routing.py : login()</td>
 </tr>

 <tr>
  <td>Modify limit for incorrect login attempts (currently 3 consecutive)</td>
  <td>routing.py : maxLoginAttempts</td>
 </tr>
 
 <tr>
  <td>Adjusting host & ports on preferred netword & access scope</td>
  <td>Access scope limited</td>
 </tr>
 
 <tr>
  <td>Modify token auth wrapper to limit consecutively active tokens for a user</td>
  <td>routing.py : valid_jwt_required()<br>models.py : <b>user</b> class</td>
 </tr>
 
 <tr>
  <td>Set up cronjobs for regular cleanup of expired residuals</td>
  <td><b>Temp Folder</b> contents<br>Expired entries in the tables <b>token_black_list</b> & <b>user_verification_links</b></td>
 </tr>
 
 <tr>
  <td>Set up a secure way to manage admin accounts and a separate dashboard for in-app management of domain sessions for other users</td>
  <td>routing.py : privelaged_user_required()<br>TABLE <b>user</b> : priority</td>
 </tr>

 <tr>
  <td>Setting up custom DB enviroments other than MySQL may require also customizing the table declarations</td>
  <td>models.py : All MySQL datatypes used in class variable definitions</td>
 </tr>
</table>

## Major Dependencies used - 
- Angular
  - Angular Material
- Python
  - flask-jwt-extended
  - passlib
  - functools
  - flask-sqlalchemy
  - mysql-connector-python (for MySQL; may change based on your database requirements)
- TailwindCSS
- NodeJS
