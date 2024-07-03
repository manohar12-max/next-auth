export const publicRoutes=[
    // this routes can be accesseed by both loggenin and logged out users
    "/","/auth/new-verification" 
]

export const authRoutes=[
    // these routes can only be accessed by logged out users and these routes will redirect to settings
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password"
    
]
export const apiauthPrifix="/api/auth"

export const DEFAULT_LOGIN_REDIRECT="/settings"
