
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "starters" | "mains" | "desserts" | "drinks";
  image_url?: string;
  is_spicy: boolean;
}

const Menu = () => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const categories = ["starters", "mains", "desserts", "drinks"];

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('category');

        if (error) {
          throw error;
        }

        setMenuItems(data || []);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load menu items. Please try again later.",
        });
      }
    };

    fetchMenuItems();
  }, [toast]);

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
                    {item.image_url && (
                      <div className="relative h-48 w-full">
                        <img
                          src={item.image_url || '/placeholder.svg'}
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            {item.name}
                            {item.is_spicy && <span title="Spicy">🌶️</span>}
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
