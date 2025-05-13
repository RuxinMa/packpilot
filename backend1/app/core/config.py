import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "4745622e956c078f49c256e39467afc4a14cec43f9404273d3ce4fc7b434acf4")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db") 