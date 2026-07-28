import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  entities: {
    x: { id: 'x', name: 'X / Twitter', charLimit: 280, active: true },
    facebook: { id: 'facebook', name: 'Facebook', charLimit: 2000, active: true },
    instagram: { id: 'instagram', name: 'Instagram', charLimit: 2200, active: true },
    linkedin: { id: 'linkedin', name: 'LinkedIn', charLimit: 3000, active: true }
  },
  selectedPlatforms: ['x']
};

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    togglePlatformActiveState: (state, action) => {
      const platformId = action.payload;
      if (state.entities[platformId]) {
        state.entities[platformId].active = !state.entities[platformId].active;
        // If turned inactive, remove from selection array
        if (!state.entities[platformId].active) {
          state.selectedPlatforms = state.selectedPlatforms.filter(id => id !== platformId);
        }
      }
    },
    updatePlatformCharacterLimit: (state, action) => {
      const { id, charLimit } = action.payload;
      if (state.entities[id]) {
        state.entities[id].charLimit = Number(charLimit);
      }
    },
    toggleSelectedPlatform: (state, action) => {
      const platformId = action.payload;
      if (state.selectedPlatforms.includes(platformId)) {
        // Keep at least one selected if possible, but allow empty selection or toggle
        if (state.selectedPlatforms.length > 1) {
          state.selectedPlatforms = state.selectedPlatforms.filter(id => id !== platformId);
        }
      } else {
        if (state.entities[platformId]?.active) {
          state.selectedPlatforms.push(platformId);
        }
      }
    }
  }
});

export const {
  togglePlatformActiveState,
  updatePlatformCharacterLimit,
  toggleSelectedPlatform
} = platformsSlice.actions;

// Selectors
export const selectAllPlatforms = state => Object.values(state.platforms.entities);
export const selectPlatformEntities = state => state.platforms.entities;
export const selectSelectedPlatforms = state => state.platforms.selectedPlatforms;

export default platformsSlice.reducer;
