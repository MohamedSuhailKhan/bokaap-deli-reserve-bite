from fastapi import APIRouter
from ..database import db
from ..models import MenuItem
from typing import List

router = APIRouter()

@router.get("/menu", response_model=List[MenuItem])
async def get_menu_items():
    menu_items = await db.menu_items.find().to_list(1000)
    return menu_items
