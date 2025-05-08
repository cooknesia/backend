# Cooknesia API
## `http://localhost:5000/api/v1`


## Authentication
All API must use this authentication ( **excepted** API Sign in With Google )

Request :
- Auth Bearer Token : 
   - Token : "your JWT token"

## Sign in With Google Email
Request :
- Method : POST
- Endpoint : `/auth/google`
- Header :
    - Content-Type : application/json
    - Accept: application/json
- Body :
```json
{
  "token" : "Your Google Token",
}
```
Response :
```json
{
    "status": "String",
    "message": "String",
    "token": "String, JWT Token",
    "data": {
        "id": "String,Unique",
        "email": "String",
        "name": "String",
        "photo_url": "String",
        "created_at": "date"
    }
}
```

## Get All Foods
Request :
- Method : GET
- Endpoint : `/foods`
- Header :
    - Content-Type : application/json
    - Accept: application/json

Response :
```json
{
    "code": 200,
    "status": "success",
    "data": [
        {
            "id": "integer,Unique",
            "name": "String",
            "description": "String",
            "image_url": "String",
            "province_id": "integer,Unique",
            "click_count": "integer",
            "cooking_step": "String",
            "average_rating": "integer"
        },
    ]
}
```

## Get All Foods With Province
Request :
- Method : GET
- Endpoint : `/foods/province/{provinceId}`
- Header :
    - Content-Type : application/json
    - Accept: application/json

Response :
```json
{
    "code": 200,
    "status": "success",
    "data": [
        {
            "id": "integer,Unique",
            "name": "String",
            "description": "String",
            "image_url": "String",
            "province_id": "integer,Unique",
            "click_count": "integer",
            "cooking_step": "String",
            "average_rating": "integer"
        },
    ]
}
```

## Get Food By Id
Request :
- Method : GET
- Endpoint : `/foods/{foodId}`
- Header :
    - Content-Type : application/json
    - Accept: application/json

Response :
```json
{
    "code": "integer",
    "status": "String",
    "data": {
        "id": "integer",
        "name": "String",
        "description": "String",
        "image_url": "String",
        "province_id": "integer",
        "click_count": "integer",
        "cooking_step": "String",
        "average_rating": "integer",
        "ingredients": [
            "String",
            "String",
        ]
    }
}
```

## Get Popular Foods
Request :
- Method : GET
- Endpoint : `/foods/popular`
- Header :
    - Content-Type : application/json
    - Accept: application/json

Response :
```json
{
    "code": 200,
    "status": "success",
    "data": [
        {
            "id": "integer,Unique",
            "name": "String",
            "description": "String",
            "image_url": "String",
            "province_id": "integer,Unique",
            "click_count": "integer",
            "cooking_step": "String",
            "average_rating": "integer"
        },
    ]
}
```

## Add Favorite Foods
Request :
- Method : GET
- Endpoint : `/foods/popular`
- Header :
    - Content-Type : application/json
    - Accept: application/json
- Query Param : 
    - userId : UUID
    - foodId : number

Response :
```json
{
    "code": "integer",
    "status": "String",
    "message": "String",
    "data": {
        "id": "integer",
        "user_id": "UUID",
        "food_id": "integer",
        "created_at": "date"
    }
}
```

## Get All Favorite Foods
Request :
- Method : GET
- Endpoint : `/favorites/{userId}`
- Header :
    - Content-Type : application/json
    - Accept: application/json

Response :
```json
{
    "code": 200,
    "status": "success",
    "data": [
        {
            "id": "integer,Unique",
            "name": "String",
            "description": "String",
            "image_url": "String",
            "province_id": "integer,Unique",
            "click_count": "integer",
            "cooking_step": "String",
            "average_rating": "integer"
        },
    ]
}
```

## Delete Favorite Foods
Request :
- Method : GET
- Endpoint : `/foods/popular`
- Header :
    - Content-Type : application/json
    - Accept: application/json
- Query Param : 
    - userId : UUID
    - foodId : number

Response :
```json
{
    "code": "integer",
    "status": "String",
    "message": "String",
}
```

## Add Rating Foods
Request :
- Method : POST
- Endpoint : `/ratings/{foodId}`
- Header :
    - Content-Type : application/json
    - Accept: application/json
- Body :
```json
{
  "userId": "UUID",
  "rating": "integer, number"
}
```
Response :
```json
{
    "code": "integer",
    "status": "String",
    "message": "String",
}
```