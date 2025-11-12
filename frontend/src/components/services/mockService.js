// Mock data coletado da API real do TabNews
const mockDataNew = [
  {
    "id": "3a814792-a481-4eb9-beef-ecdb3b196a44",
    "owner_id": "1793e51e-4839-415a-9a08-180f4106d25c",
    "parent_id": null,
    "slug": "minha-startup-foi-aprovada-pro-web-summit-2026-pergunte-me-qualquer-coisa",
    "title": "Minha startup foi aprovada pro web summit 2026, pergunte-me qualquer coisa",
    "status": "published",
    "type": "content",
    "source_url": "https://realoficial.com.br",
    "created_at": "2025-09-27T02:37:39.191Z",
    "updated_at": "2025-09-27T02:37:39.191Z",
    "published_at": "2025-09-27T02:37:39.192Z",
    "deleted_at": null,
    "owner_username": "acgfbr",
    "tabcoins": 15,
    "tabcoins_credit": 0,
    "tabcoins_debit": 0,
    "children_deep_count": 3
  },
  {
    "id": "427b14b2-2e39-411b-b542-3290ef285f82",
    "owner_id": "be9a4ad7-35bb-47fe-ab6d-71d9b4cb8bf9",
    "parent_id": null,
    "slug": "networking-e-a-criacao-de-comunidades-minha-experiencia",
    "title": "Networking e a criação de comunidades: minha experiência",
    "status": "published",
    "type": "content",
    "source_url": null,
    "created_at": "2025-09-27T01:55:01.139Z",
    "updated_at": "2025-09-27T01:55:01.139Z",
    "published_at": "2025-09-27T01:55:01.160Z",
    "deleted_at": null,
    "owner_username": "IamThiagoIT",
    "tabcoins": 8,
    "tabcoins_credit": 0,
    "tabcoins_debit": 0,
    "children_deep_count": 2
  },
  {
    "id": "5c678942-b22b-4681-96b2-19f6f27cf561",
    "owner_id": "873aae7c-7e26-4c6a-af1f-44d4f1ad5224",
    "parent_id": null,
    "slug": "self-hosted-e-quais-os-seus-beneficios",
    "title": "Self hosted e quais os seus benefícios",
    "status": "published",
    "type": "content",
    "source_url": null,
    "created_at": "2025-09-27T00:13:14.195Z",
    "updated_at": "2025-09-27T00:13:14.195Z",
    "published_at": "2025-09-27T00:13:14.201Z",
    "deleted_at": null,
    "owner_username": "ktfth",
    "tabcoins": 12,
    "tabcoins_credit": 0,
    "tabcoins_debit": 0,
    "children_deep_count": 1
  },
  {
    "id": "97da4033-527d-45e5-b120-949ab3ff88ca",
    "owner_id": "1474df61-939c-4189-87a4-7698a3e0f87e",
    "parent_id": null,
    "slug": "executando-metodos-de-forma-nao-bloqueante-no-php-sem-dependencias",
    "title": "Executando métodos de forma não bloqueante no PHP sem dependências.",
    "status": "published",
    "type": "content",
    "source_url": null,
    "created_at": "2025-09-26T23:36:30.797Z",
    "updated_at": "2025-09-26T23:41:10.263Z",
    "published_at": "2025-09-26T23:36:30.802Z",
    "deleted_at": null,
    "owner_username": "auguzsto",
    "tabcoins": 22,
    "tabcoins_credit": 0,
    "tabcoins_debit": 0,
    "children_deep_count": 5
  },
  {
    "id": "5781819c-b2b3-405e-9b83-d50c2265c66f",
    "owner_id": "afdd53ff-f576-45b2-9174-13bb21ba3b18",
    "parent_id": null,
    "slug": "feedback-sobre-uma-ideia-memoria-inteligente-hibrida-ou-full-self-host",
    "title": "Feedback sobre uma ideia: memória inteligente híbrida ou full self-host?",
    "status": "published",
    "type": "content",
    "source_url": null,
    "created_at": "2025-09-26T23:29:26.102Z",
    "updated_at": "2025-09-26T23:29:26.102Z",
    "published_at": "2025-09-26T23:29:26.108Z",
    "deleted_at": null,
    "owner_username": "DevMayron",
    "tabcoins": 6,
    "tabcoins_credit": 0,
    "tabcoins_debit": 0,
    "children_deep_count": 0
  }
];

const mockDataRelevant = [
  {
    "id": "featured-1",
    "owner_id": "featured-owner-1",
    "parent_id": null,
    "slug": "como-se-tornar-um-desenvolvedor-fullstack-em-2024",
    "title": "Como se tornar um desenvolvedor fullstack em 2024",
    "status": "published",
    "type": "content",
    "source_url": null,
    "created_at": "2025-09-20T10:30:00.000Z",
    "updated_at": "2025-09-20T10:30:00.000Z",
    "published_at": "2025-09-20T10:30:00.000Z",
    "deleted_at": null,
    "owner_username": "devexpert",
    "tabcoins": 156,
    "tabcoins_credit": 0,
    "tabcoins_debit": 0,
    "children_deep_count": 23
  },
  {
    "id": "featured-2",
    "owner_id": "featured-owner-2",
    "parent_id": null,
    "slug": "react-19-principais-novidades-e-breaking-changes",
    "title": "React 19: principais novidades e breaking changes",
    "status": "published",
    "type": "content",
    "source_url": null,
    "created_at": "2025-09-18T15:45:00.000Z",
    "updated_at": "2025-09-18T15:45:00.000Z",
    "published_at": "2025-09-18T15:45:00.000Z",
    "deleted_at": null,
    "owner_username": "reactmaster",
    "tabcoins": 89,
    "tabcoins_credit": 0,
    "tabcoins_debit": 0,
    "children_deep_count": 15
  },
  {
    "id": "featured-3",
    "owner_id": "featured-owner-3",
    "parent_id": null,
    "slug": "inteligencia-artificial-no-desenvolvimento-de-software",
    "title": "Inteligência Artificial no desenvolvimento de software",
    "status": "published",
    "type": "content",
    "source_url": null,
    "created_at": "2025-09-15T09:15:00.000Z",
    "updated_at": "2025-09-15T09:15:00.000Z",
    "published_at": "2025-09-15T09:15:00.000Z",
    "deleted_at": null,
    "owner_username": "aidev",
    "tabcoins": 234,
    "tabcoins_credit": 0,
    "tabcoins_debit": 0,
    "children_deep_count": 31
  }
];

const mockDataOld = [
  {
    "id": "old-1",
    "owner_id": "old-owner-1",
    "parent_id": null,
    "slug": "historia-do-javascript-dos-primordios-ate-hoje",
    "title": "História do JavaScript: dos primórdios até hoje",
    "status": "published",
    "type": "content",
    "source_url": null,
    "created_at": "2025-01-15T14:20:00.000Z",
    "updated_at": "2025-01-15T14:20:00.000Z",
    "published_at": "2025-01-15T14:20:00.000Z",
    "deleted_at": null,
    "owner_username": "jshistorian",
    "tabcoins": 67,
    "tabcoins_credit": 0,
    "tabcoins_debit": 0,
    "children_deep_count": 8
  },
  {
    "id": "old-2",
    "owner_id": "old-owner-2",
    "parent_id": null,
    "slug": "conceitos-fundamentais-de-programacao-orientada-a-objetos",
    "title": "Conceitos fundamentais de programação orientada a objetos",
    "status": "published",
    "type": "content",
    "source_url": null,
    "created_at": "2025-01-10T11:30:00.000Z",
    "updated_at": "2025-01-10T11:30:00.000Z",
    "published_at": "2025-01-10T11:30:00.000Z",
    "deleted_at": null,
    "owner_username": "oopmaster",
    "tabcoins": 43,
    "tabcoins_credit": 0,
    "tabcoins_debit": 0,
    "children_deep_count": 12
  }
];

const mockArticles = {
  "acgfbr/minha-startup-foi-aprovada-pro-web-summit-2026-pergunte-me-qualquer-coisa": {
    "id": "3a814792-a481-4eb9-beef-ecdb3b196a44",
    "title": "Minha startup foi aprovada pro web summit 2026, pergunte-me qualquer coisa",
    "owner_username": "acgfbr",
    "published_at": "2025-09-27T02:37:39.192Z",
    "tabcoins": 15,
    "children_deep_count": 3,
    "body": `# Minha startup foi aprovada pro web summit 2026, pergunte-me qualquer coisa

Pessoal, acabei de receber a confirmação que nossa startup foi **aceita para participar do Web Summit 2026** em Lisboa!

## Sobre a startup

Nossa startup é focada em **soluções de automação** para pequenas e médias empresas. Desenvolvemos uma plataforma SaaS que integra:

- 🤖 Automação de processos
- 📊 Analytics em tempo real  
- 🔗 Integrações com principais ferramentas do mercado
- 💡 IA para insights de negócio

## O processo de seleção

O processo foi bem rigoroso:

1. **Aplicação inicial** - Pitch deck, modelo de negócio, tração
2. **Entrevistas** - 3 rounds com diferentes avaliadores
3. **Demo técnico** - Apresentação da plataforma
4. **Validação financeira** - Projeções e métricas

## Estatísticas

- 📈 **Crescimento**: 300% nos últimos 6 meses
- 👥 **Usuários**: 2.500+ empresas ativas
- 💰 **Revenue**: $120k MRR
- 🚀 **Team**: 12 pessoas

---

**Pergunte-me qualquer coisa!** Posso compartilhar mais detalhes sobre o processo, a startup, ou qualquer outra curiosidade sobre empreendedorismo tech.`
  },
  "IamThiagoIT/networking-e-a-criacao-de-comunidades-minha-experiencia": {
    "id": "427b14b2-2e39-411b-b542-3290ef285f82",
    "title": "Networking e a criação de comunidades: minha experiência",
    "owner_username": "IamThiagoIT",
    "published_at": "2025-09-27T01:55:01.160Z",
    "tabcoins": 8,
    "children_deep_count": 2,
    "body": `# Networking e a criação de comunidades: minha experiência

Nos últimos **5 anos** trabalhando na área de tecnologia, aprendi que networking não é sobre "vender seu peixe", mas sobre **criar conexões genuínas**.

## Por que networking é importante?

- 🤝 **Oportunidades** surgem através de relacionamentos
- 📚 **Aprendizado** constante com outros profissionais  
- 🎯 **Mentoria** tanto dar quanto receber
- 🌟 **Inspiração** para novos projetos e ideias

## Minha jornada

### 2020 - Os primeiros passos
Comecei participando de meetups locais em São Paulo. Era tímido e só ficava no canto observando.

### 2021 - Mudança de mentalidade  
Decidi me desafiar a conversar com pelo menos 3 pessoas por evento. Foi transformador.

### 2022 - Criando conteúdo
Comecei a compartilhar conhecimento no LinkedIn e aqui no TabNews.

### 2023 - Organizando eventos
Ajudei a organizar o primeiro meetup de DevOps da minha cidade.

### 2024 - Comunidade consolidada
Nossa comunidade local cresceu para 500+ desenvolvedores ativos.

## Dicas práticas

1. **Seja genuíno** - Interesse real pelas pessoas
2. **Ofereça ajuda** - Antes de pedir, veja como pode contribuir
3. **Mantenha contato** - Follow-up é essencial
4. **Diversifique** - Tanto online quanto presencial
5. **Seja consistente** - Networking é um processo contínuo

---

E vocês? Como tem sido sua experiência com networking na área tech?`
  }
};

// Simula delay de rede
const mockDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Função para gerar dados paginados
const generatePaginatedData = (baseData, page, perPage) => {
  // Simula mais dados duplicando e variando
  const expandedData = [];
  for (let i = 0; i < 50; i++) {
    baseData.forEach((item, index) => {
      expandedData.push({
        ...item,
        id: `${item.id}-page${i}-${index}`,
        title: `${item.title} (Página ${page})`,
        tabcoins: item.tabcoins + Math.floor(Math.random() * 20),
        children_deep_count: Math.floor(Math.random() * 15),
        published_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    });
  }
  
  const startIndex = (page - 1) * perPage;
  return expandedData.slice(startIndex, startIndex + perPage);
};

/**
 * Mock da função getContents
 */
export const getContentsMock = async ({ page = 1, per_page = 10, strategy = 'new' } = {}) => {
  console.log('🎭 [MOCK] Buscando lista com filtros:', { page, per_page, strategy });
  
  await mockDelay(600); // Simula delay da API
  
  let baseData;
  switch (strategy) {
    case 'relevant':
      baseData = mockDataRelevant;
      break;
    case 'old':
      baseData = mockDataOld;
      break;
    case 'new':
    default:
      baseData = mockDataNew;
      break;
  }
  
  const data = generatePaginatedData(baseData, page, per_page);
  console.log('[MOCK] Lista carregada:', data.length, 'itens');
  
  return data;
};

/**
 * Mock da função getContent
 */
export const getContentMock = async (user, slug) => {
  console.log(`[MOCK] Buscando artigo: ${user}/${slug}`);
  
  await mockDelay(400);
  
  const articleKey = `${user}/${slug}`;
  const article = mockArticles[articleKey];
  
  if (article) {
    console.log('[MOCK] Artigo carregado:', article.title);
    return article;
  } else {
    // Gera um artigo genérico se não encontrar
    const genericArticle = {
      id: `mock-${Date.now()}`,
      title: `Artigo sobre ${slug.replace(/-/g, ' ')}`,
      owner_username: user,
      published_at: new Date().toISOString(),
      tabcoins: Math.floor(Math.random() * 50) + 1,
      children_deep_count: Math.floor(Math.random() * 10),
      body: `# ${slug.replace(/-/g, ' ')}

Este é um artigo de exemplo criado automaticamente pelo sistema de mocks.

## Conteúdo de exemplo

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Seção 1
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

### Seção 2  
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.

\`\`\`javascript
// Exemplo de código
console.log("Hello TabNews!");
\`\`\`

---

**Autor**: ${user}  
**Data**: ${new Date().toLocaleDateString('pt-BR')}
`
    };
    
    console.log('[MOCK] Artigo genérico criado:', genericArticle.title);
    return genericArticle;
  }
};