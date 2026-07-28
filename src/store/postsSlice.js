import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import {
  fetchPostsFromApi,
  createPostInApi,
  updatePostInApi,
  deletePostFromApi,
  resetDbToDefaults
} from '../utils/mockDb';

// 1. Configure the Entity Adapter for state normalization
const postsAdapter = createEntityAdapter({
  selectId: (post) => post.id,
  // Sort posts by last updated timestamp descending
  sortComparer: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
});

// 2. Define Async Thunks for API CRUD workflows
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchPostsFromApi();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addPost = createAsyncThunk(
  'posts/addPost',
  async (post, { rejectWithValue }) => {
    try {
      return await createPostInApi(post);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (post, { rejectWithValue }) => {
    try {
      return await updatePostInApi(post);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id, { rejectWithValue }) => {
    try {
      return await deletePostFromApi(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const resetPostsDatabase = createAsyncThunk(
  'posts/resetDatabase',
  async (_, { rejectWithValue }) => {
    try {
      return await resetDbToDefaults();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 3. Create the Slice combining normalized initial state and reducers
const postsSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState({
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch posts thunk cycle
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Add post thunk cycle
      .addCase(addPost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(addPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update post thunk cycle
      .addCase(updatePost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        postsAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload
        });
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Delete post thunk cycle
      .addCase(deletePost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        postsAdapter.removeOne(state, action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Reset database thunk cycle
      .addCase(resetPostsDatabase.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetPostsDatabase.fulfilled, (state, action) => {
        state.status = 'succeeded';
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(resetPostsDatabase.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// 4. Export adapter selectors targeting normalized entity fields
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  selectEntities: selectPostEntities
} = postsAdapter.getSelectors((state) => state.posts);

export default postsSlice.reducer;
