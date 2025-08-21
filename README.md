# Heavy CRM

A comprehensive Customer Relationship Management system built with Next.js and Supabase.

## Features

- **Dashboard**: Overview of notes, sales stats, and recent activities
- **Sales Management**: Pipeline management with drag-and-drop Kanban boards
- **Project Management**: Project pipelines with customizable stages
- **Contact Management**: Import/export contacts with list management
- **Templates**: Email, SMS, and WhatsApp message templates
- **Campaigns**: Multi-channel campaign management
- **Chatbot**: Automated conversation flows
- **Analytics**: Comprehensive reporting and insights

## Database Setup

### Automatic Database Initialization

The application includes an automatic database initialization system that will:

1. Check if required tables exist when the app starts
2. Display the necessary SQL commands in the browser console if tables are missing
3. Show a user-friendly interface guiding you through the setup process

### Manual Database Setup

If you prefer to set up the database manually, follow these steps:

1. **Go to your Supabase project dashboard**
2. **Navigate to the SQL Editor**
3. **Copy and paste the contents of `database-setup.sql`** (located in the project root)
4. **Execute the SQL script**

The script will create all necessary tables with:
- Proper relationships and foreign keys
- Row Level Security (RLS) policies for data isolation
- Indexes for optimal performance
- Automatic timestamp triggers
- UUID primary keys

### Required Tables

The application requires the following tables:
- `notes` - Dashboard notes
- `pipelines` & `stages` - Sales pipeline management
- `opportunities` - Sales leads and deals
- `project_pipelines` & `project_stages` - Project management
- `projects` - Project records
- `contact_lists` & `contacts` - Contact management
- `templates` - Message templates (email, SMS, WhatsApp)
- `campaigns` - Marketing campaigns
- `chatbot_flows` - Automated conversation flows
- `api_config` - API configurations

## Environment Setup

### Environment Variables

1. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your actual Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Time Setup

When you first run the application:

1. If the database tables don't exist, you'll see a loading screen followed by setup instructions
2. The browser console will display the complete SQL script needed for your Supabase database
3. Copy the SQL script and run it in your Supabase SQL Editor
4. Refresh the application and it should work normally

## Security

- **Row Level Security**: All tables have RLS enabled with user-specific policies
- **Environment Security**: Credentials are stored in `.env.local` and excluded from version control
- **Authentication**: Integrated with Supabase Auth for secure user management
- **Data Isolation**: Each user can only access their own data

## Development

The application structure includes:
- `/app` - Next.js 13+ app router pages
- `/components` - Reusable React components with UI components
- `/lib` - Utility functions, database configurations, and Supabase client
- `/hooks` - Custom React hooks including database initialization
- `/types` - TypeScript type definitions for all data models

### Key Components

- **Database Initialization** (`lib/database-init.ts`): Automatic table creation and verification
- **Authentication** (`components/auth-provider.tsx`): Supabase auth integration
- **Layout System** (`components/authenticated-layout.tsx`): Main app layout with navigation
- **Data Management**: Type-safe database operations with error handling

## Troubleshooting

### Database Issues

1. **Tables not found error**: Run the SQL script from `database-setup.sql` in Supabase
2. **Permission denied**: Ensure RLS policies are correctly applied
3. **Connection issues**: Verify your Supabase URL and API key in `.env.local`

### Development Issues

1. **Module not found**: Run `npm install` to ensure all dependencies are installed
2. **Type errors**: Ensure all TypeScript types are properly imported
3. **Build errors**: Check for any missing environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly including database operations
5. Submit a pull request

## License

[Your License Here]
