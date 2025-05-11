from django.contrib.auth import get_user_model
from django.db.models import Q

from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import (get_object_or_404,
                                     ListAPIView)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import (IsAuthenticated,
                                        AllowAny)
from rest_framework.decorators import action
from rest_framework import viewsets

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


class CourseViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search)
            )
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

    @action(detail=True, methods=['get'])
    def recommendations(self, request, pk=None):
        course = self.get_object()
        # Fetch up to 4 related courses (exclude current course)
        recommended = Course.objects.filter(
            Q(university=course.university)
        ).exclude(id=course.id)[:4]
        serializer = self.get_serializer(recommended, many=True)
        return Response(serializer.data)


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
    permission_classes = [AllowAny]

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
