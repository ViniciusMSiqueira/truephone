import 'bootstrap/dist/css/bootstrap.css';
import Head from 'next/head';
import { useEffect } from 'react';

//import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {

    useEffect(() => {
        document.body.className = pageProps = "bg-dark"
    });

    return(
    <>
        <Head>
            <meta name='viewport'
            content="width=device-width,
            initial-scale=1" />
        </Head>

        <Component {...pageProps} />

    </>
 );
}