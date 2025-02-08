from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, Group
from django.db.models import CASCADE


class UserProfileManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


class UserProfile(AbstractBaseUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    # Explicitly use custom UserGroup for many-to-many relationship between
    # auth_group and optio_users table
    groups = models.ManyToManyField(Group, through="UserGroup")

    objects = UserProfileManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "optio_users"

    def __str__(self):
        return self.email


class UserGroup(models.Model):
    """
    Custom junction model for many to many relation between users and groups
    """
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=CASCADE)

    class Meta:
        db_table = "optio_user_groups"
        unique_together = ("user", "group")  # Prevent duplicate records
