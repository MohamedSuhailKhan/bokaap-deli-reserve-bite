import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const availableTimes = [
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

const insideTables = [1, 2, 3, 4, 5];
const outsideTables = [6, 7, 8, 9, 10];

const Reservations = () => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [guests, setGuests] = useState<number>(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [seatingArea, setSeatingArea] = useState<string>();
  const [tableNumber, setTableNumber] = useState<number>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [cart, setCart] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("http://localhost:8000/menu");
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
        } else {
          throw new Error("Failed to fetch menu items");
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load the menu. Please try again later.",
        });
      }
    };
    fetchMenuItems();
  }, [toast]);

  const availableTables = seatingArea === "inside" ? insideTables : seatingArea === "outside" ? outsideTables : [];

  const handleCartChange = (itemId: string, change: number) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart);
      const currentQty = newCart.get(itemId) || 0;
      const newQty = currentQty + change;

      if (newQty > 0) {
        newCart.set(itemId, newQty);
      } else {
        newCart.delete(itemId);
      }

      return newCart;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !seatingArea || !tableNumber) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reservationData = {
        date: date.toISOString().split("T")[0],
        time,
        guests,
        name,
        email,
        phone,
        table_number: tableNumber,
        reservation_items: Array.from(cart.entries()).map(
          ([menu_item_id, quantity]) => ({
            menu_item_id,
            quantity,
          })
        ),
      };

      const response = await fetch("http://localhost:8000/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        toast({
          title: "Reservation Submitted",
          description: "Your reservation has been successfully submitted. We'll contact you shortly.",
        });
        // Reset form
        setDate(undefined);
        setTime(undefined);
        setGuests(2);
        setName("");
        setEmail("");
        setPhone("");
        setTableNumber(undefined);
        setCart(new Map());
      } else {
        throw new Error("Failed to submit reservation");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit reservation. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Make a Reservation</h1>
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <Label>Select Time</Label>
            <Select onValueChange={(value) => setTime(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Seating Area</Label>
            <Select
              onValueChange={(value) => {
                setSeatingArea(value);
                setTableNumber(undefined); // Reset table selection
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select seating area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inside">Inside</SelectItem>
                <SelectItem value="outside">Outside</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {seatingArea && (
            <div className="space-y-2">
              <Label>Select Table</Label>
              <Select
                onValuechange={(value) => setTableNumber(Number(value))}
                value={tableNumber?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                  {availableTables.map((table) => (
                    <SelectItem key={table} value={table.toString()}>
                      Table {table}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Number of Guests</Label>
            <Input
              type="number"
              min={1}
              max={8}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="preorder">
              <AccordionTrigger>
                <span className="text-lg font-semibold">Want to Pre-order? (Optional)</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">R{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCartChange(item.id, -1)}
                          disabled={!cart.has(item.id)}
                        >
                          -
                        </Button>
                        <span>{cart.get(item.id) || 0}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCartChange(item.id, 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Make Reservation"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Reservations;
