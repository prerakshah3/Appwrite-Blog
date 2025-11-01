import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        try {
            // Ensure content is a string
            const content = typeof data.content === 'string' ? data.content : String(data.content || '');
            
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                appwriteService.deleteFile(post.featuredimage);
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                    title: data.title,
                    content: content,
                featuredimage: file ? file.$id : undefined,
                    status: data.status,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                const fileId = file.$id;
                    const dbPost = await appwriteService.createPost({ 
                        title: data.title,
                        slug: data.slug,
                        content: content,
                        featuredimage: fileId,
                        status: data.status,
                        userId: userData.$id 
                    });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
                } else {
                    alert('Please upload a featured image');
                }
            }
        } catch (error) {
            console.error('Error submitting post:', error);
            let errorMessage = 'Unknown error occurred';
            
            if (error.message) {
                if (error.message.includes('255') || error.message.includes('255 chars')) {
                    errorMessage = 'Error: Content field is limited to 255 characters in your database. Please update your Appwrite database schema - see DATABASE_SETUP.md for instructions.';
                } else if (error.message.includes('Invalid document structure')) {
                    errorMessage = 'Error: Invalid document structure. Please check your Appwrite database schema - see DATABASE_SETUP.md for setup instructions.';
                } else {
                    errorMessage = error.message;
                }
            } else if (error.type) {
                errorMessage = `Appwrite Error (${error.type}): ${error.message || 'Please check your database configuration'}`;
            }
            
            alert(errorMessage);
        }
    };

     const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

            // const slug = value.toLowerCase()    anthor method
            //                   .replace(/ /g, '-')
            // setValue('slug',slug)
            // return slug

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {post ? "Edit Post" : "Create New Post"}
                </h2>
                <p className="text-gray-600">Share your thoughts and ideas with the world</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                <Input 
                        placeholder="Enter post title"
                        label="Title"
                        className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                        label="Slug"
                        placeholder="Post slug (auto-generated)"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                    <RTE label="Content" name="content" control={control} defaultValue={getValues("content")} />
            </div>
                
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <Input
                            label="Featured Image"
                    type="file"
                            className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                        {post && post.featuredimage && (
                            <div className="w-full mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 min-h-[192px] flex items-center justify-center">
                        <img
                            src={appwriteService.getFilePreview(post.featuredimage)}
                                    alt={post.title || 'Current post image'}
                                    className="w-full h-48 object-cover rounded-xl"
                                    onError={(e) => {
                                        console.error('❌ PostForm: Image failed to load:', e.target.src);
                                        e.target.style.display = 'none';
                                    }}
                        />
                    </div>
                )}
                <Select
                    options={["-Select-","active", "inactive"]}
                            label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                        <Button 
                            type="submit" 
                            bgColor={post ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700"} 
                            className="w-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            {post ? "Update Post" : "Publish Post"}
                </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
