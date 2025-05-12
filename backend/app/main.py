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

# ✅ Make sure this runs AFTER `engine` is available and app is created
with app.app_context():
    Base.metadata.create_all(bind=engine)

# Optional routes just for testing
if __name__ == "__main__":
    app.register_blueprint(item_bp)
    app.run(debug=True)