import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    openaiApiKey: process.env.OPENAI_API_KEY,
};

if (!config.openaiApiKey) {
    console.warn('WARNING: OPENAI_API_KEY is not set in environment variables.');
}
