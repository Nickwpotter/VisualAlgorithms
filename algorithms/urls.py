from django.urls import path
from . views import home, sorting, searching, selection, merge

urlpatterns = [
    path('', home, name='home'),
    path('sorting/', sorting, name='sorting'),
    path('sorting/selection', selection, name='selection_sort'),
    path('sorting/merge', merge , name='merge_sort'),
    path('searching/', searching, name='searching'),
]