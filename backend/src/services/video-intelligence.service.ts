import video from '@google-cloud/video-intelligence';
import { IAnalysisResult } from '../types';

const client = new video.VideoIntelligenceServiceClient();

export const analyzeVideo = async (filePath: string, sport: string): Promise<Partial<IAnalysisResult>> => {
  try {
    const fs = require('fs');
    const fileBuffer = fs.readFileSync(filePath);
    const inputContent = fileBuffer.toString('base64');

    // Perform label detection
    const [labelOperation] = await client.annotateVideo({
      inputContent: inputContent,
      features: ['LABEL_DETECTION', 'SHOT_CHANGE_DETECTION'],
    });

    const [labelResults] = await labelOperation.promise();
    const labels = labelResults.annotationResults?.[0]?.shotLabelAnnotations || [];

    // Extract detected labels
    const detectedLabels = labels
      .map(label => label.entity?.description || '')
      .filter(Boolean)
      .slice(0, 10);

    // Analyze performance based on labels and sport
    const analysisResult = generateAnalysis(detectedLabels, sport);

    return {
      detectedLabels,
      ...analysisResult,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Video Intelligence API error:', error);
    throw new Error('Failed to analyze video');
  }
};

function generateAnalysis(labels: string[], sport: string): Partial<IAnalysisResult> {
  // This is a simplified analysis - in production, you'd use more sophisticated AI/ML
  const sportKeywords: Record<string, string[]> = {
    football: ['kick', 'pass', 'dribble', 'shoot', 'run', 'sprint'],
    basketball: ['dribble', 'shoot', 'pass', 'jump', 'rebound', 'defense'],
    tennis: ['serve', 'forehand', 'backhand', 'volley', 'smash'],
    athletics: ['run', 'sprint', 'jump', 'throw', 'hurdle']
  };

  const relevantKeywords = sportKeywords[sport.toLowerCase()] || [];
  const foundKeywords = labels.filter(label => 
    relevantKeywords.some(kw => label.toLowerCase().includes(kw))
  );

  // Calculate performance score based on detected actions
  const performanceScore = Math.min(100, Math.max(50, foundKeywords.length * 15 + Math.random() * 20));

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const improvements: string[] = [];

  if (foundKeywords.length > 3) {
    strengths.push('Good variety of techniques demonstrated');
    strengths.push('Active movement throughout the performance');
  } else {
    weaknesses.push('Limited technique variety observed');
    improvements.push('Practice more diverse movements and techniques');
  }

  // Sport-specific feedback
  if (sport.toLowerCase() === 'football') {
    if (labels.some(l => l.toLowerCase().includes('ball'))) {
      strengths.push('Good ball control visible');
    }
    improvements.push('Focus on footwork and positioning');
  } else if (sport.toLowerCase() === 'basketball') {
    improvements.push('Work on shooting form and follow-through');
    improvements.push('Improve defensive stance');
  }

  return {
    performanceScore: Math.round(performanceScore),
    strengths,
    weaknesses,
    improvements
  };
}
