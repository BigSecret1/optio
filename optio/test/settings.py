from optio.optioconf.settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:'
    }
}

# Turn off password hashing or use faster ones for tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Reduce test run noise
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
}

# Add any test-specific flags
DEBUG = False
