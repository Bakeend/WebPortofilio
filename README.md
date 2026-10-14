# Bakeend — portfólio

Portfólio React + Vite com foco em back-end, projetos e formação em Ciência da Computação. Mantém o globo Three.js, o carrossel e a identidade grafite/verde-limão.

## Desenvolvimento

Node.js 24 (ambiente validado) e npm, com versões de dependências fixadas pelo lockfile:

```bash
npm ci
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

```bash
npm run build
npm run preview
```

Nenhum backend, banco externo ou segredo é necessário. Google Fonts é opcional; fontes do sistema servem de fallback.

## Conteúdo

- `src/data/profile.js`: perfil, contatos e tecnologias em uso/estudo.
- `src/data/projects.js`: projetos, categorias, evidências e links opcionais.
- [Notas de conteúdo e pendências](docs/portfolio-content.md).

Não publicar dados pessoais, inventar resultados, links ou experiências. Só adicionar currículo se houver arquivo real.

## Interações e acessibilidade

Menu mobile com Escape e foco; carrossel com setas/Home/End, arraste e paginação; filtros por categoria; detalhes em diálogo nativo com contenção e restauração de foco. O globo permite teclado, rotação e zoom, interrompe renderização fora da tela ou com a aba oculta e fica estático com movimento reduzido. Há fallback sem WebGL.

O Three.js é carregado sob demanda. A configuração de divisão em módulos mantém `strictExecutionOrder` para preservar a inicialização das dependências no build de produção.

## Validação

O projeto não possui suíte de testes unitários. Nesta atualização foram exercitados o build de produção, layouts em 360/390/768/1024/1440 px, navegação por teclado, filtros, diálogo, renderização WebGL, pausa/retomada, mudança de preferência de movimento e fallback sem WebGL, usando Chromium e Playwright instalados fora do projeto. Também foi realizada checagem automatizada axe-core WCAG A/AA em mobile e desktop. Isso não substitui revisão manual com tecnologias assistivas.

A publicação é uma ação separada; alterações locais não são automaticamente implantadas.
