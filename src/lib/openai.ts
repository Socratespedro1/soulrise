import OpenAI from 'openai';

// Cliente OpenAI configurado para uso APENAS no servidor (API routes)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;

export interface GeneratePlanInput {
  goals: string[];
  quizAnswers: {
    gender: string;
    motivation: string;
    emotionalState: string;
    routine: string;
    timeAvailable: string;
    spirituality: string;
    lacking: string;
    commitment: string;
  };
}

export interface PersonalizedPlan {
  dailyIntention: string;
  mainAction: string;
  complementaryAction: string;
  ritual: string;
  affirmation: string;
  weeklyFocus: string;
}
