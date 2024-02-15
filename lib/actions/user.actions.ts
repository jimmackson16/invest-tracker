'use server'

import { CreateUserParams, UpdateUserParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import User from "../database/models/user.model"
import { revalidatePath } from "next/cache"
import Investment from "../database/models/investment.model"



export const createUser = async (user:CreateUserParams) => {
    try {
      await connectToDatabase();

      const newUser = await User.create(user);
      

      // get a javascript object of the user
      return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
      handleError(error)
    }
}

export async function getUserById(userId: string) {
    try {
      await connectToDatabase()
  
      const user = await User.findById(userId)
      .populate({ path: 'investments', model: Investment })
  
      if (!user) throw new Error('User not found')
      return JSON.parse(JSON.stringify(user))
    } catch (error) {
      handleError(error)
    }
  }

export async function updateUser(clerkId: string, user: UpdateUserParams) {
    try {
      await connectToDatabase()
  
      const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })
  
      if (!updatedUser) throw new Error('User update failed')
      return JSON.parse(JSON.stringify(updatedUser))
    } catch (error) {
      handleError(error)
    }
  }
  
  export async function deleteUser(clerkId: string) {
    try {
      await connectToDatabase()
  
      // Find user to delete
      const userToDelete = await User.findOne({ clerkId })
  
      if (!userToDelete) {
        throw new Error('User not found')
      }
  
      // Unlink relationships
      await Promise.all([
        // Update the 'events' collection to remove references to the user
        Investment.updateMany(
          { _id: { $in: userToDelete.investments } },
        )
      ])
  
      // Delete user
      const deletedUser = await User.findByIdAndDelete(userToDelete._id)
      revalidatePath('/')
  
      return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
    } catch (error) {
      handleError(error)
    }
  }