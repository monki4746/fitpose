from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager



db = SQLAlchemy()
DB_NAME = "database.db"

#Create App
def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'semicircle_secret_key hollimoly guacamole roly poly'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    db.init_app(app)

    # import Blueprint
    from .views import views
    from .auth import auth
    from .models import User

    # Apply Blueprint
    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")
    
    # DB에 사용할 모델 불러오기
    from . import models   # from .models import *
    with app.app_context():
        db.create_all()
        
    # flask-login 적용
    login_manager = LoginManager()
    login_manager.login_view = 'auth.sign_in'
    login_manager.init_app(app)
    
    @login_manager.user_loader
    def load_user(id):
        return User.query.get(id)  # primary_key
        
    return app

# Create or Check Database file
def create_database(app):
    # Check db file
    if not path.exists(f'login/{DB_NAME}'):
        db.create_all(app=app)
        print('>>> Create DB')