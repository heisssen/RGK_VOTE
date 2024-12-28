export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json({
            message: 'Hello from /api/data!',
            data: { someKey: 'someValue' }
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: 'Method not allowed' });
    }
}
