import { useState } from "react";
import { useGetUsersByRole, useUpdateTravellerStatus, useUpdateGuideStatus, useUpdateHostStatus } from "@/hooks/UserManagementHooks";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Users, UserCheck, UserX, Shield, ShieldOff, CheckCircle, XCircle, AlertCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

export default function UserManagement() {
  const [selectedRole, setSelectedRole] = useState("traveller");
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalData, setModalData] = useState({
    email: "",
    currentStatus: false,
    role: "",
    title: "",
    message: ""
  });

  const { data: users = [], isLoading, error } = useGetUsersByRole(selectedRole);
  const updateTravellerStatusMutation = useUpdateTravellerStatus();
  const updateGuideStatusMutation = useUpdateGuideStatus();
  const updateHostStatusMutation = useUpdateHostStatus();

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, endIndex);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  const confirmStatusChange = (email, currentStatus, role) => {
    const newStatus = !currentStatus;
    let title, message;

    if (role === "traveller") {
      title = newStatus ? "Activate User Account" : "Deactivate User Account";
      message = newStatus 
        ? `Are you sure you want to activate the account for ${email}? This will restore all user privileges.`
        : `Are you sure you want to deactivate the account for ${email}? This will block all user privileges including guide and host access.`;
    } else if (role === "guide") {
      title = newStatus ? "Block Guide Privileges" : "Restore Guide Privileges";
      message = newStatus
        ? `Are you sure you want to block guide privileges for ${email}? This will prevent them from offering guide services.`
        : `Are you sure you want to restore guide privileges for ${email}? This will allow them to offer guide services again.`;
    } else if (role === "host") {
      title = newStatus ? "Block Host Privileges" : "Restore Host Privileges";
      message = newStatus
        ? `Are you sure you want to block host privileges for ${email}? This will prevent them from offering accommodation services.`
        : `Are you sure you want to restore host privileges for ${email}? This will allow them to offer accommodation services again.`;
    }

    // Set modal data and show modal
    setModalData({
      email,
      currentStatus,
      role,
      title,
      message
    });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    const { email, currentStatus, role } = modalData;
    const newStatus = !currentStatus;

    // Execute the appropriate mutation
    if (role === "traveller") {
      updateTravellerStatusMutation.mutate({
        email: email,
        isActive: newStatus,
      });
    } else if (role === "guide") {
      updateGuideStatusMutation.mutate({
        email: email,
        isBlocked: newStatus,
      });
    } else if (role === "host") {
      updateHostStatusMutation.mutate({
        email: email,
        isBlocked: newStatus,
      });
    }

    // Close modal
    setShowConfirmModal(false);
  };

  const handleCancelAction = () => {
    setShowConfirmModal(false);
    toast("Operation cancelled by user", {
      icon: "ℹ️",
      duration: 2000,
    });
  };

  const handleStatusToggle = (email, currentStatus) => {
    console.log("Toggle clicked:", { email, currentStatus, selectedRole });
    confirmStatusChange(email, currentStatus, selectedRole);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "traveller":
        return <Users className="w-4 h-4" />;
      case "guide":
        return <Shield className="w-4 h-4" />;
      case "host":
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "traveller":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "guide":
        return "bg-green-100 text-green-800 border-green-200";
      case "host":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getToggleLabel = (role, isBlocked, isActive) => {
    switch (role) {
      case "traveller":
        return isActive ? "Active Account" : "Inactive Account";
      case "guide":
        return isBlocked ? "Guide Blocked" : "Active Guide";
      case "host":
        return isBlocked ? "Host Blocked" : "Active Host";
      default:
        return isBlocked ? "Blocked" : "Active";
    }
  };

  const getToggleDescription = (role, isBlocked, isActive) => {
    switch (role) {
      case "traveller":
        return isActive ? "Click to deactivate account" : "Click to activate account";
      case "guide":
        return isBlocked ? "Click to restore guide privileges" : "Click to block guide privileges";
      case "host":
        return isBlocked ? "Click to restore host privileges" : "Click to block host privileges";
      default:
        return "Toggle user status";
    }
  };

  const getStatusColor = (role, isBlocked, isActive) => {
    switch (role) {
      case "traveller":
        return isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200";
      case "guide":
        return isBlocked ? "bg-red-100 text-red-800 border-red-200" : "bg-green-100 text-green-800 border-green-200";
      case "host":
        return isBlocked ? "bg-red-100 text-red-800 border-red-200" : "bg-green-100 text-green-800 border-green-200";
      default:
        return isBlocked ? "bg-red-100 text-red-800 border-red-200" : "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getStatusIcon = (role, isBlocked, isActive) => {
    switch (role) {
      case "traveller":
        return isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />;
      case "guide":
        return isBlocked ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />;
      case "host":
        return isBlocked ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />;
      default:
        return isBlocked ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D5016]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading users: {error.message}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#2D5016] mb-2">User Management</h2>
        <p className="text-[#8B4513]">Manage user accounts and permissions across the platform</p>
      </div>

      {/* Role Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0] p-6">
        <h3 className="text-lg font-semibold text-[#2D5016] mb-4">Filter by Role</h3>
        <div className="flex flex-wrap gap-3">
          {["traveller", "guide", "host"].map((role) => (
            <Button
              key={role}
              onClick={() => handleRoleChange(role)}
              variant={selectedRole === role ? "default" : "outline"}
              className={`capitalize ${
                selectedRole === role
                  ? "bg-gradient-to-r from-[#F68241] to-[#F3CA62] text-white border-0"
                  : "border-[#D4B5A0] text-[#8B4513] hover:bg-[#F68241]/10"
              }`}
            >
              {getRoleIcon(role)}
              <span className="ml-2">{role}s</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D4B5A0]">
          <h3 className="text-lg font-semibold text-[#2D5016]">
            {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}s ({users.length})
          </h3>
        </div>

        {currentUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-[#8B4513] text-lg">No {selectedRole}s found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F68241]/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                    Contact
                  </th>
                  {selectedRole === "guide" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                      Location
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4B5A0]">
                {currentUsers.map((user) => (
                  <tr key={user.email} className="hover:bg-[#F68241]/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#F68241] to-[#F3CA62] flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.firstName?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#2D5016]">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-[#8B4513]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#8B4513]">
                        {user.phoneNumber || "No phone number"}
                      </div>
                      {selectedRole === "traveller" && user.dob && (
                        <div className="text-sm text-[#8B4513]">
                          DOB: {new Date(user.dob).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    {selectedRole === "guide" && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#8B4513]">
                          {user.district}, {user.country}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={`${getStatusColor(
                          selectedRole, 
                          user.isBlocked, 
                          user.isActive
                        )} flex items-center gap-1`}
                      >
                        {getStatusIcon(selectedRole, user.isBlocked, user.isActive)}
                        {getToggleLabel(
                          selectedRole, 
                          user.isBlocked, 
                          user.isActive
                        )}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={
                              selectedRole === "traveller" 
                                ? user.isActive 
                                : !user.isBlocked
                            }
                            onCheckedChange={() => 
                              handleStatusToggle(
                                user.email,
                                selectedRole === "traveller" 
                                  ? user.isActive 
                                  : user.isBlocked
                              )
                            }
                            disabled={
                              selectedRole === "traveller" 
                                ? updateTravellerStatusMutation.isPending
                                : selectedRole === "guide"
                                ? updateGuideStatusMutation.isPending
                                : updateHostStatusMutation.isPending
                            }
                          />
                        </div>
                        <span className="text-xs text-[#8B4513]">
                          {getToggleDescription(
                            selectedRole, 
                            user.isBlocked, 
                            user.isActive
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#D4B5A0] flex items-center justify-between">
            <div className="text-sm text-[#8B4513]">
              Showing {startIndex + 1} to {Math.min(endIndex, users.length)} of {users.length} users
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-[#D4B5A0] text-[#8B4513] hover:bg-[#F68241]/10"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm text-[#8B4513]">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border-[#D4B5A0] text-[#8B4513] hover:bg-[#F68241]/10"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#2D5016]">
                {modalData.title}
              </h3>
            </div>
            
            <p className="text-[#8B4513] mb-6 leading-relaxed">
              {modalData.message}
            </p>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={handleConfirmAction}
                className="bg-[#F68241] hover:bg-[#F68241]/90 text-white px-6 py-2"
              >
                Confirm
              </Button>
              <Button
                onClick={handleCancelAction}
                variant="outline"
                className="border-[#D4B5A0] text-[#8B4513] hover:bg-[#F68241]/10 px-6 py-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
