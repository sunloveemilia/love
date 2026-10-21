import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'TWO — Наша маленькая вселенная',description:'Только ты. Только я. И целая вселенная. Игры и кино для двоих.',robots:{index:false,follow:false},icons:{icon:'/favicon.svg'},manifest:'/manifest.webmanifest'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>;}
