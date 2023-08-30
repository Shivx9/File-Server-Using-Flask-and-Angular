import sys
sys.dont_write_bytecode = True   # Prevent data logging in PyCache


from application.models.models import *
from application.utils.misc import *
from app import app, db, migrate, frontendURL
from functools import wraps
from flask_jwt_extended import JWTManager, create_access_token, current_user,jwt_required, get_jti, get_jwt, verify_jwt_in_request
from mail_server.handlers import sendVerifLink
from flask import request, jsonify, make_response, redirect, url_for, render_template, send_file, send_from_directory
from passlib.hash import pbkdf2_sha256
# from validator_collection import validators, checkers, errors
#from aws_stuff.s3_controller import *
import json, html, secrets, os, time, shutil, zipfile, datetime


maxLoginAttempts = 3        # Max incorrect login attempts
tempFolder  = os.path.join(os.getcwd(),'temp_folder')  # temp folder for zipping multiple files/folders before sending for download




# !!!!!!!!!!!!!!!!!!!!!!! REGULAR CLEANUP OPERATIONS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# Token blacklist table
# Temp Folder 


# !!!!!!!!!!!!!!!!!!!!!!! FINE-TUNE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# Error catching    ___________________________________________________________ low priority
# Uniform responses (success = true/false) ___________________________|



# !!!!!!!!!!!!!!!!!!!!!!!! TO-DO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# Admin Console









############################# BASIC AUTH ##############################




jwt = JWTManager(app)

@jwt.user_identity_loader
def user_identity_lookup(u):
    return u.id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return user.query.filter_by(id=identity).first()




 
def valid_jwt_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):

        try:
            # verify legit signed token
            verify_jwt_in_request()
            # Verify if token isn't blacklisted or user has exceeded login attempts is using obsolete token
            if tokenBlackList.query.filter_by(jti = get_jwt()['jti']).first() or current_user.loginAttempts>=maxLoginAttempts:
                raise Exception
            
        except Exception as e:
            return make_response(jsonify(valid = False), 401)
        

        return func(*args, **kwargs)
    return wrapper



def privelaged_user_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):

        try:
            if current_user.priority!=999:
                raise Exception
            
        except Exception as e:
            make_response(jsonify(valid = False), 200)
        

        return func(*args, **kwargs)
    
    return wrapper








##########################################################################
##########################################################################
##########################################################################
############################### ROUTING ##################################
##########################################################################
##########################################################################
##########################################################################






@app.route('/test', methods = ["GET", "POST"])
def testFn():
    return "It works"







###################### ADMIN STUFF - W.I.P. ######################################


@app.route('/adminShell', methods = ["GET"])
def adminShell():
    u = []
    for i in user.query.all():
        u.append({'id':i.id, "email":i.email})

    return render_template('adminShell.html', users = u)
    


@app.route('/getDomains/<u_id>', methods = ["GET", "PUT", "DELETE","POST"])
def getDomainsForUser(u_id):

    if request.method!="":
        if request.method=="GET":
            objs = userDirectorySessions.query.filter_by(user_id = int(u_id)).all()

            domains = []
            for i in objs:
                domains.append(i.__dict__)
            var = json.dumps(objs)
            if not var:
                var = json.dumps([1,2])

            return make_response(jsonify(directories= json.dumps(domains) ), 200)
        
        elif request.method== "POST":
            if userDirectorySessions.query.filter_by(user_id = u_id).filter_by(directory = request.form['dir']).first():
                return make_response(jsonify(error = 'Domain already assigned'), 202)
            
            dom = userDirectorySessions()
            dom.user_id = u_id
            dom.directory = request.form['dir']
            db.session.add(dom)
            db.session.commit()

            return make_response(jsonify(msg = 'Domain added'),201)
        
        elif request.method== "PUT":
            to_change = userDirectorySessions.query.filter_by(user_id = u_id).filter_by(directory = request.form['dir']).first()
            if not to_change:
                return make_response(jsonify(err='invalid directory session reference'), 400)
            
            if not checkValidPath(to_change, to_change):
                return make_response(jsonify(err='Bad path request made'), 400)
            
            to_change.directory = request.form['new_dir']
            db.session.commit()

            return "Directory path changed", 200
        
        elif request.method== "DELETE":
            to_del = userDirectorySessions.query.filter_by(user_id = u_id).filter_by(directory = request.form['dir']).first()
            if not to_del:
                return make_response(jsonify(err='invalid directory session reference'), 400)
            
            db.session.delete(to_del)
            db.session.commit()

            return "Deleted", 200
                







#################################### To be accessed by regular users #################################################





@app.route('/', methods = ['GET'])
@valid_jwt_required
def homePage():
    objs = userDirectorySessions.query.filter_by(user_id = current_user.id).all()
    domains = []
    for i in objs:
        d = {'id': i.id, 'name':i.directory}
        domains.append(d)

    return jsonify(directories = domains)




@app.route('/explore/<baseDirectoryRef>', methods = ["GET", "POST", "PUT", "DELETE", "PATCH"])
@valid_jwt_required
def explore(baseDirectoryRef):


    # Base directory authentication
    obj :userDirectorySessions= userDirectorySessions.query.filter_by(id=baseDirectoryRef).filter_by(user_id = current_user.id).first()  
    if not obj:
        return "out of scope", 404
    
    try:
        
        base:str= str(obj.directory).replace(safe_directory_separator, os.sep)
        extendedDirectory = request.args.get('dir', default = '', type = str).strip()
        final:str=base


        # Adjusting and verifying for final directory
        if extendedDirectory!='':             
            extendedDirectory = extendedDirectory.replace(safe_directory_separator, os.sep)  # Replacing url-safe separator for proper path mapping
            final = os.path.join(final, extendedDirectory)
            # pure = PurePath(final)
            #if pure.is_relative_to(base)==False or  ('..' in final):     # Checking for invalid/malicious subdirectory access relative to assigned base directory
            if not checkValidPath(baseDir=base, check=final):
                return f"UNAUTHORIZED ACCESS to {final} from root {base}", 403
            
        # File requested - change tracks
        if not os.path.isdir(final):
            a = send_file(final, as_attachment=False, download_name=extendedDirectory.split(os.sep)[-1])
            return a


        match request.method:
            case "GET":    # Viewing query 
 
                # Continue considering requested path leads to a normal directory
                root = final
                all:list= os.listdir(root)
                files = []
                folders = []
                for i in all:
                    tf = os.path.isdir(os.path.join(root, i))       # Assigning labels
                    if tf:
                        folders.append(i)
                    else:
                        files.append(i)
                return jsonify(root = extendedDirectory, folders = folders, files = files)
            

            

            case "POST":       # Folder-create / File-upload query
                
                match request.form['type']:
                    case 'create':        # Create folder
                        fileName = request.form['target']
                        if not checkValidName(fileName):
                            return jsonify(success=False)
                        testFile_name = fileName
                        startingNo = 1
                        while os.path.exists(os.path.join(final, testFile_name)):  
                            testFile_name = fileName + ' (' + str(startingNo) + ')'
                        os.mkdir(os.path.join(final, testFile_name))

                        return jsonify(success=True)

                    case 'upload':          # Upload content
                        
                        files = request.files.getlist('toUpload')
                        for i in files:
                            if not checkValidName(i.filename):
                                return 'Invalid filenames',400
                        
                        for i in files:
                            i.save(os.path.join(final, i.filename))

                        return jsonify(success = True)

                    case _:
                        return "Invalid request", 400


            case "PUT":         # Modify query
                data = request.form

                match data['type']:

                    case 'rename':

                        toChange = data['targetPath'] 
                        if not (checkValidName(data['target']) or checkValidPath(final , os.path.join(final ,toChange))):
                                return jsonify(success= False)
                            

                        os.rename(os.path.join(base, toChange.replace(safe_directory_separator, os.sep) ), (os.path.join(final, data['target'])))
                        return jsonify(success= True)


                    case 'relocate':  

                        # full relative path of destination directory
                        finalPath = os.path.join(base, data['finalPath'].replace(safe_directory_separator, os.sep)).replace(safe_directory_separator, os.sep)

                        for d in json.loads(data['initPath']):

                            # full relative path of file
                            initPath = os.path.join(base, d.replace(safe_directory_separator, os.sep)).replace(safe_directory_separator, os.sep)
                            # standalone file name 
                            fileName = initPath.split(os.sep)[-1]

                            isFile = False
                            
                            if os.path.isfile(initPath) and '.' in initPath.split(os.sep)[-1]:
                                isFile = True

                            # Validating paths
                            if not (checkValidPath(base,initPath) or checkValidPath(base, finalPath)):
                                return jsonify(success= False)
                            

                            # To prevent overwriting files with same names
                            testFile_name = fileName
                            startingNo = 1
                            while os.path.exists(os.path.join(finalPath, testFile_name)):  
                                
                                if isFile :                                                # For Files
                                    nameParsed = fileName.split('.')
                                    if fileName[0]=='.': # Handling DotFiles
                                        testFile_name = '.' + nameParsed[0] + '(' + str(startingNo) + ')' 
                                        if len(nameParsed)>1:
                                            testFile_name+= '.' + '.'.join(nameParsed[1:])
                                    
                                    else: #Handling regular files
                                        testFile_name = nameParsed[0] + '(' + str(startingNo) + ')' + '.' + '.'.join(nameParsed[1:])

                                else:                                                     # For Directories
                                    testFile_name = fileName + '(' + str(startingNo) + ')'
                                startingNo+=1


                            toPath = os.path.join(finalPath, testFile_name)

                            # relocate file

                            if data['duplicate'] == 'true':   # Copy


                                if os.path.isfile(initPath):
                                    shutil.copy(initPath, toPath)
                                else:
                                    shutil.copytree(initPath, toPath)

                            else:                  # Cut
                                shutil.move(initPath, toPath)

                        return jsonify(success= True)


                    case _:
                        return "Invalid request parameters", 400




            case "PATCH":       # File / Folder retrieval query  
                match request.form['type']:
                    case 'details':
                        final = os.path.join(final, request.form['toCheck'])
                        type = "folder"
                        if os.path.isfile(final):
                            type = "file"
                        
                        total = os.path.getsize(final)

                        if type!='file':
                            total = get_dir_size(final)
                            

                        return jsonify(
                            name = request.form['toCheck'], 
                            type = type, 
                            size = total, #os.path.getsize(final), 
                            created = datetime.datetime.fromtimestamp(os.path.getctime(final)), 
                            modified = datetime.datetime.fromtimestamp(os.path.getmtime(final)),
                            accessed = datetime.datetime.fromtimestamp(os.path.getatime(final))
                            )
                    
                    case 'retrieve':
                        data = json.loads(request.form['to_retrieve']) #json.loads
                        finalFile = ''
                        l = len(data)
                        if l==0:   # No files sent

                            return "False request", 400
                        
                        else:   # Prep temp directory details for sending folder or zipping multiple files 
                            for i in range(l):
                                data[i] = fr"{os.path.join(base, data[i].replace(safe_directory_separator, os.sep))}"

                            if not  os.path.exists(tempFolder):
                                os.mkdir(tempFolder)

                            finalFile  = os.path.join( tempFolder , f"files_{secrets.token_hex(10)}.zip")


                        # Validation
                        for i in data:
                            if not (checkValidPath(base, os.path.join(base,i)) or os.path.exists(base, os.path.join(base,i))):
                                return "Invalid request", 400
                        

                        thisTask = request.form['task_id']
                        addActiveTask(thisTask)
                        thisIndex = checkValidTask(thisTask)

                        global currAbortedTasks
                        if l==1 and os.path.isfile(data[0]):       # Single file

                            finalFile = data[0] #os.path.join(final, data[0])
                        
                        else:         # Folder or Multiple files - zip & send


                            if currAbortedTasks>0:                                                      # Possibility that some task might need to be aborted
                                if thisIndex>activeTaskLen or currActiveTasks[thisIndex]!=thisTask:     #Check if cached index and value at that index is still valid
                                    thisIndex = checkValidTask(thisTask)                                # Refresh outdated index
                                    if thisIndex==-1:                                                   # Check for final time in case new index is also invalid
                                        currAbortedTasks-=1
                                        return "Error occured", 500                                     # Abort task
                                

                            with zipfile.ZipFile(finalFile,'w', zipfile.ZIP_DEFLATED) as z:
                                for i in data:

                                    if os.path.isfile(i):
                                        z.write(i, i.split(os.sep)[-1])
                                    
                                    else:

                                        for root, dirs, files in os.walk(i):
                                            

                                                    

                                            for file in files:

                                                if currAbortedTasks>0:                                                      # Possibility that some task might need to be aborted
                                                    if thisIndex>activeTaskLen or currActiveTasks[thisIndex]!=thisTask:     #Check if cached index and value at that index is still valid
                                                        thisIndex = checkValidTask(thisTask)                                # Refresh outdated index
                                                        if thisIndex==-1:                                                   # Check for final time in case new index is also invalid
                                                            currAbortedTasks-=1
                                                            return "Error occured", 500                                     # Abort task
                                                        
                                                        
                                                z.write(
                                                    os.path.join(root, file),
                                                    os.path.relpath(
                                                                os.path.join(root, file),
                                                                os.path.join(i, '..')
                                                            )
                                                        )
                            
                            
                        if currAbortedTasks>0:                                                          # Possibility that some task might need to be aborted
                                if thisIndex>activeTaskLen or currActiveTasks[thisIndex]!=thisTask:     #Check if cached index and value at that index is still valid
                                    thisIndex = checkValidTask(thisTask)                                # Refresh outdated index
                                    if thisIndex==-1:                                                   # Check for final time in case new index is also invalid
                                        currAbortedTasks-=1                                             
                                        return "Error occured", 500                                     # Abort task

            
                        
                        a= send_file(finalFile, as_attachment= False, download_name=finalFile.split(os.sep)[-1])
                        
                        completeActiveTask(thisTask)

                        return a
                    
                    


            case "DELETE":      # Deletion query
                
                data= json.loads(request.form['toDelete']) # json.loads
                l = len(data)
                if l==0:                                    # No files specified
                    return "False request", 400

                correctedPaths = []
                # Validation
                for i in range(l):
                    
                    correctedPaths.append(data[i].replace(safe_directory_separator, os.sep))
                    if not (checkValidPath(final, os.path.join(final,correctedPaths[i])) or os.path.exists(os.path.join(base,correctedPaths[i]))):
                        return "Invalid request", 400
                    

                # Deletion
                for i in correctedPaths:
                    finPath = os.path.join(base, i)
                    if os.path.isfile(finPath):
                        os.remove(finPath)
                    else:
                        shutil.rmtree(finPath)

                return jsonify(success = True)
                        
 

    except Exception as e:
        return str(e), 500





@app.route('/login', methods = ["POST"])
def login():
    match request.method:

        case "GET":
            return render_template('login.html')
        

        case "POST":
            email = request.form['email']
            password = request.form['password']


            u = user.query.filter_by(email=email).first()


            # Check if credential exists
            if not email or not u:
                return make_response(jsonify(error = "email not found", success = False, forbidden = False), 200)
            

            # Check if max incorrect login attempts reached
            if u.loginAttempts>=maxLoginAttempts:
                return make_response(jsonify(error = "Max login attempts reached", success = False, forbidden = True), 200)

            
            if pbkdf2_sha256.verify(password, u.password)==False:
                u.loginAttempts+=1
                db.session.commit()
                
                return make_response(jsonify(error = "credentials don't match", success = False, forbidden = False), 200)


            # reset login attempts
            u.loginAttempts = 0
            db.session.commit()

            # Generate access token
            token = create_access_token(identity=u, expires_delta=datetime.timedelta(hours=1))
            return jsonify(msg= "logged in", token = token, user_name = u.name, user_id = u.id, redir = url_for('homePage'), success=True, forbidden = False)



@app.route('/logout')
@valid_jwt_required
def logout():
    token = get_jwt()
    if token!={}:
        blacklistObj = tokenBlackList()
        blacklistObj.exp = token['exp']
        blacklistObj.jti = token['jti']
        db.session.add(blacklistObj)
        db.session.commit()
    
    return jsonify(success = True)






@app.route('/register', methods = ["POST"])
def register():
    match request.method:
        case "GET":
            return render_template('register.html')


        case "POST":
            email = request.form['email']
            name = request.form['name'] 
            password = pbkdf2_sha256.hash(request.form["password"])
            if not email or user.query.filter_by(email = email).first():
                return jsonify(msg = "Someone with this email already exists")
            
            link = userVerificationLinks()
            link.email = email
            link.name = name
            link.password = password
            link.exp = datetime.datetime.utcnow() + datetime.timedelta(hours=1)

            code = secrets.token_hex(64)
            identifier = secrets.token_hex(8)
            append = "_".join([identifier, code])
            
            link.identifier = identifier
            link.token_hex = code
            
            db.session.add(link)
            db.session.commit()
            
            sendVerifLink(to=email, url=f"{frontendURL}/verifyreg?token={append}", purpose='reg')

            # db.session.add(user(name=name, email=email))
            # db.session.commit()
            return jsonify(msg = "Verification link mailed. You may close this tab.")




@app.route("/sendreset", methods = ['POST'])
def sendPassReset():
    if request.form['email'] and user.query.filter_by(email = request.form['email']):
        link = userVerificationLinks()
        link.email = request.form['email']
        link.name = ''
        link.password = ''
        link.exp = datetime.datetime.utcnow() + datetime.timedelta(hours=1)

        code = secrets.token_hex(64)
        identifier = secrets.token_hex(8)
        append = "_".join([identifier, code])
        
        link.identifier = identifier
        link.token_hex = code
        
        db.session.add(link)
        db.session.commit()
        
        sendVerifLink(to=request.form['email'], url=f"{frontendURL}/resetpass?key={append}", purpose='pass')

        return jsonify(success = True)
    
    else:

        return jsonify(success = False)
        





@app.route('/verify/<mode>/<token>', methods=['GET','POST'])
def verifyUserReg(mode:str, token:str):

    identifier, code = token.split('_')
    
    search = userVerificationLinks.query.filter_by(identifier = identifier, token_hex = code).first()
    if not search:
        return jsonify(success = False)
        # return redirect(url_for("login"))
    
    match mode:
        case 'reg':
            #Adding user
            u = user()
            u.email = search.email
            u.name = search.name
            u.password = search.password
            db.session.add(u)
        
        case 'pass':
            # encryption
            password = pbkdf2_sha256.hash(request.form["password"])

            u = user.query.filter_by(email = search.email).first()
            if not u:
                return jsonify(success = False)

            u.password = password
            u.loginAttempts = 0



    #Expiring link
    db.session.delete(search)

    #Deleting duplicate persisting link for same user
    to_delete = db.session.query(userVerificationLinks).filter(userVerificationLinks.email==search.email).all()
    for i in to_delete:
        db.session.delete(i)

    
    
    db.session.commit()
    return jsonify(success = True)




@app.route('/cancelTask/<string:id>', methods=["GET"])
def cancelTask(id:str):
    try:
        completeActiveTask(id)
        global currAbortedTasks
        currAbortedTasks+=1
        return jsonify(success = True)
    except:
        return jsonify(success = False)








if __name__=="__main__":
    # with app.app_context():
    #     # db.create_all()
    #     db.drop_all()
    app.run(debug=True)#, host='0.0.0.0')




