import { useState } from '../lib/htm-preact.js'

export const useActivePanel = () => {
    const [activePanel, setActivePanel] = useState('posts')
    return { activePanel, setActivePanel }
}
