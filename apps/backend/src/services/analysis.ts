import { VideoIntelligenceServiceClient } from '@google-cloud/video-intelligence';

export async function analyzeVideoLabelsGCP(gcsUri: string) {
  const client = new VideoIntelligenceServiceClient();
  const request = {
    inputUri: gcsUri,
    features: ['LABEL_DETECTION' as any],
  } as any;
  const [operation] = await client.annotateVideo(request);
  const [response] = await operation.promise();
  return response;
}

export function computeFeedbackFromLabels(labels: any) {
  // naive scoring and feedback; replace with domain logic later
  const concepts = (labels?.annotationResults?.[0]?.segmentLabelAnnotations || []).map((l: any) => l.entity?.description).filter(Boolean);
  const score = Math.min(100, Math.max(50, concepts.length * 2));
  const missing: string[] = [];
  const improvements: string[] = ['Work on consistency', 'Improve footwork', 'Increase stamina'];
  return { score, missing, improvements, concepts };
}
