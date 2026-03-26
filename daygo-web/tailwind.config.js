/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', 'class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', 'system-ui', 'sans-serif'],
  			heading: ['EB Garamond', 'Georgia', 'serif'],
  			serif: ['EB Garamond', 'Georgia', 'serif'],
  		},
  		colors: {
  			navy: '#1e293b',
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			// Muted blue-gray journal palette
  			brand: {
  				50: '#f8fafc',
  				100: '#f1f5f9',
  				200: '#e2e8f0',
  				300: '#cbd5e1',
  				400: '#94a3b8',
  				500: '#64748b',
  				600: '#475569',
  				700: '#334155',
  				800: '#1e293b',
  				900: '#0f172a',
  			},
  			teal: '#64748b',
  			success: '#64748b',
  			// All section colors unified to muted blue-gray
  			mantra: '#64748b',
  			journal: '#64748b',
  			schedule: '#64748b',
  			identity: '#64748b',
  			vision: '#64748b',
  			habit: '#64748b',
  			todo: '#64748b',
  			expense: '#64748b',
  			// Refined bevel system — warm paper tones
  			'bevel-bg': '#f5f5f0',
  			'bevel-card': '#fafaf7',
  			'bevel-text': '#1e293b',
  			'bevel-text-secondary': '#64748b',
  			'bevel-yellow': '#94a3b8',
  			'bevel-green': '#64748b',
  			'bevel-red': '#94a3b8',
  			'bevel-blue': '#64748b',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		boxShadow: {
  			'bevel-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.02)',
  			bevel: '0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 2px 8px 0 rgba(0, 0, 0, 0.04)',
  			'bevel-md': '0 2px 4px -1px rgba(0, 0, 0, 0.03), 0 6px 12px -2px rgba(0, 0, 0, 0.05)',
  			'bevel-lg': '0 4px 12px -3px rgba(0, 0, 0, 0.04), 0 10px 20px -4px rgba(0, 0, 0, 0.06)',
  			'card': '0 0 0 1px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
  			'card-hover': '0 0 0 1px rgba(100, 116, 139, 0.1), 0 2px 6px rgba(0, 0, 0, 0.03)'
  		},
  		keyframes: {
  			'slide-in-from-left': {
  				'0%': {
  					transform: 'translateX(-100%)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateX(0)',
  					opacity: '1'
  				}
  			},
  			'slide-in-from-right': {
  				'0%': {
  					transform: 'translateX(100%)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateX(0)',
  					opacity: '1'
  				}
  			},
  			'slide-out-to-left': {
  				'0%': {
  					transform: 'translateX(0)',
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'translateX(-100%)',
  					opacity: '0'
  				}
  			},
  			'slide-out-to-right': {
  				'0%': {
  					transform: 'translateX(0)',
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'translateX(100%)',
  					opacity: '0'
  				}
  			}
  		},
  		animation: {
  			'slide-in-left': 'slide-in-from-left 0.3s ease-out',
  			'slide-in-right': 'slide-in-from-right 0.3s ease-out',
  			'slide-out-left': 'slide-out-to-left 0.3s ease-in',
  			'slide-out-right': 'slide-out-to-right 0.3s ease-in'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    require('@tailwindcss/typography'),
      require("tailwindcss-animate")
],
}
