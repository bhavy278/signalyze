import { UserModel } from "../models/user.model";
import mongoose from "mongoose";

export const attachDocumentToUser = async (
  userId: mongoose.Types.ObjectId,
  documentId: mongoose.Types.ObjectId
) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: { documents: new mongoose.Types.ObjectId(documentId) },
      },
      { new: true } // return updated user
    );

    return updatedUser;
  } catch (error) {
    console.error("Error attaching document to user:", error);
    throw error;
  }
};
