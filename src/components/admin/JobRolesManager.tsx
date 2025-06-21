
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import {
  useAllJobRoles,
  useCreateJobRole,
  useUpdateJobRole,
  useDeleteJobRole,
  JobRole,
} from "@/hooks/useJobRoles";

const JobRolesManager = () => {
  const { data: jobRoles, isLoading } = useAllJobRoles();
  const createJobRole = useCreateJobRole();
  const updateJobRole = useUpdateJobRole();
  const deleteJobRole = useDeleteJobRole();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<JobRole>>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    value: "",
    label: "",
    is_active: true,
    sort_order: 0,
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createForm.value || !createForm.label) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createJobRole.mutateAsync(createForm);
      toast({
        title: "Job Role Created",
        description: "The job role has been successfully created.",
      });
      setCreateForm({ value: "", label: "", is_active: true, sort_order: 0 });
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (jobRole: JobRole) => {
    setEditingId(jobRole.id);
    setEditForm(jobRole);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editForm.value || !editForm.label) return;

    try {
      await updateJobRole.mutateAsync({ id: editingId, ...editForm });
      toast({
        title: "Job Role Updated",
        description: "The job role has been successfully updated.",
      });
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this job role?")) {
      try {
        await deleteJobRole.mutateAsync(id);
        toast({
          title: "Job Role Deleted",
          description: "The job role has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete job role. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Job Roles Management</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Job Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Job Role</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="create-value">Value (unique identifier)</Label>
                  <Input
                    id="create-value"
                    value={createForm.value}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, value: e.target.value })
                    }
                    placeholder="e.g., software_engineer"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="create-label">Display Label</Label>
                  <Input
                    id="create-label"
                    value={createForm.label}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, label: e.target.value })
                    }
                    placeholder="e.g., Software Engineer"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="create-sort">Sort Order</Label>
                  <Input
                    id="create-sort"
                    type="number"
                    value={createForm.sort_order}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, sort_order: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="create-active"
                    checked={createForm.is_active}
                    onCheckedChange={(checked) =>
                      setCreateForm({ ...createForm, is_active: checked })
                    }
                  />
                  <Label htmlFor="create-active">Active</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createJobRole.isPending}>
                    {createJobRole.isPending ? "Creating..." : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Value</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobRoles?.map((jobRole) => (
              <TableRow key={jobRole.id}>
                <TableCell>
                  {editingId === jobRole.id ? (
                    <Input
                      value={editForm.value || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, value: e.target.value })
                      }
                      className="h-8"
                    />
                  ) : (
                    jobRole.value
                  )}
                </TableCell>
                <TableCell>
                  {editingId === jobRole.id ? (
                    <Input
                      value={editForm.label || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, label: e.target.value })
                      }
                      className="h-8"
                    />
                  ) : (
                    jobRole.label
                  )}
                </TableCell>
                <TableCell>
                  {editingId === jobRole.id ? (
                    <Input
                      type="number"
                      value={editForm.sort_order || 0}
                      onChange={(e) =>
                        setEditForm({ ...editForm, sort_order: parseInt(e.target.value) || 0 })
                      }
                      className="h-8 w-20"
                    />
                  ) : (
                    jobRole.sort_order
                  )}
                </TableCell>
                <TableCell>
                  {editingId === jobRole.id ? (
                    <Switch
                      checked={editForm.is_active ?? false}
                      onCheckedChange={(checked) =>
                        setEditForm({ ...editForm, is_active: checked })
                      }
                    />
                  ) : (
                    <span className={jobRole.is_active ? "text-green-600" : "text-red-600"}>
                      {jobRole.is_active ? "Active" : "Inactive"}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {editingId === jobRole.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          disabled={updateJobRole.isPending}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(jobRole)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(jobRole.id)}
                          disabled={deleteJobRole.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default JobRolesManager;
