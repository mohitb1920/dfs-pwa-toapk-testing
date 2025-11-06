/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        'content-max-width': "1200px",
      },
      backgroundColor:{
        'primary': '#006633',
        'secondary': '#A5292B',
        'light': '#FBFAFA',
        'white': '#fff',
        'neutral-100': '#f2f2f2',
      }
    },
    fontFamily: {
      'poppins':['Poppins', 'sans-serif'],
      'inter':['Inter', 'sans-seric'],
    },
    textColor: {
      'primary': '#006633',
      'primary-dark-theme': '#85BC31',
      'white': '#fff',
      'pending': '#C79954',
      'black': '#000',
      'black-50': '#808080',
      'secondary': '#c42921',
      'error-dark-theme': "#F8CACA",
      'red': '#cc0000',
      'light-black': '#353535',
    },
    borderColor: theme => ({
      ...theme('colors'),
      'primary': '#B3B3B3',
      'secondary': '#A5292B',
      'ash': 'rgba(255, 255, 255, 1)',
     })
  },
  plugins: [],
}


