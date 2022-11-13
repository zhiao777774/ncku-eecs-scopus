import '../styles/globals.css';
import '../styles/tailwind.extend.css';
import 'tailwindcss/tailwind.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}