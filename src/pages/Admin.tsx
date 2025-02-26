import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const getInitialReservations = () => {
  const saved = localStorage.getItem('reservations');
  return saved ? JSON.parse(saved) : [];
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reservations, setReservations] = useState(getInitialReservations);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Unauthorized",
        description: "Please login as an admin to access this page.",
      });
      navigate('/auth');
    }
  }, [navigate, toast]);

  useEffect(() => {
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }, [reservations]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const { data: reservation, error: fetchError } = await supabase
        .from("reservations")
        .select()
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from("reservations")
        .update({ status: newStatus })
        .eq("id", id);

      if (updateError) throw updateError;

      const { error: emailError } = await supabase.functions.invoke(
        "send-reservation-email",
        {
          body: {
            type: newStatus === "confirmed" ? "confirmed" : "cancelled",
            reservation: {
              name: reservation.name,
              email: reservation.email,
              date: reservation.date,
              time: reservation.time,
              guests: reservation.guests,
              table_number: reservation.table_number,
            },
          },
        }
      );

      if (emailError) throw emailError;

      setReservations(
        reservations.map((res: any) =>
          res.id === id ? { ...res, status: newStatus } : res
        )
      );

      toast({
        title: "Status Updated",
        description: `Reservation #${id} has been ${newStatus}. Email notification sent.`,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update reservation status.",
      });
    }
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Reservation Management</h1>

      {reservations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No reservations found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation: any) => (
                <TableRow key={reservation.id}>
                  <TableCell>#{reservation.id}</TableCell>
                  <TableCell>
                    {format(new Date(reservation.date), "MMM d, yyyy")} {reservation.time}
                  </TableCell>
                  <TableCell>
                    <div>{reservation.name}</div>
                    <div className="text-sm text-gray-500">
                      {reservation.guests} guests
                    </div>
                  </TableCell>
                  <TableCell>Table {reservation.tableId}</TableCell>
                  <TableCell>
                    <Badge className={getBadgeColor(reservation.status || 'pending')}>
                      {reservation.status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setIsDetailsOpen(true);
                        }}
                      >
                        Details
                      </Button>
                      {(!reservation.status || reservation.status === "pending") && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleStatusChange(reservation.id, "confirmed")
                            }
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleStatusChange(reservation.id, "cancelled")
                            }
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        {selectedReservation && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reservation Details</DialogTitle>
              <DialogDescription>
                Reservation #{selectedReservation.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Guest Information</h4>
                <p>Name: {selectedReservation.name}</p>
                <p>Email: {selectedReservation.email}</p>
                <p>Phone: {selectedReservation.phone}</p>
              </div>
              <div>
                <h4 className="font-semibold">Reservation Details</h4>
                <p>
                  Date & Time: {format(new Date(selectedReservation.date), "MMMM d, yyyy")} {selectedReservation.time}
                </p>
                <p>Number of Guests: {selectedReservation.guests}</p>
                <p>Table: {selectedReservation.tableId}</p>
                <p>Status: {selectedReservation.status || 'pending'}</p>
              </div>
              {selectedReservation.menuItems && selectedReservation.menuItems.length > 0 && (
                <div>
                  <h4 className="font-semibold">Pre-ordered Items</h4>
                  <div className="space-y-2">
                    {selectedReservation.menuItems.map((item: any) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>R{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount:</span>
                        <span>R{selectedReservation.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Admin;
