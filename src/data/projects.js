// Only verified links and features belong here. Missing links remain absent.
export const projects = [
  {
    name: 'OctoGames', type: 'Marketplace digital', category: 'Web',
    image: '/images/projects/octogames.webp', width: 1280, height: 651, accent: 'blue',
    description: 'Uma interface de marketplace para reunir jogos, itens e contas digitais em um só lugar.',
    problem: 'Organizar a descoberta de produtos digitais e a apresentação dos vendedores.',
    features: ['Catálogo de produtos digitais', 'Apresentação de ofertas e vendedores'],
    tags: ['Interface web', 'Marketplace'],
    note: 'Captura do projeto original. Stack, código público e demonstração ainda não confirmados.',
  },
  {
    name: 'Pixel Store', type: 'Loja digital', category: 'Web',
    image: '/images/projects/pixel-store.webp', width: 1280, height: 481, accent: 'orange',
    description: 'Uma loja digital com identidade própria e uma vitrine dedicada aos produtos.',
    problem: 'Apresentar produtos digitais com uma navegação clara e uma identidade consistente.',
    features: ['Vitrine de produtos', 'Interface com identidade visual própria'],
    tags: ['Interface web', 'Loja digital'],
    note: 'Captura do projeto original. Stack, integrações, código público e demonstração ainda não confirmados.',
  },
  {
    name: 'Lume', type: 'Skill de estudo com IA', category: 'IA', accent: 'violet',
    description: 'Orientações modulares para conduzir estudo, prática e revisão em conversas com ChatGPT e Codex.',
    problem: 'Dar estrutura às sessões de estudo e facilitar a retomada de temas que ainda precisam de prática.',
    features: ['Guias de explicação e atividades', 'Modelo de ficha para retomada do estudo', 'Iniciador para instalação no Codex no Windows'],
    tags: ['Markdown', 'Codex', 'Windows CMD'], status: 'Em evolução',
    source: 'https://github.com/Bakeend/skilEstudo',
    note: 'Depende do modelo e das ferramentas da conversa. Não é um aplicativo autônomo nem uma promessa de ganhos de aprendizagem.',
  },
]
