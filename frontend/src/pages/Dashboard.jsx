import { Helmet } from "react-helmet";
import Layout from "./layouts/Layout";
import Carousel from "../components/Carousel";
import CardList from "../components/CardList";
import { cardData } from "../api/dummy";

function Dashboard() {
  return (
    <Layout>
      <Helmet>
        <title>Buyee | Dashboard</title>
      </Helmet>
      <Carousel />
      <CardList cardData={cardData} />
    </Layout>
  );
}

export default Dashboard;
