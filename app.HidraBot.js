import React, { useState, useEffect } from 'react';
import { Droplet, Send, Calendar, TrendingUp, User, Phone, MessageSquare, Plus, Trash2 } from 'lucide-react';

const WaterDeliverySystem = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Carregar dados salvos
  useEffect(() => {
    const saved = localStorage.getItem('waterCustomers');
    if (saved) {
      setCustomers(JSON.parse(saved));
    }
  }, []);

  // Salvar dados
  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem('waterCustomers', JSON.stringify(customers));
    }
  }, [customers]);

  // Algoritmo de previsão
  const calculatePrediction = (deliveries) => {
    if (deliveries.length < 2) return null;

    const intervals = [];
    for (let i = 1; i < deliveries.length; i++) {
      const diff = Math.floor((deliveries[i].date - deliveries[i-1].date) / (1000 * 60 * 60 * 24));
      intervals.push(diff);
    }

    // Média ponderada (dá mais peso aos pedidos recentes)
    let weightedSum = 0;
    let weightSum = 0;
    intervals.forEach((interval, idx) => {
      const weight = idx + 1;
      weightedSum += interval * weight;
      weightSum += weight;
    });

    return Math.round(weightedSum / weightSum);
  };

  const addCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) return;

    const customer = {
      id: Date.now(),
      name: newCustomer.name,
      phone: newCustomer.phone,
      deliveries: [],
      createdAt: Date.now()
    };

    setCustomers([...customers, customer]);
    setNewCustomer({ name: '', phone: '' });
    setShowAddForm(false);
  };

  const addDelivery = (customerId) => {
    setCustomers(customers.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          deliveries: [...c.deliveries, { date: Date.now(), gallons: 1 }]
        };
      }
      return c;
    }));
  };

  const removeDelivery = (customerId, deliveryIndex) => {
    setCustomers(customers.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          deliveries: c.deliveries.filter((_, idx) => idx !== deliveryIndex)
        };
      }
      return c;
    }));
  };

  const deleteCustomer = (customerId) => {
    setCustomers(customers.filter(c => c.id !== customerId));
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer(null);
    }
  };

  const getNextDeliveryDate = (customer) => {
    const prediction = calculatePrediction(customer.deliveries);
    if (!prediction || customer.deliveries.length === 0) return null;

    const lastDelivery = customer.deliveries[customer.deliveries.length - 1].date;
    return new Date(lastDelivery + prediction * 24 * 60 * 60 * 1000);
  };

  const getDaysUntilNext = (customer) => {
    const nextDate = getNextDeliveryDate(customer);
    if (!nextDate) return null;

    const diff = Math.floor((nextDate - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const sendWhatsAppMessage = (customer) => {
    const prediction = calculatePrediction(customer.deliveries);
    const message = `Olá ${customer.name}! 😊

Notamos que geralmente você pede água a cada ${prediction} dias. Gostaria de solicitar um novo galão?

Responda SIM para confirmar seu pedido! 💧`;

    const encodedMessage = encodeURIComponent(message);
    const phone = customer.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500 p-3 rounded-xl">
              <Droplet className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Sistema Inteligente de Entregas</h1>
              <p className="text-gray-600">Gestão automatizada de pedidos de água</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
              <User size={24} className="mb-2" />
              <p className="text-sm opacity-90">Total de Clientes</p>
              <p className="text-3xl font-bold">{customers.length}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
              <TrendingUp size={24} className="mb-2" />
              <p className="text-sm opacity-90">Entregas Registradas</p>
              <p className="text-3xl font-bold">
                {customers.reduce((sum, c) => sum + c.deliveries.length, 0)}
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
              <Calendar size={24} className="mb-2" />
              <p className="text-sm opacity-90">Próximas Entregas</p>
              <p className="text-3xl font-bold">
                {customers.filter(c => {
                  const days = getDaysUntilNext(c);
                  return days !== null && days <= 2;
                }).length}
              </p>
            </div>
          </div>

          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
            >
              <Plus size={20} />
              Adicionar Novo Cliente
            </button>
          )}

          {showAddForm && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Novo Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Nome do cliente"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="WhatsApp (11999999999)"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addCustomer}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition"
                >
                  Salvar Cliente
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-semibold transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User size={24} className="text-blue-500" />
              Clientes
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {customers.map(customer => {
                const prediction = calculatePrediction(customer.deliveries);
                const daysUntil = getDaysUntilNext(customer);
                
                return (
                  <div
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                      selectedCustomer?.id === customer.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">{customer.name}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone size={14} />
                          {customer.phone}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCustomer(customer.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    {prediction && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                          Média: {prediction} dias entre pedidos
                        </p>
                        {daysUntil !== null && (
                          <p className={`text-xs font-semibold ${
                            daysUntil <= 2 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {daysUntil <= 0 ? 'Pedido previsto para hoje!' : `Próximo pedido em ~${daysUntil} dias`}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {customers.length === 0 && (
                <p className="text-center text-gray-400 py-8">Nenhum cliente cadastrado</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar size={24} className="text-blue-500" />
              Detalhes do Cliente
            </h2>
            
            {selectedCustomer ? (
              <div>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white mb-4">
                  <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                  <p className="text-sm opacity-90">{selectedCustomer.phone}</p>
                </div>

                <button
                  onClick={() => addDelivery(selectedCustomer.id)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold mb-4 flex items-center justify-center gap-2 transition"
                >
                  <Plus size={20} />
                  Registrar Nova Entrega
                </button>

                {calculatePrediction(selectedCustomer.deliveries) && (
                  <button
                    onClick={() => sendWhatsAppMessage(selectedCustomer)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-semibold mb-4 flex items-center justify-center gap-2 transition"
                  >
                    <MessageSquare size={20} />
                    Enviar Mensagem WhatsApp
                  </button>
                )}

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 mb-2">Histórico de Entregas:</h4>
                  {selectedCustomer.deliveries.length === 0 ? (
                    <p className="text-gray-400 text-sm">Nenhuma entrega registrada</p>
                  ) : (
                    selectedCustomer.deliveries.map((delivery, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">Entrega #{idx + 1}</p>
                          <p className="text-sm text-gray-600">{formatDate(delivery.date)}</p>
                        </div>
                        <button
                          onClick={() => removeDelivery(selectedCustomer.id, idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <User size={48} className="mx-auto mb-4 opacity-50" />
                <p>Selecione um cliente para ver os detalhes</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Como Funciona o Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2">1</div>
              <h3 className="font-semibold mb-1">Aprendizado Inicial</h3>
              <p className="text-gray-600">Registre as entregas de cada cliente. A partir da 2ª entrega, o sistema começa a calcular padrões.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2">2</div>
              <h3 className="font-semibold mb-1">Previsão Inteligente</h3>
              <p className="text-gray-600">O algoritmo calcula a média ponderada entre pedidos, dando mais peso aos pedidos recentes.</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2">3</div>
              <h3 className="font-semibold mb-1">Notificação Automática</h3>
              <p className="text-gray-600">Envie mensagens via WhatsApp Web quando o cliente estiver próximo de precisar de um novo galão.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterDeliverySystem;