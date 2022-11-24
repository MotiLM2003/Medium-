import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header/Header';
import { sanityClient, urlFor } from '../sainty';
import { Post } from '../typings';

interface Props {
	posts: [Post];
}
const Home = ({ posts }: Props) => {
	console.log(posts);
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

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
				{posts.map((post) => {
					return (
						<Link key={post._id} href={`/posts/${post.slug.current}`}>
							<div className='border rounded-lg  shadow group overflow-hidden  border-gray-50'>
								<img
									className='h-60 w-full object-cover group-hover:scale-105 transition duration-500 ease-in-out'
									src={urlFor(post.mainImage).url()!}
									alt=''
								/>

								<div className='flex justify-between p-5 bg-white'>
									<div>
										<p className='text-lg font-bold'>{post.title}</p>
										<p>
											{post.description} by {post.author.name}
										</p>
									</div>
									<img
										className='h-12 w-12 rounded-full'
										src={urlFor(post.author.image).url()!}
										alt=''
									/>
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default Home;

export const getServerSideProps = async (props: Props) => {
	const query = `*[_type == "post"] {
    _id,
   title,
    author -> {
    name,
    image
  },
  description,
  mainImage,
  slug
   
  }`;

	const posts = await sanityClient.fetch(query);

	return {
		props: {
			posts,
		},
	};
};
