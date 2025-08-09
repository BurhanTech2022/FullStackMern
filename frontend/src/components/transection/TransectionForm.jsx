import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractErrorMessages } from "../util/errorUtils";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../../store/authStore";
import api from "../../lib/api/apiClient";
import { toast } from "sonner";
import { Cat } from "lucide-react";
// const CATEGORTY_TYPE = [
//   { value: "income", label: "income" },
//   { value: "expense", label: "expense" },
// ];
function TransectionForm({ open = true, onOpenChange, tranToEdit }) {
  const [validateError, setValidateError] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [editId, setEditId] = useState(null);
  // State for form values
  const [formValues, setFormValues] = useState({
    title: "",
    amount: "",
    category: "", // ✅ NEW
    categoryType: "expense",
    date: "",
  });

  useEffect(() => {
    if (tranToEdit) {
      setEditId(tranToEdit._id);
      setFormValues({
        title: tranToEdit.title,
        amount: tranToEdit.amount,
        category: tranToEdit.category.name,
        categoryType: tranToEdit.categoryType || "expense",
        date: "",
      });
    } else {
      setFormValues({
        title: "",
        amount: "",
        category: "",
        categoryType: "expense",
        date: "",
      });
    }
  }, [open, tranToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const clientQuery = useQueryClient();
  // mutation to create & submit the form
  const transectionMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await api.post("transection/create", userData);
      return response.data;
    },
    onSuccess: (data) => {
      clientQuery.invalidateQueries(["transections"]);
      console.log("user registered successfully", data);
      toast.success("Transaction created successfully");
      setValidateError(null); // clear any previous validateError

      setFormValues({
        title: "",
        amount: "",
        category: "",
        categoryType: "expense", // <- reset to default value
        date: "",
      });

      onOpenChange?.(false); // close modal if needed
    },
    onError: (error) => {
      toast.error("transection creating fail", error);
    },
  });

  // updateMutation
  const updateMutation = useMutation({
    mutationFn: async (userData) => {
      if (!tranToEdit || !tranToEdit._id) {
        throw new Error("No transaction selected for update");
      }
      const response = await api.put(
        `/transections/update/${tranToEdit._id}`,
        userData
      );
      return response.data;
    },
    onSuccess: (data) => {
      clientQuery.invalidateQueries(["transections"]);
      console.log("Transection updated successfully", data);
      toast.success("Transaction updated successfully");
      setValidateError(null); // clear any previous validateError

      setFormValues({
        title: "",
        amount: "",
        category: "",
        categoryType: "expense",
        date: "",
      });

      onOpenChange?.(false); // close modal if needed
    },
    onError: (validateError) => {
      toast.validateError("Transaction faild to update", validateError.message);
    },
  });

  // submit Form inta dhigo
  const handleSubmit = (e) => {
    e.preventDefault();
    // validate the inputs frist

    if (
      !formValues.title.trim() ||
      !formValues.amount ||
      !formValues.categoryType.trim() ||
      !formValues.category.trim()
    ) {
      setValidateError("All fields are required");
      return; // stop  mutation
    }
    if (formValues.amount < 0) {
      setValidateError("amount can not be negative");
      return;
    }

    const userData = {
      title: formValues.title.trim(),
      amount: Number(formValues.amount),
      categoryType: formValues.categoryType,
      category: formValues.category.trim(), // <--- Add this
    };

    if (tranToEdit) {
      updateMutation.mutate(userData);
    } else {
      transectionMutation.mutate(userData);
    }
  };

  const style = "text-gray-400 text-sm";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg">Create Transection</DialogTitle>
          <DialogDescription
            className={
              validateError
                ? "bg-destructive/10 text-destructive p-2 rounded-md"
                : ""
            }
          >
            {validateError ||
              "Fill in The Details below to create transections"}
          </DialogDescription>
        </DialogHeader>
        {/* inputs form */}
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className={style}>
              Title *
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formValues.title}
              onChange={handleInputChange}
              placeholder="Enter transaction title"
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className={style}>
              Amount *
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formValues.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
            />
          </div>

          {/* Category Type (Select) */}
          <div className="space-y-2">
            <Label htmlFor="categoryType" className={style}>
              Category Type *
            </Label>
            <Select
              value={formValues.categoryType}
              onValueChange={(value) =>
                setFormValues({ ...formValues, categoryType: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "income", label: "Income" },
                  { value: "expense", label: "Expense" },
                ].map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Name (Input) */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              name="category"
              type="text"
              value={formValues.category}
              onChange={handleInputChange}
              placeholder="e.g. Food, Salary, Rent"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" className="w-full">
              {isLoading ? "Creating..." : "Create Transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TransectionForm;
