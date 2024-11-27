import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Modal,
  Card,
  CardContent,
  TextField,
  FormControl,
  FormHelperText,
  InputAdornment,
  IconButton,
  MenuItem,
  Paper,
} from "@mui/material";

import { Close, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Store/UseContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const styles = {
//   tableRow: {
//     "& .tableCell": {
//       fontWeight: 600,
//       fontSize: "14px",
//     },
//   },
//   tableRow1: {
//     "& .tableCell1": {
//       color:"#6b7280",
//      fontweight: 600,
//     },
//   },

// };

const User = () => {
  const { storerUser, UserFROMLSGet } = useAuth();

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [openEditAddModal, setOpenEditAddModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search input
  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
  );

  const usersToDisplay = searchTerm ? filteredUsers : users;

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedUsers = [...users].sort((a, b) => {
      let valA, valB;

      if (key === "full_name") {
        // Extract the first name
        valA = a[key].split(" ")[0].toLowerCase();
        valB = b[key].split(" ")[0].toLowerCase();
      } else {
        // For other keys
        valA = a[key].toLowerCase();
        valB = b[key].toLowerCase();
      }

      if (valA < valB) {
        return direction === "asc" ? -1 : 1;
      }
      if (valA > valB) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setUsers(sortedUsers);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <ArrowUpward />
      ) : (
        <ArrowDownward />
      );
    }
    // Default icon for unsorted columns (always upward arrow)
    return <ArrowUpward style={{ opacity: 0.5 }} />;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const resetForm = () => {
    setFormData({});
    setErrors({});
  };

  const handleViewClick = (user) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewOpen(false);
    setSelectedUser(null);
  };

  const handleAddUserClick = () => {
    setIsUpdating(false);
    setOpenEditAddModal(true);
  };

  const handleAddUser = () => {
    // e.preventDefault();

    if (validateForm()) {
      const newEvent = { ...formData, id: Date.now() };
      let existingUsers;
      try {
        const storedEvents = UserFROMLSGet();
        existingUsers = storedEvents ? JSON.parse(storedEvents) : [];
        console.log(existingUsers);
      } catch (error) {
        console.error("Error parsing events from localStorage:", error);
        existingUsers = [];
      }
      if (!Array.isArray(existingUsers)) {
        existingUsers = [];
      }
      console.log(existingUsers);

      if (existingUsers) {
        const isEmailExist = existingUsers.some(
          (existingUser) => existingUser.email === formData.email
        );

        // Check if email already exists
        if (isEmailExist) {
          toast.error(
            "Email are already registered! Please use different ones."
          );
        } else {
          const updatedUsers = [...existingUsers, newEvent];

          storerUser(updatedUsers);
          setUsers(updatedUsers);

          toast.success("Registration successful");
          resetForm();
          setOpenEditAddModal(false);

          navigate("/user");
        }
      } else {
        toast.error("Something went wrong with user data.");
      }
    }
  };

  const handleUpdateClick = (user) => {
    setIsUpdating(true);

    // setSelectedUser(user);
    setFormData({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    setOpenEditAddModal(true);
  };
  console.log(formData, "formData");

  const handleUpdateUser = () => {
    if (validateForm()) {
      let storedUsers = JSON.parse(UserFROMLSGet()) || [];
      console.log(storedUsers);
      const updateduserss = storedUsers.map((user) =>
        user.id === formData.id ? { ...user, ...formData } : user
      );

      storerUser(updateduserss);
      setUsers(updateduserss);
      resetForm();

      toast.success("User updated successfully");
      setOpenEditAddModal(false);
    }
  };

  const handleSubmit = () => {
    if (isUpdating) {
      handleUpdateUser();
    } else {
      handleAddUser();
    }
  };

  const handleDeleteClick = (userId) => {
    setSelectedUser(userId);
    setOpenDeleteConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser !== null) {
      let storedUsers = JSON.parse(UserFROMLSGet()) || [];
      console.log("Stored users before deletion:", storedUsers);
      console.log("USer ID to delete:", selectedUser);
      const updatedusers = storedUsers.filter(
        (user) => user.id !== selectedUser
      );

      storerUser(updatedusers);

      setUsers(updatedusers);
      console.log("Updated users after deletion:", updatedusers);

      toast.success("User deleted successfully");
    }

    setOpenDeleteConfirmModal(false);
    setSelectedUser(null);
  };
  const nameRegex = /^[a-zA-Z\s]{10,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name) {
      newErrors.full_name = "FullName is required.";
    } else if (!nameRegex.test(formData.full_name)) {
      newErrors.full_name = "FullName should be 10-20 alphabetic characters.";
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.role) {
      newErrors.role = "Role is required.";
    }

    if (!formData.status) {
      newErrors.status = "Status is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    let storedUsers = UserFROMLSGet();
    console.log("Raw data from localStorage:", storedUsers);

    try {
      storedUsers = JSON.parse(storedUsers);
    } catch (e) {
      console.error("Error parsing localStorage data:", e);
      storedUsers = [];
    }
    if (!Array.isArray(storedUsers)) {
      storedUsers = [storedUsers];
    }
    storedUsers = storedUsers.filter(
      (user) => user !== null && user !== undefined
    );

    console.log("Parsed users array:", storedUsers);
    setUsers(storedUsers);
  }, [UserFROMLSGet]);

  return (
    <>
      <style>
        {`
          .tableRow .tableCell {
            font-weight: 600;
            font-size: 14px;
          }
         
          .tableRow1 .tableCell1 {
            color: #6b7280;
            font-weight: 600;
          }
          .table-cell {
           padding: 1px;
          }

          .chip-view {
            cursor: pointer;
            font-weight: bold;
          }

          .chip-view:hover {
            background-color: lightblue;
          }

          .header-container {
            display: flex;
            width: 100%;
            margin-bottom: 16px;
          }
          
          .header-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .form-row1 {
            display: flex;
            width: 100%;
            margin-bottom: 16px;
          }
          
          .form-row {
            display: flex;
            width: 100%;
            gap: 10px; 
           }
          
          .footer-container {
            display: flex;
            width: 100%;
            gap: 10px;
            margin-top: 16px;
          }
          
          .footer-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .view1{
            margin-bottom: 1px;
          }
        
          
        `}
      </style>

      <Box
        sx={{
          marginLeft: { xs: "0", sm: "240px" },
          padding: 2,
          // width: "83%",
          width:{sx:"100%",sm:"82%"},
          height: "100vh",
          position: "relative",
          
        }}
      >
        <Paper elevation={24} sx={{ p: 2, borderRadius: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            my={2}
            sx={{
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: { xs: 2, sm: 0 },
              alignItems: { xs: 'flex-start', sm: 'center' },
              
              
            }}
           
          >
          
            <Box display="flex" gap={2}
            // justifyContent="center"
              sx={{
                flexDirection: { xs: "column", sm: "row" }, // Stack items vertically for xs
                alignItems: { xs: "flex-start", sm: "center" }, // Align left for xs, center for larger
                width:{ xs:"100%", sm:300},
              }}
           
              >
              <Typography variant="h6" >User List</Typography>
              <TextField
                label="Search by Name"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ 
                  width:{xs:"50%", sm:200} }}
              />
            </Box>

           
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddUserClick}
            >
              Add User
            </Button>
          </Box>

          <Box sx={{ overflow: "auto", width: { xs: "100%", sm: "auto" } }}>
            <Table
              aria-label="simple table"
              sx={{ whiteSpace: "nowrap", mt: 2 }}
            >
              <TableHead>
                <TableRow className="tableRow">
                  <TableCell
                    className="tableCell"
                    onClick={() => handleSort("full_name")}
                  >
                    Full Name {getSortIcon("full_name")}
                  </TableCell>
                  <TableCell
                    className="tableCell"
                    onClick={() => handleSort("email")}
                  >
                    Email {getSortIcon("email")}
                  </TableCell>
                  <TableCell
                    className="tableCell"
                    onClick={() => handleSort("role")}
                  >
                    Role {getSortIcon("role")}
                  </TableCell>
                  <TableCell className="tableCell">Status</TableCell>
                  <TableCell className="tableCell">View</TableCell>
                  <TableCell className="tableCell">Update</TableCell>
                  <TableCell className="tableCell">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersToDisplay.map((user, index) => (
                  <TableRow className="tableRow" key={user.id}>
                    <TableCell className="tableCell">
                      {user.full_name}
                    </TableCell>
                    <TableCell className="tableCell">{user.email}</TableCell>
                    <TableCell className="tableCell">{user.role}</TableCell>
                    <TableCell className="tableCell">
                      {user.status === "active" ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell className="table-cell">
                      <Chip
                        label="View"
                        color="primary"
                        onClick={() => handleViewClick(user)}
                        className="chip-view"
                      />
                    </TableCell>
                    <TableCell className="table-cell">
                      <Chip
                        label="Update"
                        color="primary"
                        onClick={() => handleUpdateClick(user)}
                        className="chip-view"
                      />
                    </TableCell>
                    <TableCell className="table-cell">
                      <Chip
                        label="Delete"
                        color="primary"
                        onClick={() => handleDeleteClick(user.id)}
                        className="chip-view"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>

        <Modal
          open={isViewOpen}
          onClose={handleCloseModal}
          sx={{
            position:"absolute",
            marginLeft: { xs: "0", sm: "240px" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
           
          }}
        >
          <Card
            sx={{
              width: { xs: "90%", sm: 320 },
              p: 1,

              borderRadius: 2,
              boxShadow: 3,
              maxHeight: 350,
              // overflowY: "auto",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", fontWeight: "bold" }}
              >
                User Details
              </Typography>
              {selectedUser && (
                <Box sx={{ p: 0.5 }}>
                  <Typography variant="subtitle1">
                    <strong>Full Name:</strong> {selectedUser.full_name}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Email Address:</strong> {selectedUser.email}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Role:</strong> {selectedUser.role}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Status:</strong> {selectedUser.status}
                  </Typography>
                </Box>
              )}
              <Box display="flex" justifyContent="center" m={1}>
                <Chip
                  label="Close"
                  color="primary"
                  onClick={handleCloseModal}
                  sx={{
                    cursor: "pointer",
                    width: "100px",
                    textAlign: "center",
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Modal>

        <Modal
          open={openEditAddModal}
          sx={{
            display: "flex",
            position:"absolute",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: { xs: "0", sm: "240px" },
            // overflow: "auto",
            
            // height: "100vh",
            // px: { xs: 1 },
            // mb:{xs:20}
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              p: 2,
              // pr:4,
              // pb:3,
              ml: 0, // for mobile view override(ml=-16px, inherite form parent component) // Override default margin-left
              backgroundColor: "white",
              // margin: "auto", //for making mobileview responsive (without this issue create marginleft)
              borderRadius: "8px",
              display: "flex",
              width: { xs: "100%", sm: "600px" },
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Grid
              className="header-container"
              // sx={{
              //   display: "flex",
              //   width: "100%",
              //   mb: "16px"
              // }}
            >
              <Grid
                item
                xs={12}
                // sx={{
                //   display: "flex",
                //   justifyContent: "space-between",
                //   alignItems: "center",
                // }}
                className="header-item"
              >
                <Typography variant="h6">
                  {isUpdating ? "Update User" : "Add User"}
                </Typography>
                <IconButton
                  onClick={() => {
                    resetForm();
                    setOpenEditAddModal(false);
                  }}
                >
                  <Close />
                </IconButton>
              </Grid>
            </Grid>

            <Grid
              // sx={{
              //   display: "flex",
              //   width: "100%",
              //   gap: "10px",
              // }}
              className="form-row1"
            >
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.full_name}>
                  <TextField
                    label="Full Name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <FormHelperText sx={{ marginLeft: "2px" }}>
                    {errors.full_name}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <Grid
              // sx={{
              //   display: "flex",
              //   width: "100%",
              //   mt: "16px",
              // }}
              className="form-row1"
            >
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.email}>
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <FormHelperText sx={{ marginLeft: "2px" }}>
                    {errors.email}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              // sx={{
              //   display: "flex",
              //   width: "100%",
              //   mt: "16px",
              // }}
              className="form-row"
            >
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.role}>
                  <TextField
                    select
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    fullWidth
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="User">User</MenuItem>
                  </TextField>
                  <FormHelperText>{errors.role}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.status}>
                  <TextField
                    select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    fullWidth
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </TextField>
                  <FormHelperText>{errors.status}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              // sx={{
              //   display: "flex",
              //   width: "100%",
              //   gap: "10px",
              //   mt: "16px",
              // }}
              className="footer-container"
            >
              <Grid
                item
                xs={12}
                // sx={{
                //   display: "flex",
                //   justifyContent: "space-between",
                //   alignItems: "center",
                // }}
                className="footer-item"
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  {isUpdating ? "Update User" : "Add User"}
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    resetForm();
                    setOpenEditAddModal(false);
                  }}
                  // sx={{ width: "auto" }}
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Modal>

        <Modal
          open={openDeleteConfirmModal}
          onClose={() => setOpenDeleteConfirmModal(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // height: "100vh",
            position: "absolute",
            marginLeft: { xs: "0", sm: "240px" },
          }}
        >
          <Card
            sx={{
              width: { xs: "90%", sm: 400 },
              mx: "auto",
              my: "20%",
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    mb: 2,
                    color: "black",
                  }}
                >
                  Confirm Deletion
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    textAlign: "center",
                    mb: 3,
                    color: "text.secondary",
                  }}
                >
                  Are you sure you want to delete this user?
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  width="100%"
                  mt={2}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConfirmDelete}
                    sx={{ flex: 1, mr: 1 }}
                  >
                    Yes
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setOpenDeleteConfirmModal(false)}
                    sx={{ flex: 1, ml: 1 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Modal>
      </Box>
    </>
  );
};

export default User;
