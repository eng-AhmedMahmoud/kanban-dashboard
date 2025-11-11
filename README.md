# Kanban Dashboard - Interactive Task Management 📋

A modern, feature-rich Kanban board built with **Next.js 16**, **TypeScript**, **Redux Toolkit**, **React Query**, and **Material UI**. Features smooth drag-and-drop animations, real-time updates, and an intuitive user interface.

## ✨ Features

### Main Features
- **🎯 Four Column Kanban Board**: Backlog, In Progress, Review, and Done
- **🎨 Drag and Drop**: Smooth animations powered by @dnd-kit
- **🔄 Real-time Updates**: Optimistic updates with React Query
- **🔍 Smart Search**: Debounced search across task titles and descriptions
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **♾️ Infinite Scroll**: Load more tasks on demand in each column
- **💬 Interactive Tooltips**: Helpful hints and explanations throughout
- **🎭 Smooth Animations**: Fade-in, slide-up, and drag animations
- **✅ Full CRUD Operations**: Create, Read, Update, and Delete tasks
- **🔔 Toast Notifications**: Success/error feedback for all actions
- **⚡ Performance Optimized**: React Query caching and Redux state management

### Bonus Feature
- **jQuery Dynamic List**: A separate page demonstrating jQuery with fade animations and validation

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Data Fetching**: React Query (TanStack Query)
- **UI Library**: Material UI + Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **API**: json-server (mock backend)
- **Icons**: Material UI Icons

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup Instructions

1. **Clone or extract the project**
   ```bash
   cd kanban-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server** (two terminals required)

   **Terminal 1** - Start the API server:
   ```bash
   npm run server
   ```
   This starts json-server on http://localhost:4000

   **Terminal 2** - Start the Next.js app:
   ```bash
   npm run dev
   ```
   This starts the application on http://localhost:3000

4. **Open your browser**
   - Main Kanban Dashboard: http://localhost:3000
   - Bonus jQuery Page: http://localhost:3000/bonus

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run server` | Start json-server API on port 4000 |
| `npm run lint` | Run ESLint |

## 📁 Project Structure

```
kanban-dashboard/
├── app/                      # Next.js App Router
│   ├── bonus/               # Bonus jQuery page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page
│   └── providers.tsx        # Redux & React Query providers
├── components/              # React components
│   ├── Header.tsx           # App header with title
│   ├── KanbanBoard.tsx      # Main board container
│   ├── KanbanColumn.tsx     # Individual column
│   ├── LoadingSkeleton.tsx  # Loading states
│   ├── Notification.tsx     # Toast notifications
│   ├── SearchBar.tsx        # Search with debouncing
│   ├── TaskCard.tsx         # Draggable task card
│   └── TaskModal.tsx        # Create/Edit modal
├── lib/                     # Utilities and configuration
│   ├── api/                 # API functions
│   │   ├── axios.ts         # Axios instance
│   │   └── tasks.ts         # Task API endpoints
│   ├── redux/               # Redux store
│   │   ├── slices/          # Redux slices
│   │   │   ├── tasksSlice.ts
│   │   │   └── uiSlice.ts
│   │   ├── hooks.ts         # Typed hooks
│   │   └── store.ts         # Store configuration
│   ├── constants.ts         # App constants
│   └── utils.ts             # Utility functions
├── types/                   # TypeScript types
│   └── index.ts
├── db.json                  # Mock database
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## 🎮 How to Use

### Creating a Task
1. Click the "New Task" button in the header, or
2. Click "Add Task" in any column
3. Fill in the title, description, and select a column
4. Click "Create Task"

### Moving Tasks
- **Drag and drop** tasks between columns
- Watch the smooth animations as tasks move
- Changes are saved automatically

### Editing a Task
1. Hover over a task card
2. Click the edit icon (pencil) that appears
3. Modify the details
4. Click "Save Changes"

### Deleting a Task
1. Hover over a task card
2. Click the delete icon (trash) that appears
3. Confirm the deletion

### Searching Tasks
- Type in the search bar at the top
- Results filter automatically as you type
- Searches both titles and descriptions

### Loading More Tasks
- Scroll to the bottom of a column
- Click "Load More" if there are additional tasks

## 🎨 Features Highlights

### Interactive Tooltips
Every interactive element has helpful tooltips:
- Hover over icons to see what they do
- Learn about features through contextual hints
- Tooltips appear on buttons, inputs, and cards

### Smooth Animations
- **Drag animations**: Cards rotate slightly when dragged
- **Fade effects**: Tasks and notifications fade in/out smoothly
- **Slide animations**: New items slide into view
- **Skeleton loaders**: Smooth loading states

### Optimistic Updates
- Changes appear immediately in the UI
- If the server request fails, changes are rolled back
- No waiting for server responses for a snappy experience

### Responsive Design
- Mobile-friendly layout
- Stacks columns on smaller screens
- Touch-friendly drag and drop
- Optimized for all screen sizes

## 🎁 Bonus: jQuery Dynamic List

A separate demonstration page showcasing jQuery functionality:

**Features:**
- Add items to a dynamic list
- Input validation with error messages
- Error messages fade out after 2 seconds
- Delete items with smooth fade-out animation
- Beautiful gradient design
- Item counter

**Access**: http://localhost:3000/bonus

## 🔧 Configuration

### API Endpoint
The API URL can be configured via environment variable:

Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Pagination
Adjust the number of tasks per page in `lib/constants.ts`:
```typescript
export const TASKS_PER_PAGE = 10; // Change this value
```

### Search Debounce
Adjust search delay in `lib/constants.ts`:
```typescript
export const SEARCH_DEBOUNCE_DELAY = 300; // milliseconds
```

## 🚢 Deployment

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js and deploy

**Note**: For production, you'll need to replace json-server with a real backend API.

### Option 2: Netlify

1. Build the project: `npm run build`
2. Deploy the `.next` folder to Netlify
3. Set up a production API server

### Production Considerations

For production deployment:
- Replace `json-server` with a real database (PostgreSQL, MongoDB, etc.)
- Add authentication and authorization
- Implement proper error handling and logging
- Set up monitoring and analytics
- Enable HTTPS
- Add rate limiting
- Implement data backup strategies

## 🧪 Testing the Application

### Manual Testing Checklist

- [ ] Create a new task in each column
- [ ] Drag tasks between all columns
- [ ] Edit task titles and descriptions
- [ ] Delete tasks from different columns
- [ ] Search for tasks by title
- [ ] Search for tasks by description
- [ ] Test infinite scroll by creating 15+ tasks in one column
- [ ] Test on mobile device/responsive mode
- [ ] Test error handling (stop API server and try actions)
- [ ] Test the bonus jQuery page

## 📝 Code Quality

### Features Implemented
- ✅ TypeScript for type safety
- ✅ Comprehensive comments and documentation
- ✅ Consistent code formatting
- ✅ Modular component structure
- ✅ Reusable utility functions
- ✅ Error handling and validation
- ✅ Loading states and user feedback
- ✅ Accessibility considerations

## 🤝 Contributing

This is an assessment project, but if you'd like to extend it:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License - Free to use and modify

## 👨‍💻 Author

Created as part of a frontend developer assessment

## 🙏 Acknowledgments

- Material UI for the beautiful components
- @dnd-kit for the drag and drop functionality
- React Query for excellent data fetching
- Redux Toolkit for state management
- Next.js team for an amazing framework

---

## 📞 Support

If you encounter any issues:

1. Make sure both servers are running (API and Next.js)
2. Check that port 4000 and 3000 are not in use
3. Try clearing node_modules and reinstalling: `rm -rf node_modules && npm install`
4. Check the console for error messages

---

**Happy Task Managing! 🎉**
