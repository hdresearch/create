import express from 'express';
import path from 'path';
import agent from '../agent';
import browser from '../extensions/browser';
import { AgentBrowser, Logger } from 'nolita';
import { ModelResponseSchema } from 'nolita/dist/types/browser/actionStep.types';
import inventory from '../extensions/inventory';

const app = express();
const port = 3040;


app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

// In prod, serve the front-end
if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, '../app/dist')));
}

app.post('/api/browse', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    const logger = new Logger("info", (msg) => res.write(msg));
    const agentBrowser = new AgentBrowser(
        agent,
        browser,
        logger,
        inventory
    )
    const answer = await agentBrowser.browse({
        startUrl: req.query.url as string,
        objective: [req.query.objective as string],
        maxIterations: req.query.maxIterations as number || 10
    },
    ModelResponseSchema
    );
    await agentBrowser.close();
    if (answer) {
        res.write(`data: ${JSON.stringify(answer)}\n\n`);
        res.end();
    }
});