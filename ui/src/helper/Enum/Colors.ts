



export const BgColors = {
    SUCCESS:'bg-green-500',
    ERROR:'bg-red-500',
    WHITE:'bg-white',
    INFO:'bg-primary-400',
    FRONTEND:'bg-indigo-400',
    BACKEND:'bg-sky-500',
    DATABASE:'bg-amber-500',
    DESIGNER:'bg-red-600',
    FOUNDER:'bg-slate-700',
    TESTER:'bg-orange-700',
    CONSULTANT:'bg-gray-400',

}

export const TextColors = {
    LIGHT:'text-white',
    DARK:'text-slate-800'
}

export const getColorCode = (color:string) => {
    return BgColors[color as keyof typeof BgColors]
}

export const getRole = (role:string):string => {
    return String(role).toLowerCase().charAt(0).toUpperCase() +String(role).toLowerCase().slice(1)
}