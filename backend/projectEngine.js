const projects = require("./projects");

function recommendProjects(targetRole, missingSkills = [], resumeText = "") {

  const role = targetRole.toLowerCase();

  let projectPool = [];

  // -----------------------
  // ROLE DETECTION
  // -----------------------

  if (
    role.includes("backend") ||
    role.includes("node") ||
    role.includes("api")
  ) {
    projectPool = projects.backend;
  }

  else if (
    role.includes("frontend") ||
    role.includes("react") ||
    role.includes("ui") ||
    role.includes("web")
  ) {
    projectPool = projects.frontend;
  }

  else if (
    role.includes("full") ||
    role.includes("software") ||
    role.includes("developer") ||
    role.includes("engineer")
  ) {
    projectPool = [
      ...projects.backend,
      ...projects.frontend,
      ...projects.fullstack
    ];
  }

  else if (
    role.includes("data scientist") ||
    role.includes("machine learning") ||
    role.includes("ml") ||
    role.includes("data analyst")
  ) {
    projectPool = projects.datascience;
  }

  else if (
    role.includes("ai") ||
    role.includes("llm") ||
    role.includes("genai")
  ) {
    projectPool = projects.ai;
  }

  else if (
    role.includes("devops") ||
    role.includes("cloud") ||
    role.includes("site reliability")
  ) {
    projectPool = projects.devops;
  }

  else if (
    role.includes("product")
  ) {
    projectPool = projects.productmanager;
  }

  else {
    projectPool = [
      ...projects.backend,
      ...projects.frontend,
      ...projects.fullstack
    ];
  }

  // -----------------------
  // REMOVE PROJECTS ALREADY
  // PRESENT IN RESUME
  // -----------------------

  const filtered = projectPool.filter(project => {

    return !resumeText
      .toLowerCase()
      .includes(project.title.toLowerCase());

  });

  // -----------------------
  // SCORE PROJECTS
  // -----------------------

  const ranked = filtered.map(project => {

    let score = 0;

    for (const skill of missingSkills) {

      const missing =
        typeof skill === "string"
          ? skill.toLowerCase()
          : skill.skill.toLowerCase();

      project.skills.forEach(ps => {

        const s = ps.toLowerCase();

        if (
          s.includes(missing) ||
          missing.includes(s)
        ) {
          score += 10;
        }

      });

    }

    // harder projects slightly preferred
    if (project.difficulty === "Advanced") score += 3;
    if (project.difficulty === "Intermediate") score += 2;
    if (project.difficulty === "Beginner") score += 1;

    return {

      ...project,

      score

    };

  });

  ranked.sort((a, b) => b.score - a.score);

  const result = ranked.slice(0, 3).map(project => ({

    title: project.title,

    description: project.description,

    difficulty: project.difficulty,

    skills: project.skills

  }));

  console.log("================================");
  console.log("Target Role:", targetRole);
  console.log("Projects Selected:");
  console.dir(result, { depth: null });

  return result;

}

module.exports = recommendProjects;