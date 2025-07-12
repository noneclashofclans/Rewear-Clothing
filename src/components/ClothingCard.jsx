import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function ClothingCard({ item }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={item.imageUrl || "https://via.placeholder.com/300x400?text=Clothing+Image"}
        alt={item.title}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-6">{item.title}</Card.Title>
        <Card.Text className="text-muted small mb-2">
          {item.type} • Size {item.size}
        </Card.Text>
        <Card.Text className="small">
          <span className={`badge ${getConditionBadgeClass(item.condition)}`}>
            {item.condition}
          </span>
        </Card.Text>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="fw-bold text-success">{item.points} pts</span>
          <Button as={Link} to={`/item/${item.id}`} variant="outline-primary" size="sm">
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

// Badge color based on condition
function getConditionBadgeClass(condition) {
  const conditionClasses = {
    "New": "bg-success",
    "Like New": "bg-primary",
    "Good": "bg-info",
    "Fair": "bg-warning",
    "Poor": "bg-secondary"
  };
  return conditionClasses[condition] || "bg-light text-dark";
}

ClothingCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    condition: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    imageUrl: PropTypes.string,
  }).isRequired,
};

export default ClothingCard;
