
import { Card, CardContent } from "@/components/ui/card";

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

const Menu = () => {
  const categories = ["starters", "mains", "desserts", "drinks"];

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Our Menu</h1>
      
      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="text-2xl font-semibold capitalize mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">{item.name}</h3>
                          <p className="text-gray-600 mt-2">{item.description}</p>
                        </div>
                        <span className="text-lg font-medium">${item.price.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
