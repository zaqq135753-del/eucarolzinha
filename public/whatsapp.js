// Compatibility for older imports; all contact links now use Telegram.
import {TELEGRAM_BOT_URL} from './config.js';
export function whatsappUrl(){return `${TELEGRAM_BOT_URL}?start=site`;}
