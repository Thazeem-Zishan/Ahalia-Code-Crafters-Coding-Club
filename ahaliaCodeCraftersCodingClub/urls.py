from codeCraftersMainSite import views

"""
URL configuration for ahaliaCodeCraftersCodingClub project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", views.home_page),
    path("signin/", views.sign_in_page),
    path("signup/", views.sign_up_page),
    path("welcome/", views.welcome_page),
    path("verifyemail/", views.verify_email_page),
    path("termsandconditions/", views.terms_and_conditions),
    path("quiz/", views.quiz_page)
]
