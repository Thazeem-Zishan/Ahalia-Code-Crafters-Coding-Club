from django.http import HttpResponseRedirect
from django.shortcuts import render
import pyrebase
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("./code-crafters-club-firebase-adminsdk-5zea8-121f65b764.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

firebaseConfig = {}

firebase = pyrebase.initialize_app(firebaseConfig)
storage = firebase.storage()
auth = firebase.auth()


def email_to_valid_string(email):
    email = email
    email = email.split("@")
    email = "_".join(email)
    email = email.split(".")
    email = "_".join(email)
    return email


# Create your views here.


def home_page(request):
    return render(request, "index.html")


def welcome_page(request):
    try:
        user_data = db.collection(u"users").document(auth.current_user["localId"]).get()
        user_data = user_data.to_dict()
        context = {
            "pfp": storage.child(f"profile_pictures/{email_to_valid_string(auth.current_user['email'])}.png").get_url(
                None),
            "name": user_data["name"],
            "phone_number": user_data["phone_number"],
            "dob": user_data["date_of_birth"],
            "registerno": user_data["register_number"],
            "semester": user_data["semester"],
            "email": user_data["email"],
        }
    except TypeError:
        return HttpResponseRedirect("/signin/")

    if not auth.get_account_info(id_token=auth.current_user["idToken"])["users"][0]["emailVerified"]:
        auth.send_email_verification(id_token=auth.current_user["idToken"])
        return HttpResponseRedirect("/verifyemail/")

    return render(request, "welcome.html", context=context)


def sign_up_page(request):
    global db
    reason = request.GET.get("reason")
    if reason is not None:
        pass
    else:
        reason = "Sign Up!"
    context = {
        "reason": reason,
    }
    if request.method == "POST":
        email = request.POST["email"]
        password = request.POST["password"]
        name = request.POST["name"]
        phone_number = request.POST["phonenumber"]
        date_of_birth = request.POST["dob"]
        register_number = request.POST["registerno"]
        semester = request.POST["semester"]

        user_data = {
            "name": name,
            "phone_number": phone_number,
            "date_of_birth": date_of_birth,
            "register_number": register_number,
            "semester": semester,
            "email": email,
        }

        try:
            auth.create_user_with_email_and_password(email=email, password=password)
            auth.sign_in_with_email_and_password(email=email, password=password)
            auth.update_profile(id_token=auth.current_user["idToken"], display_name=name)

            storage.child(f"profile_pictures/{email_to_valid_string(email)}.png").put("./static/pictures/pfp.png")
            db.collection("users").document(auth.current_user["localId"]).set(user_data)
            auth.current_user = None
            return HttpResponseRedirect("/signin/")

        except Exception as error:
            print(error)
            if email == "":
                return render(request, "signup.html", context={"message": "Invalid Signup Credentials."})
            else:
                if "." in email:
                    if email.find(".") != len(email):
                        return render(request, "signup.html",
                                      context={"message": "Email Already Exists. Please Try Another One.", })
                    else:
                        return render(request, "signup.html",
                                      context={"message": "Invalid Signup Credentials. Please Try Again", })
                else:
                    return render(request, "signup.html", context={
                        "message": "Invalid Signup Credentials. Please Try Again",
                    })

    return render(request, "signup.html", context=context)


def sign_in_page(request):
    reason = request.GET.get("reason")
    if reason is not None:
        pass
    else:
        reason = "Please Sign In!"
    sign_in_context = {
        "message": reason,
    }
    if request.method == "POST":
        email = request.POST["email"]
        password = request.POST["password"]
        try:
            auth.sign_in_with_email_and_password(email=email, password=password)
            sign_in_context["message"] = ""
            return HttpResponseRedirect("/welcome/")
        except Exception as error:
            if type(error).__name__ == "HTTPError":
                sign_in_context["message"] = "Invalid Login Credentials. Please Try Again."
    return render(request, "signin.html", context=sign_in_context)


def verify_email_page(request):
    if auth.current_user is None:
        return HttpResponseRedirect(redirect_to="/signin?reason=Please%20Sign%20In%20To%20Continue!")
    return render(request, "verify_email.html")


def terms_and_conditions(request):
    return render(request, "termsandconditions.html")


def quiz_page(request):
    return render(request, "quiz.html")
