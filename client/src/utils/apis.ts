const BASE_URL = "http://localhost:5000/api"; // or your deployed backend URL

// University APIs
export const UNIVERSITY_API = {
  GET_ALL: `${BASE_URL}/universities`,
  ADD: `${BASE_URL}/universities`,
  EDIT: (id) => `${BASE_URL}/universities/${id}`,
  DELETE: (id) => `${BASE_URL}/universities/${id}`,
  GET_BY_ID: (id) => `${BASE_URL}/universities/${id}`,
};

export const COURSES = {
  GET_ALL: `${BASE_URL}/courses`,
  GET_BY_UNIVERSITY: (universityId) => `${BASE_URL}/courses/university/${universityId}`,
  GET_COUNT_BY_UNIVERSITY: (universityId) => `${BASE_URL}/courses/university/${universityId}/count`,
  ADD: `${BASE_URL}/courses`,
  EDIT: (id) => `${BASE_URL}/courses/${id}`,
  DELETE: (id) => `${BASE_URL}/courses/${id}`,
  STATS: `${BASE_URL}/courses/stats`

};

export const BRANCHES = {
  GET_ALL: `${BASE_URL}/branches`,
  ADD: `${BASE_URL}/branches`,
  EDIT: (id) => `${BASE_URL}/branches/${id}`,
  DELETE: (id) => `${BASE_URL}/branches/${id}`,
  STATS: `${BASE_URL}/branches/stats`,

};

export const SEMESTERS = {
  GET_ALL: `${BASE_URL}/semesters`,
  ADD: `${BASE_URL}/semesters`,
  EDIT: (id) => `${BASE_URL}/semesters/${id}`,
  DELETE: (id) => `${BASE_URL}/semesters/${id}`,
  GET_STATS: `${BASE_URL}/semesters/stats`,

};

export const SUBJECTS = {
  GET_ALL: `${BASE_URL}/subjects`,
  ADD: `${BASE_URL}/subjects`,
  EDIT: (id) => `${BASE_URL}/subjects/${id}`,
  DELETE: (id) => `${BASE_URL}/subjects/${id}`,
  GET_ONE: (id) => `${BASE_URL}/subjects/${id}`,
};

export const CONTENTS = {
  // ✅ CRUD on content sections
  GET_ALL: `${BASE_URL}/contents`,
  GET_ONE: (id) => `${BASE_URL}/contents/${id}`,
  ADD: `${BASE_URL}/contents`,
  EDIT: (id) => `${BASE_URL}/contents/${id}`,
  DELETE: (id) => `${BASE_URL}/contents/${id}`,
  UPLOADS: `${BASE_URL}/contents/uploads`,
  GET_BY_SUBJECTS: (subjectId) => `${BASE_URL}/contents/subject/${subjectId}`,
  DOWNLOAD_BY_SUBJECTS: (subjectId) => `${BASE_URL}/contents/download/subject/${subjectId}`,
  GET_CONTENT_STATS: (subjectId) => `${BASE_URL}/contents/stats/subject/${subjectId}` 
};


// Auth API
export const AUTH_API = {
  LOGIN: `${BASE_URL}/admin/login`,
};

export const SUBSCRIBER = {
  ADD: `${BASE_URL}/subscribe`,
  GET_ALL: `${BASE_URL}/subscribers`,

};
export const CONTACT = {
  ADD: `${BASE_URL}/contact`,
  GET_ALL:`${BASE_URL}/contact`,
  REPLY: (id) => `${BASE_URL}/contact/${id}/reply`,
  DELETE: (id) => `${BASE_URL}/contact/${id}`
};

