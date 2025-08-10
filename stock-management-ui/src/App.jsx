import { Routes, Route } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ProductList from './pages/products/ProductList'
import ProductForm from './pages/products/ProductForm'
import CategoryList from './pages/categories/CategoryList'
import CategoryForm from './pages/categories/CategoryForm'
import InventoryList from './pages/inventory/InventoryList'
import InventoryForm from './pages/inventory/InventoryForm'
import LowStockItems from './pages/inventory/LowStockItems'

function App() {
  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col md={2}>
          <Sidebar />
        </Col>
        <Col md={10} className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/add" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />
            
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/categories/add" element={<CategoryForm />} />
            <Route path="/categories/edit/:id" element={<CategoryForm />} />
            
            <Route path="/inventory" element={<InventoryList />} />
            <Route path="/inventory/add" element={<InventoryForm />} />
            <Route path="/inventory/edit/:id" element={<InventoryForm />} />
            <Route path="/inventory/low-stock" element={<LowStockItems />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  )
}

export default App
