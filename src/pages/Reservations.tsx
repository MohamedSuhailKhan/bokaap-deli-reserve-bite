
import { Button } from "@/components/ui/button";

const Reservations = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Make a Reservation</h1>
      <div className="grid gap-8">
        <p className="text-center text-gray-600">Reservation system coming soon...</p>
        <div className="flex justify-center">
          <Button>Book a Table</Button>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
