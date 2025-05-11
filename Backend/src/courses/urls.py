from tkinter.font import names

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from courses.views import (CourseViewSet,
                           CourseDetailAPIView,
                           CourseUserHistoryListAPIView,
                           CourseUserReviewListAPIView,
                           CourseUserRatingListAPIView)

router = DefaultRouter()
router.register("", CourseViewSet)

urlpatterns = [
    path('',
         include(router.urls),
         name='course-list'),
    # path('<int:pk>/',
    #      CourseDetailAPIView.as_view(),
    #      name='course-detail'),
    path('users/history/',
         CourseUserHistoryListAPIView.as_view(),
         name='user-history-list'),
    path('users/reviews/',
         CourseUserReviewListAPIView.as_view(),
         name='user-review-list'),
    path('users/ratings/',
         CourseUserRatingListAPIView.as_view(),
         name='user-rating-list')
]
