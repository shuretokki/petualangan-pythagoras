# 🐍 Petualangan Teorema Pythagoras

An interactive, animated, and gamified educational web application for teaching the Pythagorean theorem to elementary and middle school students.

## ✨ Features

### User-Facing Application
- **🏠 Home/Introduction**: Welcome page with Pyta the mascot introducing the Pythagorean theorem
- **📚 Materi (Learning Material)**: Interactive visual proof with draggable puzzle pieces
- **📝 Contoh Soal (Example Problems)**: Step-by-step animated solutions to example problems
- **🎯 Kuis (Quiz)**: Interactive quiz with immediate feedback and scoring
- **🎨 Beautiful Animations**: Smooth transitions using @vueuse/motion

### Admin Panel
- **🔐 Secure Authentication**: Firebase Authentication for admin access
- **📊 Quiz Management**: Full CRUD operations for quizzes and questions
- **💎 PrimeVue Components**: Professional data tables and forms

## 🛠️ Tech Stack

- **Frontend Framework**: Vue.js 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **UI Components**: PrimeVue (Admin Panel only)
- **Animations**: @vueuse/motion
- **State Management**: Pinia
- **Backend & Database**: Firebase (Firestore & Auth)
- **Data Fetching**: VueFire
- **Routing**: Vue Router

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase project set up (optional for development)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── assets/           # Static assets
├── components/       # Reusable Vue components
│   ├── NavigationBar.vue
│   └── PytaSpeech.vue
├── router/          # Vue Router configuration
│   └── index.ts
├── stores/          # Pinia stores
│   ├── auth.ts      # Authentication state
│   └── quiz.ts      # Quiz state management
├── types/           # TypeScript type definitions
│   └── models.ts
├── views/           # Page components
│   ├── HomeView.vue
│   ├── MateriView.vue
│   ├── ContohSoalView.vue
│   ├── KuisView.vue
│   └── AdminView.vue
├── App.vue          # Root component
├── firebase.ts      # Firebase configuration
├── main.ts          # Application entry point
└── style.css        # Global styles
```

## 🎮 Usage

### For Students
1. Start at the **Home** page to meet Pyta and learn about right triangles
2. Explore **Materi** to discover the Pythagorean theorem through interactive puzzles
3. Study **Contoh Soal** to see worked examples
4. Test your knowledge with the **Kuis** section

### For Administrators
1. Navigate to `/admin`
2. Login with your admin credentials
3. Manage quiz questions and answers
4. Add, edit, or delete quizzes

## 🔥 Firebase Setup (Optional)

The application includes sample data for development. To use Firebase:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (Email/Password provider)
4. Create a web app and copy the configuration
5. Update `src/firebase.ts` with your configuration
6. Create the following Firestore collections:
   - `modules` - Learning modules
   - `quizzes` - Quiz data with embedded questions

### Sample Firestore Document Structure

**Collection: `quizzes`**
```json
{
  "id": "quiz-pythagoras-1",
  "moduleId": "pythagoras-v1",
  "title": "Kuis Pythagoras Dasar",
  "questions": [
    {
      "id": "q1",
      "text": "Question text here",
      "type": "multiple-choice",
      "options": [
        { "text": "Option 1", "isCorrect": true },
        { "text": "Option 2", "isCorrect": false }
      ]
    }
  ]
}
```

## 🎨 Customization

- **Colors**: Edit TailwindCSS configuration
- **Animations**: Modify @vueuse/motion parameters in components
- **Content**: Update the static content in view components or manage via Admin Panel

## 📝 License

This project is created for educational purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Developer Notes

- All routes are protected by authentication guards
- Quiz data is reactive and updates in real-time with Firestore
- The application uses Vue 3's Composition API throughout
- TypeScript ensures type safety across the application
- Animations are GPU-accelerated for smooth performance
