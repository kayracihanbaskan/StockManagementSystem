import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar p-3">
      <h3 className="text-center mb-4">Stock Management</h3>
      <Nav className="flex-column">
        <Nav.Link as={NavLink} to="/" end>
          Dashboard
        </Nav.Link>
        <Nav.Link as={NavLink} to="/products">
          Products
        </Nav.Link>
        <Nav.Link as={NavLink} to="/categories">
          Categories
        </Nav.Link>
        <Nav.Link as={NavLink} to="/inventory">
          Inventory
        </Nav.Link>
        <Nav.Link as={NavLink} to="/inventory/low-stock">
          Low Stock Items
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
