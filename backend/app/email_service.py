import smtplib
from email.message import EmailMessage
from config import SMTP_EMAIL_ADDRESS, SMTP_PASSWORD

def send_otp_email(to_address: str, otp_code: str):
    msg = EmailMessage()
    msg["Subject"] = "Your verification code"
    msg["From"] = SMTP_EMAIL_ADDRESS
    msg["To"] = to_address
    msg.set_content(f"Your verification code is: {otp_code}")

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(SMTP_EMAIL_ADDRESS, SMTP_PASSWORD)
        server.send_message(msg)