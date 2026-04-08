import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def dashboard_data(request):
    try:
        # Fetch users data
        users_res = requests.get("https://dummyjson.com/users", timeout=5)
        users_data = users_res.json()

        # Fetch products (sales data)
        products_res = requests.get("https://fakestoreapi.com/products", timeout=5)
        products_data = products_res.json()

        # Process data
        total_users = len(users_data.get("users", []))

        total_sales = sum([float(p.get("price", 0)) for p in products_data])

        # Chart data (dummy growth for visualization)
        user_growth = [5, 15, 25, 40, total_users]
        sales_data = [100, 200, 300, 400, int(total_sales)]

        # Recent activity (latest 5 users)
        recent_activity = users_data.get("users", [])[:5]

        return Response({
            "success": True,
            "data": {
                "total_users": total_users,
                "total_sales": round(total_sales, 2),
                "user_growth": user_growth,
                "sales_data": sales_data,
                "recent_activity": recent_activity
            }
        })

    except Exception:
        return Response({
            "success": False,
            "error": "Something went wrong"
        }, status=500)