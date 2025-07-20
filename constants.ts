import { Centre, Counsellor } from "./types";

// Scraped from https://www.oxfordinstitute.in/
// In a real application, this might be fetched from a live API.
export const COURSES = [
  'Website Designing',
  'Digital Marketing',
  'Full Stack Development',
  'Data Science',
  'MERN Stack',
  'MEAN Stack',
  'Python Django',
  'Software Testing',
  'Java',
  'C, C++',
  'Graphic Designing',
  'Video Editing',
  'UI/UX Designing',
  'Android App Development',
  'iOS App Development',
  'React Native',
  'Flutter',
  'Data Analytics',
  'Machine Learning',
  'Artificial Intelligence',
  'Ethical Hacking',
  'Cyber Security',
];

export const COUNSELLORS = Object.values(Counsellor);
export const CENTRES = Object.values(Centre);

// --- Authentication Credentials ---
// In a real-world app, these should be handled by a secure backend.
export const ADMIN_CREDENTIALS = {
  username: 'adminoxford',
  password: 'oxford2025',
};

export const COUNSELLOR_CREDENTIALS = {
  username: 'counselloroxford',
  password: 'counoxford2025',
};
