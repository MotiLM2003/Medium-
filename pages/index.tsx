import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header/Header';

const Home: NextPage = () => {
	return (
		<div className='max-w-7xl mx-auto'>
			<Head>
				<title>Medium Blog</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Header />
			<div
				className='flex justify-between items-center bg-yellow-400
       border-y py-10 lg:py-4 px-5'
			>
				<div className='px-10 space-y-'>
					<h1 className='text-6xl max-w-xl font-serif'>
						<span className='underline decoration-black decoration-4 '>
							Medium
						</span>{' '}
						is a place to write, read, and connect
					</h1>
					<h2>
						It's easy and free to post your thinking on any topic and connect
						with millions of readers.
					</h2>
				</div>

				<img
					className='hidden md:inline-flex h-32 lg:h-54'
					src='https://www.pngfind.com/pngs/m/51-512759_medium-icon-svg-hd-png-download.png'
					alt='4'
				/>
			</div>
		</div>
	);
};

export default Home;
