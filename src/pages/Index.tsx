import { useState } from "react";
import { Search, BookOpen, Clock, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookRequest {
  id: string;
  title: string;
  author: string;
  status: "pending" | "in-transit" | "ready";
  pickupLocation: string;
  requestedAt: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRequests] = useState<BookRequest[]>([
    {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      status: "in-transit",
      pickupLocation: "Front Desk",
      requestedAt: "10 mins ago"
    },
    {
      id: "2",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      status: "ready",
      pickupLocation: "Front Desk",
      requestedAt: "25 mins ago"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning text-warning-foreground";
      case "in-transit":
        return "bg-primary text-primary-foreground";
      case "ready":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Processing";
      case "in-transit":
        return "LUNA is retrieving";
      case "ready":
        return "Ready for pickup";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-6 py-8 pb-12 rounded-b-3xl shadow-lg">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8" />
            <h1 className="text-3xl font-bold">LUNA</h1>
          </div>
          <p className="text-primary-foreground/90 text-sm">Library Utility & Navigation Assistant</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 -mt-6">
        {/* Search Bar */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base border-0 focus-visible:ring-0 bg-muted/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button variant="outline" className="h-24 flex flex-col gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-sm font-medium">Browse Catalog</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2">
            <Clock className="h-6 w-6" />
            <span className="text-sm font-medium">My History</span>
          </Button>
        </div>

        {/* Active Requests */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Active Requests</h2>
          
          {activeRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No active requests</p>
                <p className="text-sm text-muted-foreground mt-1">Search for a book to get started</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base mb-1">{request.title}</CardTitle>
                        <CardDescription className="text-sm">{request.author}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusText(request.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{request.pickupLocation}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{request.requestedAt}</span>
                      </div>
                    </div>
                    {request.status === "ready" && (
                      <Button className="w-full mt-4 bg-accent hover:bg-accent/90">
                        View Pickup Details
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="bg-primary/10 rounded-full p-3 h-fit">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-foreground">How LUNA Works</h3>
                <p className="text-sm text-muted-foreground">
                  Search for any book in our catalog and request it. LUNA will navigate to the shelf, 
                  and a librarian will place it in the robot's basket. You'll get notified when it's ready at the front desk!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
