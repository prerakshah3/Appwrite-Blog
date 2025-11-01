import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components'

function Home() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts && posts.documents) {
                console.log('📝 Home: Fetched posts:', posts.documents);
                posts.documents.forEach(post => {
                    console.log(`  - Post: "${post.title}" | Featured Image ID: ${post.featuredimage || 'MISSING'}`);
                });
                setPosts(posts.documents)
            } else {
                console.warn('⚠️ Home: No posts returned or posts is false');
            }
        }).catch((error) => {
            console.error('❌ Home: Error fetching posts:', error);
        })
    }, [])
  
    if (posts.length === 0) {
        return (
            <div className="w-full py-16 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap justify-center">
                        <div className="p-2 w-full max-w-md">
                            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    Welcome to Our Blog
                            </h1>
                                <p className="text-gray-600 mb-4">
                                    Login to read and discover amazing posts
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full py-12'>
            <Container>
                <div className='mb-8 text-center'>
                    <h1 className='text-4xl font-bold text-gray-800 mb-2'>Latest Posts</h1>
                    <p className='text-gray-600'>Discover stories, ideas, and perspectives</p>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {posts.map((post) => (
                        <div key={post.$id} className='animate-slide-up'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home