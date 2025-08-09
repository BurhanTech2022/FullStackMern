
import z from 'zod'

export const createTransectionSchema = z.object ({
    title : z.string().min(1,'Title is required'),
    amount : z.number().positive()
   
})