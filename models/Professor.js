// Simple professor model for the prototype
const professors = [
  {
    id: 1,
    name: 'Prof. Changhe Wang',
    university: 'Xi\'an Jiaotong University',
    department: 'Neurology',
    researchInterests: ['neuropathic pain', 'neural circuits', 'pain chronicity', 'anterior cingulate cortex', 'ventral tegmental area'],
    email: 'changhewang@xjtu.edu.cn',
    publications: [
      'An ACC-VTA-ACC positive-feedback loop mediates the persistence of neuropathic pain and emotional consequences (2024)'
    ]
  },
  {
    id: 2,
    name: 'Dr. Huadong Xu',
    university: 'Xi\'an Jiaotong University',
    department: 'Neuroscience',
    researchInterests: ['neural mechanisms', 'glutamatergic neurons', 'neuropathic pain', 'pain chronicity', 'neurotransmission'],
    email: 'huadong.xu@xjtu.edu.cn',
    publications: [
      'An ACC-VTA-ACC positive-feedback loop mediates the persistence of neuropathic pain and emotional consequences (2024)'
    ]
  },
  {
    id: 3,
    name: 'Dr. Lingli Liang',
    university: 'Xi\'an Jiaotong University',
    department: 'School of Basic Medical Sciences',
    researchInterests: ['chronic pain', 'peripheral nervous system', 'central nervous system', 'molecular mechanisms', 'pain signaling'],
    email: 'lingli.liang@xjtu.edu.cn',
    publications: [
      'Molecular mechanisms of chronic pain in the peripheral and central nervous system (2022)'
    ]
  },
  {
    id: 4,
    name: 'Dr. Fu-Quan Huo',
    university: 'Xi\'an Jiaotong University',
    department: 'Neuroscience',
    researchInterests: ['ApoE', 'neuropathic pain', 'dorsal root ganglia', 'pain development', 'neuroinflammation'],
    email: 'fuquan.huo@xjtu.edu.cn',
    publications: [
      'Role of ApoE in the pathological development of neuropathic pain (2023)'
    ]
  },
  {
    id: 5,
    name: 'Prof. Wei Gao',
    university: 'Fourth Military Medical University',
    department: 'Anesthesiology',
    researchInterests: ['perioperative regulation', 'blood-brain barrier', 'neuroprotection', 'pain management', 'anesthesia'],
    email: 'wei.gao@fmmu.edu.cn',
    publications: [
      'Perioperative regulation of blood-brain barrier function and its related nano-carriers (2021)'
    ]
  }
];

// Function to get all professors
const getAllProfessors = () => {
  return professors;
};

// Function to get professor by ID
const getProfessorById = (id) => {
  return professors.find(prof => prof.id === parseInt(id));
};

// Function to search professors by keywords
const searchProfessors = (keywords) => {
  if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
    return professors;
  }
  
  return professors.filter(prof => {
    return keywords.some(keyword => 
      prof.researchInterests.some(interest => 
        interest.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  });
};

module.exports = {
  getAllProfessors,
  getProfessorById,
  searchProfessors
};
