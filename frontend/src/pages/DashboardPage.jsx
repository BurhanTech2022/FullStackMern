import DashboarHeader from "../components/auth/DashboarHeader";
import TransectionForm from "../components/transection/TransectionForm";
import DashboardWelcome from "../components/DashboardWelcome";
import { useState } from "react";
import TransectionList from "../components/transection/TransectionList";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import api from "../lib/api/apiClient";

function Dashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingForm(null);
  };

  const handleCreateTransection = () => {
    setShowCreateForm(true);
    setEditingForm(null);
    console.log('woooo');
    
  };

  const transectionQuery =useQuery({
    queryKey:['transections'],
    queryFn :async()=>{
      const response = await api.get('/transections/get')
      return response.data;
    },
    retry:1,
  })

  if(transectionQuery.isError){
    return(
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">Error loading"{transectionQuery.error.message}</p>
      </div>
    )
  }

  if(transectionQuery.isLoading){
    return(
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin"/>
      </div>
    )
  }

 
 
   
  //  delete
   const handleEditTransection =(transId) =>{
    setEditingForm(transId)
    setShowCreateForm(true)
   console.log(transId, 'maxaa ku jira');
   }
   
   
  return (
    <div className="min-h-screen bg-background">
      {/* dashboardHeader */}
      <DashboarHeader />
      {/* Welcome Header */}
      <DashboardWelcome
        showCreateForm={showCreateForm}
        onCreate={handleCreateTransection}
      />
      {/* Main */}
      <main className="mx-2">
       {/* transection list to display */}
      <TransectionList
       transections={transectionQuery.data.transactions || []}
      isLoading ={transectionQuery.isLoading}
      onEdit ={handleEditTransection}
      
      />
      {/* transectionForm */}
      <TransectionForm
        open={showCreateForm || !!editingForm}
        onOpenChange={handleFormClose}
        tranToEdit ={editingForm}
      />
      </main>
     
    </div>
  );
}

export default Dashboard;
