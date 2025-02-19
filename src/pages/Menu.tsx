
import { Button } from "@/components/ui/button";

const Menu = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Our Menu</h1>
      <div className="grid gap-8">
        <p className="text-center text-gray-600">Menu content coming soon...</p>
        <div className="flex justify-center">
          <Button>View Full Menu</Button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
