# Configuração Dinâmica do PepMenu

## Visão Geral

O PepMenu agora suporta configuração dinâmica através de variáveis de ambiente, permitindo personalizar o título da aplicação e o nome do restaurante sem modificar o código.

## Variáveis de Ambiente

### VITE_APP_TITLE
- **Descrição**: Define o título que aparece na aba do navegador
- **Valor padrão**: "PepMenu - Cardápio Online"
- **Exemplo**: `VITE_APP_TITLE="Meu Restaurante - Cardápio"`

### VITE_RESTAURANT_NAME
- **Descrição**: Define o nome do restaurante que aparece no cabeçalho da aplicação
- **Valor padrão**: "Emburguer Fast"
- **Exemplo**: `VITE_RESTAURANT_NAME="Restaurante do João"`

## Como Configurar

### 1. Arquivo .env
Crie um arquivo `.env` na raiz do projeto:

```bash
VITE_APP_TITLE="Seu Restaurante - Cardápio Online"
VITE_RESTAURANT_NAME="Seu Restaurante"
```

### 2. Variáveis de Sistema
Defina as variáveis no sistema operacional:

```bash
# Linux/Mac
export VITE_APP_TITLE="Seu Restaurante - Cardápio Online"
export VITE_RESTAURANT_NAME="Seu Restaurante"

# Windows
set VITE_APP_TITLE=Seu Restaurante - Cardápio Online
set VITE_RESTAURANT_NAME=Seu Restaurante
```

### 3. Durante o Build
Passe as variáveis durante o comando de build:

```bash
VITE_APP_TITLE="Seu Restaurante" VITE_RESTAURANT_NAME="Restaurante XYZ" npm run build
```

## Mudanças Implementadas

### Arquivos Modificados
- `index.html` - Título dinâmico usando variável de ambiente
- `src/App.tsx` - Configuração do título da página
- `src/data/mockData.ts` - Nome do restaurante dinâmico
- `src/types/index.ts` - Novos tipos para configuração
- `vite.config.ts` - Configuração de variáveis de ambiente

### Arquivos Criados
- `src/config/app.ts` - Centralização das configurações
- `.env.example` - Exemplo de configuração
- `CONFIGURACAO.md` - Esta documentação

### Arquivos Removidos
- `public/favicon.ico` - Ícone removido conforme solicitado

## Estrutura de Configuração

```typescript
// src/config/app.ts
export const appConfig = {
  title: process.env.VITE_APP_TITLE || "PepMenu - Cardápio Online",
  restaurantName: process.env.VITE_RESTAURANT_NAME || "Emburguer Fast"
};
```

## Benefícios

1. **Flexibilidade**: Permite personalizar a aplicação sem modificar código
2. **Reutilização**: Mesma base de código para diferentes restaurantes
3. **Manutenção**: Configurações centralizadas e fáceis de gerenciar
4. **Deploy**: Diferentes configurações para diferentes ambientes

## Exemplo de Uso

Para um restaurante chamado "Pizzaria do Mario":

```bash
# .env
VITE_APP_TITLE="Pizzaria do Mario - Peça Online"
VITE_RESTAURANT_NAME="Pizzaria do Mario"
```

Resultado:
- Título da aba: "Pizzaria do Mario - Peça Online"
- Nome no cabeçalho: "Pizzaria do Mario"

## Compatibilidade

- ✅ Mantém funcionalidade existente
- ✅ Valores padrão garantem funcionamento sem configuração
- ✅ Não quebra builds existentes
- ✅ Interface de usuário inalterada