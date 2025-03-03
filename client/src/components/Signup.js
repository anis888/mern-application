import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    hobbies: [],
    email: "",
    password: "",
    role: "employee",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z0-9!@#$%^&*]{8,20}$/.test(formData.password)) {
      setError(
        "Password must be 8-20 characters with allowed special characters"
      );
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData
      );
      localStorage.setItem("token", res.data.token);
      navigate(formData.role === "employee" ? "/employee" : "/manager");
    } catch (err) {
      setError(err.response?.data?.msg || "An error occurred");
    }
  };

  return (
    <Container fluid className="signup-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="signup-card shadow-lg">
            <Card.Body className="p-0">
              <div className="p-2">
                <h2 className="text-center">Sign Up</h2>
                {error && <Alert variant="danger">{error}</Alert>}
              </div>
              <Form onSubmit={handleSubmit}>
                <div className="scrollable-form">
                  <Form.Group className="mb-3" controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                      className="rounded-pill"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                      className="rounded-pill"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formGender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      required
                      className="rounded-pill"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formHobbies">
                    <Form.Label>Hobbies (comma-separated)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., reading, gaming"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hobbies: e.target.value
                            .split(",")
                            .map((h) => h.trim()),
                        })
                      }
                      className="rounded-pill"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="rounded-pill"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      className="rounded-pill"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="rounded-pill"
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                    </Form.Select>
                  </Form.Group>
                </div>

                <div className="p-2">
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 rounded-pill py-2"
                  >
                    Sign Up
                  </Button>
                  <p className="text-center mt-3">
                    Already have an account?{" "}
                    <a href="/login" className="text-primary">
                      Login
                    </a>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
