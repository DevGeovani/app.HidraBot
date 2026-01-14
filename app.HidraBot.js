import React, { useState } from 'react';
import { FileCode, Shield, Zap, Folder, CheckCircle, AlertTriangle, Code, Database, Server } from 'lucide-react';

const CodeStandardsGuide = () => {
  const [activeSection, setActiveSection] = useState('structure');
  const [expandedItem, setExpandedItem] = useState(null);

  const sections = [
    { id: 'structure', name: 'Estrutura de Pastas', icon: Folder },
    { id: 'conventions', name: 'Convenções de Código', icon: FileCode },
    { id: 'performance', name: 'Performance', icon: Zap },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'backend', name: 'Backend (Vercel)', icon: Server },
    { id: 'database', name: 'Database', icon: Database },
  ];

  const content = {
    structure: {
      title: 'Estrutura de Pastas',
      items: [
        {
          name: 'Estrutura Recomendada',
          code: `my-app/
├── public/              # Assets estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.module.css
│   │   │   └── index.js
│   │   └── Card/
│   ├── pages/           # Páginas/rotas
│   │   ├── Home.jsx
│   │   └── About.jsx
│   ├── hooks/           # Custom hooks
│   │   └── useAuth.js
│   ├── services/        # Chamadas API
│   │   └── api.js
│   ├── utils/           # Funções auxiliares
│   │   └── helpers.js
│   ├── contexts/        # Context API
│   │   └── AuthContext.jsx
│   ├── styles/          # Estilos globais
│   │   └── global.css
│   └── App.jsx
├── api/                 # Serverless functions (Vercel)
│   ├── users.js
│   └── products.js
├── .env.local           # Variáveis de ambiente
└── package.json`,
          description: 'Organização clara e escalável seguindo padrão MVC adaptado para React'
        }
      ]
    },
    conventions: {
      title: 'Convenções de Código',
      items: [
        {
          name: 'Nomenclatura',
          good: `// ✅ BOM
// Componentes: PascalCase
const UserProfile = () => { }
const CardHeader = () => { }

// Arquivos de componentes
UserProfile.jsx
CardHeader.jsx

// Variáveis e funções: camelCase
const userName = 'João';
const fetchUserData = async () => { }

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// Custom hooks: use + camelCase
const useAuth = () => { }
const useLocalStorage = () => { }`,
          bad: `// ❌ RUIM
const userprofile = () => { } // minúsculo
const User_Profile = () => { } // snake_case
const USERPROFILE = () => { } // tudo maiúsculo

const FetchUserData = async () => { } // PascalCase em função
const UserName = 'João'; // PascalCase em variável`,
          description: 'Padrões de nomenclatura consistentes melhoram legibilidade'
        },
        {
          name: 'Componentes Funcionais',
          good: `// ✅ BOM - Componente funcional com hooks
import { useState, useEffect } from 'react';

const UserList = ({ users }) => {
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    setFilteredUsers(users.filter(u => u.active));
  }, [users]);

  return (
    <div>
      {filteredUsers.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

export default UserList;`,
          bad: `// ❌ RUIM - Componente de classe (evitar)
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filteredUsers: [] };
  }
  
  componentDidMount() {
    const filtered = this.props.users.filter(u => u.active);
    this.setState({ filteredUsers: filtered });
  }
  
  render() {
    return <div>...</div>;
  }
}`,
          description: 'Use sempre componentes funcionais com hooks - mais simples e performáticos'
        },
        {
          name: 'Destructuring',
          good: `// ✅ BOM
const UserCard = ({ name, email, avatar }) => {
  return (
    <div>
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
};

// Em objetos
const { firstName, lastName, age } = user;

// Em arrays
const [first, second, ...rest] = items;`,
          bad: `// ❌ RUIM
const UserCard = (props) => {
  return (
    <div>
      <img src={props.avatar} alt={props.name} />
      <h2>{props.name}</h2>
      <p>{props.email}</p>
    </div>
  );
};`,
          description: 'Destructuring torna o código mais limpo e legível'
        },
        {
          name: 'Arrow Functions',
          good: `// ✅ BOM
const add = (a, b) => a + b;

const processUser = (user) => {
  const fullName = \`\${user.firstName} \${user.lastName}\`;
  return { ...user, fullName };
};

// Em eventos
<button onClick={() => handleClick(id)}>Click</button>`,
          bad: `// ❌ RUIM
function add(a, b) {
  return a + b;
}

const processUser = function(user) {
  return user;
};`,
          description: 'Arrow functions são mais concisas e evitam problemas com "this"'
        }
      ]
    },
    performance: {
      title: 'Otimização de Performance',
      items: [
        {
          name: 'React.memo e useMemo',
          good: `// ✅ BOM - Evita re-renders desnecessários
import { memo, useMemo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  return <div>{data}</div>;
});

const ParentComponent = () => {
  const expensiveCalculation = useMemo(() => {
    return data.reduce((acc, item) => acc + item.value, 0);
  }, [data]);

  return <ExpensiveComponent data={expensiveCalculation} />;
};`,
          bad: `// ❌ RUIM - Re-renderiza em toda mudança de estado do pai
const ExpensiveComponent = ({ data }) => {
  return <div>{data}</div>;
};

const ParentComponent = () => {
  // Recalcula em todo render
  const expensiveCalculation = data.reduce(
    (acc, item) => acc + item.value, 0
  );

  return <ExpensiveComponent data={expensiveCalculation} />;
};`,
          description: 'Use memo para componentes pesados e useMemo para cálculos complexos'
        },
        {
          name: 'useCallback',
          good: `// ✅ BOM
import { useCallback, useState } from 'react';

const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Clicked!');
  }, []); // Só cria a função uma vez

  return <Child onClick={handleClick} />;
};`,
          bad: `// ❌ RUIM - Cria nova função a cada render
const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log('Clicked!');
  }; // Nova função em todo render

  return <Child onClick={handleClick} />;
};`,
          description: 'useCallback evita criar funções novas em cada render'
        },
        {
          name: 'Code Splitting e Lazy Loading',
          good: `// ✅ BOM - Carrega componentes sob demanda
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

const App = () => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
};`,
          bad: `// ❌ RUIM - Importa tudo de uma vez
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
// Aumenta bundle inicial desnecessariamente`,
          description: 'Lazy loading reduz o bundle inicial em 30-60%'
        },
        {
          name: 'Otimização de Listas',
          good: `// ✅ BOM - Key única e estável
const UserList = ({ users }) => {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  );
};`,
          bad: `// ❌ RUIM - Index como key
const UserList = ({ users }) => {
  return (
    <ul>
      {users.map((user, index) => (
        <li key={index}>
          {user.name}
        </li>
      ))}
    </ul>
  );
};`,
          description: 'Use IDs únicos como key, não índices. Melhora performance em 40%'
        },
        {
          name: 'Debounce em Inputs',
          good: `// ✅ BOM - Reduz chamadas API
import { useState, useCallback } from 'react';

const SearchBar = () => {
  const [query, setQuery] = useState('');

  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const handleSearch = useCallback(
    debounce((value) => {
      // API call aqui
      fetch(\`/api/search?q=\${value}\`);
    }, 300),
    []
  );

  return (
    <input
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        handleSearch(e.target.value);
      }}
    />
  );
};`,
          description: 'Debounce reduz requisições em 70-90% em inputs de busca'
        }
      ]
    },
    security: {
      title: 'Segurança',
      items: [
        {
          name: 'Evitar XSS',
          good: `// ✅ BOM - JSX escapa automaticamente
const UserProfile = ({ userName }) => {
  return <div>{userName}</div>; // Seguro
};

// Se precisar de HTML, sanitize primeiro
import DOMPurify from 'dompurify';

const SafeHTML = ({ html }) => {
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
};`,
          bad: `// ❌ RUIM - Expõe a XSS
const UserProfile = ({ userName }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: userName }} />
  );
};

// NUNCA faça isso
const Bad = () => {
  const html = userInput;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};`,
          description: 'NUNCA use dangerouslySetInnerHTML sem sanitização. XSS é a vulnerabilidade #1'
        },
        {
          name: 'Validação de URLs',
          good: `// ✅ BOM - Valida URLs antes de usar
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const SafeLink = ({ href, children }) => {
  if (!isValidUrl(href)) {
    return <span>{children}</span>;
  }
  return <a href={href}>{children}</a>;
};`,
          bad: `// ❌ RUIM - Aceita qualquer URL
const UnsafeLink = ({ href, children }) => {
  return <a href={href}>{children}</a>;
};

// Permite javascript:alert('XSS')`,
          description: 'Sempre valide URLs para evitar javascript: injection'
        },
        {
          name: 'Autenticação Segura',
          good: `// ✅ BOM - HttpOnly cookies, não localStorage
// Backend (Vercel Function)
export default async function login(req, res) {
  const { email, password } = req.body;
  
  // Valida credenciais
  const user = await validateUser(email, password);
  
  if (user) {
    // JWT em HttpOnly cookie
    res.setHeader('Set-Cookie', [
      \`token=\${jwt}\; HttpOnly; Secure; SameSite=Strict; Max-Age=3600\`
    ]);
    return res.json({ success: true });
  }
  
  return res.status(401).json({ error: 'Invalid credentials' });
}`,
          bad: `// ❌ RUIM - Token em localStorage
const login = async (email, password) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  const { token } = await response.json();
  localStorage.setItem('token', token); // INSEGURO!
  
  return token;
};`,
          description: 'Use HttpOnly cookies, NUNCA localStorage para tokens. Previne XSS'
        },
        {
          name: 'Variáveis de Ambiente',
          good: `// ✅ BOM - Secrets no servidor
// .env.local
DATABASE_URL=postgresql://...
API_SECRET_KEY=abc123...

// api/users.js (Vercel Function)
export default async function handler(req, res) {
  const dbUrl = process.env.DATABASE_URL; // Seguro
  const secret = process.env.API_SECRET_KEY;
  
  // Usa as variáveis no servidor
  const data = await db.query(dbUrl);
  res.json(data);
}

// Frontend - APENAS variáveis públicas
// NEXT_PUBLIC_ ou REACT_APP_ prefix
const apiUrl = process.env.NEXT_PUBLIC_API_URL;`,
          bad: `// ❌ RUIM - Expõe secrets no frontend
const SECRET_KEY = 'abc123...'; // NUNCA!

fetch('/api/data', {
  headers: {
    'Authorization': 'Bearer abc123...' // Exposto no código!
  }
});`,
          description: 'NUNCA exponha secrets no frontend. Use variáveis de ambiente'
        },
        {
          name: 'Input Validation',
          good: `// ✅ BOM - Validação server-side
// api/create-user.js
export default async function handler(req, res) {
  const { email, name, age } = req.body;
  
  // Valida no servidor
  if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  
  if (!name || name.length < 2 || name.length > 100) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  
  if (typeof age !== 'number' || age < 0 || age > 150) {
    return res.status(400).json({ error: 'Invalid age' });
  }
  
  // Processa dados validados
  const user = await createUser({ email, name, age });
  res.json(user);
}`,
          bad: `// ❌ RUIM - Só valida no frontend
const handleSubmit = (e) => {
  e.preventDefault();
  if (email && name) { // Validação fraca
    fetch('/api/create-user', {
      method: 'POST',
      body: JSON.stringify({ email, name })
    });
  }
};`,
          description: 'SEMPRE valide no servidor. Validação frontend é só UX'
        },
        {
          name: 'CORS Seguro',
          good: `// ✅ BOM - CORS restritivo
// api/data.js
export default async function handler(req, res) {
  const allowedOrigins = [
    'https://meusite.com',
    'https://www.meusite.com'
  ];
  
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  // Rest of handler...
}`,
          bad: `// ❌ RUIM - CORS aberto
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Inseguro!
  res.setHeader('Access-Control-Allow-Methods', '*');
  
  // Qualquer site pode acessar
}`,
          description: 'Configure CORS específico. * permite qualquer site acessar sua API'
        },
        {
          name: 'Rate Limiting',
          good: `// ✅ BOM - Protege contra ataques
// api/login.js
const rateLimit = new Map();

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  const now = Date.now();
  const userAttempts = rateLimit.get(ip) || [];
  
  // Remove tentativas antigas (> 15 min)
  const recentAttempts = userAttempts.filter(
    time => now - time < 15 * 60 * 1000
  );
  
  if (recentAttempts.length >= 5) {
    return res.status(429).json({ 
      error: 'Too many attempts. Try again later.' 
    });
  }
  
  recentAttempts.push(now);
  rateLimit.set(ip, recentAttempts);
  
  // Processa login...
}`,
          description: 'Rate limiting previne brute force e DDoS'
        },
        {
          name: 'Dependências Atualizadas',
          good: `// ✅ BOM - Mantenha pacotes atualizados
# Verifica vulnerabilidades
npm audit

# Atualiza pacotes com segurança
npm update

# Atualiza React
npm install react@latest react-dom@latest

# Use ferramentas de segurança
npm install -D snyk
npx snyk test`,
          bad: `// ❌ RUIM - Pacotes desatualizados
// package.json
{
  "dependencies": {
    "react": "16.8.0",  // Versão antiga!
    "express": "4.16.0" // Vulnerabilidades conhecidas
  }
}`,
          description: '73% dos ataques exploram dependências desatualizadas. Atualize sempre!'
        }
      ]
    },
    backend: {
      title: 'Backend Vercel Functions',
      items: [
        {
          name: 'Estrutura Básica',
          good: `// ✅ BOM - Função serverless simples
// api/hello.js
export default async function handler(req, res) {
  // Verifica método HTTP
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Acessa query params
  const { name = 'World' } = req.query;

  // Retorna resposta
  return res.status(200).json({ 
    message: \`Hello, \${name}!\` 
  });
}

// Rota: /api/hello?name=João`,
          description: 'Funções Vercel são stateless - cada requisição é independente'
        },
        {
          name: 'POST com Body',
          good: `// ✅ BOM - Processa POST
// api/create-user.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email } = req.body;

    // Validação
    if (!name || !email) {
      return res.status(400).json({ 
        error: 'Name and email are required' 
      });
    }

    // Processa dados
    const user = await saveToDatabase({ name, email });

    return res.status(201).json({ 
      success: true, 
      user 
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}`,
          description: 'req.body é automaticamente parseado pela Vercel'
        },
        {
          name: 'Variáveis de Ambiente',
          good: `// ✅ BOM - Usa env vars seguramente
// .env.local (não commitar!)
DATABASE_URL=postgresql://user:pass@host:5432/db
API_KEY=abc123xyz

// api/data.js
export default async function handler(req, res) {
  const dbUrl = process.env.DATABASE_URL;
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'Configuration error' 
    });
  }

  // Usa as variáveis...
  const data = await fetchData(dbUrl, apiKey);
  
  return res.json(data);
}`,
          description: 'Configure secrets no Vercel Dashboard ou .env.local'
        },
        {
          name: 'CORS para API',
          good: `// ✅ BOM - CORS configurado
// api/products.js
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://meusite.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Rest of handler
  const products = await getProducts();
  return res.json(products);
}`,
          description: 'Configure CORS para permitir acesso do frontend'
        },
        {
          name: 'Conexão com Database',
          good: `// ✅ BOM - Conexão otimizada
// lib/db.js
import { Pool } from 'pg';

let pool;

export const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10, // Pool de conexões
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
};

// api/users.js
import { getPool } from '../lib/db';

export default async function handler(req, res) {
  const pool = getPool();
  
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE active = $1',
      [true]
    );
    
    return res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
}`,
          description: 'Use connection pooling para melhor performance. Vercel oferece 10-60s de timeout'
        },
        {
          name: 'Middleware Pattern',
          good: `// ✅ BOM - Middleware reutilizável
// lib/middleware.js
export const withAuth = (handler) => {
  return async (req, res) => {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const user = await verifyToken(token);
      req.user = user;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};

// api/profile.js
import { withAuth } from '../lib/middleware';

async function handler(req, res) {
  // req.user está disponível aqui
  return res.json({ user: req.user });
}

export default withAuth(handler);`,
          description: 'Middleware torna código reutilizável e organizado'
        },
        {
          name: 'Error Handling',
          good: `// ✅ BOM - Tratamento de erros completo
export default async function handler(req, res) {
  try {
    // Validação de método
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        error: 'Method not allowed',
        allowedMethods: ['POST']
      });
    }

    // Validação de dados
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ 
        error: 'Validation error',
        field: 'email',
        message: 'Email is required'
      });
    }

    // Lógica de negócio
    const result = await processEmail(email);
    
    return res.status(200).json({ 
      success: true, 
      data: result 
    });

  } catch (error) {
    // Log do erro (não retorna detalhes ao cliente)
    console.error('Error in handler:', error);
    
    // Resposta genérica
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Something went wrong. Please try again later.'
    });
  }
}`,
          description: 'Sempre trate erros e retorne respostas apropriadas'
        },
        {
          name: 'Otimização Vercel',
          good: `// ✅ BOM - Configuração otimizada
// vercel.json
{
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "regions": ["gru1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    }
  ]
}`,
          description: 'Configure região (gru1 = São Paulo), timeout e cache para melhor performance'
        }
      ]
    },
    database: {
      title: 'Database e APIs',
      items: [
        {
          name: 'Opções Gratuitas Vercel',
          code: `// Opções compatíveis com plano gratuito Vercel:

1. Vercel Postgres (recomendado)
   - 256 MB storage grátis
   - Integração nativa
   - Setup em 1 clique

2. Supabase
   - 500 MB storage grátis
   - PostgreSQL completo
   - Auth integrado

3. MongoDB Atlas
   - 512 MB grátis
   - NoSQL
   - Ótimo para dados flexíveis

4. PlanetScale
   - 5 GB storage grátis
   - MySQL serverless
   - Branching para desenvolvimento`,
          description: 'Escolha database baseado em suas necessidades'
        },
        {
          name: 'Vercel Postgres',
          good: `// ✅ BOM - Vercel Postgres (recomendado)
// Instalar: npm install @vercel/postgres

// lib/db.js
import { sql } from '@vercel/postgres';

export const getUsers = async () => {
  const { rows } = await sql\`
    SELECT id, name, email 
    FROM users 
    WHERE active = true
  \`;
  return rows;
};

export const createUser = async (name, email) => {
  const { rows } = await sql\`
    INSERT INTO users (name, email, created_at)
    VALUES (\${name}, \${email}, NOW())
    RETURNING *
  \`;
  return rows[0];
};

// api/users.js
import { getUsers, createUser } from '../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const users = await getUsers();
    return res.json(users);
  }
  
  if (req.method === 'POST') {
    const { name, email } = req.body;
    const user = await createUser(name, email);
    return res.status(201).json(user);
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}`,
          description: 'Vercel Postgres: setup mais simples, integração perfeita'
        },
        {
          name: 'Supabase',
          good: `// ✅ BOM - Supabase (PostgreSQL + Auth)
// npm install @supabase/supabase-js

// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// api/users.js
import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('active', true);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    return res.json(data);
  }
  
  if (req.method === 'POST') {
    const { name, email } = req.body;
    
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email }])
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(201).json(data[0]);
  }
}`,
          description: 'Supabase: PostgreSQL + Auth + Storage + Realtime'
        },
        {
          name: 'MongoDB Atlas',
          good: `// ✅ BOM - MongoDB Atlas
// npm install mongodb

// lib/mongodb.js
import { MongoClient } from 'mongodb';

let cachedClient = null;

export const connectToDatabase = async () => {
  if (cachedClient) {
    return cachedClient;
  }

  const client = await MongoClient.connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  cachedClient = client;
  return client;
};

// api/products.js
import { connectToDatabase } from '../lib/mongodb';

export default async function handler(req, res) {
  const client = await connectToDatabase();
  const db = client.db('mystore');
  
  if (req.method === 'GET') {
    const products = await db
      .collection('products')
      .find({ available: true })
      .toArray();
    
    return res.json(products);
  }
  
  if (req.method === 'POST') {
    const { name, price } = req.body;
    
    const result = await db
      .collection('products')
      .insertOne({ 
        name, 
        price, 
        available: true,
        createdAt: new Date()
      });
    
    return res.status(201).json({ 
      id: result.insertedId 
    });
  }
}`,
          description: 'MongoDB: NoSQL, flexível, ótimo para dados não-relacionais'
        },
        {
          name: 'API External',
          good: `// ✅ BOM - Chamadas a APIs externas
// lib/api-client.js
const API_TIMEOUT = 10000; // 10 segundos

export const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
};

// api/weather.js
import { fetchWithTimeout } from '../lib/api-client';

export default async function handler(req, res) {
  const { city } = req.query;
  
  try {
    const data = await fetchWithTimeout(
      \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${process.env.WEATHER_API_KEY}\`
    );
    
    return res.json(data);
  } catch (error) {
    console.error('Weather API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch weather data' 
    });
  }
}`,
          description: 'Sempre use timeout em APIs externas para evitar travamento'
        },
        {
          name: 'Caching Strategies',
          good: `// ✅ BOM - Cache para reduzir custos
// lib/cache.js
const cache = new Map();

export const getCached = (key) => {
  const item = cache.get(key);
  
  if (!item) return null;
  
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  
  return item.value;
};

export const setCache = (key, value, ttlSeconds = 60) => {
  cache.set(key, {
    value,
    expiry: Date.now() + (ttlSeconds * 1000)
  });
};

// api/products.js
import { getCached, setCache } from '../lib/cache';

export default async function handler(req, res) {
  const cacheKey = 'products:all';
  
  // Tenta cache primeiro
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }
  
  // Busca do database
  const products = await getProductsFromDB();
  
  // Salva no cache por 5 minutos
  setCache(cacheKey, products, 300);
  
  return res.json(products);
}`,
          description: 'Cache reduz chamadas ao database em 70-90%'
        }
      ]
    }
  };

  const getIcon = (SectionIcon) => {
    return <SectionIcon className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Guia de Padrões de Código
          </h1>
          <p className="text-slate-300">React + Node.js • Otimizado para Vercel</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                setExpandedItem(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeSection === section.id
                  ? 'bg-blue-600 shadow-lg shadow-blue-500/50'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              {getIcon(section.icon)}
              {section.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            {getIcon(sections.find(s => s.id === activeSection).icon)}
            {content[activeSection].title}
          </h2>

          <div className="space-y-4">
            {content[activeSection].items.map((item, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700">
                <button
                  onClick={() => setExpandedItem(expandedItem === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Code className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold text-lg">{item.name}</span>
                  </div>
                  <div className="text-slate-400">
                    {expandedItem === idx ? '▼' : '▶'}
                  </div>
                </button>

                {expandedItem === idx && (
                  <div className="p-4 border-t border-slate-700">
                    {item.description && (
                      <div className="mb-4 p-3 bg-blue-900/30 rounded border-l-4 border-blue-500">
                        <p className="text-sm text-blue-100">{item.description}</p>
                      </div>
                    )}

                    {item.good && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-semibold text-green-400">BOM</span>
                        </div>
                        <pre className="bg-slate-950 p-4 rounded overflow-x-auto text-sm border border-green-500/30">
                          <code className="text-green-100">{item.good}</code>
                        </pre>
                      </div>
                    )}

                    {item.bad && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-sm font-semibold text-red-400">RUIM</span>
                        </div>
                        <pre className="bg-slate-950 p-4 rounded overflow-x-auto text-sm border border-red-500/30">
                          <code className="text-red-100">{item.bad}</code>
                        </pre>
                      </div>
                    )}

                    {item.code && (
                      <pre className="bg-slate-950 p-4 rounded overflow-x-auto text-sm border border-slate-700">
                        <code className="text-slate-100">{item.code}</code>
                      </pre>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Tips */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <Zap className="w-6 h-6 text-green-400 mb-2" />
            <h3 className="font-semibold mb-1 text-green-400">Performance</h3>
            <p className="text-sm text-slate-300">
              Use React.memo, lazy loading e cache para apps 40-60% mais rápidos
            </p>
          </div>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <Shield className="w-6 h-6 text-red-400 mb-2" />
            <h3 className="font-semibold mb-1 text-red-400">Segurança</h3>
            <p className="text-sm text-slate-300">
              Valide no servidor, use HttpOnly cookies, mantenha dependências atualizadas
            </p>
          </div>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <Server className="w-6 h-6 text-blue-400 mb-2" />
            <h3 className="font-semibold mb-1 text-blue-400">Vercel</h3>
            <p className="text-sm text-slate-300">
              Configure região gru1, use variáveis de ambiente e implement rate limiting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeStandardsGuide;