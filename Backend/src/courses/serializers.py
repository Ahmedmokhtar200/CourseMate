from rest_framework import serializers
from authentication.serializers import UserSerializer
from courses.models import (Course,
                            UserCourseReview,
                            UserCourseRating,
                            UserCourseHistory)


class CourseSerializer(serializers.ModelSerializer):
    skills = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Course
        fields = '__all__'


class CourseUserHistorySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)

    class Meta:
        model = UserCourseHistory
        fields = '__all__'


class CourseUserReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)

    class Meta:
        model = UserCourseReview
        fields = '__all__'


class CourseUserRatingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)

    class Meta:
        model = UserCourseRating
        fields = '__all__'
