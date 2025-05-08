from flask import Flask
from flask_cors import CORS
from models import db
from config import DB_URI
from routes.items import item_bp
from routes.tasks import task_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db.init_app(app)

app.register_blueprint(item_bp)
app.register_blueprint(task_bp)

@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
