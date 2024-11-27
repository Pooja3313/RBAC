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
  MenuItem,
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const Pooja = () => {
  const [roles, setRoles] = useState([
    { name: "Admin", permissions: ["Read", "Write", "Delete"] },
    { name: "User", permissions: ["Read"] },
  ]);
  const [users, setUsers] = useState([]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", permissions: [] });
  const [roleErrors, setRoleErrors] = useState({});

  const availablePermissions = ["Read", "Write", "Delete"];

  // Handle adding a new role
  const handleAddRole = () => {
    const errors = {};

    if (!newRole.name) {
      errors.name = "Role name is required.";
    }
    if (newRole.permissions.length === 0) {
      errors.permissions = "At least one permission is required.";
    }

    setRoleErrors(errors);

    if (Object.keys(errors).length === 0) {
      setRoles([...roles, newRole]);
      setNewRole({ name: "", permissions: [] });
      setIsRoleModalOpen(false);
    }
  };

  // Toggle permission checkbox
  const handlePermissionToggle = (permission) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((perm) => perm !== permission)
        : [...prev.permissions, permission],
    }));
  };

  useEffect(() => {
    // Mock loading users from storage or API
    setUsers([
      { id: 1, full_name: "John Doe", email: "john@example.com", role: "Admin", status: "active" },
      { id: 2, full_name: "Jane Smith", email: "jane@example.com", role: "User", status: "inactive" },
    ]);
  }, []);

  return (
    <>
      <Box
        sx={{
          marginLeft: { xs: "0", sm: "240px" },
          padding: 2,
          width: { xs: "100%", sm: "82%" },
          height: "100vh",
          position: "relative",
        }}
      >
        <Paper elevation={24} sx={{ p: 2, borderRadius: 3 }}>
          <Box display="flex" justifyContent="space-between" my={2}>
            <Typography variant="h6">Roles</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsRoleModalOpen(true)}
            >
              Add Role
            </Button>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell>Permissions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role, index) => (
                <TableRow key={index}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.permissions.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Modal
          open={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card
            sx={{
              width: { xs: "90%", sm: 400 },
              p: 3,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", fontWeight: "bold" }}
              >
                Add New Role
              </Typography>

              <FormControl fullWidth error={!!roleErrors.name} sx={{ mb: 2 }}>
                <TextField
                  label="Role Name"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole((prev) => ({ ...prev, name: e.target.value }))
                  }
                  fullWidth
                />
                <FormHelperText>{roleErrors.name}</FormHelperText>
              </FormControl>

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Permissions:
              </Typography>
              {availablePermissions.map((permission) => (
                <FormControlLabel
                  key={permission}
                  control={
                    <Checkbox
                      checked={newRole.permissions.includes(permission)}
                      onChange={() => handlePermissionToggle(permission)}
                    />
                  }
                  label={permission}
                />
              ))}
              <FormHelperText sx={{ color: "red", mb: 2 }}>
                {roleErrors.permissions}
              </FormHelperText>

              <Box display="flex" justifyContent="space-between" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddRole}
                >
                  Add Role
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setIsRoleModalOpen(false)}
                >
                  Cancel
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Modal>
      </Box>
    </>
  );
};

export default Pooja;
