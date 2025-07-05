import { db, firebaseCredentialsExist } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function saveQuizResult(userId: string, score: number, totalQuestions: number, duration: number) {
  if (!firebaseCredentialsExist) {
    // Silently fail if Firebase is not configured.
    // A warning is already printed on server start.
    return;
  }
  if (!userId) {
    console.error("User ID is required to save quiz results.");
    return;
  }
  try {
    await addDoc(collection(db, 'users', userId, 'quizHistory'), {
      score,
      totalQuestions,
      percentage: (score / totalQuestions) * 100,
      completedAt: serverTimestamp(),
      durationInSeconds: duration,
    });
  } catch (error) {
    console.error("Error saving quiz result to Firestore: ", error);
  }
}
