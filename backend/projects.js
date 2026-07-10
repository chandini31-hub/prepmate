const projects = {
  backend: [
  {
    title: "Banking REST API",
    description: "Build a secure banking backend with authentication and transactions.",
    difficulty: "Intermediate",
    skills: ["Node.js","Express","MongoDB","JWT","REST API"]
  },
  {
    title: "Food Delivery Backend",
    description: "Backend for food ordering with restaurants, orders and payments.",
    difficulty: "Intermediate",
    skills: ["Express","MongoDB","JWT","Payment Gateway"]
  },
  {
    title: "Hospital Management Backend",
    description: "Manage doctors, patients, appointments and prescriptions.",
    difficulty: "Intermediate",
    skills: ["Node.js","Express","MongoDB","Authentication"]
  },
  {
    title: "Learning Management System API",
    description: "Backend APIs for courses, students and instructors.",
    difficulty: "Intermediate",
    skills: ["Express","MongoDB","JWT","REST API"]
  },
  {
    title: "Inventory Management API",
    description: "Warehouse inventory CRUD system.",
    difficulty: "Beginner",
    skills: ["Express","MongoDB","CRUD","REST API"]
  },
  {
    title: "Real-Time Chat Backend",
    description: "WhatsApp-style backend using sockets.",
    difficulty: "Advanced",
    skills: ["Socket.io","Node.js","MongoDB"]
  },
  {
    title: "URL Shortener",
    description: "Bitly clone backend.",
    difficulty: "Beginner",
    skills: ["Express","MongoDB","REST API"]
  },
  {
    title: "Authentication Service",
    description: "Complete JWT authentication microservice.",
    difficulty: "Intermediate",
    skills: ["JWT","Express","Node.js","Authentication"]
  },
  {
    title: "Blog CMS Backend",
    description: "Backend for blogging platform.",
    difficulty: "Beginner",
    skills: ["Express","MongoDB","REST API"]
  },
  {
    title: "E-Commerce Backend",
    description: "Products, cart, orders and payments.",
    difficulty: "Advanced",
    skills: ["Node.js","Express","MongoDB","Stripe","JWT"]
  }
],

  frontend: [
  {
    title: "Netflix Clone",
    description: "Responsive movie streaming UI.",
    difficulty: "Intermediate",
    skills: ["React","CSS","JavaScript","API Integration"]
  },
  {
    title: "Jira Clone",
    description: "Task management dashboard.",
    difficulty: "Advanced",
    skills: ["React","TypeScript","Redux","Drag & Drop"]
  },
  {
    title: "Trello Clone",
    description: "Kanban board application.",
    difficulty: "Intermediate",
    skills: ["React","Context API","CSS","Drag & Drop"]
  },
  {
    title: "Portfolio Dashboard",
    description: "Modern personal portfolio with animations.",
    difficulty: "Beginner",
    skills: ["React","Tailwind CSS","JavaScript"]
  },
  {
    title: "Admin Dashboard",
    description: "Analytics dashboard with charts.",
    difficulty: "Intermediate",
    skills: ["React","Chart.js","Tailwind CSS"]
  },
  {
    title: "Weather Dashboard",
    description: "Weather app using OpenWeather API.",
    difficulty: "Beginner",
    skills: ["React","REST API","JavaScript"]
  },
  {
    title: "E-Commerce Frontend",
    description: "Shopping website UI with cart.",
    difficulty: "Intermediate",
    skills: ["React","Redux","Tailwind CSS"]
  },
  {
    title: "Expense Tracker UI",
    description: "Track daily expenses with charts.",
    difficulty: "Beginner",
    skills: ["React","Chart.js","CSS"]
  },
  {
    title: "Social Media Feed",
    description: "Instagram-style responsive feed.",
    difficulty: "Intermediate",
    skills: ["React","API Integration","CSS"]
  },
  {
    title: "Music Streaming UI",
    description: "Spotify-inspired frontend.",
    difficulty: "Intermediate",
    skills: ["React","Tailwind CSS","JavaScript"]
  }
],

  fullstack: [
  {
    title: "Hospital Management System",
    description: "Complete hospital management platform with frontend and backend.",
    difficulty: "Advanced",
    skills: ["React","Node.js","Express","MongoDB","JWT"]
  },
  {
    title: "Learning Management System",
    description: "Platform for students and instructors.",
    difficulty: "Advanced",
    skills: ["React","Node.js","Express","MongoDB"]
  },
  {
    title: "Expense Tracker",
    description: "Track expenses with authentication and reports.",
    difficulty: "Intermediate",
    skills: ["React","Express","MongoDB","JWT"]
  },
  {
    title: "E-Commerce Platform",
    description: "Complete online shopping application.",
    difficulty: "Advanced",
    skills: ["React","Redux","Node.js","MongoDB","Stripe"]
  },
  {
    title: "Food Ordering System",
    description: "Order food with restaurant dashboard.",
    difficulty: "Advanced",
    skills: ["React","Node.js","Express","MongoDB"]
  },
  {
    title: "Online Examination Portal",
    description: "Conduct online tests with auto evaluation.",
    difficulty: "Intermediate",
    skills: ["React","Express","MongoDB"]
  },
  {
    title: "Job Portal",
    description: "Recruiters and candidates platform.",
    difficulty: "Advanced",
    skills: ["React","Node.js","JWT","MongoDB"]
  },
  {
    title: "Event Management System",
    description: "Book and manage events.",
    difficulty: "Intermediate",
    skills: ["React","Express","MongoDB"]
  },
  {
    title: "Library Management System",
    description: "Manage books and users.",
    difficulty: "Beginner",
    skills: ["React","Node.js","MongoDB"]
  },
  {
    title: "AI Resume Analyzer",
    description: "Analyze resumes using AI and provide feedback.",
    difficulty: "Advanced",
    skills: ["React","Node.js","MongoDB","AI APIs"]
  }
],

 ai: [
  {
    title: "AI Resume Analyzer",
    description: "Analyze resumes and provide ATS feedback.",
    difficulty: "Advanced",
    skills: ["Python","FastAPI","LLMs","Vector DB"]
  },
  {
    title: "ChatGPT Clone",
    description: "Build your own conversational AI assistant.",
    difficulty: "Advanced",
    skills: ["React","Node.js","OpenAI API"]
  },
  {
    title: "RAG Chatbot",
    description: "Answer questions using uploaded documents.",
    difficulty: "Advanced",
    skills: ["LangChain","Vector DB","LLMs"]
  },
  {
    title: "Document Summarizer",
    description: "Summarize PDFs using AI.",
    difficulty: "Intermediate",
    skills: ["Python","Transformers","NLP"]
  },
  {
    title: "AI Interview Coach",
    description: "Mock interview platform with AI evaluation.",
    difficulty: "Advanced",
    skills: ["React","Node.js","Speech Recognition","LLMs"]
  },
  {
    title: "Image Caption Generator",
    description: "Generate captions for uploaded images.",
    difficulty: "Advanced",
    skills: ["Python","TensorFlow","CNN"]
  },
  {
    title: "AI Email Generator",
    description: "Generate professional emails using LLMs.",
    difficulty: "Intermediate",
    skills: ["OpenAI API","React"]
  },
  {
    title: "Voice Assistant",
    description: "Desktop voice assistant with speech recognition.",
    difficulty: "Advanced",
    skills: ["Python","SpeechRecognition","NLP"]
  },
  {
    title: "Question Answering System",
    description: "Answer questions from custom knowledge base.",
    difficulty: "Advanced",
    skills: ["LangChain","FAISS","LLMs"]
  },
  {
    title: "Code Review Assistant",
    description: "Review GitHub pull requests using AI.",
    difficulty: "Advanced",
    skills: ["GitHub API","OpenAI API","Node.js"]
  }
],

 datascience: [
  {
    title: "Customer Churn Prediction",
    description: "Predict customer churn using machine learning.",
    difficulty: "Intermediate",
    skills: ["Python","Pandas","Scikit-learn","SQL"]
  },
  {
    title: "Movie Recommendation System",
    description: "Build a recommendation engine using collaborative filtering.",
    difficulty: "Advanced",
    skills: ["Python","NumPy","Machine Learning"]
  },
  {
    title: "Credit Card Fraud Detection",
    description: "Detect fraudulent transactions using ML.",
    difficulty: "Advanced",
    skills: ["Python","XGBoost","SQL"]
  },
  {
    title: "House Price Prediction",
    description: "Predict house prices using regression models.",
    difficulty: "Beginner",
    skills: ["Python","Pandas","Scikit-learn"]
  },
  {
    title: "Stock Price Forecasting",
    description: "Forecast stock prices using LSTM.",
    difficulty: "Advanced",
    skills: ["TensorFlow","Python","Deep Learning"]
  },
  {
    title: "Sales Dashboard Analytics",
    description: "Analyze sales data and build dashboards.",
    difficulty: "Intermediate",
    skills: ["Power BI","SQL","Python"]
  },
  {
    title: "Customer Segmentation",
    description: "Segment customers using clustering algorithms.",
    difficulty: "Intermediate",
    skills: ["Python","KMeans","Pandas"]
  },
  {
    title: "Fake News Detection",
    description: "Detect fake news using NLP.",
    difficulty: "Advanced",
    skills: ["Python","NLP","Transformers"]
  },
  {
    title: "Sentiment Analysis",
    description: "Analyze customer reviews using NLP.",
    difficulty: "Intermediate",
    skills: ["Python","NLTK","Pandas"]
  },
  {
    title: "Healthcare Data Analysis",
    description: "Analyze healthcare datasets for insights.",
    difficulty: "Intermediate",
    skills: ["Python","SQL","Pandas"]
  }
],
  devops: [
  {
    title: "Dockerized Microservices",
    description: "Containerize multiple Node.js services using Docker.",
    difficulty: "Advanced",
    skills: ["Docker","Node.js","Microservices"]
  },
  {
    title: "Kubernetes Deployment",
    description: "Deploy applications on Kubernetes cluster.",
    difficulty: "Advanced",
    skills: ["Kubernetes","Docker","Cloud"]
  },
  {
    title: "CI/CD Pipeline",
    description: "Automate build, test and deployment.",
    difficulty: "Intermediate",
    skills: ["GitHub Actions","CI/CD","Docker"]
  },
  {
    title: "AWS EC2 Deployment",
    description: "Deploy MERN applications to AWS.",
    difficulty: "Intermediate",
    skills: ["AWS","Linux","EC2"]
  },
  {
    title: "Nginx Reverse Proxy",
    description: "Configure Nginx for production applications.",
    difficulty: "Intermediate",
    skills: ["Nginx","Linux"]
  },
  {
    title: "Monitoring Dashboard",
    description: "Monitor servers using Prometheus and Grafana.",
    difficulty: "Advanced",
    skills: ["Prometheus","Grafana","Linux"]
  },
  {
    title: "Terraform Infrastructure",
    description: "Provision cloud infrastructure using Terraform.",
    difficulty: "Advanced",
    skills: ["Terraform","AWS"]
  },
  {
    title: "Redis Cache System",
    description: "Improve API performance using Redis caching.",
    difficulty: "Intermediate",
    skills: ["Redis","Node.js"]
  },
  {
    title: "Load Balancer Setup",
    description: "Distribute traffic across multiple servers.",
    difficulty: "Advanced",
    skills: ["Nginx","Load Balancing"]
  },
  {
    title: "Jenkins Deployment Pipeline",
    description: "Automate software deployment using Jenkins.",
    difficulty: "Advanced",
    skills: ["Jenkins","CI/CD"]
  }
],

 productmanager: [

  {
    title: "Swiggy Growth Strategy",
    description: "Increase monthly active users by improving user retention and repeat ordering.",
    difficulty: "Intermediate",
    skills: ["Growth", "Product Metrics", "SQL", "A/B Testing"]
  },

  {
    title: "Netflix Retention Strategy",
    description: "Reduce subscriber churn through product improvements and experimentation.",
    difficulty: "Advanced",
    skills: ["Retention", "Analytics", "A/B Testing"]
  },

  {
    title: "Uber Driver Incentive System",
    description: "Design a better incentive model to improve driver supply during peak hours.",
    difficulty: "Intermediate",
    skills: ["Marketplace", "Product Design", "Metrics"]
  },

  {
    title: "WhatsApp Communities PRD",
    description: "Write a Product Requirement Document for a new Communities feature.",
    difficulty: "Intermediate",
    skills: ["PRD", "Product Thinking", "User Stories"]
  },

  {
    title: "Amazon Checkout Optimization",
    description: "Reduce cart abandonment and improve checkout conversion.",
    difficulty: "Advanced",
    skills: ["Conversion", "Analytics", "Experimentation"]
  },

  {
    title: "Spotify Recommendation Improvements",
    description: "Increase listening time using personalized recommendations.",
    difficulty: "Intermediate",
    skills: ["Recommendation Systems", "Product Metrics"]
  },

  {
    title: "Google Maps Offline Navigation",
    description: "Design an improved offline navigation experience for travelers.",
    difficulty: "Intermediate",
    skills: ["UX", "User Research", "Prioritization"]
  },

  {
    title: "YouTube Shorts Growth Strategy",
    description: "Increase Shorts engagement and creator adoption.",
    difficulty: "Advanced",
    skills: ["Growth", "North Star Metrics", "Experimentation"]
  },

  {
    title: "LinkedIn Job Recommendation System",
    description: "Improve relevance of job recommendations for users.",
    difficulty: "Advanced",
    skills: ["Recommendation", "SQL", "Analytics"]
  },

  {
    title: "Zomato Restaurant Ranking",
    description: "Improve restaurant discovery by redesigning ranking algorithms.",
    difficulty: "Intermediate",
    skills: ["Search Ranking", "Product Metrics"]
  },

  {
    title: "Instagram New Feature Launch",
    description: "Design and launch a new social engagement feature from scratch.",
    difficulty: "Advanced",
    skills: ["Feature Design", "PRD", "Prioritization"]
  },

  {
    title: "Paytm UPI Growth Plan",
    description: "Increase UPI adoption among first-time users.",
    difficulty: "Intermediate",
    skills: ["Growth", "Funnels", "User Research"]
  },

  {
    title: "Flipkart Seller Dashboard Redesign",
    description: "Improve seller productivity through dashboard redesign.",
    difficulty: "Intermediate",
    skills: ["UX", "Product Design", "Analytics"]
  },

  {
    title: "BookMyShow Dynamic Pricing",
    description: "Design a pricing strategy that maximizes revenue while maintaining customer satisfaction.",
    difficulty: "Advanced",
    skills: ["Pricing", "Analytics", "Business Strategy"]
  },

  {
    title: "Airbnb Host Experience",
    description: "Improve onboarding and retention for new Airbnb hosts.",
    difficulty: "Advanced",
    skills: ["User Journey", "Retention", "Product Thinking"]
  }

],
};

module.exports = projects;