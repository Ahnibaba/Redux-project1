import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";


import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";



const SinglePagePost = () => {

    const { postId } = useParams();
    

    const post = useSelector((state) => selectPostById(state, Number(postId)))
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
      // Set loading to false once post is fetched
      if (post) {
          setLoading(false);
      }
  }, [post]);

  if (loading) {
      return (
          <section>
             Loading
          </section>
      );
  }
    if(!post){
      return (
        <section>
            <h2>Post not found!</h2>
        </section>
      )
    }
  return (
    <article>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <p className="postCredit">
            <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
            <PostAuthor userId={post.userId}/>
            <TimeAgo timestamp={post.date} />
        </p>
        <ReactionButtons post={post} />
    </article>
  )
}

export default SinglePagePost