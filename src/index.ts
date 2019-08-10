/* eslint-disable require-atomic-updates */
require('dotenv').config();
const debug = require('debug')('sharex-server/index.ts');

import Koa from 'koa';
import Router from 'koa-router';
import KoaMorgan from 'koa-morgan';
import KoaBody from 'koa-body';
import httpError from 'http-errors';
import randomString from 'crypto-random-string';
import fse from 'fs-extra';
import serveStatic from 'koa-static';

const app: Koa = new Koa();
const router: Router = new Router();

// Error catcher
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		ctx.app.emit('error', err, ctx);
	}
});

router.post('/upload', async (ctx: Koa.Context) => {
	if (ctx.request.files !== undefined && ctx.request.files.uploadedFile !== undefined) {
		const file = ctx.request.files.uploadedFile;
		let newFileName: string = randomString({ length: parseInt(process.env.FILE_NAME_LENGTH as string), characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890' });
		let fileExt = file.name.split('.').pop();

		await fse.copy(file.path, `./uploaded/${newFileName}.${fileExt}`);
		debug(`${newFileName}.${fileExt}`);
		ctx.status = 200;
		ctx.body = `${process.env.URL_PROTOCOL}://${process.env.URL_BASE}/${newFileName}.${fileExt}`;
	} else {
		throw httpError(400, 'No file uploaded with key "uploadedFile"');
	}

});

router.get('/', async (ctx: Koa.Context) => {
	ctx.body = 'Hello World!';
});

app.use(serveStatic('./uploaded', { hidden: true, immutable: true }));

app.on('error', (err, ctx) => {
	ctx.status = err.status || 500;
	ctx.body = err;
});

app.use(KoaBody({ multipart: true }));
app.use(KoaMorgan(process.env.KOA_MORGAN_CONFIG as string));
app.use(router.routes());

app.listen(process.env.APP_INTERNAL_PORT as string);

debug(`Server running on port ${process.env.APP_INTERNAL_PORT}`);