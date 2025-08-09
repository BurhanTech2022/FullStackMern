import { useMutation, useQueryClient } from '@tanstack/react-query'
import {useState} from 'react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const cretaTransection = async(newTransection)=>{
    const response = await fetch('http://localhost:4000/api/transection/create',{
        method: "POST",
        headers :{'content-type' :'application/json'},
        body: JSON.stringify(newTransection),
    })
     if(!response) throw new Error('failed to created new transection')
        return response.json()
}
function Task() {
   
    const [task, setTask] = useState('')


    const queryClient = useQueryClient()
    // mutation function here as transection is creating
     const mutation = useMutation({
        mutationFn : cretaTransection,
        onSuccess: (data)=>{
         console.log('transection created ',data);
          queryClient.invalidateQueries({queryKey:['transections']})
         
        }
     })

     const handleAdd =()=>{
      mutation.mutate({
        title: task,
      })
      setTask('')
     }
  return (
    <div>
        <Input value ={task}
        onChange={(e)=>setTask(e.target.value)}
        className ="w-10px"
        ></Input>
        <Button onClick={handleAdd}
        variant ={'default'}
        className ="cursor-pointer"
        >Add Transection</Button>
    </div>
  )
}

export default Task