import { useAddNewPostMutation } from "./postsSlice";

const reactionEmoji = {
    thumbsUp: "👍",
    wow: "😮",
    heart: "💗",
    rocket: "🚀",
    coffee: "☕"
}



const ReactionButtons = ({ post }) => {
const [addReaction] = useAddNewPostMutation();

    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        
        const reactionCount = post.reactions ? post.reactions[name] || 0 : 0;
       return (
        <button 
           key={name}
           type="button"
           className="reactionButton"
           onClick={() => {
            const newValue = post.reactions[name] + 1
            addReaction({ postId: post.id, reactions: { ...post.reactions, [name]: newValue } })
           }}
           
        >
          {emoji} {reactionCount}
        </button>
       )
    })
  return <div>{reactionButtons}</div>
}

export default ReactionButtons