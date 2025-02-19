
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: "starters" | "mains" | "desserts" | "drinks";
  image: string;
  isSpicy?: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Moroccan Lentil Soup",
    description: "Traditional harira soup with lentils, chickpeas, and aromatic spices",
    price: 89.99,
    category: "starters",
    image: "/photo-1498936178812-4b2e558d2937",
  },
  {
    id: 2,
    name: "Falafel Platter",
    description: "Crispy chickpea falafels served with hummus and tahini sauce",
    price: 79.99,
    category: "starters",
    image: "/photo-1618160702438-9b02ab6515c9",
  },
  {
    id: 3,
    name: "Grilled Lamb Kebabs",
    description: "Tender lamb kebabs marinated in Middle Eastern spices",
    price: 189.99,
    category: "mains",
    image: "/photo-1466721591366-2d5fba72006d",
    isSpicy: true
  },
  {
    id: 4,
    name: "Butter Chicken",
    description: "Tender chicken in a rich, creamy tomato sauce with aromatic spices",
    price: 159.99,
    category: "mains",
    image: "/placeholder.svg",
    isSpicy: true
  },
  {
    id: 5,
    name: "Biryani",
    description: "Fragrant basmati rice cooked with tender meat and aromatic spices",
    price: 169.99,
    category: "mains",
    image: "/placeholder.svg",
    isSpicy: true
  },
  {
    id: 6,
    name: "Grilled Sea Bass",
    description: "Fresh sea bass grilled with herbs and lemon",
    price: 199.99,
    category: "mains",
    image: "/placeholder.svg"
  },
  {
    id: 7,
    name: "Kunafa",
    description: "Traditional Middle Eastern dessert with sweet cheese and crispy pastry",
    price: 69.99,
    category: "desserts",
    image: "/placeholder.svg"
  },
  {
    id: 8,
    name: "Baklava",
    description: "Layered phyllo pastry filled with nuts and honey",
    price: 59.99,
    category: "desserts",
    image: "/placeholder.svg"
  },
  {
    id: 9,
    name: "Turkish Coffee",
    description: "Traditional Turkish coffee with cardamom",
    price: 39.99,
    category: "drinks",
    image: "/placeholder.svg"
  },
  {
    id: 10,
    name: "Mint Tea",
    description: "Fresh mint tea served Moroccan style",
    price: 29.99,
    category: "drinks",
    image: "/placeholder.svg"
  },
  {
    id: 11,
    name: "Fresh Juice Selection",
    description: "Choose from orange, pomegranate, or mango",
    price: 44.99,
    category: "drinks",
    image: "/placeholder.svg"
  },
  {
    id: 12,
    name: "Shawarma Plate",
    description: "Grilled marinated chicken or lamb with rice and salad",
    price: 149.99,
    category: "mains",
    image: "/placeholder.svg"
  }
];

const Menu = () => {
  const categories = ["starters", "mains", "desserts", "drinks"];

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Our Halaal Menu</h1>
      
      <div className="text-center mb-8">
        <p className="text-lg text-gray-600">All our food is certified Halaal</p>
        <p className="text-sm text-gray-500">🌶️ Indicates spicy dishes</p>
      </div>
      
      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="text-2xl font-semibold capitalize mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="relative h-48 w-full">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            {item.name}
                            {item.isSpicy && <span title="Spicy">🌶️</span>}
                          </h3>
                          <p className="text-gray-600 mt-2">{item.description}</p>
                        </div>
                        <span className="text-lg font-medium">R{item.price.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          All prices include VAT. Menu items and prices are subject to change.
        </p>
      </div>
    </div>
  );
};

export default Menu;
