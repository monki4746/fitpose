from flask import Blueprint, render_template, request, flash, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User
from . import db
from flask_login import login_user, login_required, logout_user, current_user


# Create blueprint
auth = Blueprint('auth', __name__)

# route
# logout
@auth.route('/logout')
@login_required   # 로그인이 돼 있을때만 접근
def logout():
    logout_user()
    return render_template('logout.html')

@auth.route('/sign-in', methods=['GET', 'POST'])
def sign_in():
    # login
    if request.method == 'POST':
    #Split Data
        email = request.form.get('email')
        password1 = request.form.get('password1')
        
        # Search User in database & compare password
        user = User.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password1):
                flash('로그인 완료', category='scccess')
                login_user(user, remember=True)
                return redirect(url_for('views.home'))
            else:
                flash('비밀번호가 다릅니다.', category='error')
        else:
            flash('해당 이메일 정보가 다릅니다.', category='error')
    
    return render_template('sign_in.html')

# sign up
@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
    
        #Split Data
        email = request.form.get('email')
        name = request.form.get('name')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')
        
        #유효성 검사
        user = User.query.filter_by(email=email).first()
        if user:
            flash('이미 가입된 이메일입니다.', category='error')
        elif len(email) < 5 :
            flash("이메일은 5자 이상입니다.", category="error")
        elif len(name) < 2 :
            flash("닉네임은 2자 이상입니다.", category="error")
        elif password1 != password2 :
            flash("비밀번호와 비밀번호재입력이 서로 다릅니다", category="error")
        elif len(password1) < 7 :
            flash("비밀번호는 7자 이상입니다.")
        else:
            new_user = User(email=email, name=name, password=generate_password_hash(password1, method='sha256'))
            db.session.add(new_user)
            db.session.commit()
            
            # auto-login
            login_user(new_user, remember=True)
            flash("회원가입 완료", category="success")
            return redirect(url_for('views.home'))
        
    return render_template('sign_up.html')
