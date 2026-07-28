// Mock LocalStorage Database for Redux Toolkit CRUD Simulation
const STORAGE_KEY = 'reduxflow_posts';

let simulatedLatencyMs = 600;
let simulatedErrorRate = 0;

export const setDbConfig = (latency, errorRate) => {
  simulatedLatencyMs = Number(latency);
  simulatedErrorRate = Number(errorRate);
};

export const getDbConfig = () => ({
  latency: simulatedLatencyMs,
  errorRate: simulatedErrorRate
});

const SEED_POSTS = [
  {
    id: 'post-1',
    title: '🚀 State Normalization with Redux Toolkit',
    content: 'Why normalize state? It prevents data duplication and keeps updates flat. Using RTK\'s createEntityAdapter makes managing tabular structures like posts, users, or comments extremely easy. No more nested mapping!',
    platforms: ['x', 'linkedin'],
    category: 'Engineering',
    status: 'Published',
    scheduledDate: '',
    updatedAt: new Date(Date.now() - 3600 * 1000).toISOString()
  },
  {
    id: 'post-2',
    title: '⚡ Scalable Global State Design Patterns',
    content: 'React useState is fine for local states. But when props start drilling three levels deep, it\'s time for Redux. Learn about selectors, thunks, and store slices.',
    platforms: ['facebook', 'linkedin'],
    category: 'Marketing',
    status: 'Draft',
    scheduledDate: '',
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  },
  {
    id: 'post-3',
    title: '🎨 Visual Refresh: Dark Mode by Default',
    content: 'Check out our new dark mode dashboard styling. Glassmorphism cards with fine-bordered container styling. Neon violet glows and Outfit fonts for premium developer aesthetics.',
    platforms: ['instagram', 'facebook'],
    category: 'Design',
    status: 'Scheduled',
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    updatedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString()
  },
  {
    id: 'post-4',
    title: '🤖 RTK createEntityAdapter vs Raw Reducers',
    content: 'Did you know? createEntityAdapter generates CRUD reducer helpers like addOne, removeOne, and updateOne out of the box. It also generates pre-made memoized selectors for ids and entities!',
    platforms: ['x', 'linkedin'],
    category: 'Engineering',
    status: 'Published',
    scheduledDate: '',
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

const getStoredPosts = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_POSTS));
    return SEED_POSTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return SEED_POSTS;
  }
};

const saveStoredPosts = (posts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

const simulateNetwork = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() * 100 < simulatedErrorRate) {
        reject(new Error('503 Service Unavailable: Simulated Server Timeout.'));
      } else {
        resolve();
      }
    }, simulatedLatencyMs);
  });
};

export const fetchPostsFromApi = async () => {
  await simulateNetwork();
  return getStoredPosts();
};

export const createPostInApi = async (post) => {
  await simulateNetwork();
  const posts = getStoredPosts();
  const newPost = {
    ...post,
    id: 'post-' + Math.random().toString(36).substr(2, 9),
    updatedAt: new Date().toISOString()
  };
  const updatedList = [newPost, ...posts];
  saveStoredPosts(updatedList);
  return newPost;
};

export const updatePostInApi = async (post) => {
  await simulateNetwork();
  const posts = getStoredPosts();
  const updatedPost = {
    ...post,
    updatedAt: new Date().toISOString()
  };
  const updatedList = posts.map(p => p.id === post.id ? updatedPost : p);
  saveStoredPosts(updatedList);
  return updatedPost;
};

export const deletePostFromApi = async (id) => {
  await simulateNetwork();
  const posts = getStoredPosts();
  const filtered = posts.filter(p => p.id !== id);
  saveStoredPosts(filtered);
  return id;
};

export const resetDbToDefaults = async () => {
  await simulateNetwork();
  saveStoredPosts(SEED_POSTS);
  return SEED_POSTS;
};
