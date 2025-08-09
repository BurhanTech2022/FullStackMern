import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Delete, SquarePen } from "lucide-react";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import api from "../../lib/api/apiClient";

export default function TransectionCard({
  transections,
  onEdit,
  isLoading,
}) {
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/transections/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["transections"]);
      toast.success("Transaction deleted successfully");
    },
    onError: (error) => {
      console.error("Error confirming delete", error);
      toast.error("Error deleting transaction: " + error.message);
    },
  });

  const handleDeleteClick = (tr) => {
    setTransactionToDelete(tr);
  };

  const handleDeleteConfirm = () => {
    if (transactionToDelete) {
      deleteMutation.mutate(transactionToDelete._id);
      setTransactionToDelete(null);
    }
  };

  if (!transections || transections.length === 0) {
    return <p className="text-yellow-800 p-4 ">No transactions found ....</p>;
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {transections.map((tr) => (
        <div
          key={tr._id}
          className="bg-card w-full sm:w-[48%] md:w-[30%] lg:w-1/4 p-6 rounded-lg shadow-lg border"
        >
          <p className="font-medium">{tr.title}</p>
          <p className="text-muted-foreground text-sm">{tr.category.name}</p>

          <div className="relative py-2">
            <div className="absolute top-2 right-2 flex gap-2">
              <button onClick={() => onEdit(tr)}>
                <SquarePen
                  size={16}
                  className="text-green-800 cursor-pointer"
                />
              </button>

              <button onClick={() => handleDeleteClick(tr)}>
                <Delete size={18} className="text-rose-800 cursor-pointer" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* One single AlertDialog outside the map */}
      <AlertDialog
        open={!!transactionToDelete}
        onOpenChange={()=>setTransactionToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="flex gap-2 text-red-400">
              This will permanently delete : {transactionToDelete?.title}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTransactionToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-rose-900"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
