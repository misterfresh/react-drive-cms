import { useState } from '../lib/htm-preact.js'

export const useMenuVisible = () => {
    const [menuVisible, setMenuVisible] = useState(
        !(typeof window !== 'undefined' && window.innerWidth < 769)
    )
    const toggleMenuVisible = () => {
        setMenuVisible(!menuVisible)
    }
    return { menuVisible, toggleMenuVisible }
}
