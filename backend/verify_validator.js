import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function runVerification() {
    console.log('--- Starting Validator Verification ---');

    // 1. Test Description Too Short
    try {
        console.log('Testing Short Description...');
        await axios.post(`${BASE_URL}/feedback`, {
            title: 'Test Title',
            description: 'Too short',
            category: 'Bug'
        });
    } catch (err) {
        if (err.response?.status === 400 && err.response.data.message.includes('at least 20 characters')) {
            console.log('✅ Validation: Correctly rejected short description');
        } else {
            console.log('❌ Validation: FAILED to reject short description', err.response?.data);
        }
    }

    // 2. Test HTML Escaping
    try {
        console.log('Testing HTML Escaping...');
        const response = await axios.post(`${BASE_URL}/feedback`, {
            title: '<b>Bold Title</b>',
            description: 'This is a long description with <i>italics</i> to pass the length check.',
            category: 'Feature'
        });

        const data = response.data.data;
        if (data.title.includes('&lt;b&gt;') && data.description.includes('&lt;i&gt;')) {
            console.log('✅ Sanitization: Correctly escaped HTML tags');
        } else {
            console.log('❌ Sanitization: FAILED to escape HTML tags', { title: data.title, desc: data.description });
        }
    } catch (err) {
        console.log('❌ Request: FAILED', err.response?.data || err.message);
    }

    console.log('--- Validator Verification Complete ---');
}

runVerification();
