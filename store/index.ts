

interface AppState {
    title: string
}

export const state = (): AppState => ({
    title: 'CUValles'
})

export const mutations = {
    setTitle (state: AppState, newTitle: string) {
        state.title = newTitle
    }
}