
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
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [preOrderItems, setPreOrderItems] = useState<any[]>([]);
  const [isPreOrderLoading, setIsPreOrderLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      } else {
        setUser(user);
      }
    };

    checkUser();

    const fetchReservations = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reservations:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch reservations.",
        });
      } else {
        setReservations(data);
      }
      setIsLoading(false);
    };

    fetchReservations();

    const channel = supabase
      .channel("realtime-reservations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservations" },
        (payload) => {
          console.log("Change received!", payload);
          fetchReservations(); // Refetch all data on change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate, toast]);

  const handleStatusChange = async (id: string, newStatus: string) => {
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

      if (emailError) {
        // Log the email error but don't block the UI update
        console.error("Failed to send confirmation email:", emailError);
        toast({
          variant: "destructive",
          title: "Email Failed",
          description: `The reservation status was updated, but the confirmation email could not be sent.`,
        });
      } else {
        toast({
          title: "Status Updated",
          description: `Reservation #${id} has been ${newStatus}. Email notification sent.`,
        });
      }

      // Optimistically update the UI
      setReservations(
        reservations.map((res: any) =>
          res.id === id ? { ...res, status: newStatus } : res
        )
      );
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleViewDetails = async (reservation: any) => {
    setSelectedReservation(reservation);
    setIsDetailsOpen(true);
    setIsPreOrderLoading(true);
    setPreOrderItems([]);

    const { data, error } = await supabase
      .from("reservation_items")
      .select("quantity, menu_items(name, price)")
      .eq("reservation_id", reservation.id);

    if (error) {
      console.error("Error fetching pre-order items:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch pre-order items.",
      });
    } else {
      setPreOrderItems(data);
    }
    setIsPreOrderLoading(false);
  };

  const preOrderTotal = preOrderItems.reduce(
    (total, item) => total + item.quantity * item.menu_items.price,
    0
  );

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold">Reservation Management</h1>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.email}</span>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading reservations...</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No new reservations.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation: any) => (
                <TableRow key={reservation.id}>
                  <TableCell>#{reservation.id.slice(-6)}</TableCell>
                  <TableCell>
                    {format(new Date(reservation.date), "MMM d, yyyy")} {reservation.time}
                  </TableCell>
                  <TableCell>
                    <div>{reservation.name}</div>
                    <div className="text-sm text-gray-500">
                      {reservation.guests} guests
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{reservation.seating_area}</TableCell>
                  <TableCell>Table {reservation.table_number}</TableCell>
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
                        onClick={() => handleViewDetails(reservation)}
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
                <p>Seating Area: <span className="capitalize">{selectedReservation.seating_area}</span></p>
                <p>Table: {selectedReservation.table_number}</p>
                <p>Status: {selectedReservation.status || 'pending'}</p>
              </div>
              <div>
                <h4 className="font-semibold">Pre-ordered Items</h4>
                {isPreOrderLoading ? (
                  <p>Loading pre-order...</p>
                ) : preOrderItems.length > 0 ? (
                  <div className="space-y-2">
                    {preOrderItems.map((item: any) => (
                      <div key={item.menu_items.name} className="flex justify-between">
                        <span>{item.quantity} x {item.menu_items.name}</span>
                        <span>R{(item.quantity * item.menu_items.price).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount:</span>
                        <span>R{preOrderTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>No items were pre-ordered.</p>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Admin;
