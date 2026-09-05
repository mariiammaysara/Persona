'''
Pytest configuration — ensures required settings exist before the app
is imported, so the test suite never depends on a real .env file or a
live Groq API key.
'''
import os

os.environ.setdefault("GROQ_API_KEY", "test-key-for-testing")
