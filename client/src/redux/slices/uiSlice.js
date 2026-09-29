import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isSidebarOpen: false,
    elderMode: localStorage.getItem('elderMode') === 'true',
    activeModal: null, // null | 'login' | 'register' | etc.
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    toggleElderMode: (state) => {
      state.elderMode = !state.elderMode;
      localStorage.setItem('elderMode', state.elderMode);
      if (state.elderMode) {
        document.documentElement.setAttribute('data-elder', 'true');
      } else {
        document.documentElement.removeAttribute('data-elder');
      }
    },
    openModal: (state, action) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleElderMode, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
