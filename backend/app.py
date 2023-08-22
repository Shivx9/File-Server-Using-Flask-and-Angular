from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
import logging, json




credentials = json.load(open('credentials.json'))


connection_url=sa.engine.URL.create(drivername=credentials["driver"],
                                    username=credentials["user"],
                                    host=credentials["host"],
                                    port=credentials["port"],
                                    password=credentials["pas"],
                                    database=credentials["database"])


frontendURL = credentials['frontend_url']


app=Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] =connection_url
app.config["UPLOAD_FOLDER"] = 'uploads'
app.config["JWT_SECRET_KEY"] = credentials["JWT_SECRET_KEY"]
app.config["HASH_SECRET"] = credentials["HASH_SECRET"]

db = SQLAlchemy(app)
migrate = Migrate(app, db)

