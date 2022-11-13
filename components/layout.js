import Head from 'next/head';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import PageTopButton from '@/components/pagetop';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import Blocker from '@/components/blocker';


export default function Layout(props) {
    const {
        children, title = 'NCKU, 成功大學-電機資訊學院碩博士論文查詢系統',
        openPanel = null, selectedIdx = undefined
    } = props;

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
            </Head>
            <div className="lg:max-w-screen-2xl">
                <Navbar selectedIdx={selectedIdx}/>
                <main id="page-top" className="p-7 sm:ml-4 lg:ml-64 lg:mr-24">
                    {children}
                    {
                        openPanel === null ? null :
                            <Blocker display={openPanel} style={{backgroundColor: 'rgba(0, 0, 0, .2)'}}>
                                <LoadingSpinner/>
                            </Blocker>
                    }
                </main>
                <Footer/>
            </div>
            <PageTopButton/>
        </div>
    );
}