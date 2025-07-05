"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { quotesData } from "@/lib/data";
import type { Quote } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Home, BrainCircuit, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { saveQuizResult } from "@/lib/firestore";

// Helper to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function QuizPage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Quote[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [authorOptions, setAuthorOptions] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const quizStartTime = useRef<number | null>(null);

  const currentQuestion = useMemo(() => {
    return questions[currentQuestionIndex];
  }, [questions, currentQuestionIndex]);

  // Setup quiz on initial load
  useEffect(() => {
    startNewQuiz();
  }, []);

  // When quiz finishes, save results if user is logged in
  useEffect(() => {
    if (quizFinished && user && quizStartTime.current !== null) {
      const quizEndTime = Date.now();
      const durationInSeconds = Math.round((quizEndTime - quizStartTime.current) / 1000);
      saveQuizResult(user.uid, score, questions.length, durationInSeconds);
    }
  }, [quizFinished, user, score, questions.length]);

  // Generate author options when the question changes
  useEffect(() => {
    if (currentQuestion) {
      const correctAuthor = currentQuestion.author;
      const allAuthors = [...new Set(quotesData.map(q => q.author))];
      const distractors = shuffleArray(allAuthors.filter(a => a !== correctAuthor)).slice(0, 3);
      setAuthorOptions(shuffleArray([correctAuthor, ...distractors]));
      
      // Reset state for new question
      setSelectedAuthor(null);
      setIsAnswered(false);
      setIsCorrect(null);
    }
  }, [currentQuestion]);

  const startNewQuiz = () => {
    setQuestions(shuffleArray(quotesData));
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    quizStartTime.current = Date.now();
  };
  
  const handleAnswerSubmit = () => {
    if (!selectedAuthor) return;

    const correct = selectedAuthor === currentQuestion.author;
    setIsAnswered(true);
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };
  
  if (questions.length === 0) {
    return null; // or a loading state
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <BrainCircuit className="size-8 text-primary" />
            Quote Quiz
          </h1>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 size-4" />
              Back to Vault
            </Link>
          </Button>
        </header>

        {quizFinished ? (
          <Card>
            <CardHeader>
              <CardTitle>Quiz Complete!</CardTitle>
              <CardDescription>
                {user 
                  ? "Your results have been saved." 
                  : "Sign in to save your quiz history."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl text-center">Your final score is:</p>
              <p className="text-6xl font-bold text-center text-primary my-4">{score} / {questions.length}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={startNewQuiz} className="w-full">Play Again</Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
              <CardDescription>Who is the author of this quote?</CardDescription>
              <div className="pt-2 text-right text-sm font-medium">Score: {score}</div>
            </CardHeader>
            <CardContent className="space-y-6">
              <blockquote className="border-l-4 border-primary pl-4 text-lg italic text-foreground/80">
                "{currentQuestion.text}"
              </blockquote>
              <RadioGroup
                value={selectedAuthor ?? ""}
                onValueChange={setSelectedAuthor}
                disabled={isAnswered}
              >
                {authorOptions.map((author) => (
                  <div key={author} className="flex items-center space-x-2">
                    <RadioGroupItem value={author} id={author} />
                    <Label htmlFor={author}>{author}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4">
              {isAnswered ? (
                <Button onClick={handleNextQuestion}>
                  Next Question <ArrowRight className="ml-2 size-4"/>
                </Button>
              ) : (
                <Button onClick={handleAnswerSubmit} disabled={!selectedAuthor}>
                  Submit Answer
                </Button>
              )}
              {isAnswered && isCorrect !== null && (
                <Alert variant={isCorrect ? "default" : "destructive"} className="bg-opacity-20">
                  {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertTitle>{isCorrect ? "Correct!" : "Incorrect"}</AlertTitle>
                  <AlertDescription>
                    {isCorrect ? "Great job!" : `The correct author is ${currentQuestion.author}.`}
                  </AlertDescription>
                </Alert>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
