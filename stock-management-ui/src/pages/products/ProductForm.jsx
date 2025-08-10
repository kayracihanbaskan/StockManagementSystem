import { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, createProduct, updateProduct, getCategories } from '../../services/api';
import { toast } from 'react-toastify';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    category: { id: '' }
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };

    fetchCategories();

    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await getProduct(id);
          setProduct(response.data);
          setError(null);
        } catch (err) {
          setError('Failed to load product');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'categoryId') {
      setProduct((prev) => ({
        ...prev,
        category: { id: value === '' ? null : value }
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value
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
      
      // Format the product data
      const productData = {
        ...product,
        price: parseFloat(product.price),
        category: product.category.id ? { id: product.category.id } : null
      };
      
      if (isEditMode) {
        await updateProduct(id, productData);
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData);
        toast.success('Product created successfully');
      }
      navigate('/products');
    } catch (err) {
      setError('Failed to save product');
      toast.error('Failed to save product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>{isEditMode ? 'Edit Product' : 'Add Product'}</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit} className="form-container">
            <Form.Group className="mb-3" controlId="productName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
                disabled={loading}
              />
              <Form.Control.Feedback type="invalid">
                Product name is required
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="productDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={product.description || ''}
                onChange={handleChange}
                placeholder="Enter product description"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="productPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
                placeholder="Enter product price"
                disabled={loading}
              />
              <Form.Control.Feedback type="invalid">
                Valid price is required
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="productSku">
              <Form.Label>SKU</Form.Label>
              <Form.Control
                type="text"
                name="sku"
                value={product.sku || ''}
                onChange={handleChange}
                placeholder="Enter product SKU"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="productCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="categoryId"
                value={product.category?.id || ''}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate('/products')} disabled={loading}>
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

export default ProductForm;
