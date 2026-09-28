import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import 'dotenv/config';

const startTime = Date.now();

function formatUptime(uptimeSec) {
  const hours = Math.floor(uptimeSec / 3600);
  const minutes = Math.floor((uptimeSec % 3600) / 60);
  const seconds = Math.floor(uptimeSec % 60);
  return `${hours}h ${minutes}m ${seconds}s`;
}

async function startBot() {
  console.log('🔄 Inicializando autenticação e sessão do WhatsApp...');

  // Gerencia o estado da sessão em pasta local
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');
  const { version, isLatest } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '20.0.04']
  });

  // Salva credenciais atualizadas
  sock.ev.on('creds.update', saveCreds);

  // Monitora atualizações de conexão e QR Code
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n📲 ESCANEIE O QR CODE ABAIXO COM O SEU WHATSAPP:');
      qrcode.generate(qr, { small: true });
      console.log('👉 WhatsApp > Configurações / Aparelhos conectados > Conectar um aparelho\n');
    }

    if (connection === 'close') {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log(`⚠️ Conexão encerrada. Motivo: ${lastDisconnect?.error}`);
      if (shouldReconnect) {
        console.log('🔄 Reconectando ao WhatsApp em 3 segundos...');
        setTimeout(startBot, 3000);
      } else {
        console.log('❌ Sessão desconectada pelo aparelho. Exclua a pasta auth_info_baileys e reinicie.');
      }
    } else if (connection === 'open') {
      console.log('==================================================');
      console.log(`🤖 Bot WhatsApp Conectado: ${sock.user?.id || 'Multi-Device'}`);
      console.log('⚡ Framework:     @whiskeysockets/baileys (JavaScript)');
      console.log(`📦 Versão Web:   ${version.join('.')} (Última: ${isLatest})`);
      console.log('==================================================');
      console.log('🟢 Bot online e pronto para responder a comandos (!ping ou /ping)!');
    }
  });

  // Monitora mensagens recebidas
  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg || !msg.message) return;

    // Extrai o texto da mensagem
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      msg.message.videoMessage?.caption ||
      '';

    const cleanText = text.trim().toLowerCase();

    // Comando !ping ou /ping
    if (cleanText === '!ping' || cleanText === '/ping') {
      const startProcess = Date.now();
      const remoteJid = msg.key.remoteJid;

      // Cálculo de latência e uptime
      const latencyMs = Date.now() - startProcess;
      const uptimeSec = (Date.now() - startTime) / 1000;
      const uptimeFormatted = formatUptime(uptimeSec);
      const usedMemMb = (process.memoryUsage().rss / (1024 * 1024)).toFixed(1);

      const responseText =
        `🏓 *Pong! Estatísticas do Bot (JavaScript)*\n\n` +
        `⚡ *Latência de Resposta:* \`${latencyMs}ms\`\n` +
        `⏱️ *Tempo Ativo (Uptime):* \`${uptimeFormatted}\`\n` +
        `📱 *Framework:* \`@whiskeysockets/baileys\`\n` +
        `🟢 *Status:* \`Online & Conectado via WhatsApp Multi-Device\`\n` +
        `⚙️ *Runtime:* \`Node.js ${process.version}\`\n` +
        `🧠 *Memória Usada:* \`${usedMemMb}MB\`\n\n` +
        `_Mensagem processada com sucesso!_`;

      await sock.sendMessage(remoteJid, { text: responseText }, { quoted: msg });
      console.log(`📩 Comando !ping respondido para ${remoteJid}`);
    }
  });
}

startBot();
