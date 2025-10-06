import { useState } from "react";
import { useGetKycDetailsAdmin, useApproveKyc, useRejectKyc } from "@/hooks/KycHooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  User, 
  Mail,
  FileText,
  AlertTriangle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export default function AdminSideKyc() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingUserId, setRejectingUserId] = useState(null);
  const [approvingUserId, setApprovingUserId] = useState(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);

  const { data, isLoading, error } = useGetKycDetailsAdmin({
    status: statusFilter,
    page: currentPage
  });

  const approveMutation = useApproveKyc(statusFilter, currentPage);
  const rejectMutation = useRejectKyc(statusFilter, currentPage);

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
  };

  const handleApproveClick = (userId) => {
    setApprovingUserId(userId);
    setIsApproveDialogOpen(true);
  };

  const handleConfirmApprove = () => {
    if (approvingUserId) {
      approveMutation.mutate({userId: approvingUserId}, {
        onSuccess: () => {
          setIsApproveDialogOpen(false);
          setApprovingUserId(null);
        }
      });
    }
  };

  const handleRejectClick = (userId) => {
    setRejectingUserId(userId);
    setRejectionReason('');
    setIsRejectDialogOpen(true);
  };

  const handleConfirmReject = () => {
    if (rejectingUserId && rejectionReason.trim()) {
      rejectMutation.mutate(
        { 
          userId: rejectingUserId, 
          rejectionReason: rejectionReason.trim() 
        },
        {
          onSuccess: () => {
            setIsRejectDialogOpen(false);
            setRejectingUserId(null);
            setRejectionReason('');
          }
        }
      );
    }
  };

  const handleCancelReject = () => {
    setIsRejectDialogOpen(false);
    setRejectingUserId(null);
    setRejectionReason('');
  };

  const handleCancelApprove = () => {
    setIsApproveDialogOpen(false);
    setApprovingUserId(null);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'accepted':
        return <Badge variant="success">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            Error loading KYC applications: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Pending Reviews</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {data?.data?.filter(app => app.verificationStatus === 'pending').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Verified Users</p>
                  <p className="text-2xl font-bold text-green-900">
                    {data?.data?.filter(app => app.verificationStatus === 'accepted').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">Rejected Applications</p>
                  <p className="text-2xl font-bold text-red-900">
                    {data?.data?.filter(app => app.verificationStatus === 'rejected').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <Tabs value={statusFilter} onValueChange={handleStatusChange}>
            <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="pending" 
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Clock className="h-4 w-4 mr-2" />
                Pending
              </TabsTrigger>
              <TabsTrigger 
                value="accepted"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Verified
              </TabsTrigger>
              <TabsTrigger 
                value="rejected"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejected
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={statusFilter}>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-8 w-20" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {data?.data?.length === 0 ? (
                    <p className="text-center py-6 text-muted-foreground">
                      No {statusFilter} KYC applications found.
                    </p>
                  ) : (
                    <>
                      {data?.data?.map((application) => (
                        <Card key={application.userId} className="hover:shadow-md transition-shadow border-l-4 border-l-[#2D5016]">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="p-2 bg-gray-100 rounded-full">
                                    <User className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-lg text-gray-900">
                                      {application.firstName} {application.lastName || ''}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <Mail className="h-4 w-4" />
                                      {application.email}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 mb-3">
                                  {getStatusBadge(application.verificationStatus)}
                                  <span className="text-xs text-gray-500">
                                    Submitted {new Date(application.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                
                                {application.rejectionReason && (
                                  <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                                      <p className="text-sm text-red-700">{application.rejectionReason}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex flex-col gap-3 ml-4">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(application.kycImageUrl, '_blank')}
                                  className="flex items-center gap-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Document
                                </Button>
                                
                                {application.verificationStatus === 'pending' && (
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleApproveClick(application.userId)}
                                      disabled={approveMutation.isLoading || rejectMutation.isLoading}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      {approveMutation.isLoading ? 'Approving...' : 'Approve'}
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => handleRejectClick(application.userId)}
                                      disabled={approveMutation.isLoading || rejectMutation.isLoading}
                                      className="border-red-300 text-red-600 hover:bg-red-50"
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      {rejectMutation.isLoading ? 'Rejecting...' : 'Reject'}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {/* Pagination Controls */}
                      {data && data.totalCount > 10 && (
                        <div className="flex justify-between items-center mt-8 p-4 bg-gray-50 rounded-lg">
                          <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="flex items-center gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            Previous
                          </Button>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">
                              Page {data.page} of {Math.ceil(data.totalCount / 10)}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({data.totalCount} total applications)
                            </span>
                          </div>
                          
                          <Button
                            variant="outline"
                            disabled={currentPage >= Math.ceil(data.totalCount / 10)}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="flex items-center gap-2"
                          >
                            Next
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve KYC Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this KYC application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelApprove}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmApprove}
              disabled={approveMutation.isLoading}
            >
              {approveMutation.isLoading ? 'Approving...' : 'Approve'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject KYC Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this KYC application.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rejectionReason">Rejection Reason</Label>
              <Input
                id="rejectionReason"
                placeholder="Enter reason for rejection"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                disabled={rejectMutation.isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleCancelReject}
              disabled={rejectMutation.isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmReject}
              disabled={!rejectionReason.trim() || rejectMutation.isLoading}
            >
              {rejectMutation.isLoading ? 'Rejecting...' : 'Confirm Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}