import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function AdminSideKyc() {
    const [statusFilter, setStatusFilter] = useState('pending')
    
    // Mock data - in a real app, this would come from an API
    const kycApplications = [
        { id: 1, name: 'John Doe', submitted: '2023-04-15', status: 'pending' },
        { id: 2, name: 'Jane Smith', submitted: '2023-04-14', status: 'pending' },
        { id: 3, name: 'Robert Johnson', submitted: '2023-04-10', status: 'verified' },
        { id: 4, name: 'Sarah Williams', submitted: '2023-04-05', status: 'unverified' },
        { id: 5, name: 'Michael Brown', submitted: '2023-04-01', status: 'verified' },
    ]

    const filteredApplications = kycApplications.filter(app => app.status === statusFilter)

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>
            case 'verified':
                return <Badge variant="success">Verified</Badge>
            case 'unverified':
                return <Badge variant="destructive">Unverified</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>KYC Verification</CardTitle>
                <CardDescription>
                    Review and manage KYC applications from users
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="verified">Verified</TabsTrigger>
                        <TabsTrigger value="unverified">Unverified</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value={statusFilter}>
                        <div className="space-y-4">
                            {filteredApplications.length === 0 ? (
                                <p className="text-center py-6 text-muted-foreground">
                                    No {statusFilter} KYC applications found.
                                </p>
                            ) : (
                                filteredApplications.map((application) => (
                                    <Card key={application.id}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-medium">{application.name}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        Submitted: {application.submitted}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(application.status)}
                                                    <Button variant="outline" size="sm">
                                                        View PDF
                                                    </Button>
                                                    {application.status === 'pending' && (
                                                        <>
                                                            <Button size="sm" className="ml-2">
                                                                Approve
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="ml-2">
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}