FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY main.py .
COPY gsc.py .

# Expose port (Railway uses $PORT env var)
EXPOSE 8000

# Use shell form to expand $PORT (Railway sets this)
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
