import json
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.core.signing import dumps, loads, BadSignature
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET

from server.utils import token_required


@csrf_exempt
@require_POST
def login(request):
    data = json.loads(request.body)
    username = data["username"]
    password = data["password"]
    user = authenticate(request, username=username, password=password)
    if user is not None:
        token = dumps({"username": user.get_username()})
        data = dict(
            token=token,
            username=user.get_username(),
            message="Successfully created!",
        )
        return JsonResponse(data)
    else:
        return JsonResponse({"message": "Invalid credentials"}, status=401)


@csrf_exempt
@require_POST
def signup(request):
    data = json.loads(request.body)
    username = data["username"]
    password = data["password"]

    if User.objects.filter(username=username).exists():
        return JsonResponse({"message": "Username already exists"}, status=400)

    user = User.objects.create_user(username=username, password=password)

    return JsonResponse(
        {
            "message": f"User: {user.get_username()} successfully created",
        }
    )


@csrf_exempt
@token_required
@require_GET
def test_token(request, user):
    response_data = {
        "username": user.username,
        "message": "Token is valid",
    }

    return JsonResponse(response_data)
