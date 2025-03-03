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
  Badge,
} from "react-bootstrap";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [data, setData] = useState({ user: null, department: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employee/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setData(res.data);
      } catch (err) {
        alert("Error fetching data");
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#home">
            <FaUserCircle className="me-2" /> Employee Dashboard
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link>
                Welcome,{" "}
                <Badge bg="primary">
                  {data.user?.firstName} {data.user?.lastName}
                </Badge>
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
                <div className="text-center">
                  <FaUserCircle size={80} className="profile-icon mb-3" />
                  <h4>
                    {data.user?.firstName} {data.user?.lastName}
                  </h4>
                  <p className="text-muted">{data.user?.email}</p>
                  <p>
                    Role: <Badge bg="info">Employee</Badge>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            <Row>
              <Col md={6} className="mb-4">
                <Card className="info-card shadow">
                  <Card.Body>
                    <Card.Title>Department Details</Card.Title>
                    <Card.Text>
                      <strong>Department:</strong>{" "}
                      {data.department?.departmentName || "Not Assigned"}
                    </Card.Text>
                    <Card.Text>
                      <strong>Location:</strong>{" "}
                      {data.department?.location || "N/A"}
                    </Card.Text>
                    <Card.Text>
                      <strong>Category:</strong>{" "}
                      {data.department?.categoryName || "N/A"}
                    </Card.Text>
                    <Card.Text>
                      <strong>Salary:</strong>{" "}
                      {data.department?.salary
                        ? `$${data.department.salary.toLocaleString()}`
                        : "N/A"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} className="mb-4">
                <Card className="info-card shadow">
                  <Card.Body>
                    <Card.Title>Personal Info</Card.Title>
                    <Card.Text>
                      <strong>Gender:</strong> {data.user?.gender || "N/A"}
                    </Card.Text>
                    <Card.Text>
                      <strong>Hobbies:</strong>{" "}
                      {data.user?.hobbies?.length > 0
                        ? data.user.hobbies.join(", ")
                        : "None"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EmployeeDashboard;
