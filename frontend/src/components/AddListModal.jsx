import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { StateContext } from "@/context/stateContext";

const AddListModal = ({ open, onClose, boardId }) => {
  const { backend_url, accessToken } = useContext(StateContext);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${backend_url}/api/v1/workspace/createlist/${boardId}`,
        {
          title,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (res.data.success) {
        onClose();
        setTitle("");
      }
    } catch (err) {
      toast(err.response?.data?.message || "Failed to create list");
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
            placeholder="List title"
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create List"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddListModal;
