import { buildAnomalyPrompt } from "../prompts/anomaly.js";
import { generateAIResponse } from "./aiClient.js";
import {selectModel} from "../shared/modelRouter.js";
import {fallback} from "../fallbacks/anomaly.js";

export const runAnomalyService = async ({data, isDemo} = {}) => {

  const prompt = buildAnomalyPrompt({ anomaly: data });
  const ruleBasedInsight = fallback({ anomaly: data });
  
  let response;
  let model;

  try {
    model = selectModel({isDemo, primaryFailed: false});
    response = await generateAIResponse({ prompt, model, type: "anomaly" });  

      return insightData(data, response, model);

  } catch {
    
    try {
      model = selectModel({isDemo, primaryFailed: true});
      response = await generateAIResponse({ prompt, model, type: "anomaly" });

      return insightData(data, response, model);
    } catch {
        
        return {
        ...ruleBasedInsight,
        modelUsed: "rule-based"
      }
    };

  }
};


const insightData = (anomaly, response, model) => ({
  id: anomaly.id,
  type: "anomaly",
  severity: anomaly.risk.level,
  category: anomaly.category,
  year: new Date().getFullYear(),
  baselineValue: anomaly.signal.baseline_value,
  agent: response,
  modelUsed: model
});