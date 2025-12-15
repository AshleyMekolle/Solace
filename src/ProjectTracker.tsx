import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type Priority = 0 | 1 | 2 | 3;
type SDLCPhase = 'planning' | 'analysis' | 'design' | 'implementation' | 'testing' | 'deployment' | 'maintenance';
type IdeaStatus = 'backlog' | 'active' | 'in-progress' | 'completed' | 'archived';
type ResourceType = 'image' | 'document' | 'link' | 'audio' | 'video' | 'other';

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: Date;
  isActive: boolean;
}

interface Idea {
  id: string;
  projectId: string;
  title: string;
  description: string;
  phase: SDLCPhase;
  status: IdeaStatus;
  priority: Priority;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Task {
  id: string;
  projectId: string;
  ideaId?: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

interface Resource {
  id: string;
  projectId: string;
  title: string;
  url?: string;
  file?: File;
  type: ResourceType;
  description: string;
  tags: string[];
  createdAt: Date;
}

const ProjectTracker: React.FC = () => {
  // State
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Flower Shop Website',
      description: 'Create beautiful e-commerce site for flower boutique',
      color: '#FF9BC9',
      icon: '🌸',
      createdAt: new Date('2024-01-01'),
      isActive: true,
    },
    {
      id: '2',
      name: 'Mindfulness App',
      description: 'Meditation and relaxation mobile application',
      color: '#A1E8D9',
      icon: '🧘‍♀️',
      createdAt: new Date('2024-01-15'),
      isActive: true,
    },
    {
      id: '3',
      name: 'Art Gallery Platform',
      description: 'Digital platform for local artists',
      color: '#FFC8DD',
      icon: '🎨',
      createdAt: new Date('2024-02-01'),
      isActive: false,
    },
  ]);

  const [ideas, setIdeas] = useState<Idea[]>([
    {
      id: '1',
      projectId: '1',
      title: 'Floral Color Palette',
      description: 'Create pastel color scheme with floral accents',
      phase: 'design',
      status: 'active',
      priority: 2,
      tags: ['design', 'ui', 'colors'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
    },
    {
      id: '2',
      projectId: '1',
      title: 'Gift Wrapping Feature',
      description: 'Add virtual gift wrapping options',
      phase: 'implementation',
      status: 'in-progress',
      priority: 1,
      tags: ['feature', 'e-commerce'],
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-15'),
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      projectId: '1',
      ideaId: '1',
      title: 'Research color psychology for flowers',
      completed: true,
      createdAt: new Date('2024-01-11'),
    },
    {
      id: '2',
      projectId: '1',
      ideaId: '1',
      title: 'Create mood board with floral patterns',
      completed: false,
      createdAt: new Date('2024-01-12'),
    },
  ]);

  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      projectId: '1',
      title: 'Floral Pattern Collection',
      url: 'https://example.com/floral-patterns',
      type: 'link',
      description: 'Beautiful floral patterns for website design',
      tags: ['design', 'patterns', 'inspiration'],
      createdAt: new Date('2024-01-05'),
    },
  ]);

  const [activeProjectId, setActiveProjectId] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<'overview' | 'ideas' | 'tasks' | 'resources'>('overview');
  
  // Form states
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaDesc, setNewIdeaDesc] = useState('');
  const [newIdeaPhase, setNewIdeaPhase] = useState<SDLCPhase>('planning');
  const [newIdeaPriority, setNewIdeaPriority] = useState<Priority>(2);
  const [newIdeaTags, setNewIdeaTags] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newResourceDesc, setNewResourceDesc] = useState('');
  const [newResourceType, setNewResourceType] = useState<ResourceType>('link');
  const [newResourceTags, setNewResourceTags] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Zen Color Palette
  const zenColors = {
    primary: '#FF9BC9',      // Soft Pink
    secondary: '#A1E8D9',    // Mint Green
    tertiary: '#FFC8DD',     // Light Pink
    accent: '#BDB2FF',       // Lavender
    background: '#FFF9F9',   // Almost White Pink
    surface: '#FFFFFF',      // White
    text: '#5A5560',         // Soft Gray
    lightText: '#9D8BA5',    // Light Gray
    border: '#F0D9E7',       // Very Light Pink
    success: '#A1E8D9',      // Mint
    warning: '#FFD6A5',      // Peach
    error: '#FF9BC9',        // Pink
  };

  // SDLC Phases with zen colors
  const sdlcPhases: { id: SDLCPhase; name: string; description: string; color: string; icon: string }[] = [
    { id: 'planning', name: 'Planning', description: 'Define project scope and requirements', color: '#BDB2FF', icon: '📋' },
    { id: 'analysis', name: 'Analysis', description: 'Analyze requirements and feasibility', color: '#A1E8D9', icon: '🔍' },
    { id: 'design', name: 'Design', description: 'Create system architecture and UI/UX', color: '#FFC8DD', icon: '🎨' },
    { id: 'implementation', name: 'Implementation', description: 'Write code and develop features', color: '#FF9BC9', icon: '💻' },
    { id: 'testing', name: 'Testing', description: 'Test and fix bugs', color: '#FFD6A5', icon: '🧪' },
    { id: 'deployment', name: 'Deployment', description: 'Deploy to production', color: '#CAFFBF', icon: '🚀' },
    { id: 'maintenance', name: 'Maintenance', description: 'Maintain and update', color: '#D6CCC2', icon: '🛠️' },
  ];

  // Project icons
  const projectIcons = ['🌸', '🌺', '🌷', '🌼', '🌻', '💐', '🌹', '🌿', '🍃', '💮'];

  // Priority colors
  const priorityColors = {
    0: '#FF9BC9',
    1: '#FFB6C1',
    2: '#A1E8D9',
    3: '#BDB2FF',
  };

  // Status colors
  const statusColors = {
    'backlog': '#D6CCC2',
    'active': '#BDB2FF',
    'in-progress': '#A1E8D9',
    'completed': '#CAFFBF',
    'archived': '#FFD6A5',
  };

  // Resource type icons and colors
  const resourceTypes = {
    'image': { icon: '🖼️', color: '#FF9BC9', bg: '#FFF0F5' },
    'document': { icon: '📄', color: '#A1E8D9', bg: '#F0FFF9' },
    'link': { icon: '🔗', color: '#BDB2FF', bg: '#F8F7FF' },
    'audio': { icon: '🎵', color: '#FFD6A5', bg: '#FFF9F0' },
    'video': { icon: '🎬', color: '#FFB6C1', bg: '#FFF0F5' },
    'other': { icon: '📁', color: '#D6CCC2', bg: '#F9F6F2' },
  };

  // Get active project
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  
  // Filter data for active project
  const projectIdeas = ideas.filter(idea => idea.projectId === activeProjectId);
  const projectTasks = tasks.filter(task => task.projectId === activeProjectId);
  const projectResources = resources.filter(resource => resource.projectId === activeProjectId);

  // Handlers
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: newProjectName,
        description: newProjectDesc,
        color: zenColors.primary,
        icon: projectIcons[Math.floor(Math.random() * projectIcons.length)],
        createdAt: new Date(),
        isActive: true,
      };
      setProjects([newProject, ...projects]);
      setActiveProjectId(newProject.id);
      setNewProjectName('');
      setNewProjectDesc('');
    }
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIdeaTitle.trim()) {
      const newIdea: Idea = {
        id: Date.now().toString(),
        projectId: activeProjectId,
        title: newIdeaTitle,
        description: newIdeaDesc,
        phase: newIdeaPhase,
        status: 'backlog',
        priority: newIdeaPriority,
        tags: newIdeaTags.split(',').map(tag => tag.trim()).filter(Boolean),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setIdeas([newIdea, ...ideas]);
      setNewIdeaTitle('');
      setNewIdeaDesc('');
      setNewIdeaTags('');
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        projectId: activeProjectId,
        title: newTaskTitle,
        completed: false,
        createdAt: new Date(),
      };
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (newResourceTitle.trim() && (newResourceUrl.trim() || uploadedFile)) {
      const newResource: Resource = {
        id: Date.now().toString(),
        projectId: activeProjectId,
        title: newResourceTitle,
        url: newResourceUrl || undefined,
        file: uploadedFile || undefined,
        type: newResourceType,
        description: newResourceDesc,
        tags: newResourceTags.split(',').map(tag => tag.trim()).filter(Boolean),
        createdAt: new Date(),
      };
      setResources([newResource, ...resources]);
      setNewResourceTitle('');
      setNewResourceUrl('');
      setNewResourceDesc('');
      setNewResourceTags('');
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateIdeaStatus = (id: string, status: IdeaStatus) => {
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, status, updatedAt: new Date() } : idea
    ));
  };

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
    setTasks(tasks.filter(task => task.ideaId !== id));
  };

  const deleteResource = (id: string) => {
    setResources(resources.filter(resource => resource.id !== id));
  };

  const toggleProjectActive = (id: string) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, isActive: !project.isActive } : project
    ));
  };

  const deleteProject = (id: string) => {
    if (projects.length <= 1) return;
    setProjects(projects.filter(project => project.id !== id));
    if (activeProjectId === id) {
      setActiveProjectId(projects.filter(p => p.id !== id)[0]?.id || '');
    }
  };

  // Get stats for active project
  const getProjectStats = () => {
    const projectIdeas = ideas.filter(idea => idea.projectId === activeProjectId);
    const projectTasks = tasks.filter(task => task.projectId === activeProjectId);
    
    const phaseCounts: Record<SDLCPhase, number> = {
      planning: 0, analysis: 0, design: 0, 
      implementation: 0, testing: 0, deployment: 0, maintenance: 0
    };
    
    projectIdeas.forEach(idea => {
      phaseCounts[idea.phase]++;
    });

    return {
      totalIdeas: projectIdeas.length,
      totalTasks: projectTasks.length,
      completedTasks: projectTasks.filter(t => t.completed).length,
      phaseCounts,
    };
  };

  const stats = getProjectStats();

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="project-tracker">
      {/* Header */}
      <motion.div 
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>🌸Project Tracker</h1>
        <p className="subtitle">Find peace in your project management journey</p>
      </motion.div>

      <div className="main-content">
        {/* Projects Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>🌸 My Projects</h3>
            <motion.button 
              className="new-project-btn"
              onClick={() => document.getElementById('project-form')?.scrollIntoView()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              +
            </motion.button>
          </div>
          
          <div className="project-list">
            <AnimatePresence>
              {projects.map(project => (
                <motion.div
                  key={project.id}
                  className={`project-item ${activeProjectId === project.id ? 'active' : ''} ${!project.isActive ? 'inactive' : ''}`}
                  onClick={() => setActiveProjectId(project.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="project-icon" style={{ background: project.color }}>
                    {project.icon}
                  </div>
                  <div className="project-info">
                    <h4>{project.name}</h4>
                    <p>{project.description}</p>
                    <div className="project-meta">
                      <span>{ideas.filter(i => i.projectId === project.id).length} ideas</span>
                      <span>{tasks.filter(t => t.projectId === project.id).length} tasks</span>
                    </div>
                  </div>
                  <div className="project-actions">
                    <motion.button 
                      className={`status-btn ${project.isActive ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProjectActive(project.id);
                      }}
                      title={project.isActive ? 'Pause project' : 'Activate project'}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {project.isActive ? '●' : '○'}
                    </motion.button>
                    <motion.button 
                      className="delete-project-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                      title="Delete project"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      🗑️
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Add Project Form */}
          <motion.form 
            id="project-form"
            className="add-project-form"
            onSubmit={handleAddProject}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h4>🌱 New Project</h4>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name"
              className="form-input"
              required
            />
            <textarea
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              placeholder="Brief description..."
              className="form-textarea"
              rows={2}
            />
            <motion.button 
              type="submit" 
              className="submit-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🌸 Create Project
            </motion.button>
          </motion.form>

          {/* Zen Quote */}
          <div className="zen-quote">
            <div className="quote-icon">🌿</div>
            <p>"Progress, not perfection, is what matters."</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="content">
          {/* Project Header */}
          <div className="project-header" style={{ borderLeftColor: activeProject.color }}>
            <div className="project-title">
              <div className="title-row">
                <span className="project-icon-small" style={{ background: activeProject.color }}>
                  {activeProject.icon}
                </span>
                <h2>{activeProject.name}</h2>
              </div>
              <p>{activeProject.description}</p>
            </div>
            <div className="project-stats">
              <div className="stat">
                <span className="stat-number">{stats.totalIdeas}</span>
                <span className="stat-label">Ideas</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.completedTasks}/{stats.totalTasks}</span>
                <span className="stat-label">Tasks</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                </span>
                <span className="stat-label">Progress</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="tabs">
            {(['overview', 'ideas', 'tasks', 'resources'] as const).map(tab => (
              <motion.button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab === 'overview' && '🌿'}
                {tab === 'ideas' && '💭'}
                {tab === 'tasks' && '📝'}
                {tab === 'resources' && '📚'}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                className="overview-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* SDLC Phase Overview */}
                <div className="sdlc-overview">
                  <h3>🌱 Project Journey</h3>
                  <div className="phase-grid">
                    {sdlcPhases.map(phase => (
                      <motion.div
                        key={phase.id}
                        className="phase-card"
                        style={{ 
                          borderLeftColor: phase.color,
                          background: `${phase.color}15`
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <div className="phase-icon">{phase.icon}</div>
                        <h4>{phase.name}</h4>
                        <p>{phase.description}</p>
                        <div className="phase-count">
                          <span className="count">{stats.phaseCounts[phase.id]}</span>
                          <span>ideas in this phase</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Recent Ideas */}
                <div className="recent-section">
                  <h3>💭 Recent Ideas</h3>
                  <div className="ideas-list">
                    {projectIdeas.slice(0, 5).map(idea => {
                      const phase = sdlcPhases.find(p => p.id === idea.phase);
                      return (
                        <motion.div
                          key={idea.id}
                          className="idea-card"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -2 }}
                        >
                          <div className="idea-header">
                            <h4>{idea.title}</h4>
                            <span 
                              className="phase-badge"
                              style={{ 
                                background: phase?.color,
                                color: '#FFF'
                              }}
                            >
                              {phase?.icon} {phase?.name}
                            </span>
                          </div>
                          <p>{idea.description}</p>
                          <div className="idea-footer">
                            <span 
                              className="status-badge"
                              style={{ 
                                background: statusColors[idea.status],
                                color: '#5A5560'
                              }}
                            >
                              {idea.status}
                            </span>
                            <span className="date">
                              {new Date(idea.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Ideas Tab */}
            {activeTab === 'ideas' && (
              <motion.div
                className="ideas-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Add Idea Form */}
                <form onSubmit={handleAddIdea} className="idea-form">
                  <h3>💭 New Idea</h3>
                  <input
                    type="text"
                    value={newIdeaTitle}
                    onChange={(e) => setNewIdeaTitle(e.target.value)}
                    placeholder="Idea title..."
                    className="form-input"
                    required
                  />
                  <textarea
                    value={newIdeaDesc}
                    onChange={(e) => setNewIdeaDesc(e.target.value)}
                    placeholder="Describe your idea in detail..."
                    className="form-textarea"
                    rows={3}
                    required
                  />
                  <div className="form-row">
                    <select
                      value={newIdeaPhase}
                      onChange={(e) => setNewIdeaPhase(e.target.value as SDLCPhase)}
                      className="form-select"
                    >
                      {sdlcPhases.map(phase => (
                        <option key={phase.id} value={phase.id}>{phase.icon} {phase.name}</option>
                      ))}
                    </select>
                    <select
                      value={newIdeaPriority}
                      onChange={(e) => setNewIdeaPriority(parseInt(e.target.value) as Priority)}
                      className="form-select"
                    >
                      <option value={0}>🌸 Critical</option>
                      <option value={1}>🌺 High</option>
                      <option value={2}>🌷 Medium</option>
                      <option value={3}>🌿 Low</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={newIdeaTags}
                    onChange={(e) => setNewIdeaTags(e.target.value)}
                    placeholder="Tags (comma separated)"
                    className="form-input"
                  />
                  <motion.button 
                    type="submit" 
                    className="submit-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🌸 Add Idea
                  </motion.button>
                </form>

                {/* Ideas Grid */}
                <div className="ideas-grid">
                  <AnimatePresence>
                    {projectIdeas.map(idea => {
                      const phase = sdlcPhases.find(p => p.id === idea.phase);
                      return (
                        <motion.div
                          key={idea.id}
                          className="idea-card"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          layout
                          whileHover={{ y: -4 }}
                        >
                          <div className="idea-header">
                            <h4>{idea.title}</h4>
                            <div className="idea-actions">
                              <select
                                value={idea.status}
                                onChange={(e) => updateIdeaStatus(idea.id, e.target.value as IdeaStatus)}
                                className="status-select"
                                style={{ color: '#5A5560', background: statusColors[idea.status] }}
                              >
                                <option value="backlog">📥 Backlog</option>
                                <option value="active">🌟 Active</option>
                                <option value="in-progress">🌱 In Progress</option>
                                <option value="completed">✅ Completed</option>
                                <option value="archived">📦 Archived</option>
                              </select>
                              <motion.button
                                onClick={() => deleteIdea(idea.id)}
                                className="delete-btn"
                                title="Delete idea"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                🗑️
                              </motion.button>
                            </div>
                          </div>
                          <p className="idea-desc">{idea.description}</p>
                          <div className="idea-meta">
                            <div className="meta-item">
                              <span className="meta-label">Phase:</span>
                              <span 
                                className="phase-badge"
                                style={{ 
                                  background: phase?.color,
                                  color: '#FFF'
                                }}
                              >
                                {phase?.icon} {phase?.name}
                              </span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-label">Priority:</span>
                              <span 
                                className="priority-badge"
                                style={{ 
                                  background: priorityColors[idea.priority],
                                  color: '#5A5560'
                                }}
                              >
                                {idea.priority === 0 && '🌸'}
                                {idea.priority === 1 && '🌺'}
                                {idea.priority === 2 && '🌷'}
                                {idea.priority === 3 && '🌿'}
                                P{idea.priority}
                              </span>
                            </div>
                          </div>
                          {idea.tags.length > 0 && (
                            <div className="idea-tags">
                              {idea.tags.map(tag => (
                                <span key={tag} className="tag">#{tag}</span>
                              ))}
                            </div>
                          )}
                          <div className="idea-footer">
                            <span className="date">
                              Added: {new Date(idea.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <motion.div
                className="tasks-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Add Task Form */}
                <form onSubmit={handleAddTask} className="task-form">
                  <h3>📝 New Task</h3>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="form-input"
                    required
                  />
                  <motion.button 
                    type="submit" 
                    className="submit-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🌸 Add Task
                  </motion.button>
                </form>

                {/* Tasks List */}
                <div className="tasks-list">
                  <AnimatePresence>
                    {projectTasks.map(task => (
                      <motion.div
                        key={task.id}
                        className={`task-item ${task.completed ? 'completed' : ''}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        layout
                        whileHover={{ x: 4 }}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="task-checkbox"
                        />
                        <span className="task-title">{task.title}</span>
                        {task.ideaId && (
                          <span className="task-idea">
                            💭 {ideas.find(i => i.id === task.ideaId)?.title}
                          </span>
                        )}
                        <motion.button
                          onClick={() => deleteTask(task.id)}
                          className="delete-btn"
                          title="Delete task"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          🗑️
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <motion.div
                className="resources-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Add Resource Form */}
                <form onSubmit={handleAddResource} className="resource-form">
                  <h3>📚 Add Resource</h3>
                  <div className="form-row">
                    <input
                      type="text"
                      value={newResourceTitle}
                      onChange={(e) => setNewResourceTitle(e.target.value)}
                      placeholder="Resource title"
                      className="form-input"
                      required
                    />
                    <select
                      value={newResourceType}
                      onChange={(e) => setNewResourceType(e.target.value as ResourceType)}
                      className="form-select"
                    >
                      <option value="link">🔗 Link</option>
                      <option value="image">🖼️ Image</option>
                      <option value="document">📄 Document</option>
                      <option value="audio">🎵 Audio</option>
                      <option value="video">🎬 Video</option>
                      <option value="other">📁 Other</option>
                    </select>
                  </div>
                  
                  <div className="upload-section">
                    <div className="upload-options">
                      <div className="upload-option">
                        <input
                          type="url"
                          value={newResourceUrl}
                          onChange={(e) => setNewResourceUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="form-input"
                        />
                        <span className="option-label">OR paste a URL</span>
                      </div>
                      
                      <div className="upload-option">
                        <div className="file-upload-area" onClick={() => fileInputRef.current?.click()}>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="file-input"
                            hidden
                          />
                          <div className="upload-icon">📤</div>
                          <p className="upload-text">
                            {uploadedFile ? uploadedFile.name : 'Click to upload from your PC'}
                          </p>
                          {uploadedFile && (
                            <p className="file-size">{formatFileSize(uploadedFile.size)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <textarea
                    value={newResourceDesc}
                    onChange={(e) => setNewResourceDesc(e.target.value)}
                    placeholder="Description..."
                    className="form-textarea"
                    rows={2}
                  />
                  
                  <input
                    type="text"
                    value={newResourceTags}
                    onChange={(e) => setNewResourceTags(e.target.value)}
                    placeholder="Tags (comma separated)"
                    className="form-input"
                  />
                  
                  <motion.button 
                    type="submit" 
                    className="submit-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    📚 Add Resource
                  </motion.button>
                </form>

                {/* Resources Grid */}
                <div className="resources-grid">
                  <AnimatePresence>
                    {projectResources.map(resource => {
                      const typeConfig = resourceTypes[resource.type];
                      return (
                        <motion.div
                          key={resource.id}
                          className="resource-card"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ y: -4 }}
                        >
                          <div 
                            className="resource-header"
                            style={{ background: typeConfig.bg }}
                          >
                            <div className="resource-type-icon" style={{ color: typeConfig.color }}>
                              {typeConfig.icon}
                            </div>
                            <h4>{resource.title}</h4>
                            <motion.button
                              onClick={() => deleteResource(resource.id)}
                              className="delete-btn"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              🗑️
                            </motion.button>
                          </div>
                          <div className="resource-body">
                            <p>{resource.description}</p>
                            
                            <div className="resource-content">
                              {resource.url && (
                                <a 
                                  href={resource.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="resource-link"
                                >
                                  🔗 {resource.url}
                                </a>
                              )}
                              {resource.file && (
                                <div className="file-info">
                                  <span className="file-name">📄 {resource.file.name}</span>
                                  <span className="file-size">{formatFileSize(resource.file.size)}</span>
                                </div>
                              )}
                            </div>
                            
                            {resource.tags.length > 0 && (
                              <div className="resource-tags">
                                {resource.tags.map(tag => (
                                  <span key={tag} className="tag">🏷️ {tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="resource-footer">
                            <span className="date">
                              Added: {new Date(resource.createdAt).toLocaleDateString()}
                            </span>
                            <span className="type-badge" style={{ color: typeConfig.color }}>
                              {typeConfig.icon} {resource.type}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>🌸 Find your flow, one project at a time</p>
      </div>

      <style>{`
        .project-tracker {
          min-height: 100vh;
          background: linear-gradient(135deg, ${zenColors.background} 0%, #FFEFF7 100%);
          padding: 20px;
          font-family: 'Poppins', sans-serif;
          color: ${zenColors.text};
        }

        .header {
          background: ${zenColors.surface};
          padding: 40px;
          border-radius: 24px;
          margin-bottom: 20px;
          box-shadow: 0 8px 32px rgba(255, 155, 201, 0.1);
          border: 1px solid ${zenColors.border};
          text-align: center;
        }

        .header h1 {
          font-size: 3rem;
          color: ${zenColors.primary};
          margin: 0 0 10px 0;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .subtitle {
          color: ${zenColors.lightText};
          font-size: 1.2rem;
          margin: 0;
          font-weight: 400;
        }

        .main-content {
          display: flex;
          gap: 20px;
          min-height: 800px;
        }

        /* Sidebar */
        .sidebar {
          flex: 0 0 320px;
          background: ${zenColors.surface};
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 8px 32px rgba(255, 155, 201, 0.1);
          border: 1px solid ${zenColors.border};
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid ${zenColors.border};
        }

        .sidebar-header h3 {
          margin: 0;
          color: ${zenColors.primary};
          font-size: 1.5rem;
          font-weight: 600;
        }

        .new-project-btn {
          background: ${zenColors.primary};
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(255, 155, 201, 0.3);
        }

        .new-project-btn:hover {
          background: #FF7BB3;
          transform: scale(1.1);
        }

        .project-list {
          margin-bottom: 30px;
          flex: 1;
          overflow-y: auto;
        }

        .project-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: ${zenColors.background};
          border: 2px solid ${zenColors.border};
          border-radius: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .project-item:hover {
          border-color: ${zenColors.primary};
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(255, 155, 201, 0.1);
        }

        .project-item.active {
          border-color: ${zenColors.primary};
          background: ${zenColors.primary}15;
          box-shadow: 0 4px 16px rgba(255, 155, 201, 0.2);
        }

        .project-item.inactive {
          opacity: 0.6;
        }

        .project-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .project-info {
          flex: 1;
          min-width: 0;
        }

        .project-info h4 {
          margin: 0 0 5px 0;
          color: ${zenColors.text};
          font-size: 1rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .project-info p {
          margin: 0 0 10px 0;
          color: ${zenColors.lightText};
          font-size: 0.85rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-meta {
          display: flex;
          gap: 12px;
          font-size: 0.8rem;
          color: ${zenColors.lightText};
        }

        .project-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .project-item:hover .project-actions {
          opacity: 1;
        }

        .status-btn {
          background: none;
          border: none;
          color: ${zenColors.success};
          cursor: pointer;
          font-size: 1rem;
          padding: 4px;
          transition: all 0.3s;
        }

        .status-btn.active {
          color: ${zenColors.success};
        }

        .status-btn:not(.active) {
          color: ${zenColors.lightText};
        }

        .delete-project-btn {
          background: none;
          border: none;
          color: ${zenColors.error};
          cursor: pointer;
          opacity: 0.6;
          padding: 4px;
          transition: all 0.3s;
          font-size: 1rem;
        }

        .delete-project-btn:hover {
          opacity: 1;
          transform: scale(1.1);
        }

        .add-project-form {
          background: ${zenColors.background};
          padding: 25px;
          border-radius: 16px;
          border: 2px dashed ${zenColors.border};
          margin-bottom: 20px;
        }

        .add-project-form h4 {
          margin: 0 0 15px 0;
          color: ${zenColors.primary};
          font-size: 1.1rem;
          font-weight: 600;
        }

        .zen-quote {
          background: ${zenColors.tertiary}20;
          padding: 20px;
          border-radius: 16px;
          text-align: center;
          border: 1px solid ${zenColors.border};
          margin-top: auto;
        }

        .quote-icon {
          font-size: 2rem;
          margin-bottom: 10px;
          opacity: 0.8;
        }

        .zen-quote p {
          margin: 0;
          color: ${zenColors.text};
          font-style: italic;
          font-size: 0.9rem;
        }

        /* Main Content */
        .content {
          flex: 1;
          background: ${zenColors.surface};
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 8px 32px rgba(255, 155, 201, 0.1);
          border: 1px solid ${zenColors.border};
          display: flex;
          flex-direction: column;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-left: 20px;
          border-left-width: 6px;
          border-left-style: solid;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid ${zenColors.border};
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .project-icon-small {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .project-title h2 {
          margin: 0 0 8px 0;
          color: ${zenColors.text};
          font-size: 2rem;
          font-weight: 700;
        }

        .project-title p {
          margin: 0;
          color: ${zenColors.lightText};
          font-size: 1rem;
        }

        .project-stats {
          display: flex;
          gap: 30px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: ${zenColors.primary};
        }

        .stat-label {
          font-size: 0.9rem;
          color: ${zenColors.lightText};
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 5px;
          margin-bottom: 30px;
          border-bottom: 2px solid ${zenColors.border};
          padding-bottom: 5px;
        }

        .tab-btn {
          padding: 12px 24px;
          border: none;
          background: none;
          font-weight: 600;
          color: ${zenColors.lightText};
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tab-btn.active {
          background: ${zenColors.primary};
          color: white;
          box-shadow: 0 4px 12px rgba(255, 155, 201, 0.3);
        }

        .tab-btn:hover:not(.active) {
          background: ${zenColors.background};
          color: ${zenColors.primary};
        }

        /* Forms */
        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 14px;
          border: 2px solid ${zenColors.border};
          border-radius: 12px;
          font-size: 1rem;
          margin-bottom: 15px;
          transition: all 0.3s;
          background: ${zenColors.background};
          color: ${zenColors.text};
          font-family: inherit;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: ${zenColors.lightText};
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: ${zenColors.primary};
          box-shadow: 0 0 0 3px ${zenColors.primary}20;
        }

        .form-row {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }

        .form-row .form-select {
          flex: 1;
          margin-bottom: 0;
        }

        .submit-btn {
          background: ${zenColors.primary};
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
          font-size: 1rem;
          box-shadow: 0 4px 12px rgba(255, 155, 201, 0.3);
        }

        .submit-btn:hover {
          background: #FF7BB3;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 155, 201, 0.4);
        }

        /* Overview */
        .phase-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0 40px 0;
        }

        .phase-card {
          background: white;
          border-left: 4px solid;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
        }

        .phase-icon {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .phase-card h4 {
          margin: 0 0 8px 0;
          color: ${zenColors.text};
          font-size: 1.1rem;
        }

        .phase-card p {
          margin: 0 0 15px 0;
          color: ${zenColors.lightText};
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .phase-count {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .phase-count .count {
          font-size: 1.5rem;
          font-weight: bold;
          color: ${zenColors.primary};
        }

        .phase-count span:last-child {
          color: ${zenColors.lightText};
          font-size: 0.9rem;
        }

        /* Recent Ideas */
        .recent-section {
          margin-top: 40px;
        }

        .recent-section h3 {
          margin: 0 0 20px 0;
          color: ${zenColors.text};
          font-size: 1.5rem;
          font-weight: 600;
        }

        .ideas-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .idea-card {
          background: ${zenColors.background};
          border: 2px solid ${zenColors.border};
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s;
        }

        .idea-card:hover {
          border-color: ${zenColors.primary};
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 155, 201, 0.1);
        }

        .idea-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .idea-header h4 {
          margin: 0;
          color: ${zenColors.text};
          font-size: 1.1rem;
          font-weight: 600;
        }

        .phase-badge {
          padding: 6px 12px;
          border-radius: 20px;
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .idea-card p {
          margin: 0 0 15px 0;
          color: ${zenColors.lightText};
          line-height: 1.5;
          font-size: 0.95rem;
        }

        .idea-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .date {
          font-size: 0.85rem;
          color: ${zenColors.lightText};
        }

        /* Ideas Grid */
        .ideas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .idea-desc {
          margin: 10px 0;
          color: ${zenColors.lightText};
          line-height: 1.5;
          font-size: 0.95rem;
        }

        .idea-meta {
          display: flex;
          gap: 15px;
          margin: 15px 0;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .meta-label {
          font-size: 0.9rem;
          color: ${zenColors.lightText};
        }

        .priority-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .idea-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 15px 0;
        }

        .tag {
          background: ${zenColors.border};
          color: ${zenColors.text};
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        .idea-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .status-select {
          padding: 6px 12px;
          border: 2px solid ${zenColors.border};
          border-radius: 8px;
          background: white;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.3s;
        }

        .status-select:focus {
          outline: none;
          border-color: ${zenColors.primary};
        }

        /* Tasks */
        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 30px;
        }

        .task-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 18px;
          background: ${zenColors.background};
          border: 2px solid ${zenColors.border};
          border-radius: 16px;
          transition: all 0.3s;
        }

        .task-item:hover {
          border-color: ${zenColors.primary};
          transform: translateX(4px);
        }

        .task-item.completed {
          opacity: 0.6;
        }

        .task-item.completed .task-title {
          text-decoration: line-through;
        }

        .task-checkbox {
          width: 22px;
          height: 22px;
          cursor: pointer;
          border-radius: 6px;
          border: 2px solid ${zenColors.border};
          accent-color: ${zenColors.primary};
        }

        .task-title {
          flex: 1;
          color: ${zenColors.text};
          font-size: 1rem;
        }

        .task-idea {
          background: ${zenColors.border};
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 0.85rem;
          color: ${zenColors.lightText};
        }

        /* Resources */
        .upload-section {
          margin-bottom: 15px;
        }

        .upload-options {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .upload-option {
          position: relative;
        }

        .option-label {
          position: absolute;
          top: -8px;
          left: 12px;
          background: white;
          padding: 0 8px;
          font-size: 0.8rem;
          color: ${zenColors.lightText};
        }

        .file-upload-area {
          border: 2px dashed ${zenColors.border};
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          background: ${zenColors.background};
        }

        .file-upload-area:hover {
          border-color: ${zenColors.primary};
          background: ${zenColors.primary}10;
        }

        .upload-icon {
          font-size: 2rem;
          margin-bottom: 10px;
          color: ${zenColors.primary};
        }

        .upload-text {
          margin: 0 0 5px 0;
          color: ${zenColors.text};
          font-size: 0.9rem;
        }

        .file-size {
          margin: 0;
          color: ${zenColors.lightText};
          font-size: 0.8rem;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .resource-card {
          background: white;
          border: 2px solid ${zenColors.border};
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .resource-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(255, 155, 201, 0.1);
        }

        .resource-header {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .resource-type-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .resource-header h4 {
          margin: 0;
          flex: 1;
          color: ${zenColors.text};
          font-size: 1.1rem;
          font-weight: 600;
        }

        .resource-body {
          padding: 0 20px 20px;
        }

        .resource-body p {
          margin: 0 0 15px 0;
          color: ${zenColors.lightText};
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .resource-content {
          margin-bottom: 15px;
        }

        .resource-link {
          display: block;
          color: ${zenColors.primary};
          text-decoration: none;
          font-size: 0.9rem;
          word-break: break-all;
          padding: 8px;
          background: ${zenColors.background};
          border-radius: 8px;
          transition: all 0.3s;
        }

        .resource-link:hover {
          background: ${zenColors.primary}15;
        }

        .file-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          background: ${zenColors.background};
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .file-name {
          color: ${zenColors.text};
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .file-size {
          color: ${zenColors.lightText};
          font-size: 0.8rem;
        }

        .resource-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .resource-footer {
          padding: 15px 20px;
          border-top: 1px solid ${zenColors.border};
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
        }

        .type-badge {
          font-weight: 600;
        }

        /* Delete Button */
        .delete-btn {
          background: none;
          border: none;
          color: ${zenColors.error};
          cursor: pointer;
          font-size: 1rem;
          opacity: 0.6;
          padding: 4px;
          transition: all 0.3s;
          border-radius: 6px;
        }

        .delete-btn:hover {
          opacity: 1;
          background: ${zenColors.error}15;
        }

        /* Footer */
        .footer {
          text-align: center;
          padding: 30px;
          color: ${zenColors.lightText};
          font-size: 0.9rem;
          margin-top: 20px;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .main-content {
            flex-direction: column;
          }
          
          .sidebar {
            flex: none;
            width: 100%;
          }
          
          .ideas-grid,
          .resources-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
          
          .phase-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .header {
            padding: 30px 20px;
          }
          
          .header h1 {
            font-size: 2.5rem;
          }
          
          .project-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          
          .project-stats {
            width: 100%;
            justify-content: space-between;
          }
          
          .form-row {
            flex-direction: column;
            gap: 10px;
          }
          
          .tabs {
            overflow-x: auto;
            padding-bottom: 0;
          }
          
          .tab-btn {
            white-space: nowrap;
            padding: 10px 16px;
          }
          
          .ideas-grid,
          .resources-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectTracker;