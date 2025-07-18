FROM python:3.10

WORKDIR /app

# Copy requirements first for caching
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY backend/ .

# Create necessary directories and database file
RUN mkdir -p /app/instance
RUN touch /app/app.db
RUN chmod 666 /app/app.db

EXPOSE 8000

# Use wsgi.py as the entrypoint with increased timeout
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--timeout", "600", "wsgi:app"]
