
import { CT_MAP, PT_MAP, CV_MAP, WEIGHT_LIMITS } from './classificationMaps';

export const classifyBird = ({
  bodyCarriage,
  backLength,
  featherType,
  colorPattern,
  weight,
  mode = 'detailed' // 'basic' or 'detailed'
}) => {
  // For basic mode, use smart defaults if classification fields are missing
  const effectiveBodyCarriage = bodyCarriage || (mode === 'basic' ? 'Upright' : '');
  const effectiveBackLength = backLength || (mode === 'basic' ? 'Short' : '');
  const effectiveFeatherType = featherType || (mode === 'basic' ? 'Normal' : '');
  const effectiveColorPattern = colorPattern || (mode === 'basic' ? 'Other' : '');

  // Create key for body type classification
  const key = `${effectiveBodyCarriage}|${effectiveBackLength}`;
  
  // Look up classifications using mapping tables
  const ct = CT_MAP[key] ?? (mode === 'basic' ? 'Traditional/American' : 'Undetermined');
  const pt = PT_MAP[effectiveFeatherType] ?? 'Smooth';
  const cv = CV_MAP[effectiveColorPattern] ?? 'Other';

  // Collect warnings
  const warnings = [];

  // Only add classification warnings in detailed mode
  if (mode === 'detailed') {
    // Check if body carriage and back length combination is recognized
    if (!CT_MAP[key]) {
      warnings.push('Body carriage and back length combination does not match standard classifications');
    }

    // Validate required inputs for detailed classification
    if (!bodyCarriage) {
      warnings.push('Body carriage is required for classification');
    }
    if (!backLength) {
      warnings.push('Back length is required for classification');
    }
  }

  // Always check weight ranges regardless of mode
  if (weight > WEIGHT_LIMITS.max) {
    warnings.push('Weight exceeds typical Serama range');
  }
  if (weight < WEIGHT_LIMITS.min) {
    warnings.push('Weight below typical Serama range');
  }

  return { ct, pt, cv, warnings, mode };
};
