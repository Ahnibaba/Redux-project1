import { useDispatch } from "react-redux";
import { reactionAdded } from "./postsSlice";

const reactionEmoji = {
    thumbsUp: "👍",
    wow: "😮",
    heart: "💗",
    rocket: "🚀",
    coffee: "☕"
}



const ReactionButtons = ({ post }) => {
    const dispatch = useDispatch();

    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        
        const reactionCount = post.reactions ? post.reactions[name] || 0 : 0;
       return (
        <button 
           key={name}
           type="button"
           className="reactionButton"
           onClick={() =>
              dispatch(reactionAdded({ postId: post.id, reaction: name}))
            
           }
           
        >
          {emoji} {reactionCount}
        </button>
       )
    })
  return <div>{reactionButtons}</div>
}

export default ReactionButtons