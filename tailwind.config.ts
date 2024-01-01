import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".box-shadow-bottom-red": {
          boxShadow: "0 20px 0 red",
        },

        ".box-shadow-bottom-green": {
          boxShadow: "0 20px 0 green",
        },

        ".box-shadow-bottom-blue": {
          boxShadow: "0 20px 0 blue",
        },

        ".box-shadow-bottom-none": {
          boxShadow: "none",
        }
      }

      addUtilities(newUtilities, ['responsive', 'active']);
    }
  ],
}
export default config
