const express = require("express");
const { createTask, getMyTasks, getAllTasks, updateTask, deleteTask } = require("../controller/taskController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createTask);
router.get("/me", protect, getMyTasks);
router.get("/all", protect, authorize(["admin"]), getAllTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

module.exports = router;
