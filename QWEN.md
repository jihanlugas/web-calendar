# Web Calendar Application Overview

## Application Summary
Web Calendar is a Next.js-based calendar application designed for property management and event scheduling. The application provides a timeline view for managing events across multiple properties with real-time updates via WebSocket connections.

## Technology Stack
- **Framework**: Next.js 15.3.1 with React 19
- **State Management**: @tanstack/react-query for server state management
- **Styling**: Tailwind CSS with PostCSS
- **Date Handling**: moment.js and dayjs
- **UI Components**: 
  - react-calendar-timeline for timeline visualization
  - react-icons for iconography
  - react-notifications-component for notifications
  - formik and yup for form handling and validation
- **HTTP Client**: axios
- **Utilities**: uuid for unique identifiers
- **Animations**: animate.css

## Key Features
1. **Multi-Property Timeline Management**: Users can manage events across multiple properties in a single view
2. **Real-time Updates**: WebSocket integration for live event synchronization
3. **Drag-and-Drop Interface**: Interactive timeline with drag-and-drop event management
4. **Event Creation and Editing**: Modal-based interface for creating and managing events
5. **Responsive Design**: Mobile-friendly interface with Tailwind CSS
6. **Authentication Flow**: Built-in sign-in page and authenticated routes

## Project Structure
```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── lib/            # Library functions and API clients
├── pages/          # Next.js pages and routing
├── styles/         # Global styles and Tailwind configuration
├── types/          # TypeScript type definitions
└── utils/          # Utility functions and helpers
```

## Core Functionality
- **Dashboard View**: Main timeline interface showing events across all properties
- **Event Management**: Create, update, and move events on the timeline
- **Property Groups**: Organize timeline into property-specific groups
- **Time Navigation**: Zoom and pan through different time periods
- **WebSocket Communication**: Real-time event updates and synchronization

## Development Setup
- Development server: `yarn dev`
- Production build: `yarn build`
- Linting: `yarn lint`

## Environment
The application appears to be designed for property management companies that need to schedule and track events across multiple properties. It uses a timeline-based interface which is particularly suited for visualizing time-bound activities like bookings, maintenance schedules, or reservations.