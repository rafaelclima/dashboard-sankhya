/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        'verde-sankhya': '#5dc95d',
        'cinza-sankhya': '#4b5766',
        'branco-sankhya': '#F0F0F0',
        'antiflash-sankhya': '#E2E2E2',
        'background-snk': '#ccccccbd',
        'btn-azul': '#223950',
        'btn-cinza': '#4B4F66',
        'btn-danger': '#C9605D',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        titulo: ['Roboto', 'sans-serif'],
        texto: ['Poppins', 'sans-serif'],
        sans: ['Helvetica Neue', 'sans-serif'],
        snkFont: ['Helvetica Neue', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      backgroundImage: {
        'gradient-sankhya': 'linear-gradient(90deg, #5dc95d, #66cc66)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

/*
Cores:
bg-verde-sankhya: #5dc95d
bg-cinza-sankhya: #4b5766
bg-branco-sankhya: #F5F5F5
bg-antiflash-sankhya: #E2E2E2

Font:
Títulos = Roboto Light 300
Textos = Poppins Light 300
*/

// background: -webkit-linear-gradient(90deg, #5dc95d,#66cc66);
// background: linear-gradient(90deg, #5dc95d,#66cc66);
