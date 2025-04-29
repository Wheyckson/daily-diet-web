/** @type {import('tailwindcss').Config} */

export const content = [
  "./app/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
]
export const theme = {  
  extend: {
    colors: {
      //produto
      redDark: '#BF3B44',
      redMid: '#F3BABD',
      redLight: '#F4E6E7',

      greenDark: '#639339',
      greenMid: '#CBE4B4',
      greenLight: '#E5F0DB',

      //base
      gray1: '#1B1D1E',
      gray2: '#333638',
      gray3: '#5C6265',
      gray4: '#B9BBBC',
      gray5: '#DDDEDF',
      gray6: '#EFF0F0',
      gray7: '#FAFAFA',
      white: '#FFFFFF',
    },
    fontFamily: {
      main: ['Nunito_Sans', 'sans-serif'],
    },
    fontSize: {
      bodyXs: '12',
      bodyS: '14',
      bodyM: '16',
      titleXS: '14',
      titleS: '18',
      titleM: '24',
      titleG: '32',
    }
  },
}