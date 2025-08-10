import { useState, useEffect } from 'react';
import { Table, Button, Card, Alert, Modal, Form } from 'react-bootstrap';
import { getLowStockItems, addStock } from '../../services/api';
import { toast } from 'react-toastify';

const LowStockItems = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stock adjustment modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fetchLowStockItems = async () => {
    try {
      setLoading(true);
      const response = await getLowStockItems();
      setLowStockItems(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load low stock items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockItems();
  }, []);

  const openStockModal = (item) => {
    setSelectedItem(item);
    // Default to the difference between current and minimum stock level
    const suggestedQuantity = Math.max(1, item.minStockLevel - item.quantity);
    setQuantity(suggestedQuantity);
    setShowModal(true);
  };

  const handleAddStock = async () => {
    try {
      await addStock(selectedItem.product.id, quantity);
      toast.success(`Added ${quantity} items to stock`);
      setShowModal(false);
      fetchLowStockItems();
    } catch (err) {
      toast.error(`Failed to add stock: ${err.response?.data?.message || err.message}`);
      console.error(err);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Low Stock Items</h1>
        <Button variant="primary" onClick={fetchLowStockItems} disabled={loading}>
          Refresh
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          {loading ? (
            <p>Loading low stock items...</p>
          ) : lowStockItems.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Quantity</th>
                  <th>Min Stock Level</th>
                  <th>Shortage</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item.id} className="low-stock">
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.minStockLevel}</td>
                    <td>{item.minStockLevel - item.quantity}</td>
                    <td>{new Date(item.lastUpdated).toLocaleString()}</td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => openStockModal(item)}
                      >
                        Restock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="success">No low stock items found. Your inventory is in good shape!</Alert>
          )}
        </Card.Body>
      </Card>

      {/* Restock Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Restock - {selectedItem?.product.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Quantity: {selectedItem?.quantity}</Form.Label>
              <Form.Text className="d-block mb-2">
                Minimum Stock Level: {selectedItem?.minStockLevel}
              </Form.Text>
              <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleAddStock}
          >
            Add to Stock
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LowStockItems;
