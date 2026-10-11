// Load state from localStorage
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('taskflow_state');
    if (serializedState === null) {
      return undefined; // Let reducers use their default initial state
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Could not load state from localStorage", error);
    return undefined;
  }
};

// Save state to localStorage
export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('taskflow_state', serializedState);
  } catch (error) {
    console.error("Could not save state to localStorage", error);
  }
};