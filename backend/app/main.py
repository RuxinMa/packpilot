from flask import Flask, jsonify
from app.auth.routes import bp as auth_bp
from app.Item.item import bp as item_bp
from app.Task.task import bp as task_bp
from app.Container.container import bp as container_bp
from app.db.database import engine, close_db, SessionLocal
from app.auth.models import Base, User, UserRole
from app.auth.auth import get_password_hash

def create_default_users():
    """create default test users"""
    db = SessionLocal()
    try:
        # check if users already exist
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("✅ Users already exist, skipping user creation")
            return
        
        # create default users
        test_users = [
            {
                "username": "manager1",
                "password": "password123", 
                "role": UserRole.Manager
            },
            {
                "username": "worker1",
                "password": "password123",
                "role": UserRole.Worker
            }
        ]
        
        for user_data in test_users:
            hashed_password = get_password_hash(user_data["password"])
            new_user = User(
                username=user_data["username"],
                password=hashed_password,
                role=user_data["role"]
            )
            db.add(new_user)
            print(f"✅ Created user: {user_data['username']}")
        
        db.commit()
        print("🎉 Default users created successfully!")
        print("   Manager: manager1 / password123")
        print("   Worker:  worker1 / password123")
        
    except Exception as e:
        print(f"❌ Error creating users: {e}")
        db.rollback()
    finally:
        db.close()

def create_app():
    app = Flask(__name__)
    
    # Config
    app.config.from_mapping(SECRET_KEY="dev")

    # add root path route
    @app.route('/')
    def index():
        return jsonify({
            "message": "Flask Backend API is running!",
            "endpoints": {
                "auth": "/api/auth/token",
                "items": "/api/manager/add_item",
                "tasks": "/api/manager/assign_task", 
                "containers": "/api/manager/add_container"
            }
        })

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(item_bp)
    app.register_blueprint(task_bp)
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
    # automatically create default users
    create_default_users()

# For direct local runs (optional)
if __name__ == "__main__":
    app.run(debug=True)
