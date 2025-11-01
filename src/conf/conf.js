// Validate environment variables
const getEnvVar = (key, defaultValue = '') => {
    const value = import.meta.env[key];
    if (!value || value === 'undefined' || value === '') {
        console.warn(`⚠️ Environment variable ${key} is not set. Using default: ${defaultValue}`);
        return defaultValue;
    }
    return String(value);
};

const appwriteUrl = getEnvVar('VITE_APPWRITE_URL', 'https://cloud.appwrite.io/v1');
const appwriteProjectId = getEnvVar('VITE_APPWRITE_PROJECT_ID');

// Validate URL format
const isValidUrl = (urlString) => {
    try {
        new URL(urlString);
        return true;
    } catch {
        return false;
    }
};

if (!isValidUrl(appwriteUrl)) {
    console.error(`❌ Invalid Appwrite URL: ${appwriteUrl}`);
    console.error('Please set VITE_APPWRITE_URL in your .env file');
}

if (!appwriteProjectId || appwriteProjectId === 'your-project-id-here') {
    console.warn('⚠️ Appwrite Project ID is not configured');
    console.warn('📝 Please set VITE_APPWRITE_PROJECT_ID in your .env file');
    console.warn('📖 Check ENV_SETUP.md for detailed setup instructions');
}

const conf = {
    appwriteUrl: appwriteUrl,
    appwriteProjectId: appwriteProjectId,
    appwriteDatabaseId: getEnvVar('VITE_APPWRITE_DATABASE_ID'),
    appwriteCollectionId: getEnvVar('VITE_APPWRITE_COLLECTION_ID'),
    appwriteBucketId: getEnvVar('VITE_APPWRITE_BUCKET_ID'),
}

// there was a name issue with the import.meta.env.VITE_APPWRITE_URL, it was later fixed in debugging video

export default conf