# Market Trends Dashboard 📈

Una aplicación web moderna construida con Next.js 16 para rastrear tendencias de mercado en tiempo real usando la API de Alpha Vantage.

## Características Implementadas ✨

### 1. **Dashboard de Acciones (Stocks)**
- Búsqueda de acciones por símbolo (AAPL, MSFT, GOOGL, etc.)
- Cotizaciones en tiempo real con precio actual, cambio y volumen
- Gráficos interactivos con datos intradiarios (cada 5 minutos)
- Visualización de precio de cierre, máximo y mínimo

### 2. **Rastreador de Criptomonedas**
- Seguimiento de Bitcoin, Ethereum y otras criptomonedas
- Conversión a diferentes monedas fiat (USD, EUR, etc.)
- Precios en tiempo real

### 3. **Monitor de Forex**
- Tipos de cambio para pares de divisas principales
- Formato: USD/EUR, GBP/JPY, etc.
- Actualización en tiempo real

### 4. **Indicadores Técnicos**
- RSI (Relative Strength Index)
- SMA (Simple Moving Average) - 50 y 200 períodos
- Componente reutilizable para análisis técnico

### 5. **Noticias y Análisis de Sentimiento**
- Feed de noticias del mercado financiero
- Análisis de sentimiento de artículos (Positivo, Neutral, Negativo)
- Filtrado por símbolo de acción

### 6. **UI Moderna y Responsiva**
- Diseño adaptable para móviles, tablets y desktop
- Modo oscuro automático
- Gráficos interactivos con Recharts
- Iconos con Lucide React
- Estilos con Tailwind CSS

## Tecnologías Utilizadas 🛠️

- **Next.js 16** - Framework de React con App Router
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Recharts** - Biblioteca de gráficos
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **Alpha Vantage API** - Datos financieros

## Instalación y Configuración 🚀

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd marketapp
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la API Key

1. Obtén tu API key gratuita en: https://www.alphavantage.co/support/#api-key
2. Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=tu_api_key_aqui
```

**Nota**: La aplicación viene con una API key "demo" por defecto, pero tiene limitaciones. Se recomienda usar tu propia key.

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 5. Compilar para producción

```bash
npm run build
npm start
```

## Estructura del Proyecto 📁

```
marketapp/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globales
├── components/
│   ├── StockCard.tsx       # Tarjeta de acción
│   ├── StockChart.tsx      # Gráfico de acciones
│   ├── CryptoCard.tsx      # Tarjeta de cripto
│   ├── SearchBar.tsx       # Barra de búsqueda
│   ├── TechnicalIndicators.tsx  # Indicadores técnicos
│   └── MarketNews.tsx      # Noticias de mercado
├── lib/
│   └── alphavantage.ts     # Cliente de API
├── .env.local              # Variables de entorno
└── README.md               # Este archivo
```

## Uso de la Aplicación 💡

### Buscar Acciones
1. Haz clic en la pestaña "Stocks"
2. Ingresa un símbolo (ej: AAPL, TSLA, GOOGL)
3. Presiona "Search" o Enter
4. Visualiza el precio actual y el gráfico intradiario

### Buscar Criptomonedas
1. Haz clic en la pestaña "Crypto"
2. Ingresa el símbolo de la cripto (ej: BTC, ETH)
3. Visualiza el precio en USD

### Consultar Forex
1. Haz clic en la pestaña "Forex"
2. Ingresa el par de divisas (ej: USD/EUR)
3. Visualiza el tipo de cambio actual

## Sugerencias de Características Adicionales 🎯

### Características de Nivel Básico/Intermedio

#### 1. **Portfolio Tracker (Rastreador de Cartera)**
Permite a los usuarios:
- Agregar múltiples acciones a su cartera
- Guardar cantidades de acciones compradas
- Calcular ganancias/pérdidas totales
- Persistir datos en localStorage o base de datos

```typescript
// Ejemplo de estructura
interface Portfolio {
  stocks: {
    symbol: string;
    quantity: number;
    purchasePrice: number;
  }[];
}
```

#### 2. **Watchlist (Lista de Seguimiento)**
- Crear múltiples listas de seguimiento
- Guardar acciones favoritas
- Recibir alertas cuando alcancen ciertos precios
- Actualización automática cada X segundos

#### 3. **Comparador de Acciones**
- Comparar 2-4 acciones lado a lado
- Gráficos superpuestos
- Tabla comparativa de métricas
- Rendimiento relativo

#### 4. **Historial de Precios Extendido**
- Gráficos semanales, mensuales, anuales
- Selector de rango de fechas personalizado
- Diferentes tipos de gráficos (línea, velas, barras)
- Zoom y pan en gráficos

#### 5. **Screener de Acciones**
Filtrar acciones por:
- Rango de precio
- Volumen de negociación
- Capitalización de mercado
- Rendimiento de dividendos
- Ratios financieros

#### 6. **Dashboard de Commodities (Materias Primas)**
- Precios de oro, plata, petróleo
- Gráficos históricos
- Tendencias de mercado

```typescript
// API de Alpha Vantage soporta commodities
function getCommodityData(commodity: 'WTI' | 'BRENT' | 'NATURAL_GAS') {
  // Implementación usando la función COMMODITIES
}
```

### Características Avanzadas

#### 7. **Panel de Indicadores Técnicos Completo**
Agregar más indicadores:
- **MACD** (Moving Average Convergence Divergence)
- **Bollinger Bands**
- **Stochastic Oscillator**
- **ATR** (Average True Range)
- **ADX** (Average Directional Index)
- **CCI** (Commodity Channel Index)
- **Aroon**

```typescript
// Alpha Vantage soporta más de 60 indicadores técnicos
export async function getMACD(symbol: string) {
  const response = await axios.get(BASE_URL, {
    params: {
      function: 'MACD',
      symbol,
      interval: 'daily',
      series_type: 'close',
      apikey: API_KEY,
    },
  });
  return response.data['Technical Analysis: MACD'];
}
```

#### 8. **Análisis Fundamental**
Mostrar datos de la empresa:
- Balance general (Balance Sheet)
- Estado de resultados (Income Statement)
- Flujo de efectivo (Cash Flow)
- Ratios financieros (P/E, EPS, ROE, etc.)
- Próximos dividendos y earnings

```typescript
// API endpoints disponibles
function getIncomeStatement(symbol: string) {
  // function: 'INCOME_STATEMENT'
}

function getBalanceSheet(symbol: string) {
  // function: 'BALANCE_SHEET'
}

function getCashFlow(symbol: string) {
  // function: 'CASH_FLOW'
}
```

#### 9. **Sistema de Alertas Inteligentes**
- Alertas por correo/push cuando:
  - El precio sube/baja X%
  - El RSI alcanza niveles de sobrecompra/sobreventa
  - Cruces de medias móviles
  - Volumen inusual
- Integración con servicios de notificación

#### 10. **Backtesting de Estrategias**
- Probar estrategias de trading con datos históricos
- Calcular rendimientos hipotéticos
- Comparar diferentes estrategias
- Visualizar resultados

#### 11. **Análisis de Sectores e Industrias**
- Vista de rendimiento por sector
- Comparación de industrias
- Heat maps de mercado
- Top gainers/losers por sector

#### 12. **Correlación entre Activos**
- Matriz de correlación entre acciones
- Identificar diversificación de cartera
- Análisis de riesgo

#### 13. **Economic Indicators (Indicadores Económicos)**
Alpha Vantage ofrece datos macro:
- **Tasa de desempleo**
- **Inflación (CPI)**
- **PIB real**
- **Tasas de interés**
- **Confianza del consumidor**

```typescript
function getRealGDP() {
  // function: 'REAL_GDP'
}

function getInflation() {
  // function: 'INFLATION'
}

function getUnemployment() {
  // function: 'UNEMPLOYMENT'
}
```

#### 14. **Crypto Dashboard Avanzado**
- Top 100 criptomonedas
- Gráficos de dominancia de Bitcoin
- Indicador de Fear & Greed
- Análisis on-chain

#### 15. **AI-Powered Features (Características con IA)**
- Predicciones de precios usando ML
- Análisis de sentimiento avanzado de noticias
- Generación automática de insights
- Recomendaciones personalizadas

#### 16. **Export de Datos**
- Exportar datos a CSV/Excel
- Generar reportes PDF
- Compartir análisis

#### 17. **Social Features**
- Compartir carteras públicamente
- Seguir a otros inversores
- Sistema de comentarios
- Rankings de rendimiento

#### 18. **Trading Paper (Simulación)**
- Cuenta demo con dinero virtual
- Simular compra/venta
- Historial de transacciones
- Aprender sin riesgo

### Mejoras de UI/UX

#### 19. **Temas Personalizables**
- Múltiples esquemas de color
- Customización de dashboard
- Layouts guardados

#### 20. **Widgets Personalizables**
- Dashboard tipo Trello
- Arrastrar y soltar widgets
- Guardar configuración

#### 21. **Modo Offline**
- Service Workers
- Cache de datos
- PWA (Progressive Web App)

#### 22. **Internacionalización**
- Soporte multi-idioma
- Formatos de moneda locales
- Fechas localizadas

## API Rate Limits ⚠️

La API gratuita de Alpha Vantage tiene límites:
- **5 llamadas por minuto**
- **500 llamadas por día**

Para uso intensivo, considera:
1. Implementar caching
2. Actualizar a plan premium
3. Agregar manejo de rate limits

## Recursos Adicionales 📚

- [Documentación de Alpha Vantage](https://www.alphavantage.co/documentation/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Ejemplo de Cache Implementation

```typescript
// lib/cache.ts
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minuto

export function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

export function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}
```

## Contribuir 🤝

Las contribuciones son bienvenidas. Por favor:
1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia 📄

Este proyecto es open source y está disponible bajo la licencia ISC.

## Contacto 📧

Para preguntas o sugerencias, abre un issue en el repositorio.

---

**Nota**: Este proyecto usa datos de Alpha Vantage. Asegúrate de cumplir con sus [términos de servicio](https://www.alphavantage.co/terms_of_service/).
