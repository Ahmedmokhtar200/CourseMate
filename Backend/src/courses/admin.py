from django.contrib import admin
from courses.models import (Course,
                            UserCourseRating,
                            UserCourseReview,
                            UserCourseHistory)

admin.site.register(Course)
admin.site.register(UserCourseHistory)
admin.site.register(UserCourseReview)
admin.site.register(UserCourseRating)