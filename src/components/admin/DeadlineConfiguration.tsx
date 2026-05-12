import { useState } from "react";
import { Calendar, Clock, Save, Plus, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useDeadlines, type Deadline } from "@/hooks/useDeadlines";

export function DeadlineConfiguration() {
  const { deadlines, loading, addDeadline, toggleActive, deleteDeadline } = useDeadlines();
  const [isAdding, setIsAdding] = useState(false);
  const [newDeadline, setNewDeadline] = useState<Omit<Deadline, 'id'>>({
    name: "",
    projectType: "mini-project",
    academicYear: "2024-25",
    dueDate: "",
    isActive: true,
  });

  const handleAddDeadline = async () => {
    if (!newDeadline.name || !newDeadline.dueDate) {
      toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    const success = await addDeadline(newDeadline);
    if (success) {
      setIsAdding(false);
      setNewDeadline({ name: "", projectType: "mini-project", academicYear: "2024-25", dueDate: "", isActive: true });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getProjectTypeLabel = (pt: string) => {
    if (pt === 'mini-project') return 'Minor';
    if (pt === 'major-project') return 'Major';
    return 'Internship';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Deadline Configuration</CardTitle>
              <CardDescription>Manage submission deadlines for minor and major projects</CardDescription>
            </div>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Deadline
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add Deadline Form */}
          {isAdding && (
            <Card className="mb-6 border-dashed">
              <CardHeader><CardTitle className="text-lg">New Deadline</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="grid gap-2">
                    <Label>Deadline Name</Label>
                    <Input value={newDeadline.name} onChange={(e) => setNewDeadline({ ...newDeadline, name: e.target.value })} placeholder="e.g., Minor Project Final Submission" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Project Type</Label>
                    <Select value={newDeadline.projectType} onValueChange={(value: Deadline['projectType']) => setNewDeadline({ ...newDeadline, projectType: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mini-project">Minor Project (Sem 7)</SelectItem>
                        <SelectItem value="major-project">Major Project (Sem 8)</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Academic Year</Label>
                    <Select value={newDeadline.academicYear} onValueChange={(value) => setNewDeadline({ ...newDeadline, academicYear: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2025-26">2025-26</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Due Date</Label>
                    <Input type="date" value={newDeadline.dueDate} onChange={(e) => setNewDeadline({ ...newDeadline, dueDate: e.target.value })} />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button onClick={handleAddDeadline}>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Deadlines Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading deadlines...
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Project Type</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deadlines.map((deadline) => (
                    <TableRow key={deadline.id}>
                      <TableCell className="font-medium">{deadline.name}</TableCell>
                      <TableCell>
                        <Badge variant={deadline.projectType === 'major-project' ? 'default' : 'secondary'}>
                          {getProjectTypeLabel(deadline.projectType)}
                        </Badge>
                      </TableCell>
                      <TableCell>{deadline.academicYear}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(deadline.dueDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={deadline.isActive} onCheckedChange={() => toggleActive(deadline.id)} />
                          <span className={deadline.isActive ? 'text-success' : 'text-muted-foreground'}>
                            {deadline.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => deleteDeadline(deadline.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {deadlines.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No deadlines configured yet. Click "Add Deadline" to create one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Info Banner */}
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 p-4">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Grace Period Policy</p>
              <p className="text-sm text-muted-foreground">
                Students can still submit during the grace period, but their submission will be marked as "Late". 
                Faculty will be notified of late submissions during evaluation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
