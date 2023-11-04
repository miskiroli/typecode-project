import React, { useState, useEffect } from "react";
import "./App.css";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsResponse, usersResponse] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/posts"),
          fetch("https://jsonplaceholder.typicode.com/users"),
        ]);

        const [postsData, usersData] = await Promise.all([
          postsResponse.json(),
          usersResponse.json(),
        ]);

        setPosts(postsData);
      } catch (error) {
        console.error("Hiba történt a posztok letöltésekor:", error);
      }
    }

    fetchData();
  }, []);

  const handlePostClick = async (postId) => {
    try {
      const [selectedPostResponse, commentsResponse] = await Promise.all([
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`),
        fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`),
      ]);

      const [selectedPostData, commentsData] = await Promise.all([
        selectedPostResponse.json(),
        commentsResponse.json(),
      ]);

      setSelectedPost(selectedPostData);

      const userResponse = await fetch(
        `https://jsonplaceholder.typicode.com/users/${selectedPostData.userId}`
      );
      const userData = await userResponse.json();
      setUser(userData);

      setComments(commentsData);
      setSelectedPostId(postId);
    } catch (error) {
      console.error(
        "Hiba történt a kiválasztott poszt és kommentek letöltésekor:",
        error
      );
    }
  };

  const resetSelectedPost = () => {
    setSelectedPost(null);
    setUser(null);
    setComments([]);
    setSelectedPostId(null);
  };

  return (
    <div className="App">
      <h1>Posztok</h1>
      <div className="Posts">
        {posts.map((post) => (
          <div key={post.id}>
            <div
              onClick={() =>
                selectedPostId === post.id
                  ? resetSelectedPost()
                  : handlePostClick(post.id)
              }
              className={selectedPostId === post.id ? "SelectedPost" : ""}
            >
              {post.title}
            </div>
            {selectedPostId === post.id && (
              <div>
                <h2>Kiválasztott Poszt: {selectedPost.title}</h2>
                {user && (
                  <div>
                    <h3>Felhasználó: {user.name}</h3>
                    <p>Email: {user.email}</p>
                    <p>Telefonszám: {user.phone}</p>
                  </div>
                )}
                <h3>Kommentek:</h3>
                <ul>
                  {comments.map((comment) => (
                    <li key={comment.id}>
                      <strong>{comment.name}</strong> - {comment.body}
                    </li>
                  ))}
                </ul>
                <button onClick={resetSelectedPost}>Vissza a posztokhoz</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Posts;
