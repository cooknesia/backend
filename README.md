# Cooknesia API

## Base URL
`http://localhost:5000/api/v1`

## Authentication
some API endpoints require authentication via Bearer JWT token in the Authorization header, except the Google login endpoint.

Example header:
```
Authorization: Bearer your_jwt_token
```

---

## Installation Guide

### Prerequisites
- Make sure Node.js is installed on your computer. You can download it from [https://nodejs.org/](https://nodejs.org/).

### Installation Steps
1. Clone this repository to your computer:
   ```
   git clone <YOUR_REPOSITORY_URL>
   ```
2. Navigate to the project directory:
   ```
   cd backend
   ```
3. Install the required dependencies:
   ```
   npm install
   ```
4. Run the server:
   ```
   node server.js
   ```
   or if you use npm start (make sure there is a start script in package.json):
   ```
   npm start prod

   ```

---

## Endpoints

### Authentication

#### Sign in With Google Email
- Method: POST
- Endpoint: `/auth/google`
- Description: Login using Google account
- Authentication: No
- Request Body:
```json
{
  "idToken": "string (Google OAuth ID Token)"
}
```
- Response (200):
```json
{
  "status": "success",
  "message": "string",
  "token": "JWT token string"
}
```

---

### Favorites

#### Add Favorite Recipe
- Method: POST
- Endpoint: `/favorites`
- Description: Add a recipe to user's favorites
- Authentication: Yes
- Request Body:
```json
{
  "userId": "string (user ID)",
  "recipeId": "string (recipe ID)"
}
```
- Response (201):
```json
{
  "message": "string"
}
```

#### Remove Favorite Recipe
- Method: DELETE
- Endpoint: `/favorites`
- Description: Remove a recipe from user's favorites
- Authentication: Yes
- Request Body:
```json
{
  "userId": "string (user ID)",
  "recipeId": "string (recipe ID)"
}
```
- Response (200):
```json
{
  "message": "string"
}
```

#### Get User's Favorite Recipes
- Method: GET
- Endpoint: `/favorites/{userId}`
- Description: Get list of favorite recipes for a user
- Authentication: Yes
- Path Parameters:
  - `userId`: string (user ID)
- Response (200):
```json
[
  {
    "recipeId": "string",
    "recipeName": "string"
  }
]
```

---

### Foods

#### Get All Foods
- Method: GET
- Endpoint: `/foods`
- Description: Get list of foods with optional filters
- Authentication: No
- Query Parameters:
  - `keyword` (optional): string
  - `province` (optional): integer (1-38)
  - `page` (optional): integer (default 1)
  - `limit` (optional): integer (default 20, max 100)
- Response (200):
```json
{
  "code": 200,
  "status": "success",
  "data": [
    {
      "id": "integer",
      "name": "string",
      "description": "string",
      "image_url": "string",
      "province_id": "integer",
      "click_count": "integer",
      "cooking_step": "string",
      "average_rating": "integer"
    }
  ]
}
```

#### Get Food By ID
- Method: GET
- Endpoint: `/foods/{foodId}`
- Description: Get details of a specific food by ID
- Authentication: No
- Path Parameters:
  - `foodId`: string or integer
- Response (200):
```json
{
  "code": 200,
  "status": "success",
  "data": {
    "id": "integer",
    "name": "string",
    "description": "string",
    "image_url": "string",
    "province_id": "integer",
    "click_count": "integer",
    "cooking_step": "string",
    "average_rating": "integer",
    "ingredients": ["string"]
  }
}
```

#### Get Popular Foods
- Method: GET
- Endpoint: `/foods/popular`
- Description: Get list of popular foods
- Authentication: No
- Response (200):
```json
{
  "code": 200,
  "status": "success",
  "data": [
    {
      "id": "integer",
      "name": "string",
      "description": "string",
      "image_url": "string",
      "province_id": "integer",
      "click_count": "integer",
      "cooking_step": "string",
      "average_rating": "integer"
    }
  ]
}
```

---

### Ingredients

#### Get All Ingredients
- Method: GET
- Endpoint: `/ingredients`
- Description: Get list of all ingredients
- Authentication: No
- Response (200):
```json
[
  {
    "id": "string",
    "name": "string"
  }
]
```

#### Search Ingredients
- Method: GET
- Endpoint: `/ingredients/search`
- Description: Search ingredients by keyword
- Authentication: No
- Query Parameters:
  - `keyword`: string (required)
- Response (200):
```json
[
  {
    "id": "string",
    "name": "string"
  }
]
```

---

### Ratings

#### Add Rating for Food
- Method: POST
- Endpoint: `/ratings/{foodId}`
- Description: Add a rating for a food item
- Authentication: Yes
- Path Parameters:
  - `foodId`: string or integer
- Request Body:
```json
{
  "userId": "string",
  "rating": "integer"
}
```
- Response (200):
```json
{
  "code": 200,
  "status": "success",
  "message": "string"
}
```

---

### Recommendations

#### Recommend Food
- Method: POST
- Endpoint: `/recommendations`
- Description: Get food recommendations based on ingredients
- Authentication: No
- Request Body:
```json
{
  "ingredients": ["string"]
}
```
- Query Parameters:
  - `userId` (optional): string
- Response (200):
```json
{
  "code": 200,
  "status": "success",
  "data": [
    {
      "id": "integer",
      "name": "string",
      "description": "string",
      "image_url": "string",
      "province_id": "integer",
      "click_count": "integer",
      "cooking_step": "string",
      "average_rating": "integer"
    }
  ]
}
```

#### Get Recommendation Logs
- Method: GET
- Endpoint: `/recommendation-logs/{userId}`
- Description: Get recommendation logs for a user
- Authentication: No
- Path Parameters:
  - `userId`: string
- Response (200):
```json
{
  "code": 200,
  "status": "success",
  "data": [
    {
      "id": "integer",
      "user_id": "string",
      "selected_ingredients": ["string"],
      "created_at": "string",
      "foods": [
        {
          "id": "integer",
          "name": "string",
          "description": "string",
          "image_url": "string",
          "province_id": "integer or null",
          "click_count": "integer",
          "average_rating": "integer"
        }
      ]
    }
  ]
}
```
}

---
}
}

This documentation covers all implemented endpoints in the backend project.
