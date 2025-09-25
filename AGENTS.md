# Repository Guidelines

## Project Structure & Module Organization

Source code is organized in `src/` with clear separation of concerns:
- `src/components/` - Reusable UI components and shadcn/ui components in `ui/` subfolder
- `src/pages/` - Route-level components (Menu, Cart, Delivery, Payment, OrderHistory)
- `src/contexts/` - React Context providers for global state management
- `src/types/` - TypeScript type definitions for the application
- `src/data/` - Mock data and static content
- `src/lib/` - Utility functions and helpers

## Build, Test, and Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Coding Style & Naming Conventions

- **Indentation**: 2 spaces (configured in ESLint)
- **File naming**: PascalCase for components (`ProductCard.tsx`), camelCase for utilities
- **Function/variable naming**: camelCase with descriptive names
- **Linting**: ESLint with TypeScript rules, React hooks, and React refresh plugins
- **Formatting**: Tailwind CSS classes, TypeScript strict mode enabled

## Testing Guidelines

- **Framework**: No testing framework currently configured
- **Linting**: Use `npm run lint` to check code quality
- **Type checking**: TypeScript compiler validates types during build

## Commit & Pull Request Guidelines

- **Commit format**: Standard conventional commits recommended
- **PR process**: Code should pass linting before merge
- **Branch naming**: Feature branches with descriptive names

---

# Repository Tour

## 🎯 What This Repository Does

PepMenu is a modern food delivery application for "Bella Vista Restaurante" that provides customers with an intuitive mobile-first ordering experience. The app allows users to browse menu items, customize orders, manage their cart, and complete the checkout process with delivery and payment options.

**Key responsibilities:**
- Menu browsing with category-based navigation
- Shopping cart management with quantity controls
- Multi-step checkout flow (delivery info and payment)
- Order history and status tracking

---

## 🏗️ Architecture Overview

### System Context
```
[Customer Mobile/Web] → [React SPA] → [Mock Data Layer]
                            ↓
                    [Context API State] → [Local Storage]
```

### Key Components
- **AppContext** - Centralized state management using React Context and useReducer
- **Page Components** - Route-level components handling specific user flows
- **UI Components** - Reusable components built on shadcn/ui and Radix primitives
- **Mock Data Layer** - Static data simulation for products, orders, and restaurant info

### Data Flow
1. User interacts with UI components (ProductCard, Cart, etc.)
2. Actions dispatch to AppContext reducer for state updates
3. Components re-render based on context state changes
4. Navigation handled by React Router for multi-page flows

---

## 📁 Project Structure [Partial Directory Tree]

```
pepmenu/
├── src/                    # Main application source code
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui component library
│   │   ├── ProductCard.tsx # Product display component
│   │   ├── BottomNav.tsx  # Mobile navigation bar
│   │   └── FloatingCart.tsx # Cart overlay component
│   ├── pages/             # Route-level page components
│   │   ├── Menu.tsx       # Main menu browsing page
│   │   ├── Cart.tsx       # Shopping cart management
│   │   ├── Delivery.tsx   # Delivery information form
│   │   └── Payment.tsx    # Payment method selection
│   ├── contexts/          # React Context providers
│   │   └── AppContext.tsx # Global state management
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # Core application types
│   ├── data/              # Mock data and static content
│   │   └── mockData.ts    # Restaurant, products, and orders
│   ├── lib/               # Utility functions
│   │   └── utils.ts       # Helper functions (formatPrice, cn)
│   └── assets/            # Static images and media
├── public/                # Static public assets
├── components.json        # shadcn/ui configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite build configuration
└── package.json           # Dependencies and scripts
```

### Key Files to Know

| File | Purpose | When You'd Touch It |
|------|---------|---------------------|
| `src/App.tsx` | Application entry point with routing | Adding new routes/global providers |
| `src/contexts/AppContext.tsx` | Global state management | Adding new state or actions |
| `src/data/mockData.ts` | Mock data for development | Adding products or test data |
| `src/types/index.ts` | TypeScript type definitions | Adding new data structures |
| `components.json` | shadcn/ui component configuration | Configuring UI component library |

---

## 🔧 Technology Stack

### Core Technologies
- **Language:** TypeScript (5.8.3) - Type safety and better developer experience
- **Framework:** React (18.3.1) - Component-based UI library
- **Build Tool:** Vite (5.4.19) - Fast development and build tooling
- **Styling:** Tailwind CSS (3.4.17) - Utility-first CSS framework

### Key Libraries
- **@radix-ui/react-*** - Accessible UI primitives for complex components
- **react-router-dom** - Client-side routing and navigation
- **@tanstack/react-query** - Server state management (configured but not actively used)
- **react-hook-form** - Form handling and validation
- **zod** - Runtime type validation and schema definition

### Development Tools
- **ESLint** - Code linting with TypeScript and React rules
- **@vitejs/plugin-react-swc** - Fast React compilation with SWC
- **lovable-tagger** - Development-mode component tagging
- **tailwindcss-animate** - Animation utilities for Tailwind

---

## 🌐 External Dependencies

### Required Services
- **Static Assets** - Images served from local assets folder
- **Font Loading** - System fonts and web-safe fallbacks

### Optional Integrations
- **Lovable Platform** - Development and deployment platform integration
- **Component Library** - shadcn/ui components with Radix UI primitives

---

## 🔄 Common Workflows

### Menu Browsing Flow
1. User lands on Menu page (`/`)
2. RestaurantHeader displays restaurant info and status
3. CategoryNav allows filtering by food categories
4. ProductCard components display items with images and prices
5. ProductModal opens for item customization and cart addition

**Code path:** `Menu.tsx` → `ProductCard.tsx` → `ProductModal.tsx` → `AppContext`

### Checkout Process
1. User reviews cart items on Cart page (`/cart`)
2. Proceeds to delivery information (`/checkout/delivery`)
3. Enters payment details (`/checkout/payment`)
4. Order confirmation displays success (`/order-confirmation/:orderId`)

**Code path:** `Cart.tsx` → `Delivery.tsx` → `Payment.tsx` → `OrderConfirmation.tsx`

---

## 📈 Performance & Scale

### Performance Considerations
- **Code Splitting:** Vite automatically splits code by routes
- **Image Optimization:** Static images served from assets folder
- **State Management:** Efficient Context API with useReducer pattern

### Monitoring
- **Development:** Vite dev server with hot module replacement
- **Build Analysis:** Vite build output shows bundle sizes

---

## 🚨 Things to Be Careful About

### 🔒 Security Considerations
- **Data Handling:** Currently uses mock data - no sensitive information stored
- **Form Validation:** Uses react-hook-form with zod for client-side validation
- **State Management:** Cart and order data stored in memory (lost on refresh)

*Updated at: 2024-12-19 UTC*

## 📱 Diretriz de Produto: Mobile-first e Configuração Dinâmica

- Foco principal: experiência mobile (layout, performance e navegação otimizados para smartphones).
- Evolução planejada: integração futura com um sistema de gestão (backoffice) onde o dono do restaurante realiza configurações do app.
- Princípio: todas as informações devem ser variáveis/configuráveis (evitar hardcode).

Informações que devem ser variáveis:
- Nome e descrição do restaurante; status de funcionamento e horário.
- Endereço, telefone e dados de contato.
- Categorias, produtos, descrições, imagens, preços, promoções.
- Taxas, opções de entrega/retirada e formas de pagamento.
- Textos/labels de UI e mensagens.

Diretrizes de implementação:
- Centralizar configurações em AppConfig/Context e/ou via API; usar variáveis de ambiente (.env) para URLs e chaves.
- Tipar configurações em src/types (ex.: AppConfig) e manter defaults seguros com fallback para mockData em dev.
- Componentes devem receber dados via props/context; evitar literais fixos no JSX.
- Preparar para internacionalização (i18n) e temas, quando aplicável.

Implicações para PRs:
- Evitar código com dados/textos fixos; preferir fontes de dados configuráveis.
- Validar novas telas/fluxos sob a ótica mobile-first.

*Section updated: 2025-09-25 UTC*