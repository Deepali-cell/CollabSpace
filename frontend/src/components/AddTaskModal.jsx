import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { StateContext } from "@/context/stateContext";

const AddTaskModal = ({ open, onClose, boardId }) => {
  const { accessToken, backend_url } = useContext(StateContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [listId, setListId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${backend_url}/api/v1/workspace/createtask/${boardId}`,
        {
          title,
          description,
          listId,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (res.data.success) {
        onClose();
        setTitle("");
        setDescription("");
        setListId(null);
      }
    } catch (err) {
      toast(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
          />

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
