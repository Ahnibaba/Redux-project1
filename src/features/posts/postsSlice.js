import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from  "@reduxjs/toolkit";
import { sub } from "date-fns"
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
        status: "idle", // "idle" | "loading" | "succeeded" | "failed"
        error: null,
        count: 0
    }
)


export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
    try{
        const response = await axios.get(POSTS_URL);
        return [...response.data];
    } catch (err) {
        return err.message;
    }
});

export const addNewPost = createAsyncThunk("posts/addedNewPost", async (initialPost) => {
    try {
       const response = await axios.post(POSTS_URL, initialPost);
       return response.data
    } catch (err) {
       return err.message
    }
});

export const updatePost =  createAsyncThunk("posts/updatePost", async(initialPost) => {
    const { id } = initialPost;
    
    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
        return response.data
    } catch (err) {
        //return err.message;
        return initialPost; // only for testing Redux and save
    }
} )

export const deletePost = createAsyncThunk("posts/deletePost", async(initialPost) =>{
    const { id } = initialPost;

    try{
        const response = await axios.delete(`${POSTS_URL}/${id}`)
        if(response?.status === 200) return initialPost;
        return `${response?.status} : ${response?.statusText}`;
    } catch (err) {
        //return err.message;
        return initialPost
    }


})


const postsSlice = createSlice({
    name: "Posts",
    initialState,
    reducers: { 

        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.entities[postId]
            if(existingPost){
                existingPost.reactions[reaction]++
            }

        },
        increaseCount(state, action) {
           state.count = state.count + 1 
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = "loading"
            }) 
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "succeeded"
                //Adding date and reactions
                let min =  1;
                
                const loadedPosts = action.payload.map(post => { 
                 //post.id = nanoid()    
                 post.date = sub(new Date(), {minutes: min++}).toISOString()
                  post.reactions = {
                     thumbsUp: 0,
                     wow: 0,
                     heart: 0,
                     rocket: 0,                 
                     coffee: 0
                 }
                 return post;
                })
                //Add any fetched posts to the array
                //state.posts = state.posts.concat(loadedPosts)
                postsAdapter.upsertMany(state, action)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                //action.payload.id = nanoid() 
                
                action.payload.userId = Number(action.payload.userId);
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }

                

                console.log(action.payload);
                //state.posts.push(action.payload);
                postsAdapter.upsertOne(state, action.payload)
            })

            .addCase(updatePost.fulfilled, (state, action) => {
                if(!action.payload?.id){
                    console.log("Update could not complete");
                    console.log(action.payload);
                    return;
                }
                
                action.payload.date = new Date().toISOString()
               
                //state.posts = [...filterPosts, action.payload]
                postsAdapter.upsertOne(state, action.payload)
            })


            .addCase(deletePost.fulfilled, (state, action) => {
                if(!action.payload?.id) {
                    console.log("Delete could not complete");
                    console.log(action.payload);
                    return;
                }

                const { id } = action.payload;
               
                //state.posts = posts;
                postsAdapter.removeOne(state, id)
            })
            
     }
    
})

 //getSelectors creates these selectors and we rename them with aliases using destructuring
 export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    //Pass in a selector that returns the posts slice of the state
 } = postsAdapter.getSelectors(state => state.posts)


export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;



export const selectPostByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.userId === userId)
)

export const { increaseCount, reactionAdded } = postsSlice.actions


export default postsSlice.reducer
