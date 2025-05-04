from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Difficulty(models.TextChoices):
    Beginner = "beginner", "Beginner"
    Intermediate = "intermediate", "Intermediate"
    Advanced = "advanced", "Advanced"
    Conversant = "Conversant", "Conversant"
    Not_Calibrated = "not_calibrated", "Not_Calibrated"


class Course(models.Model):
    name = models.CharField(max_length=120)
    university = models.CharField(max_length=120)
    difficulty_level = models.CharField(max_length=120, choices=Difficulty.choices)
    # UserProfile.objects.filter(status=Status.ACTIVE)
    skills = models.TextField()
    description = models.TextField()
    rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    url = models.URLField(max_length=500)

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = "course"
        verbose_name_plural = "courses"
        managed = False  # Django won't manage the table's schema
        db_table = "courses"  # Matches the table name in coursera.db


class UserCourseHistory(models.Model):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE)
    course = models.ForeignKey(Course,
                               on_delete=models.CASCADE,
                               related_name='user_history')

    class Meta:
        verbose_name = "user_course_history"
        verbose_name_plural = "user_course_histories"
        db_table = "user_course_history"

    def __str__(self):
        return f"{self.user.first_name} {self.course.name}"


class UserCourseRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course,
                               on_delete=models.CASCADE,
                               related_name='user_rating')
    rating = models.DecimalField(max_digits=3, decimal_places=1)

    class Meta:
        verbose_name = "user_course_rating"
        verbose_name_plural = "user_course_ratings"
        db_table = "user_course_rating"


class UserCourseReview(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course,
                               on_delete=models.CASCADE,
                               related_name='user_review')
    review = models.TextField()

    class Meta:
        verbose_name = "user_course_review"
        verbose_name_plural = "user_course_reviews"
        db_table = "user_course_review"
