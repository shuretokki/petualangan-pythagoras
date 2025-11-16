/**
 * Firebase Data Seeding Script
 * 
 * This script helps you seed initial quiz data into Firebase Firestore.
 * 
 * Usage:
 * 1. Make sure Firebase is properly configured in src/firebase.ts
 * 2. Run: npm install (if not already done)
 * 3. Uncomment the seedData() call at the bottom
 * 4. Run: npx tsx scripts/seed-firebase.ts
 */

import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../src/firebase';

const sampleQuiz = {
  moduleId: 'pythagoras-v1',
  title: 'Kuis Pythagoras Dasar',
  questions: [
    {
      id: 'q1',
      text: 'Sebuah segitiga siku-siku memiliki alas 3 cm dan tinggi 4 cm. Berapa panjang sisi miringnya?',
      type: 'multiple-choice',
      options: [
        { text: '5 cm', isCorrect: true },
        { text: '6 cm', isCorrect: false },
        { text: '7 cm', isCorrect: false },
        { text: '8 cm', isCorrect: false }
      ]
    },
    {
      id: 'q2',
      text: 'Jika sisi miring adalah 13 cm dan alas adalah 5 cm, berapa tingginya?',
      type: 'multiple-choice',
      options: [
        { text: '10 cm', isCorrect: false },
        { text: '11 cm', isCorrect: false },
        { text: '12 cm', isCorrect: true },
        { text: '13 cm', isCorrect: false }
      ]
    },
    {
      id: 'q3',
      text: 'Rumus Teorema Pythagoras adalah...',
      type: 'multiple-choice',
      options: [
        { text: 'a² + b² = c²', isCorrect: true },
        { text: 'a + b = c', isCorrect: false },
        { text: 'a² - b² = c²', isCorrect: false },
        { text: 'a × b = c²', isCorrect: false }
      ]
    },
    {
      id: 'q4',
      text: 'Segitiga dengan sisi 6, 8, dan 10 adalah segitiga...',
      type: 'multiple-choice',
      options: [
        { text: 'Segitiga siku-siku', isCorrect: true },
        { text: 'Segitiga lancip', isCorrect: false },
        { text: 'Segitiga tumpul', isCorrect: false },
        { text: 'Segitiga sama sisi', isCorrect: false }
      ]
    },
    {
      id: 'q5',
      text: 'Jika alas dan tinggi sama-sama 5 cm, berapa sisi miringnya? (√50 ≈ 7.07)',
      type: 'multiple-choice',
      options: [
        { text: '5 cm', isCorrect: false },
        { text: '7 cm', isCorrect: true },
        { text: '10 cm', isCorrect: false },
        { text: '25 cm', isCorrect: false }
      ]
    }
  ]
};

const sampleModule = {
  title: 'Petualangan Teorema Pythagoras',
  description: 'Menjelajahi rahasia di balik segitiga siku-siku.',
  order: 1
};

async function seedData() {
  try {
    console.log('🌱 Starting to seed Firebase data...');

    // Add module
    console.log('📚 Adding module...');
    const moduleRef = await setDoc(doc(db, 'modules', 'pythagoras-v1'), sampleModule);
    console.log('✅ Module added successfully!');

    // Add quiz
    console.log('📝 Adding quiz...');
    const quizRef = await setDoc(doc(db, 'quizzes', 'quiz-pythagoras-1'), sampleQuiz);
    console.log('✅ Quiz added successfully!');

    console.log('🎉 All data seeded successfully!');
    console.log('\nYou can now:');
    console.log('1. Visit /kuis to see the quiz in action');
    console.log('2. Login to /admin to manage quizzes');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Uncomment the line below to run the seeding
// seedData();

console.log('💡 To seed data:');
console.log('1. Uncomment the seedData() call at the bottom of this file');
console.log('2. Make sure your Firebase config is correct in src/firebase.ts');
console.log('3. Run: npx tsx scripts/seed-firebase.ts');
