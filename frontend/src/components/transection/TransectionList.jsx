import { useState } from "react";
import {
  BadgeDollarSign,
  BanknoteArrowDown,
  Landmark,
  Search,
} from "lucide-react";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PiChart from "../../components/charts/PiChart";
import { Input } from "@/components/ui/input";
import TransectionCard from "./TransectionCard";

function TransectionList({
  transections = [],
  isLoading = false,
  onEdit,
  onDelete,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate stats
  const getAllStatus = () => {
    const totalTransactions = transections.length;
    const totalIncome = transections
      .filter((tr) => tr.categoryType === "income")
      .reduce((acc, tr) => acc + tr.amount, 0);

    const totalExpense = transections
      .filter((tr) => tr.categoryType === "expense")
      .reduce((acc, tr) => acc + tr.amount, 0);

    const blances = totalIncome - totalExpense;
    return { totalTransactions, totalIncome, totalExpense, blances };
  };

  const stats = getAllStatus();

  // Filter transactions based on tab and search
  const filteredTransections = transections.filter((transection) => {
    const matchTab =
      activeTab === "all" || transection.categoryType === activeTab;
    const matchSearch = transection.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  if (isLoading) {
    return <div className="p-4">Loading transactions...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-2">
        {/* Transactions */}
        <div className="bg-card rounded-lg border shadow-sm p-4 h-[120px]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">
              Transactions
            </p>
            <Landmark className="h-4 w-4" />
          </div>
          <p className="text-xl font-bold">{stats.totalTransactions}</p>
        </div>

        {/* Income */}
        <div className="bg-card rounded-lg border shadow-sm p-4 h-[120px]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Income</p>
            <BanknoteArrowDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-base font-semibold text-green-500">
            ${stats.totalIncome}
          </p>
        </div>

        {/* Expenses */}
        <div className="bg-card rounded-lg border shadow-sm p-4 h-[120px]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">
              Expenses
            </p>
            <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-base font-semibold text-red-500">
            ${stats.totalExpense}
          </p>
        </div>

        {/* Chart */}
        <div >
          <PiChart income={stats.totalIncome} expense={stats.totalExpense} />
        </div>
      </div>

      {/* Search + Tabs */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search input */}
        <div className="relative flex max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {["all", "income", "expense"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium px-4 py-1.5 rounded-md border transition ${
                activeTab === tab
                  ? "bg-primary text-white border-primary"
                  : "bg-muted text-muted-foreground border-transparent"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Filtered Transaction Cards */}
      <TransectionCard
        transections={filteredTransections}
        onEdit={onEdit}
        onDelete={onDelete}
        isLoading={isLoading}
      />
    </div>
  );
}

export default TransectionList;
