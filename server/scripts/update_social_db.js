import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://qwertyuiop01152999615_db_user:oJnjXrVagmq20iPr@cluster0.o8men4d.mongodb.net/?retryWrites=true&w=majority';

async function updateSocialLinks() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: 'test' });
    console.log('Connected to MongoDB!');

    const db = mongoose.connection.db;

    // 1. Update SiteSettings
    const settingsUpdate = {
      $set: {
        linkedin_url: 'https://www.linkedin.com/in/mohamed-hamdey/',
        youtube_url: 'https://www.youtube.com/@coding-keys',
        facebook_url: 'https://www.facebook.com/m0hamedhamdy1/?locale=ar_AR',
        github_url: 'https://github.com/mohamdhamd'
      }
    };
    const settingsResult = await db.collection('sitesettings').updateMany({}, settingsUpdate);
    console.log(`Updated SiteSettings documents: ${settingsResult.modifiedCount} / matched ${settingsResult.matchedCount}`);

    // 2. Update Resumes
    const resumeUpdate = {
      $set: {
        'personal.linkedin': 'linkedin.com/in/mohamed-hamdey',
        'personal.linkedin_url': 'https://www.linkedin.com/in/mohamed-hamdey/',
        'personal.youtube_url': 'https://www.youtube.com/@coding-keys',
        'personal.facebook_url': 'https://www.facebook.com/m0hamedhamdy1/?locale=ar_AR',
        'personal.github_url': 'https://github.com/mohamdhamd'
      }
    };
    const resumeResult = await db.collection('resumes').updateMany({}, resumeUpdate);
    console.log(`Updated Resumes documents: ${resumeResult.modifiedCount} / matched ${resumeResult.matchedCount}`);

    const updatedSettings = await db.collection('sitesettings').findOne({});
    console.log('Updated settings sample:', {
      linkedin_url: updatedSettings?.linkedin_url,
      youtube_url: updatedSettings?.youtube_url,
      facebook_url: updatedSettings?.facebook_url,
      github_url: updatedSettings?.github_url
    });

    await mongoose.disconnect();
    console.log('Finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error updating social links:', err);
    process.exit(1);
  }
}

updateSocialLinks();
