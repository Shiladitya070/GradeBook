'use client'

import { CookiesProvider } from "react-cookie"

function CookieProvider({ children }) {
    return (
        <CookiesProvider>
            {children}
        </CookiesProvider>
    )
}

export default CookieProvider