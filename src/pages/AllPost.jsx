import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";

function AllPosts() {
    const [posts, setPosts] = useState([])
    
    useEffect(() => {
    appwriteService.getPosts([]).then((posts) => {
            if (posts && posts.documents) {
            setPosts(posts.documents)
        }
        }).catch((error) => {
            console.error('❌ AllPosts: Error fetching posts:', error);
    })
    }, [])
  return (
    <div className='w-full py-12'>
        <Container>
            <div className='mb-8 text-center'>
                <h1 className='text-4xl font-bold text-gray-800 mb-2'>All Posts</h1>
                <p className='text-gray-600'>Browse through all our amazing content</p>
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

export default AllPosts