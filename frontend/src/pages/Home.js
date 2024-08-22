import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleSuccess } from "../util";

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", description: "" });
  const [editBlogId, setEditBlogId] = useState(null);
  const [expandedBlogId, setExpandedBlogId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/blogs");
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs", error);
    }
  };

  const handleCreateBlog = async () => {
    try {
      await axios.post("http://localhost:8000/api/blogs", newBlog);
      fetchBlogs();
      setNewBlog({ title: "", description: "" });
    } catch (error) {
      console.error("Error creating blog", error);
    }
  };

  const handleEditBlog = (id) => {
    const blog = blogs.find((blog) => blog._id === id);
    setNewBlog({ title: blog.title, description: blog.description });
    setEditBlogId(id);
  };

  const handleUpdateBlog = async () => {
    try {
      await axios.put(`http://localhost:8000/api/blogs/${editBlogId}`, newBlog);
      fetchBlogs();
      setNewBlog({ title: "", description: "" });
      setEditBlogId(null);
    } catch (error) {
      console.error("Error updating blog", error);
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/blogs/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User Logged out");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const toggleExpand = (id) => {
    setExpandedBlogId(expandedBlogId === id ? null : id);
  };

  return (
    <div>
      <h1>Welcome, {loggedInUser}</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Blog List</h2>
      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <tr key={blog._id}>
                <td>{blog.title}</td>
                <td>
                  {expandedBlogId === blog._id ? (
                    <div>
                      <p>{blog.description}</p>
                      <button onClick={() => toggleExpand(blog._id)}>
                        Read Less
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p>{blog.description.substring(0, 100)}...</p>
                      <button onClick={() => toggleExpand(blog._id)}>
                        Read More
                      </button>
                    </div>
                  )}
                </td>
                <td>
                  <button onClick={() => handleEditBlog(blog._id)}>Edit</button>
                  <button onClick={() => handleDeleteBlog(blog._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No blogs found</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>{editBlogId ? "Edit Blog" : "Add Blog"}</h2>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newBlog.title}
          onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
          style={{ display: "block", marginBottom: "10px" }}
        />
        <textarea
          placeholder="Description"
          value={newBlog.description}
          onChange={(e) =>
            setNewBlog({ ...newBlog, description: e.target.value })
          }
          style={{ display: "block", marginBottom: "10px" }}
        />
        {editBlogId ? (
          <button onClick={handleUpdateBlog}>Update Blog</button>
        ) : (
          <button onClick={handleCreateBlog}>Add Blog</button>
        )}
      </div>
    </div>
  );
};

export default Home;
