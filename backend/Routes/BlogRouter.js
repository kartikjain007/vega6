const express = require("express");
const Blog = require("../Models/Blog");
const router = express.Router();

router.post("/blogs", async (req, res) => {
  const { title, description } = req.body;
  try {
    const blog = new Blog({ title, description });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/blogs/:id", async (req, res) => {
  const { title, description } = req.body;
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/blogs/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
