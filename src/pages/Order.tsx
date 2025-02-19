
import { Button } from "@/components/ui/button";

const Order = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Order Online</h1>
      <div className="grid gap-8">
        <p className="text-center text-gray-600">Online ordering coming soon...</p>
        <div className="flex justify-center">
          <Button>Start Order</Button>
        </div>
      </div>
    </div>
  );
};

export default Order;
