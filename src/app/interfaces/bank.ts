export const banks: Bank []= [
  {
    'name' : 'CIMB Bank', 
    'logo' : 'assets/banks/cimbBank.png'
  },
  {
    'name' : 'Maybank', 
    'logo' : 'assets/banks/mayBank.png'
  },
  {
    'name' : 'Public Bank', 
    'logo' : 'assets/banks/publicBank.png'
  },
  {
    'name' : 'RHB Bank', 
    'logo' : 'assets/banks/rhbBank.png'
  },
  {
    'name' : 'Hong Leong Bank', 
    'logo' : 'assets/banks/hlBank.png'
  },
  {
    'name' : 'Affin Bank', 
    'logo' : 'assets/banks/affinBank.png'
  },
  {
    'name' : 'Bank Islam', 
    'logo' : 'assets/banks/bankIslam.png'
  },

]

export interface Bank{
  name: string
  logo: string
}