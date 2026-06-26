from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import date
import random, string
from ..email_service import send_otp_email

from .. import crud, schemas, security, validations
from ..deps import get_db, get_current_user, get_admin

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/create", response_model=schemas.UserOut)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    
    try:
        validations.validate_username(user.username)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid username. " + str(e))

    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    try:
        validations.validate_password(user.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Password invalid. " + str(e))
    
    if not user.created_on:
        user.created_on = date.today()
    
    hashed_password = security.hash_password(user.password)
    return crud.create_user(db, user, hashed_password)

@router.post("/admin/promote", response_model=schemas.UserOutAdmin)
def promote_user(
    user_id : int,
    isAdmin : bool,
    admin_check = Depends(get_admin),
    db: Session = Depends(get_db)
):
    db_users = crud.promote_user(db, user_id=user_id, isAdmin=isAdmin)
    
    if not db_users:
        raise HTTPException(status_code=404, detail="The user you are trying to promote does not exist")
    
    return db_users

@router.get('/fetch/{user_id}', response_model = schemas.UserOut)
def get_user_by_code(
    user_id: int,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user(db, user_id)
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User doesn't exists")
    
    return db_user

@router.get('/fetchAll', response_model=list[schemas.UserOutAdmin]) #
def get_all_users(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    isAdmin = Depends(get_admin)
):
    
    db_users = crud.get_all_users(db=db)
    
    if not db_users:
        raise HTTPException(status_code=404, detail="No users exist")
    
    return db_users

@router.get('/by-username/{username}', response_model = schemas.UserOut)
def get_user_by_username(
    username: str,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_username(db, username)
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User doesn't exists")
    
    return db_user



@router.delete('/delete/{user_id}', response_model = schemas.UserOut)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    
    if current_user.isAdmin:
        pass
    elif current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this user")

    deleted_user = crud.delete_user(db,user_id)

    if not deleted_user:
        raise HTTPException(status_code=404, detail="User doesn't exists")
    
    return deleted_user


@router.post("/otp/create", response_model=schemas.CreateOTPOutput)
def create_otp(
    payload : schemas.CreateOTPRequest,
    background_tasks: BackgroundTasks,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_otp = ''.join(random.choices(string.digits,k=6))
    db_users = crud.create_otp(db = db, user_id=user.id, email=payload.email, new_otp=new_otp)
    
    if db_users == "user_does_not_exist":
        raise HTTPException(status_code=404, detail="User does not exist")
    elif db_users == "email_not_unique":
        raise HTTPException(status_code=409, detail="Email already in use")
    
    background_tasks.add_task(send_otp_email, payload.email, new_otp)
    
    return db_users


@router.post("/otp/verify", response_model=schemas.VerifyOTPResponse)
def verify_otp(
    payload : schemas.VerifyOTPRequest,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verification = crud.verifyOTP(db = db, user_id=user.id, payload=payload)
    
    if verification == "otp_not_generated":
        raise HTTPException(status_code=404, detail="OTP Not Generated")
    elif verification == "too_many_attempts":
        raise HTTPException(status_code=403, detail="Too many failed attempts")
    elif verification == "otp_expired":
        raise HTTPException(status_code=410, detail="OTP Expired")
    elif verification == "otp_not_correct":
        raise HTTPException(status_code=400, detail="OTP Incorrect")
    
    
    return verification