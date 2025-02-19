import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Available time slots
const timeSlots = [
  "17:00", "17:30", "18:00", "18:30", "19:00", 
  "19:30", "20:00", "20:30", "21:00"
];

// Table configurations
const tables = [
  { id: 1, seats: 2, location: "Window" },
  { id: 2, seats: 2, location: "Window" },
  { id: 3, seats: 4, location: "Interior" },
  { id: 4, seats: 4, location: "Interior" },
  { id: 5, seats: 6, location: "Garden" },
  { id: 6, seats: 8, location: "Private Room" },
];

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: "starters" | "mains" | "desserts" | "drinks";
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Caprese Salad",
    description: "Fresh mozzarella, tomatoes, and basil with balsamic glaze",
    price: 12.99,
    category: "starters"
  },
  {
    id: 2,
    name: "Bruschetta",
    description: "Grilled bread rubbed with garlic and topped with tomatoes and olive oil",
    price: 9.99,
    category: "starters"
  },
  {
    id: 3,
    name: "Grilled Salmon",
    description: "Atlantic salmon with lemon butter sauce and seasonal vegetables",
    price: 28.99,
    category: "mains"
  },
  {
    id: 4,
    name: "Beef Tenderloin",
    description: "8oz beef tenderloin with red wine reduction and roasted potatoes",
    price: 34.99,
    category: "mains"
  },
  {
    id: 5,
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
    price: 8.99,
    category: "desserts"
  },
  {
    id: 6,
    name: "Crème Brûlée",
    description: "Rich vanilla custard with caramelized sugar top",
    price: 9.99,
    category: "desserts"
  },
  {
    id: 7,
    name: "House Red Wine",
    description: "Glass of our premium house red wine",
    price: 8.99,
    category: "drinks"
  },
  {
    id: 8,
    name: "Craft Beer",
    description: "Selection of local craft beers",
    price: 6.99,
    category: "drinks"
  }
];

const Reservations = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [guests, setGuests] = useState<string>("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleItemToggle = (itemId: number) => {
    setSelectedItems(current =>
      current.includes(itemId)
        ? current.filter(id => id !== itemId)
        : [...current, itemId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !selectedTable) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const selectedMenuItems = menuItems.filter(item => 
      selectedItems.includes(item.id)
    );

    const totalAmount = selectedMenuItems.reduce(
      (sum, item) => sum + item.price,
      0
    );

    // Get existing reservations
    const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    
    // Create new reservation
    const newReservation = {
      id: Date.now(),
      date,
      time,
      guests,
      name,
      email,
      phone,
      tableId: selectedTable,
      status: "pending",
      menuItems: selectedMenuItems,
      totalAmount
    };

    // Save to localStorage
    localStorage.setItem('reservations', JSON.stringify([...existingReservations, newReservation]));

    toast({
      title: "Reservation Submitted!",
      description: "Your reservation has been received. Check your email for confirmation.",
    });

    // Reset form
    setDate(undefined);
    setTime("");
    setGuests("2");
    setName("");
    setEmail("");
    setPhone("");
    setSelectedTable(null);
    setSelectedItems([]);
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Make a Reservation</h1>
      
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
              <div className="space-y-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
                
                <div>
                  <Label htmlFor="time">Preferred Time</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Select a Table</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {tables.map((table) => (
                <Button
                  key={table.id}
                  variant={selectedTable === table.id ? "default" : "outline"}
                  className="h-auto py-4"
                  onClick={() => setSelectedTable(table.id)}
                  type="button"
                >
                  <div className="text-left">
                    <div className="font-semibold">Table {table.id}</div>
                    <div className="text-sm text-gray-600">
                      {table.seats} seats - {table.location}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Pre-order Menu Items</h2>
            <div className="space-y-6">
              {["starters", "mains", "desserts", "drinks"].map((category) => (
                <div key={category}>
                  <h3 className="text-lg font-medium capitalize mb-3">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <div key={item.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={`item-${item.id}`}
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => handleItemToggle(item.id)}
                          />
                          <div className="flex-1">
                            <label
                              htmlFor={`item-${item.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {item.name} - ${item.price.toFixed(2)}
                            </label>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-center">
            <Button type="submit" size="lg">
              Confirm Reservation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reservations;
