from flask import Flask
from backend.app.auth.routes import bp as auth_bp

from backend.app.container import bp as container_bp

from backend.app.db.database import engine, close_db
from backend.app.auth.models import Base

def create_app():
    app = Flask(__name__)
    
    # Config
    app.config.from_mapping(SECRET_KEY="dev")

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(container_bp)

    # Teardown
    app.teardown_appcontext(close_db)

    return app

app = create_app()

print("\n✅ REGISTERED ROUTES:")
for rule in app.url_map.iter_rules():
    print(f"{rule.methods} {rule.rule}")

# Create DB tables after app is created
with app.app_context():
    Base.metadata.create_all(bind=engine)

# For direct local runs (optional)
if __name__ == "__main__":
    app.run(debug=True)
