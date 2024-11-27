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
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Close,ArrowDownward, ArrowUpward  } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Store/UseContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Roles = () => {
  const { storerRole, RoleFROMLSGet } = useAuth();
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [openEditAddModal, setOpenEditAddModal] = useState(false);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [selectedRole, setselectedRole] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    role: "",
    permissions: {
      Read: false,
      Write: false,
      Delete: false,
    },
  });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  const [searchTerm, setSearchTerm] = useState("");
  const availablePermissions = ["Read", "Write", "Delete"];

  const usersToDisplay = roles.filter((role) =>
    role.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedRoles = [...roles].sort((a, b) => {
      let valA, valB;

      if (key === "role") {
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

    setRoles(sortedRoles);
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

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [name]: checked,
      },
    });
  };

  const handleAddUserClick = () => {
    setIsUpdating(false);
    setFormData({
      role: "",
      permissions: {
        Read: false,
        Write: false,
        Delete: false,
      },
    });
    setOpenEditAddModal(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = () => {
    if (isUpdating) {
      handleUpdateUser();
    } else {
      handleAddUser();
    }
  };

  const handleAddUser = () => {
    if (validateForm()) {
      const newRole = { ...formData, id: Date.now() };
      let existingRoles;
      try {
        const storedRoles = RoleFROMLSGet();
        existingRoles = storedRoles ? JSON.parse(storedRoles) : [];
      } catch (error) {
        console.error("Error parsing roles from localStorage:", error);
        existingRoles = [];
      }

      const isRoleExist = existingRoles.some(
        (existingRole) => existingRole.role === formData.role
      );

      if (isRoleExist) {
        toast.error("Role already exists!");
      } else {
        const updatedRoles = [...existingRoles, newRole];
        storerRole(updatedRoles);
        setRoles(updatedRoles);
        toast.success("Role added successfully!");
        setOpenEditAddModal(false);
      }
    }
  };

  const handleUpdateUser = () => {
    if (validateForm()) {
      let storedRoles = JSON.parse(RoleFROMLSGet()) || [];
      const updatedRoles = storedRoles.map((role) =>
        role.id === formData.id ? { ...role, ...formData } : role
      );

      storerRole(updatedRoles);
      setRoles(updatedRoles);
      resetForm();
      toast.success("Role updated successfully!");
      setOpenEditAddModal(false);
    }
  };

  const handleUpdateClick = (role) => {
    setIsUpdating(true);
    setFormData({
      id: role.id,
      role: role.role,
      permissions: role.permissions,
    });
    setOpenEditAddModal(true);
  };

  const handleDeleteClick = (roleId) => {
    setselectedRole(roleId);
    setOpenDeleteConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRole !== null) {
      let storedRoles = JSON.parse(RoleFROMLSGet()) || [];
      console.log("Stored users before deletion:", storedRoles);
      console.log("USer ID to delete:", selectedRole);
      const updatedroles = storedRoles.filter(
        (role) => role.id !== selectedRole
      );

      storerRole(updatedroles);

      setRoles(updatedroles);
      console.log("Updated users after deletion:", updatedroles);

      toast.success("User deleted successfully");
    }

    setOpenDeleteConfirmModal(false);
    setselectedRole(null);
  };

  useEffect(() => {
    let storerRole = RoleFROMLSGet();
    console.log("Raw data from localStorage:", storerRole);

    try {
      storerRole = JSON.parse(storerRole);
    } catch (e) {
      console.error("Error parsing localStorage data:", e);
      storerRole = [];
    }
    if (!Array.isArray(storerRole)) {
      storerRole = [storerRole];
    }
    storerRole = storerRole.filter(
      (role) => role !== null && role !== undefined
    );

    console.log("Parsed users array:", storerRole);
    setRoles(storerRole);
  }, [RoleFROMLSGet]);

  const resetForm = () => {
    setFormData({
      role: "",
      permissions: {
        read: false,
        write: false,
        delete: false,
      },
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.role) {
      newErrors.role = "Role is required.";
    }
    // if (!formData.permissions || formData.permissions.length === 0) {
    //   errors.permissions = "At least one permission is required.";
    // }
    if (!Object.values(formData.permissions).includes(true)) {
      newErrors.permissions = "At least one permission is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
          width: { sx: "100%", sm: "82%" },
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
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 },
              alignItems: { xs: "flex-start", sm: "center" },
            }}
          >
            <Box
              display="flex"
              gap={2}
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                width: { xs: "100%", sm: 300 },
              }}
            >
              <Typography variant="h6">Role List</Typography>
              <TextField
                label="Search by Name"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ width: { xs: "50%", sm: 200 } }}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddUserClick}
            >
              Add Role
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
                    onClick={() => handleSort("role")}>
                    Role Name{getSortIcon("role")}
                  </TableCell>
                  <TableCell
                    className="tableCell"
                    >
                    Permissions
                  </TableCell>
                  <TableCell className="tableCell">Update</TableCell>
                  <TableCell className="tableCell">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersToDisplay.map((role) => (
                  <TableRow className="tableRow" key={role.id}>
                    <TableCell className="tableCell">{role.role}</TableCell>
                    <TableCell className="tableCell">
                      {Object.keys(role.permissions)
                        .filter((key) => role.permissions[key])
                        .join(", ")}
                    </TableCell>
                    <TableCell className="table-cell">
                      <Chip
                        label="Update"
                        color="primary"
                        onClick={() => handleUpdateClick(role)}
                        className="chip-view"
                      />
                    </TableCell>
                    <TableCell className="table-cell">
                      <Chip
                        label="Delete"
                        color="primary"
                        onClick={() => handleDeleteClick(role.id)}
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
          open={openEditAddModal}
          onClose={() => setOpenEditAddModal(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: { xs: "0", sm: "240px" },
          }}
        >
          <Card
            sx={{
              width: { xs: "90%", sm: 400 },
              p: 1,
              borderRadius: 2,
              boxShadow: 3,
              //   display: "flex",
              // alignItems: "center",
              // justifyContent: "center",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                marginBottom={2}
                sx={{ textAlign: "center", fontWeight: "bold" }}
              >
                {isUpdating ? "Edit Role" : "Add New Role"}
              </Typography>

              <FormControl fullWidth error={!!errors.role} sx={{ mb: 2 }}>
                <TextField
                  name="role"
                  label="Role Name"
                  fullWidth
                  value={formData.role}
                  onChange={handleInputChange}
                />
                <FormHelperText sx={{ color: "red", mb: 2, marginLeft: "2px" }}>
                  {errors.role}
                </FormHelperText>
              </FormControl>

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Permissions:
              </Typography>

              {availablePermissions.map((permission) => (
                <FormControlLabel
                  key={permission}
                  control={
                    <Checkbox
                      checked={formData.permissions[permission]}
                      onChange={handlePermissionChange}
                      name={permission}
                    />
                  }
                  label={
                    permission.charAt(0).toUpperCase() + permission.slice(1)
                  }
                />
              ))}
              <FormHelperText sx={{ color: "red", mb: 2, marginLeft: "2px" }}>
                {errors.permissions}
              </FormHelperText>

              <Box display="flex" justifyContent="space-between" mt={2}>
                <Button variant="contained" onClick={handleSubmit}>
                  {isUpdating ? "Update" : "Add"} Role
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    resetForm();
                    setOpenEditAddModal(false);
                  }}
                >
                  Close
                </Button>
              </Box>
            </CardContent>
          </Card>
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

export default Roles;
