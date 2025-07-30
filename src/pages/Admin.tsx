import { useState, useEffect, useCallback } from "react";
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

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/auth');
        return;
      }

      const response = await fetch("http://localhost:8000/reservations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        throw new Error("Failed to fetch reservations");
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch reservations.",
      });
      if (error.response?.status === 401) {
        navigate('/auth');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/auth');
    } else {
      fetchReservations();
    }
  }, [navigate, fetchReservations]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/reservations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: "Status Updated",
          description: `Reservation has been ${newStatus}.`,
        });
        fetchReservations(); // Refetch to get the latest data
      } else {
        throw new Error("Failed to update status");
      }
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handleViewDetails = (reservation: any) => {
    setSelectedReservation(reservation);
    setIsDetailsOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold">Reservation Management</h1>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={fetchReservations}>Refresh</Button>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
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
                <p>Table: {selectedReservation.table_number}</p>
                <p>Status: {selectedReservation.status || 'pending'}</p>
              </div>
              <div>
                <h4 className="font-semibold">Pre-ordered Items</h4>
                {selectedReservation.reservation_items?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedReservation.reservation_items.map((item: any) => (
                      <div key={item.menu_item_id} className="flex justify-between">
                        <span>{item.quantity} x {item.menu_item_id}</span>
                      </div>
                    ))}
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
