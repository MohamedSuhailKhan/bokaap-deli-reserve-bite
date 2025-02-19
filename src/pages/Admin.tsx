
import { useState } from "react";
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

// Mock reservations data
const mockReservations = [
  {
    id: 1,
    date: new Date("2024-02-20T19:00:00"),
    name: "John Smith",
    guests: 4,
    table: 3,
    status: "pending",
    email: "john@example.com",
    phone: "123-456-7890",
  },
  {
    id: 2,
    date: new Date("2024-02-21T20:00:00"),
    name: "Sarah Johnson",
    guests: 2,
    table: 1,
    status: "confirmed",
    email: "sarah@example.com",
    phone: "123-456-7891",
  },
  // Add more mock reservations as needed
];

const Admin = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState(mockReservations);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleStatusChange = (id: number, newStatus: string) => {
    setReservations(
      reservations.map((res) =>
        res.id === id ? { ...res, status: newStatus } : res
      )
    );

    toast({
      title: "Status Updated",
      description: `Reservation #${id} has been ${newStatus}.`,
    });
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
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>#{reservation.id}</TableCell>
                <TableCell>
                  {format(reservation.date, "MMM d, yyyy h:mm a")}
                </TableCell>
                <TableCell>
                  <div>{reservation.name}</div>
                  <div className="text-sm text-gray-500">
                    {reservation.guests} guests
                  </div>
                </TableCell>
                <TableCell>Table {reservation.table}</TableCell>
                <TableCell>
                  <Badge className={getBadgeColor(reservation.status)}>
                    {reservation.status}
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
                    {reservation.status === "pending" && (
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
                  Date & Time:{" "}
                  {format(selectedReservation.date, "MMMM d, yyyy h:mm a")}
                </p>
                <p>Number of Guests: {selectedReservation.guests}</p>
                <p>Table: {selectedReservation.table}</p>
                <p>Status: {selectedReservation.status}</p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Admin;
