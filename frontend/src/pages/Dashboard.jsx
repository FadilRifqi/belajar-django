import Card from "../components/Card";
import Layout from "./layouts/Layout";

const cardData = [
  {
    id: 1,
    title: "Sepatu",
    content:
      "Sepatu adalah alas kaki yang biasa digunakan untuk melindungi kaki.",
    price: 100000,
  },
  {
    id: 2,
    title: "Baju",
    content: "Baju adalah pakaian yang dikenakan pada tubuh manusia.",
    price: 150000,
  },
  {
    id: 3,
    title: "Tas",
    content: "Tas adalah wadah yang digunakan untuk membawa barang.",
    price: 200000,
  },
];

function Dashboard() {
  return (
    <Layout>
      <div className="h-screen bg-gray-100">
        <header className="flex justify-between items-center p-6 bg-white shadow mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add New
          </button>
        </header>
        <main className="p-6">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardData.map((card) => (
              <Card
                key={card.id}
                title={card.title}
                content={card.content}
                price={card.price}
              />
            ))}
          </section>
        </main>
      </div>
    </Layout>
  );
}

export default Dashboard;
