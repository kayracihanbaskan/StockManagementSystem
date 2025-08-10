import { useState, useEffect } from 'react';
import { Row, Col, Card, Alert } from 'react-bootstrap';
import { getProducts, getCategories, getInventory, getLowStockItems } from '../services/api';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, inventoryRes, lowStockRes] = await Promise.all([
          getProducts(),
          getCategories(),
          getInventory(),
          getLowStockItems()
        ]);
        
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setInventory(inventoryRes.data);
        setLowStockItems(lowStockRes.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row>
        <Col md={3}>
          <Card className="text-center dashboard-card">
            <Card.Body>
              <div className="dashboard-icon">📦</div>
              <Card.Title>Total Products</Card.Title>
              <Card.Text className="fs-1">{products.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center dashboard-card">
            <Card.Body>
              <div className="dashboard-icon">🏷️</div>
              <Card.Title>Categories</Card.Title>
              <Card.Text className="fs-1">{categories.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center dashboard-card">
            <Card.Body>
              <div className="dashboard-icon">🔢</div>
              <Card.Title>Total Items in Stock</Card.Title>
              <Card.Text className="fs-1">
                {inventory.reduce((total, item) => total + item.quantity, 0)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center dashboard-card bg-warning text-white">
            <Card.Body>
              <div className="dashboard-icon">⚠️</div>
              <Card.Title>Low Stock Items</Card.Title>
              <Card.Text className="fs-1">{lowStockItems.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>Recent Low Stock Items</Card.Header>
            <Card.Body>
              {lowStockItems.length > 0 ? (
                <ul className="list-group">
                  {lowStockItems.slice(0, 5).map((item) => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {item.product.name}
                      <span className="badge bg-warning rounded-pill">
                        {item.quantity} / {item.minStockLevel}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No low stock items found.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>Product Categories</Card.Header>
            <Card.Body>
              {categories.length > 0 ? (
                <ul className="list-group">
                  {categories.map((category) => (
                    <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {category.name}
                      <span className="badge bg-primary rounded-pill">
                        {products.filter(p => p.category && p.category.id === category.id).length} products
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No categories found.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
