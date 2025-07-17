const Task = require("../models/Task");


exports.createTask = async(req, res)=> {
    const task = await Task.create({...req.body, owner: req.user.id});
    res.json(task);
};

//GET/API/tasks/me
exports.getMyTasks = async (req,res) => {
    const tasks = await Task.find({owner: req.user.id});
    res.json(tasks);
};

//GET/api/tasks/all
exports.getAllTasks = async (req, res) => {
    const tasks= await Task.find().populate("owner", "email");
    res.json(tasks);
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ 
            _id: req.params.id, 
            owner: req.user.id 
        });
        
        if (!task) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }
        
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Delete task error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!task) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }
        
        res.json(task);
    } catch (error) {
        console.error("Update task error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
