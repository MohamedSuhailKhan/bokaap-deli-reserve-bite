
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "new" | "confirmed" | "cancelled";
  reservation: {
    name: string;
    email: string;
    date: string;
    time: string;
    guests: number;
    table_number: number;
  };
}

const getEmailContent = (type: string, reservation: EmailRequest["reservation"]) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  switch (type) {
    case "new":
      return {
        subject: "Reservation Received - Bokaap Deli",
        html: `
          <h1>Thank you for your reservation, ${reservation.name}!</h1>
          <p>We have received your reservation request for:</p>
          <ul>
            <li>Date: ${formatDate(reservation.date)}</li>
            <li>Time: ${reservation.time}</li>
            <li>Number of guests: ${reservation.guests}</li>
            <li>Table: ${reservation.table_number}</li>
          </ul>
          <p>We will review your reservation and confirm it shortly.</p>
          <p>Best regards,<br>Bokaap Deli Team</p>
        `,
      };
    case "confirmed":
      return {
        subject: "Reservation Confirmed - Bokaap Deli",
        html: `
          <h1>Your reservation is confirmed, ${reservation.name}!</h1>
          <p>We're looking forward to seeing you on:</p>
          <ul>
            <li>Date: ${formatDate(reservation.date)}</li>
            <li>Time: ${reservation.time}</li>
            <li>Number of guests: ${reservation.guests}</li>
            <li>Table: ${reservation.table_number}</li>
          </ul>
          <p>See you soon!</p>
          <p>Best regards,<br>Bokaap Deli Team</p>
        `,
      };
    case "cancelled":
      return {
        subject: "Reservation Cancelled - Bokaap Deli",
        html: `
          <h1>Reservation Cancelled</h1>
          <p>Dear ${reservation.name},</p>
          <p>Unfortunately, we were unable to accommodate your reservation for:</p>
          <ul>
            <li>Date: ${formatDate(reservation.date)}</li>
            <li>Time: ${reservation.time}</li>
            <li>Number of guests: ${reservation.guests}</li>
          </ul>
          <p>We apologize for any inconvenience caused.</p>
          <p>Best regards,<br>Bokaap Deli Team</p>
        `,
      };
    default:
      throw new Error("Invalid email type");
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, reservation }: EmailRequest = await req.json();
    const { subject, html } = getEmailContent(type, reservation);

    const { data, error } = await resend.emails.send({
      from: "Bokaap Deli <onboarding@resend.dev>", // Update this with your verified domain
      to: [reservation.email],
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
