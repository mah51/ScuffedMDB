import { create } from 'zustand'

type State = {
    view: string
  }
  
  type Action = {
    setView: (view: State['view']) => void
  }
  
  // Create your store, which includes both state and (optionally) actions
  const useStore = create<State & Action>((set) => ({
    view: 'movies',
    setView: (view) => set(() => ({ view: view })),
  }));

  export default useStore;