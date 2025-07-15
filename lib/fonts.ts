import { 
  Inter, 
  Roboto, 
  Open_Sans, 
  Lato, 
  Montserrat, 
  Poppins, 
  Raleway, 
  Ubuntu, 
  Merriweather, 
  Playfair_Display, 
  Source_Serif_4, 
  Oswald, 
  Nunito, 
  Roboto_Slab, 
  Roboto_Mono, 
  Lora, 
  Fira_Sans, 
  PT_Sans, 
  PT_Serif, 
  Arvo, 
  Bitter, 
  Crimson_Text,
  Noto_Nastaliq_Urdu
} from 'next/font/google'

// Configure all fonts
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
})

export const lato = Lato({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
})

export const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
})

export const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})

export const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
})

export const ubuntu = Ubuntu({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ubuntu',
})

export const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
})

export const playfairDisplay = Playfair_Display({
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair-display',
})

export const sourceSerifPro = Source_Serif_4({
  weight: ['200', '300', '400', '600', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-sans-pro',
})

export const oswald = Oswald({
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald',
})

export const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
})

export const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-slab',
})

export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
})

export const firaSans = Fira_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-sans',
})

export const ptSans = PT_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pt-sans',
})

export const ptSerif = PT_Serif({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pt-serif',
})

export const arvo = Arvo({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-arvo',
})

export const bitter = Bitter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bitter',
})

export const crimsonText = Crimson_Text({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-crimson-text',
})

// Nastaleeq Urdu font
export const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  weight: ['400', '700'],
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-noto-nastaliq-urdu',
})

// Font variables array for easy access
export const fontVariables = [
  inter.variable,
  roboto.variable,
  openSans.variable,
  lato.variable,
  montserrat.variable,
  poppins.variable,
  raleway.variable,
  ubuntu.variable,
  merriweather.variable,
  playfairDisplay.variable,
  sourceSerifPro.variable,
  oswald.variable,
  nunito.variable,
  robotoSlab.variable,
  robotoMono.variable,
  lora.variable,
  firaSans.variable,
  ptSans.variable,
  ptSerif.variable,
  arvo.variable,
  bitter.variable,
  crimsonText.variable,
  notoNastaliqUrdu.variable,
].join(' ')
