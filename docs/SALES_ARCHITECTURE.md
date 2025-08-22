# Sales Management Module Architecture

## Overview

The Sales Management module has been refactored to follow a modular architecture pattern that promotes:
- **Separation of Concerns**: Each component has a single responsibility
- **Reusability**: Components can be easily reused across different parts of the application
- **Maintainability**: Code is easier to understand, modify, and debug
- **Scalability**: New features can be added without affecting existing functionality

## Architecture Structure

### 1. Types (`/types/sales.ts`)
Central location for all type definitions used across the sales module:
- `Pipeline` - Pipeline data structure
- `Stage` - Stage data structure
- `Opportunity` - Opportunity data structure
- `NewLeadForm` - Form data for creating new leads
- `SortConfig` - Configuration for sorting
- `DateRange` - Date range selection
- `DragResult` - Drag and drop result data

### 2. Custom Hooks (`/hooks/`)

#### `useSalesData` (`/hooks/use-sales-data.ts`)
Manages all data fetching, state management, and filtering logic:
- **State Management**: Pipelines, opportunities, search, and sorting
- **Data Fetching**: API calls to Supabase for pipelines and opportunities
- **Filtering & Sorting**: Real-time filtering and sorting of opportunities
- **Side Effects**: Automatic data loading and pipeline selection

#### `useSalesOperations` (`/hooks/use-sales-operations.ts`)
Handles all CRUD operations and business logic:
- **Pipeline Operations**: Add, edit, delete pipelines
- **Opportunity Operations**: Add, edit, delete, move opportunities
- **Stage Operations**: Add, edit, delete, reorder stages
- **Drag & Drop**: Complex drag and drop functionality
- **Database Sync**: Automatic synchronization with Supabase

### 3. UI Components (`/components/sales/`)

#### Core Components
- **`SalesHeader.tsx`** - Hero header with pipeline selector and add pipeline button
- **`SalesTabs.tsx`** - Main tabbed interface containing all views (Kanban, Table, Calendar, etc.)

#### Dialog Components
- **`AddPipelineDialog.tsx`** - Modal for creating new pipelines
- **`AddLeadDialog.tsx`** - Modal for creating new opportunities/leads
- **`EditLeadDialog.tsx`** - Modal for editing existing opportunities

#### Feature Components
- **`KanbanControls.tsx`** - Search, filters, and action buttons for Kanban view

### 4. Main Page (`/app/sales/page.tsx`)
The main sales page acts as a container that:
- Orchestrates all components
- Manages dialog visibility state
- Connects hooks with UI components
- Handles high-level event coordination

## Benefits of This Architecture

### 1. **Single Responsibility Principle**
Each component/hook has one clear purpose:
- `useSalesData` → Data management
- `useSalesOperations` → Business operations
- Dialog components → User input handling
- Header/Tabs → UI layout and navigation

### 2. **Improved Testability**
- Hooks can be tested independently
- Components have clear props interfaces
- Business logic is separated from UI logic

### 3. **Better Code Reusability**
- Hooks can be reused in other parts of the application
- Components are self-contained and portable
- Type definitions are shared and consistent

### 4. **Enhanced Maintainability**
- Easier to locate and fix bugs
- Changes to one component don't affect others
- Clear separation between data layer and presentation layer

### 5. **Simplified State Management**
- State is colocated with its usage
- No prop drilling through multiple levels
- Clear data flow from hooks to components

## Usage Examples

### Using the Sales Data Hook
```typescript
const salesData = useSalesData()
const { pipelines, currentPipeline, opportunities, filteredOpportunities } = salesData
```

### Using the Sales Operations Hook
```typescript
const salesOperations = useSalesOperations({
  pipelines,
  setPipelines,
  currentPipeline,
  setCurrentPipeline,
  opportunities,
  setOpportunities,
  user
})

// Add a new pipeline
await salesOperations.handleAddPipeline("New Pipeline")

// Add a new opportunity
await salesOperations.handleAddLead(opportunityData)
```

### Using Dialog Components
```typescript
<AddLeadDialog
  open={isAddLeadDialogOpen}
  onOpenChange={setIsAddLeadDialogOpen}
  onAddLead={salesOperations.handleAddLead}
  currentPipeline={salesData.currentPipeline}
/>
```

## File Structure
```
/types/
  sales.ts                    # Type definitions

/hooks/
  use-sales-data.ts          # Data management hook
  use-sales-operations.ts    # Operations hook

/components/sales/
  SalesHeader.tsx            # Header component
  SalesTabs.tsx              # Main tabs component
  AddPipelineDialog.tsx      # Add pipeline modal
  AddLeadDialog.tsx          # Add lead modal
  EditLeadDialog.tsx         # Edit lead modal
  KanbanControls.tsx         # Kanban controls
  
  # Existing components (unchanged)
  KanbanBoard.tsx
  OpportunitiesTable.tsx
  SalesCalendar.tsx
  SalesPipeline.tsx
  SalesForecast.tsx

/app/sales/
  page.tsx                   # Main sales page (orchestrator)
```

## Future Enhancements

This modular architecture makes it easy to add new features:

1. **New Views**: Add new tab content by extending `SalesTabs.tsx`
2. **Additional Operations**: Extend hooks with new business logic
3. **Enhanced Filtering**: Add more filter options to `KanbanControls.tsx`
4. **Real-time Updates**: Add WebSocket support to hooks
5. **Offline Support**: Add caching layer to data management hook

## Migration Notes

The refactoring maintains 100% backward compatibility:
- All existing functionality is preserved
- No breaking changes to the user interface
- Database operations remain unchanged
- Performance characteristics are maintained or improved
