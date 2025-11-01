import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";


export class AuthService {
    client = new Client();
    account;

    constructor() {
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
            // Still initialize with placeholder to prevent crashes, but methods will check
        }
        
        try {
            if (conf.appwriteUrl && conf.appwriteProjectId && !isPlaceholder) {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
            }
        } catch (error) {
            console.error('❌ Failed to initialize Appwrite Auth client:', error);
        }
    }

    async createAccount({email, password, name}) {
        if (!this.account) {
            throw new Error('Appwrite is not configured. Please set up your .env file with valid Appwrite credentials.');
        }
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            // Return account without auto-login - user will need to login manually
            return userAccount;
        } catch (error) {
            throw error;
        }
    }

    async login({email, password}) {
        if (!this.account) {
            throw new Error('Appwrite is not configured. Please set up your .env file with valid Appwrite credentials.');
        }
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        if (!this.account) {
            console.warn("⚠️ Appwrite Auth not initialized. Please check your .env configuration.");
            return null;
        }
        try {
            return await this.account.get();
        } catch (error) {
            // Silently return null for unauthenticated users
            if (error.type === 'general_unauthorized_scope') {
                return null;
            }
            console.log("Appwrite serive :: getCurrentUser :: error", error);
        }

        return null;
    }

    async logout() {
        if (!this.account) {
            console.warn("⚠️ Appwrite Auth not initialized. Logout skipped.");
            return;
        }
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService


