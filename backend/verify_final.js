import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function runVerification() {
    console.log('--- Starting Backend Final Verification ---');

    // 1. Test Login (Check JSON Structure)
    let token = '';
    try {
        console.log('Testing Login...');
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@gmail.com',
            password: 'admin123'
        });
        
        const keys = Object.keys(response.data);
        const expectedKeys = ['success', 'data', 'error', 'message'];
        const hasAllKeys = expectedKeys.every(key => keys.includes(key));
        
        if (hasAllKeys && response.data.data.token) {
            token = response.data.data.token;
            console.log('✅ Login Response Structure: OK');
        } else {
            console.log('❌ Login Response Structure: FAILED', keys);
        }
    } catch (err) {
        console.log('❌ Login Request: FAILED', err.message);
    }

    // 2. Test Input Sanitization (XSS Prevention)
    try {
        console.log('Testing Input Sanitization...');
        const dirtyDescription = '<script>alert("xss")</script> This is a long description to pass validation.';
        const response = await axios.post(`${BASE_URL}/feedback`, {
            title: '<b>Dangerous Title</b>',
            description: dirtyDescription,
            category: 'Bug'
        });

        const savedFeedback = response.data.data;
        if (savedFeedback.title.includes('&lt;b&gt;') && savedFeedback.description.includes('&lt;script&gt;')) {
            console.log('✅ Input Sanitization: OK (Stripped HTML)');
        } else {
            console.log('❌ Input Sanitization: FAILED', { title: savedFeedback.title, desc: savedFeedback.description });
        }
    } catch (err) {
        console.log('❌ Sanitization Test: FAILED', err.response?.data || err.message);
    }

    // 3. Test Stats (Check JSON Structure)
    try {
        console.log('Testing Stats Structure...');
        const response = await axios.get(`${BASE_URL}/feedback/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const keys = Object.keys(response.data);
        if (keys.includes('success') && keys.includes('data') && keys.includes('error') && keys.includes('message')) {
            console.log('✅ Stats Response Structure: OK');
        } else {
            console.log('❌ Stats Response Structure: FAILED', keys);
        }
    } catch (err) {
        console.log('❌ Stats Request: FAILED', err.message);
    }

    console.log('--- Final Verification Complete ---');
}

runVerification();
