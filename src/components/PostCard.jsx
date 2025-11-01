import React from 'react'
import appwriteService from "../appwrite/config"
import {Link} from 'react-router-dom'

function PostCard({$id, title, featuredimage}) {
    const [imageError, setImageError] = React.useState(false);
    const [imageUrl, setImageUrl] = React.useState(null);

    React.useEffect(() => {
        if (!featuredimage) {
            console.log('⚠️ PostCard: No featuredimage provided for post:', title || $id);
            setImageError(true);
            return;
        }
        try {
            const url = appwriteService.getFilePreview(featuredimage);
            if (!url) {
                console.error('❌ PostCard: No URL generated for fileId:', featuredimage);
                setImageError(true);
                return;
            }
            console.log('📷 PostCard: Image URL generated:', url, 'for post:', title || $id, 'fileId:', featuredimage);
            setImageUrl(url);
        } catch (error) {
            console.error('❌ PostCard: Error generating image URL:', error);
            setImageError(true);
        }
    }, [featuredimage, title, $id]);

    const handleImageError = (e) => {
        console.error('❌ PostCard: Image failed to load from URL:', e.target.src);
        console.error('  File ID was:', featuredimage);
        console.error('💡 This usually means bucket permissions need to be set.');
        console.error('💡 Go to Appwrite Console → Storage → Your Bucket → Permissions');
        console.error('💡 Add "Anyone" role with "Read" permission');
        setImageError(true);
    }
    
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden group'>
            <div className='w-full justify-center mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center min-h-[192px]'>
                {imageError || !imageUrl ? (
                    <div className='flex flex-col items-center justify-center text-gray-400 p-4 w-full h-48'>
                        <svg className='w-20 h-20 mb-3 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                        </svg>
                        <p className='text-sm text-gray-500 text-center font-medium'>{featuredimage ? 'Image not available' : 'No image uploaded'}</p>
                    </div>
                ) : (
                    <img 
                        src={imageUrl} 
                        alt={title || 'Post image'}
                        className='w-full h-48 object-cover rounded-xl transition-transform duration-300 group-hover:scale-110'
                        onError={handleImageError}
                        loading='lazy'
                    />
                )}
            </div>
            <h2 className='text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-200 line-clamp-2'>
              {title || 'Untitled Post'}
            </h2>
        </div>
    </Link>
  )
}


export default PostCard