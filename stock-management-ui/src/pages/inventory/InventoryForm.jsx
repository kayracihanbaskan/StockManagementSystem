import { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getInventoryItem, createInventory, updateInventory, getProducts } from '../../services/api';
import { toast } from 'react-toastify';

const InventoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [inventory, setInventory] = useState({
    product: { id: '' },
    quantity: 0,
    minStockLevel: 0
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to load products', err);
      }
    };

    fetchProducts();

    if (isEditMode) {
      const fetchInventory = async () => {
        try {
          setLoading(true);
          const response = await getInventoryItem(id);
          setInventory(response.data);
          setError(null);
        } catch (err) {
          setError('Failed to load inventory item');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchInventory();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'productId') {
      setInventory((prev) => ({
        ...prev,
        product: { id: value === '' ? null : value }
      }));
    } else {
      setInventory((prev) => ({
        ...prev,
        [name]: value === '' ? '' : parseInt(value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setLoading(true);
      
      if (isEditMode) {
        await updateInventory(id, inventory);
        toast.success('Inventory updated successfully');
      } else {
        await createInventory(inventory);
        toast.success('Inventory created successfully');
      }
      navigate('/inventory');
    } catch (err) {
      setError('Failed to save inventory: ' + (err.response?.data?.message || err.message));
      toast.error('Failed to save inventory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter out products that already have inventory items (for create mode only)
  const availableProducts = isEditMode
    ? products
    : products.filter(product => 
        !product.inventoryId || product.id === inventory.product?.id
      );

  return (
    <div>
      <h1>{isEditMode ? 'Edit Inventory' : 'Add Inventory'}</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit} className="form-container">
            <Form.Group className="mb-3" controlId="inventoryProduct">
              <Form.Label>Product</Form.Label>
              <Form.Select
                name="productId"
                value={inventory.product?.id || ''}
                onChange={handleChange}
                required
                disabled={loading || isEditMode}
              >
                <option value="">Select a product</option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Product is required
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="inventoryQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="quantity"
                value={inventory.quantity}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <Form.Control.Feedback type="invalid">
                Quantity must be 0 or greater
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="inventoryMinStockLevel">
              <Form.Label>Minimum Stock Level</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="minStockLevel"
                value={inventory.minStockLevel}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <Form.Control.Feedback type="invalid">
                Minimum stock level must be 0 or greater
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate('/inventory')} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default InventoryForm;
