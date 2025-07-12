import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ClothingCard from "../components/ClothingCard";
import "../index.css"; // make sure this file contains video styling

const featuredItems = [
  {
    id: "1",
    title: "Denim Jacket",
    description: "Size M, excellent condition",
    points: 60,
    size: "M",
    condition: "Excellent",
    type: "Jacket",
  },
  {
    id: "2",
    title: "Summer Dress",
    description: "Size S, like new",
    points: 45,
    size: "S",
    condition: "New",
    type: "Dress",
  },
  {
    id: "3",
    title: "Running Shoes",
    description: "Size 9, good condition",
    points: 75,
    size: "9",
    condition: "Good",
    type: "Shoes",
  },
];

export default function Home() {
  return (
    <>
      <video className="back_vid" autoPlay loop muted>
        <source src="/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <section className="hero-section text-center text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold">ReWear Clothing Exchange</h1>
          <p className="lead">Swap your unused clothes and reduce textile waste</p>
          <div className="mt-4">
            <Button as={Link} to="/register" variant="success" size="lg" className="me-2">
              Get Started
            </Button>
            <Button as={Link} to="/browse" variant="outline-light" size="lg">
              Browse Items
            </Button>
          </div>
        </Container>
      </section>

      <Container className="my-5">
        <h2 className="text-center mb-4 text-white">Featured Items</h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          {featuredItems.map((item) => (
            <Col key={item.id}>
              <ClothingCard item={item} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
