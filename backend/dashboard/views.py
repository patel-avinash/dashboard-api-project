from collections import defaultdict

import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response


USERS_API_URL = "https://dummyjson.com/users"
PRODUCTS_API_URL = "https://fakestoreapi.com/products"


def fetch_json(url):
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    return response.json()


def build_request_error_message(exc):
    message = str(exc).lower()

    if "name resolution" in message or "failed to resolve" in message:
        return "Unable to reach the external API. Please check your internet connection and try again."

    if "timeout" in message:
        return "The external API took too long to respond. Please try again."

    return "Unable to fetch data from the external API right now."


def build_user_growth(users):
    age_buckets = {
        "18-25": 0,
        "26-35": 0,
        "36-45": 0,
        "46+": 0,
    }

    for user in users:
        age = user.get("age", 0)
        if age <= 25:
            age_buckets["18-25"] += 1
        elif age <= 35:
            age_buckets["26-35"] += 1
        elif age <= 45:
            age_buckets["36-45"] += 1
        else:
            age_buckets["46+"] += 1

    return {
        "labels": list(age_buckets.keys()),
        "values": list(age_buckets.values()),
    }


def build_sales_data(products):
    sales_by_category = defaultdict(float)

    for product in products:
        category = product.get("category", "Other")
        sales_by_category[category.title()] += float(product.get("price", 0))

    top_categories = sorted(
        sales_by_category.items(),
        key=lambda item: item[1],
        reverse=True,
    )[:5]

    return {
        "labels": [category for category, _ in top_categories],
        "values": [round(total, 2) for _, total in top_categories],
    }


@api_view(["GET"])
def dashboard_data(request):
    try:
        users_payload = fetch_json(USERS_API_URL)
        products_payload = fetch_json(PRODUCTS_API_URL)

        users = users_payload.get("users", [])
        products = products_payload if isinstance(products_payload, list) else []

        total_users = len(users)
        total_sales = round(
            sum(float(product.get("price", 0)) for product in products),
            2,
        )

        return Response(
            {
                "success": True,
                "data": {
                    "total_users": total_users,
                    "total_sales": total_sales,
                    "user_growth": build_user_growth(users),
                    "sales_data": build_sales_data(products),
                    "recent_activity": users[:5],
                },
            }
        )
    except requests.RequestException as exc:
        return Response(
            {
                "success": False,
                "error": build_request_error_message(exc),
            },
            status=502,
        )
    except Exception:
        return Response(
            {
                "success": False,
                "error": "Something went wrong",
            },
            status=500,
        )
