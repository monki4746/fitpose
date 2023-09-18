from flask import Blueprint, render_template
from flask_login import login_required, current_user

#create Blueprint
views = Blueprint('views', __name__)

#route
@views.route('/')
def home():
    return render_template('home.html')