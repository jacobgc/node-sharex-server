require('dotenv').config();
const debug = require('debug')('sharex-server/index.ts');

import Koa from 'koa';
import Router from 'koa-router';
import KoaLogger from 'koa-logger';

const app: Koa = new Koa();
const router: Router = new Router();

router.get('/*', async (ctx: Koa.Context) => {
	ctx.body = 'Hello World!';
});

app.use(KoaLogger);
app.use(router.routes());

app.listen(process.env.APP_INTERNAL_PORT);

debug(`Server running on port ${process.env.APP_INTERNAL_PORT}`);