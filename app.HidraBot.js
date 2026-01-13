import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Droplets, Send, Users, TrendingUp, Calendar, Phone } from 'lucide-react';

const WaterDeliverySystem = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ name: '', phone: '' });
  const [selectedClient, setSelectedClient] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Simula dados iniciais
  useEffect(() => {
    const mockClients = [
      { id: 1, name: 'João Silva', phone: '5511999998888', orders: [
        { date: '2024-11-15', gallons: 2 },
        { date: '2024-11-22', gallons: 2 },
        { date: '2024-12-01', gallons: 2 },
        { date: '2024-12-10', gallons: 2 }
      ]},
      { id: 2, name: 'Maria Santos', phone: '5511988887777', orders: [
        { date: '2024-11-10', gallons: 1 },
        { date: '2024-11-20', gallons: 1 },
        { date: '2024-12-05', gallons: 1 }
      ]},
      { id: 3, name: 'Pedro Costa', phone: '5511977776666', orders: [
        { date: '2024-11-12', gallons: 3 },
        { date: '2024-11-17', gallons: 3 }
      ]}
    ];
    setClients(mockClients);
  }, []);

  // Algoritmo de cálculo de média de dias
  const calculateAverageDays = (orders) => {
    if (orders.length < 2) return null;
    
    const intervals = [];
    for (let i = 1; i < orders.length; i++) {
      const prevDate = new Date(orders[i-1].date);
      const currDate = new Date(orders[i].date);
      const diffTime = Math.abs(currDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      intervals.push(diffDays);
    }
    
    const average = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    return Math.round(average);
  };

  // Calcula quando notificar (1 dia antes da previsão)
  const shouldNotify = (client) => {
    const avgDays = calculateAverageDays(client.orders);
    if (!avgDays || client.orders.length === 0) return false;
    
    const lastOrder = new Date(client.orders[client.orders.length - 1].date);
    const today = new Date();
    const daysSinceLastOrder = Math.ceil((today - lastOrder) / (1000 * 60 * 60 * 24));
    
    return daysSinceLastOrder >= avgDays - 1;
  };

  // Simula envio de mensagem WhatsApp
  const sendWhatsAppMessage = (client) => {
    const avgDays = calculateAverageDays(client.orders);
    const message = `Olá ${client.name}! 😊\n\nNotamos que você costuma pedir água a cada ${avgDays} dias.\n\nGostaria de solicitar um novo galão? 💧\n\nResponda SIM para confirmar seu pedido!`;
    
    setNotifications(prev => [{
      id: Date.now(),
      clientName: client.name,
      phone: client.phone,
      message: message,
      time: new Date().toLocaleTimeString('pt-BR')
    }, ...prev]);
    
    alert(`Mensagem enviada para ${client.name} (${client.phone}):\n\n${message}`);
  };

  // Adicionar novo cliente
  const addClient = () => {
    if (newClient.name && newClient.phone) {
      setClients(prev => [...prev, {
        id: Date.now(),
        name: newClient.name,
        phone: newClient.phone,
        orders: []
      }]);
      setNewClient({ name: '', phone: '' });
    }
  };

  // Registrar novo pedido
  const addOrder = (clientId) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          orders: [...client.orders, {
            date: new Date().toISOString().split('T')[0],
            gallons: 2
          }]
        };
      }
      return client;
    }));
  };

  // Preparar dados para o gráfico
  const chartData = clients.map(client => ({
    name: client.name.split(' ')[0],
    média: calculateAverageDays(client.orders) || 0,
    pedidos: client.orders.length
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Sistema de Reposição Inteligente</h1>
          </div>
          <p className="text-gray-600">Automatize o contato com clientes usando aprendizado progressivo</p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Clientes</p>
                <p className="text-3xl font-bold text-blue-600">{clients.length}</p>
              </div>
              <Users className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Notificações Enviadas</p>
                <p className="text-3xl font-bold text-green-600">{notifications.length}</p>
              </div>
              <Send className="w-12 h-12 text-green-200" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Clientes para Notificar</p>
                <p className="text-3xl font-bold text-orange-600">
                  {clients.filter(shouldNotify).length}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Adicionar Cliente */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Cadastrar Novo Cliente</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Nome completo"
              value={newClient.name}
              onChange={(e) => setNewClient({...newClient, name: e.target.value})}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Telefone (5511999998888)"
              value={newClient.phone}
              onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addClient}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Lista de Clientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Clientes Cadastrados</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {clients.map(client => {
                const avgDays = calculateAverageDays(client.orders);
                const needsNotification = shouldNotify(client);
                
                return (
                  <div key={client.id} className={`p-4 rounded-lg border-2 ${needsNotification ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800">{client.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {client.phone}
                        </p>
                      </div>
                      {needsNotification && (
                        <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                          Notificar!
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <p>📦 Pedidos: {client.orders.length}</p>
                      {avgDays && (
                        <p>📊 Média: {avgDays} dias entre pedidos</p>
                      )}
                      {!avgDays && client.orders.length === 1 && (
                        <p className="text-blue-600">⏳ Aguardando 2º pedido para calcular média</p>
                      )}
                      {client.orders.length === 0 && (
                        <p className="text-gray-400">Nenhum pedido registrado</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => addOrder(client.id)}
                        className="flex-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                      >
                        Registrar Pedido
                      </button>
                      <button
                        onClick={() => sendWhatsAppMessage(client)}
                        disabled={!avgDays}
                        className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                      >
                        Enviar WhatsApp
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notificações Enviadas */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Histórico de Notificações</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Nenhuma notificação enviada ainda</p>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">{notif.clientName}</h3>
                      <span className="text-xs text-gray-600">{notif.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{notif.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Análise de Consumo por Cliente</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="média" fill="#3b82f6" name="Média de Dias" />
              <Bar dataKey="pedidos" fill="#10b981" name="Total de Pedidos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WaterDeliverySystem;