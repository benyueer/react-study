import React from "react"

export const ThemeContext = React.createContext({} as any)
export const ThemeProvider = ThemeContext.Provider
export const ThemeConsumer = ThemeContext.Consumer

export const UserContxt = React.createContext({} as any)
export const UserProvider = UserContxt.Provider
export const UserConsumer = UserContxt.Consumer