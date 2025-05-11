from django.contrib.auth import get_user_model
from django.db.models import Q

from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import (get_object_or_404,
                                     ListAPIView)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import (IsAuthenticated,
                                        AllowAny)

from courses.pagination import SmallSetPagination
from courses.serializers import (CourseSerializer,
                                 CourseUserRatingSerializer,
                                 CourseUserReviewSerializer,
                                 CourseUserHistorySerializer)
from courses.models import (Course,
                            UserCourseHistory,
                            UserCourseReview,
                            UserCourseRating)

User = get_user_model()


class CourseListAPIView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CourseSerializer

    def get_queryset(self):
        # Start with all courses
        queryset = Course.objects.all()

        # Get query parameters
        search_query = self.request.query_params.get('search', None)
        category = self.request.query_params.get('category', None)

        # Apply search filter
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(description__icontains=search_query)
            )

        # Apply category filter
        if category:
            queryset = queryset.filter(category=category)  # Assuming category field

        return queryset

    def list(self, request, *args, **kwargs):
        # Customize the response structure to match {'courses': data}
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response({'courses': serializer.data})

        serializer = self.get_serializer(queryset, many=True)
        return Response({'courses': serializer.data})


class CourseDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get_object(self, pk):
        course = get_object_or_404(Course, pk=pk)
        return course

    def get(self, request, pk):
        course = self.get_object(pk)
        serializer = CourseSerializer(course)
        return Response(serializer.data)


class CourseUserHistoryListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        # Verify user exists
        user = get_object_or_404(User, pk=user_id)

        # Get all UserCourseHistory records for the user
        user_course_histories = UserCourseHistory.objects.filter(user=user)

        # Serialize the data
        serializer = CourseUserHistorySerializer(
            user_course_histories,
            many=True,
            context={'request': request}
        )

        return Response(serializer.data)

    def post(self, request):
        """User viewed a course """
        user = request.user
        course = get_object_or_404(Course, pk=request.data.get('course_id'))

        user_course_history = UserCourseHistory.objects.create(user=user, course=course)
        serializer = CourseUserHistorySerializer(
            user_course_history
        )

        return Response(serializer.data)


class CourseUserReviewListAPIView(APIView):
    def get(self, request):
        user = request.user

        user_reviews = UserCourseReview.objects.filter(user=user)

        serializer = CourseUserReviewSerializer(
            user_reviews,
            many=True,
            context={'request', request}
        )

        return Response({'data': serializer.data})


class CourseUserRatingListAPIView(APIView):
    def get(self, request):
        user = request.user.id

        user_ratings = UserCourseRating.objects.filter(user=user)

        serializer = CourseUserRatingSerializer(
            user_ratings,
            many=True,
            context={'request', request}
        )

        return Response({'data': serializer.data})
