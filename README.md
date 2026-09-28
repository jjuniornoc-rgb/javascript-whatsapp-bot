# 📱 JavaScript WhatsApp Bot (`Baileys Multi-Device`)

Um bot moderno, leve e assíncrono para **WhatsApp Multi-Device** em **JavaScript (Node.js)** utilizando o framework oficial da comunidade [`@whiskeysockets/baileys`](https://github.com/WhiskeySockets/Baileys).

Não requer navegador pesado (como Puppeteer/Selenium) pois se comunica diretamente via **WebSockets puros** com a infraestrutura do WhatsApp, consumindo menos de 100MB de RAM.

Totalmente preparado para hospedagem local e nuvem como **Discloud**.

---

## 🚀 Funcionalidades

- 📲 **Conexão Multi-Device**: Escaneie o QR Code direto no terminal uma única vez.
- 💾 **Persistência de Sessão**: Armazena as chaves criptográficas em pasta local (`auth_info_baileys/`) para reconexão automática sem pedir QR Code novamente.
- 🏓 **Comando `!ping` ou `/ping`**:
  - Latência de processamento em milissegundos.
  - Tempo de atividade do bot (*Uptime* formatado em horas, minutos e segundos).
  - Consumo de memória RAM em tempo real.
  - Informações do ambiente Node.js.
- ☁️ **Compatível com Discloud**: Arquivo `discloud.config` pronto para deploy na Discloud com apenas 100MB de RAM.

---

## 📁 Estrutura do Projeto

```text
javascript-whatsapp-bot/
├── index.js               # Ponto de entrada, autenticação e handler de mensagens
├── package.json           # Dependências e scripts
├── discloud.config        # Arquivo de configuração da Discloud
├── .env.example           # Modelo de variáveis de ambiente
├── .gitignore             # Arquivos e sessões ignorados pelo Git
└── README.md              # Documentação do projeto
```

---

## 🛠️ Pré-requisitos

- **Node.js 18+** instalado.
- Smartphone com o aplicativo do **WhatsApp** instalado.

---

## ⚙️ Configuração e Instalação Local

### 1. Clonar o Repositório
```bash
git clone https://github.com/jjuniornoc-rgb/javascript-whatsapp-bot.git
cd javascript-whatsapp-bot
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente (Opcional)
```bash
cp .env.example .env
```

---

## ▶️ Executando o Bot

```bash
npm start
```

1. Um **QR Code** será exibido no seu terminal.
2. Abra o WhatsApp no seu celular:
   - **Android**: Toque nos três pontinhos verticais no canto superior direito > **Aparelhos conectados** > **Conectar um aparelho**.
   - **iPhone (iOS)**: Toque em **Configurações** > **Aparelhos conectados** > **Conectar um aparelho**.
3. Aponte a câmera para o QR Code no terminal.
4. Assim que autenticar, envie `!ping` ou `/ping` em qualquer conversa para receber as estatísticas do bot!

---

## ☁️ Hospedagem na Discloud

1. Comprima os seguintes arquivos num arquivo `.zip`:
   - `index.js`
   - `package.json`
   - `discloud.config`
   - `.env`
2. No painel da [Discloud](https://discloudbot.com) ou via CLI da Discloud:
   ```bash
   discloud upload
   ```
3. Acompanhe os logs na Discloud para visualizar o QR Code inicial ou conecte localmente primeiro para enviar a pasta `auth_info_baileys` salva.

---

## 📜 Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para mais informações.
