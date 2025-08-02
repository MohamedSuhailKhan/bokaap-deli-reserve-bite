from fastapi import APIRouter, HTTPException, Depends, Body
from ..database import db
from ..models import Reservation, AdminUser
from typing import List
from ..auth import get_current_user
from .. import email_sender as email
from bson import ObjectId

router = APIRouter()

@router.post("/reservations", response_model=Reservation)
async def create_reservation(reservation: Reservation):
    reservation_dict = reservation.dict(by_alias=True)
    result = await db.reservations.insert_one(reservation_dict)
    created_reservation = await db.reservations.find_one({"_id": result.inserted_id})

    if created_reservation:
        email.send_reservation_email("new", created_reservation)

    return created_reservation

@router.get("/reservations", response_model=List[Reservation], dependencies=[Depends(get_current_user)])
async def get_reservations():
    reservations = await db.reservations.find().to_list(1000)
    return reservations

@router.get("/reservations/{reservation_id}", response_model=Reservation, dependencies=[Depends(get_current_user)])
async def get_reservation(reservation_id: str):
    reservation = await db.reservations.find_one({"_id": ObjectId(reservation_id)})
    if reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation

@router.patch("/reservations/{reservation_id}/status", response_model=Reservation, dependencies=[Depends(get_current_user)])
async def update_reservation_status(reservation_id: str, status_body: dict = Body(...)):
    new_status = status_body.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status not provided")

    updated_reservation = await db.reservations.find_one_and_update(
        {"_id": ObjectId(reservation_id)},
        {"$set": {"status": new_status}},
        return_document=True
    )
    if updated_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")

    email.send_reservation_email(new_status, updated_reservation)

    return updated_reservation
