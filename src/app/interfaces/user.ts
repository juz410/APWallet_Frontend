export interface User{
  user_id: string
  email: string
  name: string
  phone_number: string
  balance: number
  registered_at: Date
}

export interface Card{
  card_id: number,
  card_number: string,
  registered_at: Date,
  user: User
}