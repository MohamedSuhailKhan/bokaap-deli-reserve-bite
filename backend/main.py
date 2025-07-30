from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from . import auth
from .auth import get_password_hash, get_current_user
from .database import db
from .models import AdminUser
from .routers import menu, reservations

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",  # The default address for the React frontend
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/token", response_model=auth.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.admin_users.find_one({"username": form_data.username})
    if not user or not auth.verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me/", response_model=AdminUser)
async def read_users_me(current_user: AdminUser = Depends(get_current_user)):
    return current_user


# Temporary endpoint to create an admin user for testing
@app.post("/create_admin")
async def create_admin(user: AdminUser):
    # In a real application, this would be a secure, one-time setup
    existing_user = await db.admin_users.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    hashed_password = get_password_hash(user.password_hash) # In a real app, the plaintext password would be passed
    user_dict = user.dict(by_alias=True)
    user_dict["password_hash"] = hashed_password

    await db.admin_users.insert_one(user_dict)
    return {"message": "Admin user created successfully"}


app.include_router(menu.router)
app.include_router(reservations.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
