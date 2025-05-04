from django.urls import path
from courses.views import (CourseListAPIView,
                           CourseDetailAPIView,
                           CourseUserHistoryListAPIView,
                           CourseUserReviewListAPIView,
                           CourseUserRatingListAPIView)


urlpatterns = [
    # path('', views.index, name='index'),
    path('',CourseListAPIView.as_view(),
         name='course-list'),
    path('<int:pk>/',
         CourseDetailAPIView.as_view(),
         name='course-detail'),
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