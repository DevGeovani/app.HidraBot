const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.json());
const PORT = 3000;

// ============ BANCO DE DADOS ============
const db = new sqlite3.Database('./water_delivery.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    gallons INTEGER DEFAULT 1,
    order_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    message TEXT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
  )`);
});

// ============ WHATSAPP ============
const whatsappClient = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true }
});

whatsappClient.on('qr', (qr) => {
  console.log('📱 Escaneie o QR Code:');
  qrcode.generate(qr, { small: true });
});

whatsappClient.on('ready', () => {
  console.log('✅ WhatsApp conectado!');
});

whatsappClient.initialize();

// ============ ALGORITMO DE CÁLCULO ============
function calculateAverageDays(orders) {
  if (orders.length < 2) return null;
  
  const intervals = [];
  for (let i = 1; i < orders.length; i++) {
    const prev = new Date(orders[i-1].order_date);
    const curr = new Date(orders[i].order_date);
    const days = Math.ceil((curr - prev) / (1000 * 60 * 60 * 24));
    intervals.push(days);
  }
  
  return Math.round(intervals.reduce((a,b) => a+b) / intervals.length);
}

// ============ ENVIAR MENSAGEM ============
async function sendWhatsAppMessage(phone, name, avgDays) {
  try {
    const chatId = phone.includes('@c.us') ? phone : `${phone}@c.us`;
    const message = `Olá ${name}! 😊\n\nNotamos que você costuma pedir água a cada *${avgDays} dias*.\n\nGostaria de solicitar um novo galão? 💧\n\nResponda *SIM* para confirmar!`;
    
    await whatsappClient.sendMessage(chatId, message);
    console.log(`✅ Mensagem enviada: ${name}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro: ${error}`);
    return false;
  }
}

// ============ VERIFICAÇÃO AUTOMÁTICA ============
function checkClients() {
  db.all('SELECT * FROM clients', [], (err, clients) => {
    clients.forEach(client => {
      db.all(
        'SELECT * FROM orders WHERE client_id = ? ORDER BY order_date ASC',
        [client.id],
        async (err, orders) => {
          if (orders.length < 2) return;
          
          const avgDays = calculateAverageDays(orders);
          const lastOrder = new Date(orders[orders.length - 1].order_date);
          const today = new Date();
          const daysSince = Math.ceil((today - lastOrder) / (1000*60*60*24));
          
          if (daysSince >= avgDays - 1) {
            await sendWhatsAppMessage(client.phone, client.name, avgDays);
            db.run('INSERT INTO notifications (client_id, message) VALUES (?, ?)',
              [client.id, `Média: ${avgDays} dias`]);
          }
        }
      );
    });
  });
}

// ============ AGENDAMENTO (9h diariamente) ============
cron.schedule('0 9 * * *', checkClients);

// ============ API ENDPOINTS ============

// Cadastrar cliente
app.post('/clients', (req, res) => {
  const { name, phone } = req.body;
  db.run('INSERT INTO clients (name, phone) VALUES (?, ?)', [name, phone],
    function(err) {
      if (err) return res.status(400).json({ error: 'Erro ao cadastrar' });
      res.json({ id: this.lastID, name, phone });
    });
});

// Listar clientes
app.get('/clients', (req, res) => {
  db.all('SELECT * FROM clients', [], (err, rows) => {
    res.json(rows);
  });
});

// Registrar pedido
app.post('/orders', (req, res) => {
  const { client_id, gallons, order_date } = req.body;
  const date = order_date || new Date().toISOString().split('T')[0];
  
  db.run('INSERT INTO orders (client_id, gallons, order_date) VALUES (?, ?, ?)',
    [client_id, gallons || 1, date],
    function(err) {
      if (err) return res.status(400).json({ error: 'Erro ao registrar' });
      res.json({ id: this.lastID, client_id, gallons, order_date: date });
    });
});

// Ver pedidos do cliente
app.get('/orders/:client_id', (req, res) => {
  db.all('SELECT * FROM orders WHERE client_id = ? ORDER BY order_date DESC',
    [req.params.client_id], (err, rows) => {
      res.json(rows);
    });
});

// Análise do cliente
app.get('/analytics/:client_id', (req, res) => {
  db.all('SELECT * FROM orders WHERE client_id = ? ORDER BY order_date ASC',
    [req.params.client_id], (err, orders) => {
      const avgDays = calculateAverageDays(orders);
      res.json({
        total_orders: orders.length,
        average_days: avgDays,
        orders: orders
      });
    });
});

// Enviar mensagem manual
app.post('/send/:client_id', (req, res) => {
  db.get('SELECT * FROM clients WHERE id = ?', [req.params.client_id],
    async (err, client) => {
      db.all('SELECT * FROM orders WHERE client_id = ? ORDER BY order_date ASC',
        [client.id], async (err, orders) => {
          const avgDays = calculateAverageDays(orders);
          if (!avgDays) return res.status(400).json({ error: 'Precisa 2+ pedidos' });
          
          await sendWhatsAppMessage(client.phone, client.name, avgDays);
          res.json({ message: 'Enviado!' });
        });
    });
});

// Dashboard
app.get('/dashboard', (req, res) => {
  db.get('SELECT COUNT(*) as total FROM clients', [], (e1, c) => {
    db.get('SELECT COUNT(*) as total FROM orders', [], (e2, o) => {
      db.get('SELECT COUNT(*) as total FROM notifications', [], (e3, n) => {
        res.json({
          clients: c.total,
          orders: o.total,
          notifications: n.total
        });
      });
    });
  });
});

// Verificar notificações manualmente
app.post('/check', (req, res) => {
  checkClients();
  res.json({ message: 'Verificação iniciada!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor: http://localhost:${PORT}`);
});