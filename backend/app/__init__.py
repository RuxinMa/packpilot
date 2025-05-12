# from flask import Flask

# def create_app():
#     app = Flask(__name__)
#     app.config.from_object('config.Config')

#     from . import routes
#     app.register_blueprint(routes.bp)

#     return app

from flask import Flask
from backend.app.auth.routes import bp as auth_bp
from backend.app.item import bp as item_bp

from backend.app.db.database import engine, close_db
from backend.app.auth.models import Base

def create_app():
    app = Flask(__name__)
    
    # Config
    app.config.from_mapping(SECRET_KEY="dev")

    # Routes
    app.register_blueprint(auth_bp)
    app.teardown_appcontext(close_db)

    return app

app = create_app()