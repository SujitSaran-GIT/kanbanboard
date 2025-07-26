import { time } from "framer-motion"
import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { logout } from "../redux/slices/authSlice"

const INACTIVITY_LIMIT = 1 * 60 * 1000

export default function useAutoLogout() {
    const dispatch = useDispatch()
    const timer = useRef()

    useEffect(() => {
        const resetTimer = () => {
            console.log(timer.current)
            if (timer.current) {
                clearTimeout(timer.current)
            }

            timer.current = setTimeout(() => {
                dispatch(logout())

                window.location.href = '/login'
            }, INACTIVITY_LIMIT)
        }

        const events = ['mousemove','keydown','mousedown','touchstart']

        events.forEach(event => 
            window.addEventListener(event, resetTimer)
        )

        resetTimer()

        return () => {
            if (timer.current) {
                clearTimeout(timer.current)
            }

            events.forEach(event => 
                window.removeEventListener(event, resetTimer)
            )
        }
    }, [dispatch])
}