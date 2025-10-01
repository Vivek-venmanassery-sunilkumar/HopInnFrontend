import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    Search, 
    MoreVertical, 
    UserCheck, 
    UserX, 
    Mail, 
    Phone,
    Calendar,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    Home,
    Compass,
    User,
    Loader2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    useTravellers,
    useGuides,
    useHosts,
    useDeactivateTraveller,
    useRemoveHostPrivileges,
    useRemoveGuidePrivileges,
    useReactivateTraveller,
    useReinstateHostPrivileges,
    useReinstateGuidePrivileges
} from '@/hooks/AdminUserManagementHooks';

export default function UserManagementTab() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');

    // API hooks
    const { data: travellersData, isLoading: travellersLoading, error: travellersError } = useTravellers();
    const { data: guidesData, isLoading: guidesLoading, error: guidesError } = useGuides();
    const { data: hostsData, isLoading: hostsLoading, error: hostsError } = useHosts();

    // Mutation hooks
    const deactivateTravellerMutation = useDeactivateTraveller();
    const removeHostPrivilegesMutation = useRemoveHostPrivileges();
    const removeGuidePrivilegesMutation = useRemoveGuidePrivileges();
    const reactivateTravellerMutation = useReactivateTraveller();
    const reinstateHostPrivilegesMutation = useReinstateHostPrivileges();
    const reinstateGuidePrivilegesMutation = useReinstateGuidePrivileges();

    // Get users based on selected role
    const getUsersByRole = () => {
        switch (selectedRole) {
            case 'travellers':
                return travellersData?.users || [];
            case 'guides':
                return guidesData?.users || [];
            case 'hosts':
                return hostsData?.users || [];
            default:
                return [];
        }
    };

    // Filter users based on search term
    const filteredUsers = getUsersByRole().filter(user => 
        searchTerm === '' || 
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Loading state
    const isLoading = selectedRole === 'travellers' ? travellersLoading : 
                     selectedRole === 'guides' ? guidesLoading : 
                     selectedRole === 'hosts' ? hostsLoading : false;


    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'suspended':
                return 'bg-red-100 text-red-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleUserAction = (userId, action) => {
        console.log(`Action ${action} for user ${userId}`);
        // Implement actual API calls here
    };

    const handleDeactivateTraveller = (userId) => {
        deactivateTravellerMutation.mutate(userId);
    };

    const handleRemoveHostPrivileges = (userId) => {
        removeHostPrivilegesMutation.mutate(userId);
    };

    const handleRemoveGuidePrivileges = (userId) => {
        removeGuidePrivilegesMutation.mutate(userId);
    };

    const handleReactivateTraveller = (userId) => {
        reactivateTravellerMutation.mutate(userId);
    };

    const handleReinstateHostPrivileges = (userId) => {
        reinstateHostPrivilegesMutation.mutate(userId);
    };

    const handleReinstateGuidePrivileges = (userId) => {
        reinstateGuidePrivilegesMutation.mutate(userId);
    };

    const renderUserCard = (user, roleSpecificAction, reactivationAction) => (
        <div
            key={user.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-[#F68241] to-[#F3CA62] rounded-full flex items-center justify-center text-white font-semibold">
                    {user.firstName?.[0] || 'U'}{user.lastName?.[0] || ''}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                            {user.firstName || 'Unknown'} {user.lastName || ''}
                        </h3>
                        {user.isVerified && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phoneNumber || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'Unknown'}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Badge className={getStatusBadgeColor(user.status || 'pending')}>
                    {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Pending'}
                </Badge>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, 'view')}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, 'edit')}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                        </DropdownMenuItem>
                        {roleSpecificAction && (
                            <DropdownMenuItem 
                                onClick={() => roleSpecificAction(user.id)}
                                className="text-red-600"
                            >
                                {roleSpecificAction === handleDeactivateTraveller && <UserX className="h-4 w-4 mr-2" />}
                                {roleSpecificAction === handleRemoveHostPrivileges && <Home className="h-4 w-4 mr-2" />}
                                {roleSpecificAction === handleRemoveGuidePrivileges && <Compass className="h-4 w-4 mr-2" />}
                                {roleSpecificAction === handleDeactivateTraveller && 'Deactivate Account'}
                                {roleSpecificAction === handleRemoveHostPrivileges && 'Remove Host Privileges'}
                                {roleSpecificAction === handleRemoveGuidePrivileges && 'Remove Guide Privileges'}
                            </DropdownMenuItem>
                        )}
                        {reactivationAction && (
                            <DropdownMenuItem 
                                onClick={() => reactivationAction(user.id)}
                                className="text-green-600"
                            >
                                {reactivationAction === handleReactivateTraveller && <UserCheck className="h-4 w-4 mr-2" />}
                                {reactivationAction === handleReinstateHostPrivileges && <Home className="h-4 w-4 mr-2" />}
                                {reactivationAction === handleReinstateGuidePrivileges && <Compass className="h-4 w-4 mr-2" />}
                                {reactivationAction === handleReactivateTraveller && 'Reactivate Account'}
                                {reactivationAction === handleReinstateHostPrivileges && 'Reinstate Host Privileges'}
                                {reactivationAction === handleReinstateGuidePrivileges && 'Reinstate Guide Privileges'}
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D5016]"></div>
                <span className="ml-2 text-[#8B4513]">Loading users...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#2D5016]">User Management</h2>
            </div>

            {/* Search and Role Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                    >
                        <option value="all">Select Role</option>
                        <option value="travellers">Travellers</option>
                        <option value="guides">Guides</option>
                        <option value="hosts">Hosts</option>
                    </select>
                </div>
            </div>

            {/* Users List based on selected role */}
            {selectedRole === 'all' ? (
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center text-gray-500">
                            <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>Please select a role to view users</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {selectedRole === 'travellers' && <User className="h-5 w-5 text-blue-600" />}
                            {selectedRole === 'guides' && <Compass className="h-5 w-5 text-green-600" />}
                            {selectedRole === 'hosts' && <Home className="h-5 w-5 text-orange-600" />}
                            {selectedRole === 'travellers' && 'Travellers'}
                            {selectedRole === 'guides' && 'Guides'}
                            {selectedRole === 'hosts' && 'Hosts'}
                            ({filteredUsers.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-[#2D5016]" />
                                <span className="ml-2 text-[#8B4513]">Loading users...</span>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No {selectedRole} found.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredUsers.map(user => {
                                    let roleSpecificAction = null;
                                    let reactivationAction = null;
                                    
                                    if (selectedRole === 'travellers') {
                                        // Show deactivate if active, reactivate if inactive
                                        if (user.isActive !== false) {
                                            roleSpecificAction = handleDeactivateTraveller;
                                        } else {
                                            reactivationAction = handleReactivateTraveller;
                                        }
                                    } else if (selectedRole === 'hosts') {
                                        // Show remove privileges if not blocked, reinstate if blocked
                                        if (user.isHostBlocked !== true) {
                                            roleSpecificAction = handleRemoveHostPrivileges;
                                        } else {
                                            reactivationAction = handleReinstateHostPrivileges;
                                        }
                                    } else if (selectedRole === 'guides') {
                                        // Show remove privileges if not blocked, reinstate if blocked
                                        if (user.isGuideBlocked !== true) {
                                            roleSpecificAction = handleRemoveGuidePrivileges;
                                        } else {
                                            reactivationAction = handleReinstateGuidePrivileges;
                                        }
                                    }
                                    
                                    return renderUserCard(user, roleSpecificAction, reactivationAction);
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
