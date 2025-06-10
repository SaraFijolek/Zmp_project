// src/__tests__/api.test.ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { login, getUsers } from '../api/api';

const server = setupServer(
    rest.post('/api/login', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ token: 'abc123' }));
    }),
    rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.json([{ id: 1, name: 'Jan' }]));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API calls', () => {
    it('login zwraca token', async () => {
        const res = await login('user@example.com', 'pass');
        expect(res.token).toBe('abc123');
    });

    it('getUsers pobiera listę użytkowników', async () => {
        const users = await getUsers();
        expect(users).toHaveLength(1);
        expect(users[0].name).toBe('Jan');
    });
});
