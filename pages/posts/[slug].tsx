import { GetStaticProps } from 'next';
import React from 'react';
import Header from '../../components/Header/Header';
import { sanityClient, urlFor } from '../../sainty';
import { Post } from '../../typings';
import PortableText from 'react-portable-text';
import { useForm, SubmitHandler } from 'react-hook-form';
interface Props {
	post: Post;
}

interface IFormInput {
	_id: string;
	name: string;
	email: string;
	comment: string;
}
const Post = ({ post }: Props) => {
	console.log(post);
	const [submitted, setSubmitted] = React.useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormInput>();
	React.useEffect(() => {
		console.log('post', post);
	}, []);

	const onSubmit: SubmitHandler<IFormInput> = async (data) => {
		await fetch('/api/createComment', {
			method: 'POST',
			body: JSON.stringify(data),
		})
			.then(() => {
				console.log(data);
				setSubmitted(true);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<main>
			<Header />

			<img
				className='w-full h-40 md:h-[200px] object-cover'
				src={urlFor(post.mainImage).url()!}
			/>

			<article className='max-w-3xl mx-auto p-5'>
				<h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
				<h2 className='text-xl font-light text-gray-500'>{post.description}</h2>
				<div>
					<img
						className='h-10 w-10 rounded-full'
						src={urlFor(post.author.image).url()!}
						alt=''
					/>

					<p className='font-extalarge text-sm'>
						blog post by{' '}
						<span className='text-green-500'> {post.author.name}</span> -
						Published at {new Date(post._createdAt).toLocaleString()}
					</p>
				</div>

				<div className='mt-10'>
					<PortableText
						dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
						projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
						content={post.body}
						serializers={{
							h1: (props: any) => {
								return <h1 className='text-2xl font-bold my-5' {...props} />;
							},
							h2: (props: any) => {
								return <h2 className='text-2xl font-bold my-5' {...props} />;
							},
							link: ({ href, children }: any) => {
								<a href={href} className='text-blue-500 hover:underline'>
									{children}
								</a>;
							},
						}}
					/>
				</div>
			</article>

			<hr className='max-w-lg my-5 mx-auto border border-yellow-500' />

			{submitted ? (
				<div className='flex flex-col space-y-3  pl-2 py-10 mt-10 bg-yellow-500 text-white  max-w-2xl mx-auto '>
					<h3 className='text-3xl font-bold'>
						Thank you for submitting your comment!
					</h3>
					<p className='text-lg'>
						Once it has been approved, it will appear below!{' '}
					</p>
				</div>
			) : (
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex flex-col p-5 max-w-2xl mx-auto nb-10'
				>
					<input
						{...register('_id')}
						type='hidden'
						name='_id'
						value={post._id}
					/>

					<label className='block mb-5'>
						<span className='text-gray-700'>Name</span>
						<input
							{...register('name', { required: true })}
							className='shadow border rounded py-2 px-3 form-input mt-1 block w-full  outline-none focus:ring ring-yellow-500'
							type='text'
							placeholder='Enter your name'
						/>
					</label>
					<label className='block mb-5'>
						<span className='text-gray-700'>E-mail</span>
						<input
							{...register('email', { required: true })}
							className='shadow border rounded py-2 px-3 form-input mt-1 block w-full  outline-none focus:ring ring-yellow-500'
							type='text'
							placeholder='Your email'
						/>
					</label>
					<label className='block mb-5'>
						<span className='text-gray-700'>comment</span>
						<textarea
							{...register('comment', { required: true })}
							className='shadow border rounded py-2 px-3 form-textarea  mt-1 block w-full outline-none focus:ring ring-yellow-500'
							placeholder='add a comment...'
							rows={8}
						></textarea>
					</label>

					<div className='flex flex-col p-5'>
						{errors.name && (
							<span className='text-red-500'>- The name field is required</span>
						)}

						{errors.email && (
							<span className='text-red-500'>- The name email is required</span>
						)}
						{errors.comment && (
							<span className='text-red-500'>
								- The name comment is required
							</span>
						)}
					</div>

					<input
						className='bg-yellow-400 shadow hover:bg-yellow-500 
                    hover:shadow-outline py-2 px-4 rounded focus:outline-none
                     text-white font-bold cursor-pointer'
						type='submit'
					/>
				</form>
			)}

			<div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow shadow-yellow-300 rounded '>
				<h3 className='text-4xl'>Comments</h3>
				<hr className='mb-3' />
				{post.comments.map((comment) => {
					return (
						<div key={comment._id}>
							<p>
								<span className='text-yellow-500'>{comment.name}</span>:
								{comment.comment}
							</p>
						</div>
					);
				})}
			</div>
		</main>
	);
};

export default Post;

export const getStaticPaths = async () => {
	const query = `*[_type == "post"] {
        _id,
       slug  {
         current
       }
      }`;

	const posts = await sanityClient.fetch(query);

	const paths = posts.map((post: Post) => {
		return {
			params: {
				slug: post.slug.current,
			},
		};
	});

	return {
		paths: paths,
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    author -> {
    name,
    image
  },
  'comments' : *[
    _type == "comment" &&
    post._ref == ^._id &&
    approved == true],
  description,
  mainImage,
  slug,
  body
  }`;

	try {
		const post = await sanityClient.fetch(query, {
			slug: params?.slug,
		});

		if (!post) {
			return {
				notFound: true,
			};
		}

		return {
			props: {
				post,
			},
			revalidate: 60,
		};
	} catch (err) {
		console.log('error', err);
	}
	return {
		notFound: true,
	};
};
