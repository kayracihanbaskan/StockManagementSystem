import { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategory, createCategory, updateCategory } from '../../services/api';
import { toast } from 'react-toastify';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [category, setCategory] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          setLoading(true);
          const response = await getCategory(id);
          setCategory(response.data);
          setError(null);
        } catch (err) {
          setError('Failed to load category');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchCategory();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value
    }));
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
        await updateCategory(id, category);
        toast.success('Category updated successfully');
      } else {
        await createCategory(category);
        toast.success('Category created successfully');
      }
      navigate('/categories');
    } catch (err) {
      setError('Failed to save category');
      toast.error('Failed to save category');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>{isEditMode ? 'Edit Category' : 'Add Category'}</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit} className="form-container">
            <Form.Group className="mb-3" controlId="categoryName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={category.name}
                onChange={handleChange}
                required
                placeholder="Enter category name"
                disabled={loading}
              />
              <Form.Control.Feedback type="invalid">
                Category name is required
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="categoryDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={category.description || ''}
                onChange={handleChange}
                placeholder="Enter category description"
                disabled={loading}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate('/categories')} disabled={loading}>
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

export default CategoryForm;
