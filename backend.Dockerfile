FROM python:3.10

WORKDIR /app

# Copy requirements first for caching
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY backend/ .

# Create necessary directories if not exist
RUN mkdir -p /app/instance

EXPOSE 8000

# Use wsgi.py as the entrypoint
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "wsgi:app"]
