import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import request from 'supertest';

import app from '../server.js';
import { Feedback } from '../models/feedback.model.js';
import { geminiService } from '../services/gemini.service.js';
import jwt from 'jsonwebtoken';

describe('Feedback API Unit Tests', () => {

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    // 1. Validation Test
    test('POST /api/feedback - rejects empty title', async () => {
        const response = await request(app)
            .post('/api/feedback')
            .send({
                title: "",
                description: "This is a valid description with enough characters",
                category: "Bug"
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("Title");
    });


    // 2. Valid Submission Test
    test('POST /api/feedback - valid submission saves to DB and triggers AI', async () => {

        const mockFeedback = {
            title: "Dark mode issue",
            description: "Dark mode turns entire UI white when toggled",
            category: "Bug"
        };

        const mockSavedFeedback = {
            _id: "12345",
            ...mockFeedback,
            ai_processed: false
        };

        const mockAIResponse = {
            category: "Bug",
            sentiment: "Negative",
            priority_score: 7,
            summary: "Dark mode UI bug",
            tags: ["UI", "Bug"]
        };

        jest.spyOn(Feedback, 'create').mockResolvedValue(mockSavedFeedback as any);
        jest.spyOn(geminiService, 'analyzeFeedback').mockResolvedValue(mockAIResponse as any);
        jest.spyOn(Feedback, 'findByIdAndUpdate').mockResolvedValue(mockSavedFeedback as any);

        const response = await request(app)
            .post('/api/feedback')
            .send(mockFeedback);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(Feedback.create).toHaveBeenCalled();
    });


    // 3. PATCH Status Update Test
    test('PATCH /api/feedback/:id - status update works correctly', async () => {

        jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'admin123' } as any);

        const mockUpdatedFeedback = {
            _id: "12345",
            status: "Resolved"
        };

        jest.spyOn(Feedback, 'findByIdAndUpdate')
            .mockResolvedValue(mockUpdatedFeedback as any);

        const response = await request(app)
            .patch('/api/feedback/12345')
            .set('Authorization', 'Bearer faketoken')
            .send({ status: "Resolved" });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe("Resolved");
    });


    // 4. Auth Middleware Test
    test('Auth middleware rejects unauthenticated requests', async () => {

        const response = await request(app)
            .patch('/api/feedback/12345')
            .send({ status: "Resolved" });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });


    // 5. Gemini Service Test (Mock API Call)
    test('Gemini service parses AI response correctly', async () => {

        const mockAIResponse = {
            category: "Feature",
            sentiment: "Positive",
            priority_score: 6,
            summary: "User requested new feature",
            tags: ["Feature"]
        };

        jest.spyOn(geminiService, 'analyzeFeedback')
            .mockResolvedValue(mockAIResponse as any);

        const result = await geminiService.analyzeFeedback("Test title", "Test description");

        expect(result.category).toBe("Feature");
        expect(result.sentiment).toBe("Positive");
    });

});