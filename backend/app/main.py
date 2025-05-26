from flask import Flask
from app.auth.routes import bp as auth_bp
from app.db.database import engine, close_db
from app.auth import models
from app.AI.routes import bp as ai_bp

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
    app.register_blueprint(ai_bp)
    
    # Register database teardown function
    app.teardown_appcontext(close_db)
    
    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True) 