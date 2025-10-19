Dia 18/10/2025

FRONT END: 

Finalizei a configuração do TailwindCSS e testei o funcionamento com sucesso.
Criei o layout base da Dashboard, incluindo:
 - Sidebar com logo e navegação;
 - Topbar;
 - Componentes principais (Portfolio, MarketList, TransactionsTable);
 - Layout responsivo com flex e gap utilizando Tailwind;
 - Efeito de vidro fosco (glassmorphism) aplicado via classes backdrop-blur e transparência.

 BACKEND:

Configurei o backend com Node.js + Express + CORS + dotenv.
Estruturei o primeiro endpoint /api para teste e confirmei o funcionamento.
Criei as rotas e controladores iniciais de cryptos e portfolio, com endpoints REST:
 - GET /api/cryptos — listar todas as cryptos simuladas
 - GET /api/portfolio — listar portfolio
 - POST /api/portfolio — adicionar cripto manualmente
 - PUT /api/portfolio/:symbol — atualizar preço de compra
 - DELETE /api/portfolio/:symbol — remover do portfolio

Planejei a integração futura com WebSocket da Binance para atualização em tempo real dos preços.
Estudei mais a fundo a lógica de portfólio híbrido (automático via Binance + manual via app).

PRINCIPAL APRENDIZADO
 - Entendimento da arquitetura frontend (React) + backend (Node/Express).
 - Diferença entre endpoints estáticos e integração com fontes em tempo real (WebSocket).
 - Aplicação prática do conceito de controller e routes no padrão MVC.
 - Uso do Tailwind para criar layouts com estilo consistente e clean.
_________________________________________________________________________________________________________


