import { Helmet } from "react-helmet";
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
  {
    id: 4,
    title: "Celana",
    content: "Celana adalah pakaian yang dikenakan pada pinggang dan kaki.",
    price: 250000,
  },
  {
    id: 5,
    title: "Topi",
    content:
      "Topi adalah penutup kepala yang biasa digunakan sebagai aksesoris.",
    price: 300000,
  },
  {
    id: 6,
    title: "Kacamata",
    content: "Kacamata adalah alat bantu penglihatan yang dikenakan di mata.",
    price: 350000,
  },
];

function Dashboard() {
  return (
    <Layout>
      <Helmet>
        <title>Buyee | Dashboard</title>
      </Helmet>
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
    </Layout>
  );
}

export default Dashboard;
