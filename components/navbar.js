import {Component} from 'react';
import Link from 'next/link';
import Image from 'next/image';


export default class Navbar extends Component {
    constructor(props) {
        super(props);
    }

    _activateSelected(target = 0) {
        return this.props.selectedIdx === target ?
            'bg-blue-500 text-white' : 'text-gray-800 hover:text-blue-800';
    }

    render() {
        const basicLinkStyle = ' px-3 py-2 pt-3 rounded-md text-sm font-medium font-mono ';

        return (
            <div className="w-screen z-60">
                <nav className="bg-white pb-2 shadow">
                    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                        <div className="relative flex flex-col xl:flex-row items-center justify-between h-26">
                            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex-shrink-0 flex items-center relative top-1">
                                    <Link prefetch href="/">
                                        <a className="p-1 rounded-xl flex">
                                            <div className="relative top-1">
                                                <Image src={'/favicon.jpeg'}
                                                       alt="NCKU, College of Electrical Engineering & Computer Science"
                                                       width={80} height={80}
                                                />
                                            </div>
                                            <div style={{fontFamily: '標楷體'}}
                                                 className="p-4 text-black text-2xl font-semibold cursor-pointer">
                                                <div>國立成功大學電機資訊學院博碩士論文典藏系統</div>
                                                <div style={{fontFamily: 'TimesNewRoman,Times New Roman'}}
                                                     className="text-xs font-semibold tracking-wide text-center">
                                                    National Cheng Kung University, College of Electrical Engineering &
                                                    Computer Science
                                                </div>
                                                <div style={{fontFamily: 'TimesNewRoman,Times New Roman'}}
                                                     className="text-xs font-semibold tracking-wide text-center">Theses
                                                    and Dissertations System
                                                </div>
                                            </div>
                                        </a>
                                    </Link>

                                </div>
                            </div>
                            <div className="hidden mt-2 sm:block sm:ml-6 relative tracking-wide text-center">
                                <div className="flex space-x-4 last:ml-20" style={{font: '400 13.3333px Arial'}}>
                                    <Link prefetch href="/search/basic">
                                        <a className={this._activateSelected(0) + basicLinkStyle}>
                                            簡易查詢
                                        </a>
                                    </Link>
                                    <Link prefetch href="/search/advance">
                                        <a className={this._activateSelected(1) + basicLinkStyle}>
                                            進階查詢
                                        </a>
                                    </Link>
                                    <Link prefetch href="/browse">
                                        <a className={this._activateSelected(2) + basicLinkStyle}>
                                            論文瀏覽
                                        </a>
                                    </Link>
                                    <Link prefetch href="/collection">
                                        <a className={this._activateSelected(3) + basicLinkStyle}>
                                            我的收藏
                                        </a>
                                    </Link>
                                    <Link href="https://eecs.ncku.edu.tw/">
                                        <a className={basicLinkStyle + 'pt-2.5 border-red-600 border-2 text-gray-800 hover:bg-red-600 hover:text-white'}>
                                            電資學院網站
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}