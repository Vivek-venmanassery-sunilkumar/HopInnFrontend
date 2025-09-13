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
      <Card>
        <CardHeader>
          <CardTitle>KYC Verification</CardTitle>
          <CardDescription>
            Review and manage KYC applications from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={statusFilter} onValueChange={handleStatusChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Verified</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
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
                        <Card key={application.userId}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">User ID: {application.userId}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Status: {application.verificationStatus}
                                </p>
                                {application.rejectionReason && (
                                  <p className="text-sm text-destructive mt-1">
                                    Reason: {application.rejectionReason}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(application.verificationStatus)}
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(application.kycImageUrl, '_blank')}
                                >
                                  View Document
                                </Button>
                                {application.verificationStatus === 'pending' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      className="ml-2"
                                      onClick={() => handleApproveClick(application.userId)}
                                      disabled={approveMutation.isLoading || rejectMutation.isLoading}
                                    >
                                      {approveMutation.isLoading ? 'Approving...' : 'Approve'}
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="ml-2"
                                      onClick={() => handleRejectClick(application.userId)}
                                      disabled={approveMutation.isLoading || rejectMutation.isLoading}
                                    >
                                      {rejectMutation.isLoading ? 'Rejecting...' : 'Reject'}
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {/* Pagination Controls */}
                      {data && data.totalCount > 10 && (
                        <div className="flex justify-between items-center mt-6">
                          <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                          >
                            Previous
                          </Button>
                          
                          <span className="text-sm text-muted-foreground">
                            Page {data.page} of {Math.ceil(data.totalCount / 10)}
                          </span>
                          
                          <Button
                            variant="outline"
                            disabled={currentPage >= Math.ceil(data.totalCount / 10)}
                            onClick={() => setCurrentPage(currentPage + 1)}
                          >
                            Next
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