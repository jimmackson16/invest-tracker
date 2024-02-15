'use server'
import { connectToDatabase } from "../database"
import { handleError } from "../utils"
import User from "../database/models/user.model"
import { revalidatePath } from "next/cache"
import { CreateInvestmentParams } from "@/types"
import Investment from "../database/models/investment.model"

export const createEvent = async ({investment, userEmail, path}:CreateInvestmentParams)=>{
    try {
        await connectToDatabase


        const investor = await User.findOne({email:userEmail})

        if (!investor){throw new Error('Organizer not found')}

        const newInvestment = await Investment.create(
            {
            ...investment, 
            user: investor._id
            })
        revalidatePath(path)

        return JSON.parse(JSON.stringify(newInvestment))
        
    } catch (error) {
        handleError(error)
    }
}