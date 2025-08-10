import { useState, useEffect } from 'react';
import { Table, Button, Card, Alert, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getInventory, addStock, removeStock, deleteInventory } from '../../services/api';
import { toast } from 'react-toastify';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stock adjustment modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'remove'
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await getInventory();
      setInventory(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load inventory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await deleteInventory(id);
        toast.success('Inventory item deleted successfully');
        fetchInventory();
      } catch (err) {
        toast.error('Failed to delete inventory item');
        console.error(err);
      }
    }
  };

  const openStockModal = (item, mode) => {
    setSelectedItem(item);
    setModalMode(mode);
    setQuantity(1);
    setShowModal(true);
  };

  const handleStockAdjustment = async () => {
    try {
      if (modalMode === 'add') {
        await addStock(selectedItem.product.id, quantity);
        toast.success(`Added ${quantity} items to stock`);
      } else {
        await removeStock(selectedItem.product.id, quantity);
        toast.success(`Removed ${quantity} items from stock`);
      }
      setShowModal(false);
      fetchInventory();
    } catch (err) {
      toast.error(`Failed to ${modalMode} stock: ${err.response?.data?.message || err.message}`);
      console.error(err);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Inventory</h1>
        <Link to="/inventory/add">
          <Button variant="primary">Add Inventory Item</Button>
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          {loading ? (
            <p>Loading inventory...</p>
          ) : inventory.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Min Stock Level</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className={item.quantity <= item.minStockLevel ? 'low-stock' : ''}>
                    <td>{item.id}</td>
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.minStockLevel}</td>
                    <td>
                      {item.quantity <= item.minStockLevel ? (
                        <span className="badge bg-danger">Low Stock</span>
                      ) : (
                        <span className="badge bg-success">In Stock</span>
                      )}
                    </td>
                    <td>{new Date(item.lastUpdated).toLocaleString()}</td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-1"
                        onClick={() => openStockModal(item, 'add')}
                      >
                        Add
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-1"
                        onClick={() => openStockModal(item, 'remove')}
                        disabled={item.quantity <= 0}
                      >
                        Remove
                      </Button>
                      <Link to={`/inventory/edit/${item.id}`} className="btn btn-sm btn-info me-1">
                        Edit
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No inventory items found.</p>
          )}
        </Card.Body>
      </Card>

      {/* Stock Adjustment Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'add' ? 'Add Stock' : 'Remove Stock'} - {selectedItem?.product.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Quantity: {selectedItem?.quantity}</Form.Label>
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
            variant={modalMode === 'add' ? 'success' : 'warning'}
            onClick={handleStockAdjustment}
          >
            {modalMode === 'add' ? 'Add to Stock' : 'Remove from Stock'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InventoryList;
