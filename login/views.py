from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify
from flask_login import login_required, current_user
from .models import Note
from . import db

#create Blueprint
views = Blueprint('views', __name__)

#route

# Question
@views.route('/question', methods=['GET','POST'])
@login_required
def question():
    # POST : 메모 생성
    if request.method == "POST":
        title = request.form.get('note-title')
        content = request.form.get('note-content')

        if len(title) < 1 or len(content) < 1:
            flash("제목 또는 내용이 없습니다.", category = "error")
        elif len(title) > 50:
            flash("제목이 너무 깁니다. 50자 이내", category = "error")
        elif len(content) > 2000:
            flash("내용이 너무 깁니다. 2000자 이내", category="error")
        else :
            # note 인스턴스 생성 -> DB에 저장
            new_note = Note(title=title, content=content, user_id=current_user.id)    
            db.session.add(new_note)
            db.session.commit()

            flash("메모 생성 완료", category="success")
            return redirect(url_for('views.question')) # 없으면 메모 계속 생성

    return render_template('question.html')

# 메모 삭제 기능
@views.route('/delete-note', methods=['POST'])
def delete_note():
    # POST : 메모 삭제
    if request.method == "POST":
        note = request.get_json()
        note_id = note.get('noteId')

        select_note = Note.query.get(note_id)
        if select_note:
            if select_note.user_id == current_user.id : 
                db.session.delete(select_note)
                db.session.commit()

        return jsonify({'result': False})
    
    # 메모 수정 기능
@views.route('/update-note', methods=['PUT'])
def update_note():
    # PUT : 메모 수정
    if request.method == "PUT":
        note = request.get_json()
        note_id = note.get('noteId')
        title = note.get('title')
        content = note.get('content')

        select_note = Note.query.get(note_id)
        if select_note:
            if select_note.user_id == current_user.id : 
                select_note.title = title
                select_note.content = content
                db.session.commit()

        return jsonify({})


@views.route('/')
def home():
    return render_template('home.html')