export interface IAuthData {
    email: string,
    password: string
}
export interface IFormData {
    email: string,
    password: string,
    re_passowrd: string,
    phone: string
}
export interface IErrors {
    email: string[],
    password: string[],
    phone: string[]
}
export interface IHouse {
    id: number,
    type: string
    address: string,
    city: string,
    daira: string,
    rooms: number,
    price: number,
    description: string,
    transaction: 'rent' | 'sell'
    paymentFormat: string,
    phone: string,
    user: number,
    images: string[]
}
export interface ISavedHouse extends IHouse {
    saved: boolean
}