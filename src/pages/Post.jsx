import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredimage);
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-12">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <div className="w-full flex justify-center mb-8 relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-200 to-gray-300 min-h-[400px] flex items-center justify-center">
                        {post.featuredimage ? (
                    <img
                        src={appwriteService.getFilePreview(post.featuredimage)}
                                alt={post.title || 'Post image'}
                                className="w-full h-[400px] object-cover"
                                onError={(e) => {
                                    console.error('❌ Post: Image failed to load:', e.target.src);
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div className="hidden flex-col items-center justify-center text-gray-400 p-8 min-h-[400px] w-full">
                            <svg className='w-32 h-32 mb-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                            </svg>
                            <p className='text-lg text-gray-500 font-medium'>Image not available</p>
                        </div>

                    {isAuthor && (
                            <div className="absolute right-6 top-6 flex gap-3">
                            <Link to={`/edit-post/${post.$id}`}>
                                    <Button bgColor="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" className="shadow-lg">
                                    Edit
                                </Button>
                            </Link>
                                <Button bgColor="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" onClick={deletePost} className="shadow-lg">
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                    <article className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                        <h1 className="text-4xl font-bold text-gray-800 mb-6">{post.title}</h1>
                        <div className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-purple-600">
                    {parse(post.content)}
                        </div>
                    </article>
                    </div>
            </Container>
        </div>
    ) : null;
}           