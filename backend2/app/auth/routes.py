from flask import Blueprint, request, jsonify
from datetime import timedelta
from backend.app.db.database import SessionLocal
from backend.app.models import User, UserRole
# from backend.app.auth.schemas import UserLogin
from backend.app.auth import auth
from backend.app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES
import backend.app.auth.schemas as schemas
import backend.app.models as models

bp = Blueprint('auth', __name__)

@bp.route("/api/auth/token", methods=["POST"])
def login():
    """
    user login API, returns JWT access token
    """
    # Create a new session for this request
    db = SessionLocal()
    try:
        request_data = request.get_json()
        user_data = schemas.UserLogin(**request_data)
        
        

        try:
            user_role_enum = UserRole(user_data.role)
        except ValueError:
            return jsonify({
                "status": "error",
                "message": "Invalid role provided",
                "token": None,
                "role": None,
                "redirect_url": None
            }), 400

        user = db.query(models.User).filter(
            models.User.username == user_data.username,
            models.User.role == user_role_enum
        ).first()

        print("Looking for:", user_data.username, user_data.role)
        print("Resolved role:", user_role_enum)
        print("Found user:", user.username if user else "None")
        if user:
            print("Password check:", auth.verify_password(user_data.password, user.password))

        if not user or not auth.verify_password(user_data.password, user.password):
            return jsonify({
                "status": "error",
                "message": "Incorrect username, password, or role",
                "token": None,
                "role": None,
                "redirect_url": None
            }), 401
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth.create_access_token(
            data={"sub": user.username, "role": user.role.value},
            expires_delta=access_token_expires
        )
        
        # Set redirect URL based on role
        redirect_url = "/manager/dashboard" if user.role == models.UserRole.Manager else "/worker/dashboard"
        
        return jsonify({
            "status": "success",
            "message": "Login successful",
            "token": access_token,
            "role": user.role.value,
            "redirect_url": redirect_url
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "token": None,
            "role": None,
            "redirect_url": None
        }), 400
    finally:
        db.close()