"""
one-time script to create test users
run: python create_test_users.py
"""

from app.db.database import SessionLocal
from app.auth.models import User, UserRole
from app.auth.auth import get_password_hash

# test users data
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

def main():
    db = SessionLocal()
    try:
        # check if these users already exist
        for user_data in test_users:
            existing_user = db.query(User).filter(
                User.username == user_data["username"]
            ).first()
            
            if existing_user:
                print(f"user {user_data['username']} already exists, skipping")
                continue
                
            # create new user
            hashed_password = get_password_hash(user_data["password"])
            new_user = User(
                username=user_data["username"],
                password=hashed_password,
                role=user_data["role"]
            )
            db.add(new_user)
            print(f"created user {user_data['username']} successfully")
        
        db.commit()
        print("done!")
    except Exception as e:
        print(f"error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()