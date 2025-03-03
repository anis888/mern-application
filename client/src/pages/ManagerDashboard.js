import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Navbar,
  Nav,
  Button,
  Form,
  Table,
  Badge,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { FaBuilding, FaSignOutAlt, FaList, FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    departmentName: "",
    categoryName: "",
    location: "",
    salary: "",
    employeeIds: [],
  });
  const [employees, setEmployees] = useState([]);
  const [managerName, setManagerName] = useState("");
  const [showDepartments, setShowDepartments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // For employee search

  useEffect(() => {
    fetchEmployees();
    fetchManagerName();
    if (showDepartments) fetchDepartments(true);
  }, [page, showDepartments]);

  const fetchDepartments = async (showNotification = false) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/departments?page=${page}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setDepartments(res.data.departments);
      setTotalPages(res.data.pages);
      if (showNotification) {
        toast.success("Departments fetched successfully");
      }
    } catch (err) {
      toast.error("Error fetching departments");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employee/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEmployees(res.data);
    } catch (err) {
      toast.error("Error fetching employees");
    }
  };

  const fetchManagerName = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employee/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setManagerName(`${res.data.user.firstName} ${res.data.user.lastName}`);
    } catch (err) {
      console.error("Error fetching manager name", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/departments", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Department created successfully");
      fetchDepartments(false);
      fetchEmployees();
      setFormData({
        departmentName: "",
        categoryName: "",
        location: "",
        salary: "",
        employeeIds: [],
      });
      setSearchTerm(""); // Reset search
    } catch (err) {
      toast.error("Error creating department");
    }
  };

  const handleEdit = (dept) => {
    const employeeIds = dept.employeeIds.map((emp) => emp._id);
    setEditFormData({ ...dept, employeeIds });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/departments/${editFormData._id}`,
        editFormData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Department updated successfully");
      setShowEditModal(false);
      fetchDepartments(false);
      fetchEmployees();
      setSearchTerm(""); // Reset search
    } catch (err) {
      toast.error("Error updating department");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`http://localhost:5000/api/departments/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Department deleted successfully");
        fetchDepartments(false);
        fetchEmployees();
      } catch (err) {
        toast.error("Error deleting department");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-wrapper">
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#home">
            <FaBuilding className="me-2" /> Manager Dashboard
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link>
                Welcome, <Badge bg="primary">{managerName || "Manager"}</Badge>
              </Nav.Link>
              <Nav.Link onClick={handleLogout} className="text-danger">
                <FaSignOutAlt className="me-1" /> Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="dashboard-container py-4">
        <Row>
          <Col md={3} className="mb-4">
            <Card className="sidebar-card shadow">
              <Card.Body>
                <h4 className="text-center">Quick Actions</h4>
                <Button
                  variant="primary"
                  className="w-100 mb-3 rounded-pill"
                  onClick={() => setShowDepartments(false)}
                >
                  Add Department
                </Button>
                <Button
                  variant="outline-primary"
                  className="w-100 rounded-pill"
                  onClick={() => setShowDepartments(true)}
                >
                  <FaList className="me-2" /> Departments
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            {!showDepartments ? (
              <Card className="info-card shadow mb-4">
                <Card.Body>
                  <Card.Title>Create New Department</Card.Title>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="departmentName">
                          <Form.Label>Department Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="e.g., Google IT Soln Pvt"
                            value={formData.departmentName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                departmentName: e.target.value,
                              })
                            }
                            required
                            className="rounded-pill"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="categoryName">
                          <Form.Label>Category</Form.Label>
                          <Form.Select
                            value={formData.categoryName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                categoryName: e.target.value,
                              })
                            }
                            required
                            className="rounded-pill"
                          >
                            <option value="">Select Category</option>
                            <option value="HR">HR</option>
                            <option value="IT">IT</option>
                            <option value="Sales">Sales</option>
                            <option value="Product">Product</option>
                            <option value="Marketing">Marketing</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="location">
                          <Form.Label>Location</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="e.g., Aurangabad"
                            value={formData.location}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                location: e.target.value,
                              })
                            }
                            required
                            className="rounded-pill"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="salary">
                          <Form.Label>Salary</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="e.g., 50000"
                            value={formData.salary}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                salary: e.target.value,
                              })
                            }
                            required
                            className="rounded-pill"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3" controlId="employeeIds">
                      <Form.Label>Assign Employees</Form.Label>
                      <InputGroup className="mb-2">
                        <InputGroup.Text>
                          <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Search employees..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                      <div className="employee-checkbox-list">
                        {filteredEmployees.map((emp) => (
                          <Form.Check
                            key={emp._id}
                            type="checkbox"
                            id={`create-emp-${emp._id}`}
                            label={`${emp.firstName} ${emp.lastName}`}
                            checked={formData.employeeIds.includes(emp._id)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData((prev) => ({
                                ...prev,
                                employeeIds: checked
                                  ? [...prev.employeeIds, emp._id]
                                  : prev.employeeIds.filter(
                                      (id) => id !== emp._id
                                    ),
                              }));
                            }}
                          />
                        ))}
                      </div>
                    </Form.Group>
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 rounded-pill"
                    >
                      Create Department
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            ) : (
              <Card className="info-card shadow">
                <Card.Body>
                  <Card.Title>Departments</Card.Title>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Salary</th>
                        <th>Employees</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map((dept) => (
                        <tr key={dept._id}>
                          <td>{dept.departmentName}</td>
                          <td>{dept.categoryName}</td>
                          <td>{dept.location}</td>
                          <td>${dept.salary.toLocaleString()}</td>
                          <td>
                            {dept.employeeIds
                              .map((emp) => `${emp.firstName} ${emp.lastName}`)
                              .join(", ") || "None"}
                          </td>
                          <td>
                            <Button
                              variant="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(dept)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(dept._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="d-flex justify-content-between align-items-center">
                    <Button
                      variant="outline-primary"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="rounded-pill"
                    >
                      Previous
                    </Button>
                    <span>
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline-primary"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="rounded-pill"
                    >
                      Next
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      <Modal
        backdrop="static"
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-body-scrollable">
            <Form onSubmit={handleEditSubmit}>
              <Form.Group className="mb-3" controlId="editDepartmentName">
                <Form.Label>Department Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editFormData.departmentName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      departmentName: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="editCategoryName">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={editFormData.categoryName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      categoryName: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="Sales">Sales</option>
                  <option value="Product">Product</option>
                  <option value="Marketing">Marketing</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="editLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  value={editFormData.location}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      location: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="editSalary">
                <Form.Label>Salary</Form.Label>
                <Form.Control
                  type="number"
                  value={editFormData.salary}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, salary: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="editEmployeeIds">
                <Form.Label>Assign Employees</Form.Label>
                <InputGroup className="mb-2">
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                <div className="employee-checkbox-list">
                  {filteredEmployees.map((emp) => (
                    <Form.Check
                      key={emp._id}
                      type="checkbox"
                      id={`edit-emp-${emp._id}`}
                      label={`${emp.firstName} ${emp.lastName}`}
                      checked={(editFormData.employeeIds || []).includes(
                        emp._id
                      )}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setEditFormData((prev) => ({
                          ...prev,
                          employeeIds: checked
                            ? [...(prev.employeeIds || []), emp._id]
                            : (prev.employeeIds || []).filter(
                                (id) => id !== emp._id
                              ),
                        }));
                      }}
                    />
                  ))}
                </div>
              </Form.Group>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          </div>
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ManagerDashboard;
