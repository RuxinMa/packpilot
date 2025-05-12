from flask import Flask
from .auth.routes import bp as auth_bp
from .db.database import engine, close_db
from .auth import models

from .item import bp as item_bp
from backend.app.db.database import Base





# Create database tables
models.Base.metadata.create_all(bind=engine)

def create_app():
    app = Flask(__name__)
    
    # Configure app
    app.config.from_mapping(
        SECRET_KEY="dev",
    )
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    
    # Register database teardown function
    app.teardown_appcontext(close_db)
    
    return app

app = create_app()

if __name__ == "__main__":
    app.register_blueprint(item_bp)
    app.register_blueprint(task_bp)
    app.register_blueprint(container_bp)
    app.run(debug=True)