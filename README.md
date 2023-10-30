# Django Backend API
### by Mohd Saif Ansari

Django Rest API with Microsoft Outlook Authentication

## Framework and Libraries Used
- Django
- DRF
- DRF-social-oauth2
- djagno-cors-header

## Database
- MySQL

## Hosted On:
- Backend API: https://mhodsaifsps.pythonanywhere.com
- Frontend :  https://silly-hotteok-e91834.netlify.app/
- Postman Collection: https://www.postman.com/planetary-desert-940330/workspace/mohd-saif-ansari/collection/16499545-3fa0ead3-1b5d-492d-9c27-f43b05b2dc63?action=share&creator=16499545

> **Important**<br>
> **Before running server,After Installing drf-social-oauth2 Update Social_Core Library: <u>Lib/social_core/backend/azuread.py</u>**<br>
```sh
#  Previous Code
    def get_user_id(self, details, response):
        """Use upn as unique id"""
        return response.get("upn")
```
```sh
#Updated Code
    def get_user_id(self, details, response):
        """Use upn as unique id"""
        return response.get("sub")
```
### .env FILE CONFIGURATION(in folder containing settings.py file)
   ```JSON
      SECRET_KEY="djagno-secret"
      DATABASE_NAME="database-name"
      DATABASE_USER="database-username"
      DATABASE_PASSWORD="database-password"
      DATABASE_HOST="database-host"
      DATABASE_PORT="database-port"
      AZUREAD_OAUTH2_KEY="azure ad client id"
      AZUREAD_OAUTH2_SECRET="azure secret "
      APPLICATION_CLIENT_ID="application client id(for frontend, not required in .env)"
      APPLICATION_CLIENT_SECRET="application client secret(for frontend, not required in .env)"
   ```

## Usage
1. On Frontend: 
   1. Login using Microsoft Login plugin or package after successful login 
   2. pass following response to **<u>'/auth/convert-token'</u>** to **verify and login/sign up**
        ```json
      {
        "grant_type":"convert_token",
        "client_id":"registered client id over django admin/application",
        "client_secret":"client_secret registered Application in django admin/application",
        "backend":"azure-oauth2",
        "token": "id_token provided after successful Microsoft Login"
      }
        ```
      **Be sure to Add Email,Family_Name, Given Name  Azure Ad/Application/Token Configuration for username,name and email id in database**
   3. Expected Response if Authentication is successful
      ```json
      {
       "access_token": "access_token",
       "expires_in": 36000,
       "token_type": "Bearer",
       "scope": "read write",
       "refresh_token": "refresh_token"
      }
      ```
      To Refresh Token <br>
      Endpoint: **/auth/token**
      Request:
      ```json
      {   "grant_type":"refresh_token",
          "client_id":"registered client id over django admin/application",
          "client_secret":"client_secret registered Application in django admin/application",
          "refresh_token":"refresh_token"
      }
      ```
      
2. Use Access Token to Authorize and Access Endpoint<br> As of now:
   1. url: '', index:return success and user data if successful<br>
      example:
      ```shell
        curl --location 'http://127.0.0.1:8000/' \
        --header 'Authorization: Bearer {access_token}'
      ```
      Response:200
      ```json
         {
          "message": "User successfully authenticated",
          "user": {
              "email": "mhodsaifansari@outlook.com",
              "id": 2,
              "first_name": "Mohd Saif",
              "last_name": "Ansari",
              "username": "MohdSaifAnsari"
                   }
         }
      ```

