import { jest, describe, test, expect } from '@jest/globals';
import { extractJSON } from '../services/gemini.service.js';

describe('5. Gemini AI Service Tests', () => {
    test('Should parse valid JSON out of markdown backticks', () => {
        
        const fakedAIResult = "Here is the result.\n```json\n{\"category\":\"Bug\", \"sentiment\":\"Negative\", \"priority_score\":8, \"summary\":\"Help fix\", \"tags\":[\"UI\"]}\n```";
        
        const result = extractJSON(fakedAIResult);

        expect(result).not.toBeNull();
        expect(result.category).toBe("Bug");
        expect(result.sentiment).toBe("Negative");
        expect(result.priority_score).toBe(8);
        expect(result.tags).toContain("UI");
    });
});
