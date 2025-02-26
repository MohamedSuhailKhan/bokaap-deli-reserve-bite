import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Experience Authentic Bo-Kaap Flavors
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Discover the finest Cape Malay cuisine in the heart of Bo-Kaap.
              Traditional recipes with a modern twist.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link to="/reservations">Make a Reservation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Specialties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Cape Malay Curry",
                description: "Traditional curry with aromatic spices",
                image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd",
              },
              {
                title: "Bobotie",
                description: "South African minced meat dish",
                image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
              },
              {
                title: "Koesisters",
                description: "Traditional Cape Malay spiced doughnuts",
                image: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/90">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                Nestled in the heart of Cape Town's most colorful neighborhood,
                Bokaap-Deli brings together traditional Cape Malay cuisine with
                modern dining excellence. Our recipes have been passed down through
                generations, each dish telling a story of culture and tradition.
              </p>
              <Button asChild variant="secondary">
                <Link to="/menu">Explore Our Menu</Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf"
                alt="Restaurant interior"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
