
// Classification mapping tables for Serama bird traits
export const CT_MAP = {
  'Upright|Short': 'Traditional/American',
  'Upright|Medium': 'Traditional/American', 
  'Forward|Medium': 'Ayam (Malaysian)',
  'Forward|Long': 'Ayam (Malaysian)',
  'Moderate|Long': 'Modern Malaysian',
  'Moderate|Medium': 'Modern Malaysian'
};

export const PT_MAP = {
  'Frizzled': 'Frizzled',
  'Silkied': 'Silkied'
  // default will fall back to "Smooth" (previously "Normal")
};

export const CV_MAP = {
  'Solid Black': 'Black',
  'Solid White': 'White', 
  'Red/Gold': 'Red',
  'Mixed Colors': 'Exchequer'
  // anything else → "Other"
};

export const WEIGHT_LIMITS = {
  min: 7,
  max: 14
};
