import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        // Check if using placeholder values
        const isPlaceholder = !conf.appwriteProjectId || 
                             conf.appwriteProjectId === 'your-project-id-here' || 
                             conf.appwriteProjectId.trim() === '';
        
        if (!conf.appwriteUrl || !conf.appwriteProjectId || isPlaceholder) {
            if (isPlaceholder) {
                console.warn('⚠️ Appwrite configuration is using placeholder values.');
                console.warn('📝 Please update your .env file with your actual Appwrite credentials.');
                console.warn('📖 See ENV_SETUP.md for setup instructions.');
            } else {
                console.error('❌ Appwrite configuration is missing. Please configure your .env file with valid Appwrite credentials.');
            }
            // Still initialize but methods will check
        }
        
        try {
            if (conf.appwriteUrl && conf.appwriteProjectId && !isPlaceholder) {
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
                console.log('✅ Appwrite Service initialized successfully');
                console.log('  - Bucket ID:', conf.appwriteBucketId);
                console.log('  - Database ID:', conf.appwriteDatabaseId);
                console.log('  - Collection ID:', conf.appwriteCollectionId);
            } else {
                console.warn('⚠️ Appwrite Service not fully initialized');
            }
        } catch (error) {
            console.error('❌ Failed to initialize Appwrite Service client:', error);
        }
    }

    async createPost({title, slug, content, featuredimage, status, userId}){
        if (!this.databases) {
            throw new Error('Appwrite Service not initialized. Please check your .env configuration.');
        }
        try {
            // Ensure content is a string
            const contentString = typeof content === 'string' ? content : String(content || '');
            
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content: contentString,
                    featuredimage,
                    status,
                    userId,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
            // Re-throw to allow error handling in components
            throw error;
        }
    }

    async updatePost(slug, {title, content, featuredimage, status}){
        if (!this.databases) {
            throw new Error('Appwrite Service not initialized. Please check your .env configuration.');
        }
        try {
            // Ensure content is a string
            const contentString = typeof content === 'string' ? content : String(content || '');
            
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content: contentString,
                    featuredimage,
                    status,

                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
            // Re-throw to allow error handling in components
            throw error;
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        if (!this.databases) {
            console.warn("⚠️ Appwrite Service not initialized. Please check your .env configuration.");
            return false;
        }
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
                

            )
        } catch (error) {
            console.error("Appwrite serive :: getPosts :: error", error);
            if (error.code === 401 || error.type === 'general_unauthorized_scope') {
                console.error('❌ Database permission error: Collection does not allow public read access.');
                console.error('📝 Solution: Go to Appwrite Console → Database → Collection → Permissions');
                console.error('📝 Add "Anyone" role with "Read" permission to allow public access to posts');
                console.error('📖 See DATABASE_PERMISSIONS.md for detailed instructions');
            }
            return false
        }
    }

    // file upload service

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

    getFilePreview(fileId){
        // Use getFileView instead since getFilePreview requires image transformations
        // which may not be available on all Appwrite plans
        return this.getFileView(fileId);
    }

    getFileView(fileId){
        if (!this.bucket) {
            console.error('❌ getFileView: Bucket not initialized. Check Appwrite configuration.');
            return null;
        }
        if (!fileId) {
            console.warn('⚠️ getFileView: fileId is missing or empty');
            return null;
        }
        if (!conf.appwriteBucketId || conf.appwriteBucketId === 'your-bucket-id-here') {
            console.error('❌ getFileView: Bucket ID not configured in .env');
            return null;
        }
        try {
            const url = this.bucket.getFileView(
            conf.appwriteBucketId,
            fileId
            );
            console.log('✅ getFileView: Generated URL:', url, 'for fileId:', fileId);
            return url;
        } catch (error) {
            console.error('❌ getFileView: Error generating view:', error);
            console.error('FileId:', fileId, 'BucketId:', conf.appwriteBucketId);
            return null;
        }
    }
}


const service = new Service()
export default service