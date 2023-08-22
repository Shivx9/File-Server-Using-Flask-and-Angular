from flask_sqlalchemy.model import Model
from app import db
from sqlalchemy.dialects import mysql


commonBaseClassProperties = [p for p in dir(db.Model) if p[0]!='_']

def getPropertyList(obj:object):
    return [p for p in dir(obj) if (p[0]!='_' and not p in commonBaseClassProperties)]




class user(db.Model):
    __tablename__='user'

    id = db.Column(mysql.INTEGER, primary_key = True, autoincrement = True, nullable = False)
    name = db.Column(mysql.VARCHAR(100), nullable = False)
    email = db.Column(mysql.VARCHAR(200), nullable = False, unique = True)
    password = db.Column(mysql.VARCHAR(256), nullable = False)
    priority = db.Column(mysql.INTEGER(), default = 1)
    loginAttempts = db.Column(mysql.INTEGER(), default = 0)
    directorySessions = db.relationship('userDirectorySessions', backref = 'user')





class userVerificationLinks(db.Model):
    identifier = db.Column(mysql.VARCHAR(16), primary_key=True, nullable = False)
    token_hex = db.Column(mysql.VARCHAR(128), nullable=False)
    name = db.Column(mysql.VARCHAR(100), nullable = False)
    email = db.Column(mysql.VARCHAR(200), nullable = False)
    password = db.Column(mysql.VARCHAR(256), nullable = False)
    exp = db.Column(mysql.DATETIME(), nullable = False)




class userDirectorySessions(db.Model):
    id = db.Column(mysql.INTEGER, primary_key = True, autoincrement = True, nullable = False)
    user_id = db.Column(mysql.INTEGER, db.ForeignKey('user.id'))
    directory =  db.Column(mysql.VARCHAR(200))
    




class tokenBlackList(db.Model):
    jti = db.Column(mysql.VARCHAR(64), primary_key=True, nullable = False)
    exp = db.Column(mysql.VARCHAR(32))
    







class testTable(db.Model):
    __tablename__="testtable"

    id = db.Column(mysql.INTEGER(), primary_key = True, autoincrement = True, nullable = False)

    textField  = db.Column(mysql.TEXT(), nullable = False)


    def testFn(self):
        print("->\n", [p for p in dir(self) if (p[0]!='_' and not p in commonBaseClassProperties)], "\n" , not self.__getattribute__('textField'),"\n")
        self.__setattr__('textField', 'some text here')
