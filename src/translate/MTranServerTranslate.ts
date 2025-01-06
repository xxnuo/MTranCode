import { BaseTranslate } from './baseTranslate';
import got from 'got';
import { ITranslateOptions } from 'comment-translate-manager';
import { getConfig } from '../configuration';

export class MTranServerTranslate extends BaseTranslate {
    override readonly maxLen = 10000;

    async _translate(content: string, { from = 'auto', to = 'auto' }: ITranslateOptions): Promise<string> {
        let apiUrl = getConfig<string>('MTranServer.apiUrl', 'http://localhost:8989');
        
        if (apiUrl.endsWith('/')) {
            apiUrl = apiUrl.slice(0, -1);
        }

        const url = `${apiUrl}/translate`;

        try {
            const res: any = await got.post(url, {
                json: {
                    from: from,
                    to: to,
                    text: content,
                    html: false
                },
                timeout: { request: 10000 }
            }).json();

            if (res && res.result) {
                return res.result;
            }
            return '';
        } catch (e) {
            return '';
        }
    }
}
