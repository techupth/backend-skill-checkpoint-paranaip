import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const questionsRouter = Router();

//requirement 1: ผู้ใช้งานสามารถสร้างคำถามได้
questionsRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("questions");

    const questionData = {
      ...req.body,
      created_at: new Date(),
    };

    const newQuestion = await collection.insertOne(questionData);

    return res.status(200).json({
      message: `Question (id: ${newQuestion.insertedId}) has been created successfully`,
      data: questionData,
      status: 200,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

//requirement 2: ผู้ใช้งานสามารถที่จะดูคำถามทั้งหมดได้
questionsRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("questions");

    const questions = await collection.find().toArray();

    return res.status(200).json({
      data: questions,
      status: 200,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

//requirement 3: ผู้ใช้งานสามารถที่จะดูคำถามแต่ละอันได้ ด้วย Id ของคำถามได้
questionsRouter.get("/:questionId", async (req, res) => {
  try {
    const collection = db.collection("questions");

    const questionId = new ObjectId(req.params.questionId);

    const questionById = await collection.findOne({ _id: questionId });

    return res.json({
      data: questionById,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

//requirement 4: ผู้ใช้งานสามารถที่จะแก้ไขหัวข้อ หรือคำอธิบายของคำถามได้
questionsRouter.put("/:questionId", async (req, res) => {
  try {
    const collection = db.collection("questions");

    const newQuestionData = { ...req.body, modified_at: new Date() };

    const questionId = new ObjectId(req.params.questionId);

    await collection.updateOne(
      {
        _id: questionId,
      },
      {
        $set: newQuestionData,
      }
    );

    return res.status(200).json({
      message: `Question (Id: ${questionId}) has been updated successfully`,
      data: newQuestionData,
      status: 200,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

////requirement 5: ผู้ใช้งานสามารถที่จะลบคำถามได้
questionsRouter.delete("/:questionId", async (req, res) => {
  try {
    const collection = db.collection("questions");

    const questionId = new ObjectId(req.params.questionId);

    await collection.deleteOne({
      _id: questionId,
    });

    return res.status(200).json({
      message: `Question (Id: ${questionId}) has been deleted successfully`,
      status: 200,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

export default questionsRouter;
