const request = require('supertest');
const app = require('../src/queen');

describe('Queen.js Signal Ingestion', () => {
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.body).toEqual({
        status: 'healthy',
        service: 'queen-signal-ingestion'
      });
    });
  });

  describe('POST /signals/academic', () => {
    it('should accept a valid academic signal', async () => {
      const signal = {
        subject: 'Research Paper',
        from: 'researcher@university.edu',
        content: 'Test content'
      };

      const res = await request(app)
        .post('/signals/academic')
        .send(signal)
        .expect(200);

      expect(res.body.status).toBe('accepted');
      expect(res.body.classification).toBeDefined();
      expect(res.body.result).toBeDefined();
      expect(res.body.timestamp).toBeDefined();
    });

    it('should classify urgent signals as high priority', async () => {
      const signal = {
        subject: 'Urgent Research Deadline',
        from: 'researcher@university.edu',
        content: 'Important findings'
      };

      const res = await request(app)
        .post('/signals/academic')
        .send(signal)
        .expect(200);

      expect(res.body.classification.priority).toBe('high');
      expect(res.body.classification.tags).toContain('deadline');
    });

    it('should classify research content appropriately', async () => {
      const signal = {
        subject: 'Research Paper Submission',
        from: 'researcher@university.edu',
        content: 'Paper details'
      };

      const res = await request(app)
        .post('/signals/academic')
        .send(signal)
        .expect(200);

      expect(res.body.classification.type).toBe('academic-research');
      expect(res.body.classification.tags).toContain('research');
      expect(res.body.result.handler).toBe('research-processor');
    });

    it('should route high priority signals to priority queue', async () => {
      const signal = {
        subject: 'Critical Alert',
        from: 'admin@university.edu',
        content: 'Urgent matter'
      };

      const res = await request(app)
        .post('/signals/academic')
        .send(signal)
        .expect(200);

      expect(res.body.classification.priority).toBe('high');
      expect(res.body.result.handler).toBe('priority-queue');
    });
  });

  describe('POST /signals/:category', () => {
    it('should accept signals for custom categories', async () => {
      const signal = {
        subject: 'Test Signal',
        content: 'Test content'
      };

      const res = await request(app)
        .post('/signals/research')
        .send(signal)
        .expect(200);

      expect(res.body.status).toBe('accepted');
      expect(res.body.classification.category).toBe('research');
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully', async () => {
      // Send invalid data that might cause processing errors
      const res = await request(app)
        .post('/signals/academic')
        .send(null)
        .expect(200); // Should still accept even with null body

      expect(res.body.status).toBe('accepted');
    });
  });
});
