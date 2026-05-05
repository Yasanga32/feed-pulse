const mongoose = require('mongoose');
const url = 'mongodb+srv://yasangashanuka33_db_user:Shanuka32@cluster0.mbu2dum.mongodb.net/feedpulse';

async function migrate() {
    try {
        await mongoose.connect(url);
        console.log('Connected to MongoDB');
        
        const result = await mongoose.connection.collection('feedbacks').updateMany(
            {}, 
            { $set: { appId: 'cancer-platform' } }
        );
        
        console.log(`Updated ${result.modifiedCount} feedback records to 'cancer-platform'`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
