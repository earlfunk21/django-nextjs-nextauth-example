from django.http import JsonResponse
from django.core.signing import dumps, loads, BadSignature
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt


def token_required(function):
    def wrap(request, *args, **kwargs):
        try:
            authorization_header = request.headers.get("Authorization")
            if authorization_header and authorization_header.startswith("Bearer "):
                token = authorization_header.split(" ")[1]
                decoded_token = loads(token)
                username = decoded_token["username"]
                user = User.objects.get(username=username)
                return function(request, user, *args, **kwargs)
            else:
                return JsonResponse(
                    {"message": "Invalid authorization header format"}, status=400
                )
        except BadSignature as error:
            return JsonResponse(
                {"message": "Token is invalid!"}, error=str(error), status=401
            )
        except User.DoesNotExist as error:
            return JsonResponse(
                {"message": "User does not exist"}, error=str(error), status=401
            )
    return wrap
