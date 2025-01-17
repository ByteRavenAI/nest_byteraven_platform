import { PromptTemplate } from '@langchain/core/prompts';

export function promptGenerateScreeningTemplateQuestions(): PromptTemplate {
  const prompt =
    `You have to generate 6-7 screening questions that can be asked to a user for the screening process. The user is going to appear for a screening for the title - {jobTitle}. Give the output as a list in the below JSON format -
[] // List of questions (strings)
    `.trim();

  const promptTemplate = PromptTemplate.fromTemplate(prompt);
  return promptTemplate;
}

export function promptGenerateJd(): PromptTemplate {
  const prompt = `You are provided with some info about a job description, generate a proper Job Description, with the following details mentioned. We need the out in a JSON format provided below:
  
  Things to mention in the JD:
  1. Job Title
  2. Company Name
  3. Salary Range
  4. Location
  5. Remote or not
  6. Job Type
  7. Experience Level
  8. Roles and Responsibilities
  9. Skills Required
  
  
  Output Format - 
  data: HTML string - The generated Job Description in a HTML string format.
  
  example - 
  data: <!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Job Description</title></head><body><div class='job-description'><h1>Software Engineer</h1><p><strong>Company Name:</strong> Tech Innovators Inc.</p><p><strong>Salary Range:</strong> $70,000 - $90,000 per year</p><p><strong>Location:</strong> New York, NY</p><p><strong>Remote:</strong> Yes</p><p><strong>Job Type:</strong> Full-time</p><p><strong>Experience Level:</strong> Mid-level</p><h2>Roles and Responsibilities</h2><ul><li>Develop and maintain web applications using modern JavaScript frameworks.</li><li>Collaborate with cross-functional teams to define, design, and ship new features.</li><li>Write clean, maintainable, and efficient code.</li><li>Troubleshoot and debug applications.</li><li>Participate in code reviews and contribute to team best practices.</li></ul><h2>Skills Required</h2><ul><li>Proficiency in JavaScript, HTML, CSS</li><li>Experience with React or Angular</li><li>Familiarity with RESTful APIs</li><li>Strong problem-solving skills</li><li>Excellent communication and teamwork abilities</li></ul></div></body></html>

  Provided Info:
  {jdInfo}`;

  const promptTemplate = PromptTemplate.fromTemplate(prompt);
  return promptTemplate;
}
