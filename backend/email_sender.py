import os
import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

def get_email_content(type: str, reservation: dict):
    def format_date(date: str):
        # A simple date formatting function, can be improved
        return date

    name = reservation.get("name", "Customer")
    date = format_date(reservation.get("date", ""))
    time = reservation.get("time", "")
    guests = reservation.get("guests", "")
    table_number = reservation.get("table_number", "")

    if type == "new":
        return {
            "subject": "Reservation Received - Bokaap Deli",
            "html": f"""
              <h1>Thank you for your reservation, {name}!</h1>
              <p>We have received your reservation request for:</p>
              <ul>
                <li>Date: {date}</li>
                <li>Time: {time}</li>
                <li>Number of guests: {guests}</li>
                <li>Table: {table_number}</li>
              </ul>
              <p>We will review your reservation and confirm it shortly.</p>
              <p>Best regards,<br>Bokaap Deli Team</p>
            """,
        }
    elif type == "confirmed":
        return {
            "subject": "Reservation Confirmed - Bokaap Deli",
            "html": f"""
              <h1>Your reservation is confirmed, {name}!</h1>
              <p>We're looking forward to seeing you on:</p>
              <ul>
                <li>Date: {date}</li>
                <li>Time: {time}</li>
                <li>Number of guests: {guests}</li>
                <li>Table: {table_number}</li>
              </ul>
              <p>See you soon!</p>
              <p>Best regards,<br>Bokaap Deli Team</p>
            """,
        }
    elif type == "cancelled":
        return {
            "subject": "Reservation Cancelled - Bokaap Deli",
            "html": f"""
              <h1>Reservation Cancelled</h1>
              <p>Dear {name},</p>
              <p>Unfortunately, we were unable to accommodate your reservation for:</p>
              <ul>
                <li>Date: {date}</li>
                <li>Time: {time}</li>
                <li>Number of guests: {guests}</li>
              </ul>
              <p>We apologize for any inconvenience caused.</p>
              <p>Best regards,<br>Bokaap Deli Team</p>
            """,
        }
    else:
        raise ValueError("Invalid email type")


def send_reservation_email(email_type: str, reservation: dict):
    email_to = reservation.get("email")
    if not email_to:
        return

    content = get_email_content(email_type, reservation)

    params = {
        "from": "Bokaap Deli <onboarding@resend.dev>",
        "to": [email_to],
        "subject": content["subject"],
        "html": content["html"],
    }

    try:
        email = resend.Emails.send(params)
        return email
    except Exception as e:
        print(f"Error sending email: {e}")
        return None
