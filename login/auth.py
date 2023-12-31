from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify
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

# # Question
# @auth.route('/question', methods=['GET','POST'])
# @login_required
# def question():
#     # POST : 메모 생성
#     if request.method == "POST":
#         title = request.form.get('note-title')
#         content = request.form.get('note-content')

#         if len(title) < 1 or len(content) < 1:
#             flash("제목 또는 내용이 없습니다.", category = "error")
#         elif len(title) > 50:
#             flash("제목이 너무 깁니다. 50자 이내", category = "error")
#         elif len(content) > 2000:
#             flash("내용이 너무 깁니다. 2000자 이내", category="error")
#         else :
#             # note 인스턴스 생성 -> DB에 저장
#             new_note = Note(title=title, content=content, user_id=current_user.id)    
#             db.session.add(new_note)
#             db.session.commit()

#             flash("메모 생성 완료", category="success")
#             return redirect(url_for('auth.question')) # 없으면 메모 계속 생성

#     return render_template('question.html')

# Pose    
@auth.route("/pose1")
def pose1():
    return render_template("pose.html")

@auth.route("/pose2")
def pose2():
    return render_template("pose.html")