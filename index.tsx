import React, { useState } from 'react';
import { Shield, Building2, Target, MessageSquare, FileText, Loader2, ChevronRight, HelpCircle, Upload, Download, BarChart3, Calendar, Sliders, CheckSquare } from 'lucide-react';

export default function CybersecuritySalesBot() {
  const [activeTab, setActiveTab] = useState('instructions');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: '',
    industry: '',
    size: '',
    currentInitiatives: '',
    techStack: '',
    concerns: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [simulationValues, setSimulationValues] = useState({
    mfa: false,
    encryption: false,
    backupSystem: false,
    securityTraining: false,
    endpoint: false
  });
  const [showSimulator, setShowSimulator] = useState(false);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (field, value) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  const analyzeCompany = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: `You are a cybersecurity sales intelligence analyst. Analyze this company and provide a comprehensive security assessment in JSON format.

Company Information:
- Name: ${companyData.name}
- Industry: ${companyData.industry}
- Company Size: ${companyData.size}
- Current Initiatives: ${companyData.currentInitiatives}
- Tech Stack: ${companyData.techStack}
- Known Concerns: ${companyData.concerns}

Provide your analysis in this exact JSON structure with NO additional text or markdown:
{
  "overallRiskScore": 75,
  "industryBenchmark": {
    "averageScore": 65,
    "percentile": 60,
    "comparison": "above/below/at industry average",
    "industryContext": "brief context about security in this industry"
  },
  "companyProfile": {
    "summary": "2-3 sentence summary of company priorities and strategic direction",
    "keyInitiatives": ["initiative 1", "initiative 2", "initiative 3"]
  },
  "threatAnalysis": {
    "primaryThreats": [
      {"type": "threat name", "risk": "High/Medium/Low", "description": "why this matters", "urgencyScore": 8}
    ],
    "ransomwareTypes": ["specific ransomware type 1", "specific ransomware type 2"],
    "attackVectors": ["vector 1", "vector 2", "vector 3"]
  },
  "swotAnalysis": {
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "opportunities": ["opportunity 1", "opportunity 2"],
    "threats": ["threat 1", "threat 2"]
  },
  "vulnerabilities": [
    {"area": "vulnerability area", "severity": "Critical/High/Medium", "impact": "business impact", "urgencyScore": 9}
  ],
  "valueProps": [
    {"pain": "specific pain point", "solution": "how Cohesity/solution addresses it", "benefit": "measurable benefit"}
  ],
  "discoveryQuestions": [
    "question 1",
    "question 2",
    "question 3",
    "question 4",
    "question 5"
  ],
  "actionPlan": [
    {
      "priority": 1,
      "action": "specific action to take",
      "timeline": "Immediate/1-3 months/3-6 months/6-12 months",
      "resources": "resources needed",
      "expectedOutcome": "what this achieves"
    }
  ],
  "preMeetingBrief": "Comprehensive 3-4 paragraph pre-call brief covering company context, key concerns, recommended talking points, and meeting objectives",
  "executiveSummary": "Concise 2-3 paragraph executive summary suitable for C-level presentation"
}`
          }]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.error?.message || 'API request failed');
      }
      
      if (!data.content || !data.content[0]) {
        throw new Error('No content in API response');
      }
      
      const content = data.content[0].text;
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanContent);
      
      setAnalysis(parsed);
      setStep(2);
    } catch (error) {
      console.error('Analysis error:', error);
      alert(`Error generating analysis: ${error.message}. Please check the console for details and try again.`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const downloadReport = () => {
    const reportContent = `
CYBERSECURITY INTELLIGENCE REPORT
Company: ${companyData.name}
Industry: ${companyData.industry}
Generated: ${new Date().toLocaleDateString()}

==================================================
OVERALL RISK ASSESSMENT
==================================================
Risk Score: ${analysis.overallRiskScore}/100
Industry Average: ${analysis.industryBenchmark.averageScore}/100
Percentile: ${analysis.industryBenchmark.percentile}th percentile (${analysis.industryBenchmark.comparison})

${analysis.industryBenchmark.industryContext}

==================================================
COMPANY PROFILE
==================================================
${analysis.companyProfile.summary}

Key Initiatives:
${analysis.companyProfile.keyInitiatives.map(init => `• ${init}`).join('\n')}

==================================================
THREAT ANALYSIS
==================================================
Primary Threats:
${analysis.threatAnalysis.primaryThreats.map(t => `
• ${t.type} (${t.risk} Risk - Urgency: ${t.urgencyScore}/10)
  ${t.description}`).join('\n')}

Ransomware Types: ${analysis.threatAnalysis.ransomwareTypes.join(', ')}

Attack Vectors: ${analysis.threatAnalysis.attackVectors.join(', ')}

==================================================
SWOT ANALYSIS
==================================================
STRENGTHS:
${analysis.swotAnalysis.strengths.map(s => `• ${s}`).join('\n')}

WEAKNESSES:
${analysis.swotAnalysis.weaknesses.map(w => `• ${w}`).join('\n')}

OPPORTUNITIES:
${analysis.swotAnalysis.opportunities.map(o => `• ${o}`).join('\n')}

THREATS:
${analysis.swotAnalysis.threats.map(t => `• ${t}`).join('\n')}

==================================================
CRITICAL VULNERABILITIES
==================================================
${analysis.vulnerabilities.map(v => `
• ${v.area} (${v.severity} - Urgency: ${v.urgencyScore}/10)
  Impact: ${v.impact}`).join('\n')}

==================================================
VALUE PROPOSITIONS
==================================================
${analysis.valueProps.map((vp, i) => `
${i + 1}. Pain Point: ${vp.pain}
   Solution: ${vp.solution}
   Benefit: ${vp.benefit}`).join('\n')}

==================================================
ACTION PLAN & ROADMAP
==================================================
${analysis.actionPlan.map(ap => `
Priority ${ap.priority}: ${ap.action}
Timeline: ${ap.timeline}
Resources Needed: ${ap.resources}
Expected Outcome: ${ap.expectedOutcome}`).join('\n')}

==================================================
DISCOVERY QUESTIONS
==================================================
${analysis.discoveryQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

==================================================
PRE-MEETING BRIEF
==================================================
${analysis.preMeetingBrief}

==================================================
EXECUTIVE SUMMARY
==================================================
${analysis.executiveSummary}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyData.name.replace(/\s+/g, '_')}_Cybersecurity_Report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const calculateSimulatedRisk = () => {
    let reduction = 0;
    if (simulationValues.mfa) reduction += 15;
    if (simulationValues.encryption) reduction += 12;
    if (simulationValues.backupSystem) reduction += 10;
    if (simulationValues.securityTraining) reduction += 8;
    if (simulationValues.endpoint) reduction += 10;
    
    const newScore = Math.max(0, analysis.overallRiskScore - reduction);
    return { newScore, reduction };
  };

  const toggleSimulation = (key) => {
    setSimulationValues(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Shield className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold">Cybersecurity Intelligence Bot</h1>
          </div>
          <p className="text-slate-300 text-lg">AI-powered threat analysis and security assessment</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('instructions')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'instructions' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            Instructions
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'analysis' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            <Shield className="w-5 h-5" />
            Analysis Tool
          </button>
        </div>

        {/* Instructions Tab */}
        {activeTab === 'instructions' && (
          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-8 border border-slate-700">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-blue-400" />
              How to Use the Cybersecurity Intelligence Bot
            </h2>

            <div className="space-y-6 text-slate-300">
              <section>
                <h3 className="text-xl font-semibold text-white mb-3">Overview</h3>
                <p className="leading-relaxed">
                  The Cybersecurity Intelligence Bot is your AI-powered assistant for conducting comprehensive security assessments. 
                  It analyzes company information to identify vulnerabilities, threats, and provides actionable intelligence for 
                  cybersecurity professionals and engineers.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">Step-by-Step Guide</h3>
                <ol className="space-y-4 list-decimal list-inside">
                  <li className="leading-relaxed">
                    <strong className="text-white">Navigate to the Analysis Tool:</strong> Click the "Analysis Tool" tab above to access the input form.
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-white">Enter Company Information:</strong> Fill in the required fields including company name, industry, 
                    size, strategic initiatives, technology stack, and any known security concerns.
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-white">Upload Supporting Documents (Optional):</strong> Add any relevant documents, screenshots, 
                    or company data that can provide additional context:
                    <ul className="ml-8 mt-2 space-y-1 list-disc">
                      <li>Company security policies and procedures</li>
                      <li>Network architecture diagrams or screenshots</li>
                      <li>Previous security audit reports</li>
                      <li>Compliance documentation (HIPAA, SOC 2, etc.)</li>
                      <li>IT infrastructure documentation</li>
                      <li>Incident response reports</li>
                      <li>Strategic planning documents</li>
                    </ul>
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-white">Generate Analysis:</strong> Click "Generate Intelligence Report" to process the information 
                    and receive a comprehensive security assessment.
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-white">Review Results:</strong> Examine the detailed analysis including threat profiles, SWOT analysis, 
                    vulnerabilities, and actionable recommendations.
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-white">Export Intelligence:</strong> Use the "Copy" buttons throughout the report to easily transfer 
                    specific sections to your documents or presentations.
                  </li>
                </ol>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">What You'll Receive</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Company profile and strategic context summary</li>
                  <li>Threat analysis with specific ransomware types and attack vectors</li>
                  <li>Security posture SWOT analysis</li>
                  <li>Critical vulnerabilities with severity ratings</li>
                  <li>Tailored value propositions and solutions</li>
                  <li>Discovery questions for deeper assessment</li>
                  <li>Pre-meeting brief for team preparation</li>
                  <li>Executive summary for leadership presentations</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">Best Practices</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Be as specific as possible when describing company initiatives and concerns</li>
                  <li>Include details about the current technology environment</li>
                  <li>Upload relevant documentation to enhance analysis accuracy</li>
                  <li>Review all sections of the generated report for comprehensive insights</li>
                  <li>Use the copy function to integrate findings into your workflow</li>
                </ul>
              </section>

              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6 mt-6">
                <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Supported File Types for Upload
                </h4>
                <p className="text-sm">
                  PDF, DOC, DOCX, TXT, PNG, JPG, JPEG, CSV, XLS, XLSX - Maximum 10 files per analysis
                </p>
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={() => setActiveTab('analysis')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  Get Started
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && step === 1 && (
          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-8 border border-slate-700">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold">Company Intelligence Input</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Company Name</label>
                <input
                  type="text"
                  value={companyData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Acme Corporation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Industry</label>
                <input
                  type="text"
                  value={companyData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Healthcare, Financial Services, Manufacturing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Company Size</label>
                <select
                  value={companyData.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select size</option>
                  <option value="Small (1-500)">Small (1-500 employees)</option>
                  <option value="Mid-Market (501-5000)">Mid-Market (501-5,000 employees)</option>
                  <option value="Enterprise (5001+)">Enterprise (5,001+ employees)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Current Strategic Initiatives</label>
                <textarea
                  value={companyData.currentInitiatives}
                  onChange={(e) => handleInputChange('currentInitiatives', e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Digital transformation, cloud migration, regulatory compliance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Technology Stack</label>
                <textarea
                  value={companyData.techStack}
                  onChange={(e) => handleInputChange('techStack', e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., AWS, Azure, VMware, legacy systems"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Known Security Concerns</label>
                <textarea
                  value={companyData.concerns}
                  onChange={(e) => handleInputChange('concerns', e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Recent breaches, compliance requirements, data protection needs"
                />
              </div>

              {/* File Upload Section */}
              <div className="border-t border-slate-700 pt-5 mt-2">
                <label className="block text-sm font-medium mb-3 text-slate-300 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Supporting Documents (Optional)
                </label>
                <div className="bg-slate-900/50 border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.csv,.xls,.xlsx"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-slate-400" />
                    <span className="text-slate-400">Click to upload or drag and drop</span>
                    <span className="text-xs text-slate-500">
                      PDF, DOC, Images, Excel - Max 10 files
                    </span>
                  </label>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-slate-400">{uploadedFiles.length} file(s) uploaded:</p>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-900/50 p-2 rounded">
                        <span className="text-sm text-slate-300 truncate">{file.name}</span>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-400 hover:text-red-300 text-sm px-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={analyzeCompany}
                disabled={loading || !companyData.name || !companyData.industry}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Generate Intelligence Report
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && step === 2 && analysis && (
          <div className="space-y-6">
            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
              >
                ← Back to Input
              </button>
              <button
                onClick={downloadReport}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Full Report
              </button>
            </div>

            {/* Overall Risk Dashboard */}
            <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur rounded-lg p-6 border border-slate-700">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                Overall Risk Assessment
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold mb-2" style={{
                    color: analysis.overallRiskScore >= 70 ? '#ef4444' : 
                           analysis.overallRiskScore >= 40 ? '#f59e0b' : '#10b981'
                  }}>
                    {analysis.overallRiskScore}
                  </div>
                  <div className="text-slate-400 text-sm">Overall Risk Score</div>
                  <div className="text-xs text-slate-500 mt-1">out of 100</div>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold text-slate-400 mb-2">
                    {analysis.industryBenchmark.averageScore}
                  </div>
                  <div className="text-slate-400 text-sm">Industry Average</div>
                  <div className="text-xs text-slate-500 mt-1">{companyData.industry}</div>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold text-blue-400 mb-2">
                    {analysis.industryBenchmark.percentile}<span className="text-2xl">th</span>
                  </div>
                  <div className="text-slate-400 text-sm">Percentile</div>
                  <div className="text-xs mt-1" style={{
                    color: analysis.industryBenchmark.comparison.includes('above') ? '#10b981' : 
                           analysis.industryBenchmark.comparison.includes('below') ? '#ef4444' : '#f59e0b'
                  }}>
                    {analysis.industryBenchmark.comparison}
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <h4 className="font-medium text-blue-400 mb-2">Industry Context</h4>
                <p className="text-slate-300 text-sm">{analysis.industryBenchmark.industryContext}</p>
              </div>
            </div>

            {/* Company Profile */}
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  Company Profile & Strategic Context
                </h3>
                <button
                  onClick={() => copyToClipboard(analysis.companyProfile.summary)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Copy
                </button>
              </div>
              <p className="text-slate-300 mb-4">{analysis.companyProfile.summary}</p>
              <div>
                <h4 className="font-medium text-sm text-slate-400 mb-2">Key Initiatives:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {analysis.companyProfile.keyInitiatives.map((init, i) => (
                    <li key={i}>{init}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Threat Analysis */}
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-red-400" />
                Threat & Vulnerability Analysis
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-400 mb-2">Primary Threats:</h4>
                  <div className="space-y-2">
                    {analysis.threatAnalysis.primaryThreats.map((threat, i) => (
                      <div key={i} className="bg-slate-900/50 p-3 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{threat.type}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 rounded bg-purple-600">
                              Urgency: {threat.urgencyScore}/10
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              threat.risk === 'High' ? 'bg-red-600' : 
                              threat.risk === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'
                            }`}>
                              {threat.risk} Risk
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400">{threat.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-slate-400 mb-2">Ransomware Types:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                      {analysis.threatAnalysis.ransomwareTypes.map((type, i) => (
                        <li key={i}>{type}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-400 mb-2">Attack Vectors:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                      {analysis.threatAnalysis.attackVectors.map((vector, i) => (
                        <li key={i}>{vector}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* SWOT Analysis */}
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4">Security Posture SWOT Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900/20 border border-green-700 p-4 rounded">
                  <h4 className="font-medium text-green-400 mb-2">Strengths</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                    {analysis.swotAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="bg-red-900/20 border border-red-700 p-4 rounded">
                  <h4 className="font-medium text-red-400 mb-2">Weaknesses</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                    {analysis.swotAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
                <div className="bg-blue-900/20 border border-blue-700 p-4 rounded">
                  <h4 className="font-medium text-blue-400 mb-2">Opportunities</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                    {analysis.swotAnalysis.opportunities.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
                <div className="bg-orange-900/20 border border-orange-700 p-4 rounded">
                  <h4 className="font-medium text-orange-400 mb-2">Threats</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                    {analysis.swotAnalysis.threats.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* Vulnerabilities */}
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4">Critical Vulnerabilities</h3>
              <div className="space-y-3">
                {analysis.vulnerabilities.map((vuln, i) => (
                  <div key={i} className="bg-slate-900/50 p-4 rounded border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{vuln.area}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-purple-600">
                          Urgency: {vuln.urgencyScore}/10
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          vuln.severity === 'Critical' ? 'bg-red-600' : 
                          vuln.severity === 'High' ? 'bg-orange-600' : 'bg-yellow-600'
                        }`}>
                          {vuln.severity}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400">{vuln.impact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Value Propositions */}
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4">Tailored Value Propositions</h3>
              <div className="space-y-4">
                {analysis.valueProps.map((prop, i) => (
                  <div key={i} className="bg-slate-900/50 p-4 rounded">
                    <h4 className="font-medium text-blue-400 mb-2">Pain Point: {prop.pain}</h4>
                    <p className="text-sm text-slate-300 mb-2"><strong>Solution:</strong> {prop.solution}</p>
                    <p className="text-sm text-green-400"><strong>Benefit:</strong> {prop.benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Plan & Roadmap */}
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Action Plan & Roadmap
                </h3>
                <button
                  onClick={() => copyToClipboard(analysis.actionPlan.map(ap => 
                    `Priority ${ap.priority}: ${ap.action}\nTimeline: ${ap.timeline}\nResources: ${ap.resources}\nOutcome: ${ap.expectedOutcome}`
                  ).join('\n\n'))}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Copy All
                </button>
              </div>
              
              <div className="space-y-4">
                {analysis.actionPlan.map((action, i) => (
                  <div key={i} className="bg-slate-900/50 p-5 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                          {action.priority}
                        </div>
                        <h4 className="font-semibold text-lg">{action.action}</h4>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        action.timeline.includes('Immediate') ? 'bg-red-600' :
                        action.timeline.includes('1-3') ? 'bg-orange-600' :
                        action.timeline.includes('3-6') ? 'bg-yellow-600' : 'bg-green-600'
                      }`}>
                        {action.timeline}
                      </span>
                    </div>
                    
                    <div className="ml-11 space-y-2 text-sm">
                      <div>
                        <span className="text-slate-400 font-medium">Resources Needed:</span>
                        <p className="text-slate-300">{action.resources}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Expected Outcome:</span>
                        <p className="text-green-400">{action.expectedOutcome}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <p className="text-sm text-slate-300">
                  <strong className="text-blue-400">Implementation Tip:</strong> Focus on high-priority items first. 
                  Items marked "Immediate" should be addressed within the next 30 days to minimize risk exposure.
                </p>
              </div>
            </div>

            {/* Risk Simulator */}
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400" />
                  Risk Calculator & Simulator
                </h3>
                <button
                  onClick={() => setShowSimulator(!showSimulator)}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  {showSimulator ? 'Hide' : 'Show'} Simulator
                </button>
              </div>

              {showSimulator && (
                <>
                  <p className="text-slate-300 mb-4 text-sm">
                    Toggle security measures below to see how they impact your overall risk score. 
                    This helps you understand which investments provide the most risk reduction.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="bg-slate-900/50 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">Multi-Factor Authentication (MFA)</h4>
                        <p className="text-xs text-slate-400">Reduces risk by ~15 points</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={simulationValues.mfa}
                          onChange={() => toggleSimulation('mfa')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">Data Encryption at Rest & In Transit</h4>
                        <p className="text-xs text-slate-400">Reduces risk by ~12 points</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={simulationValues.encryption}
                          onChange={() => toggleSimulation('encryption')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">Automated Backup & Recovery System</h4>
                        <p className="text-xs text-slate-400">Reduces risk by ~10 points</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={simulationValues.backupSystem}
                          onChange={() => toggleSimulation('backupSystem')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">Employee Security Awareness Training</h4>
                        <p className="text-xs text-slate-400">Reduces risk by ~8 points</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={simulationValues.securityTraining}
                          onChange={() => toggleSimulation('securityTraining')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">Advanced Endpoint Protection (EDR/XDR)</h4>
                        <p className="text-xs text-slate-400">Reduces risk by ~10 points</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={simulationValues.endpoint}
                          onChange={() => toggleSimulation('endpoint')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4 text-purple-300">Simulated Risk Impact</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold text-slate-400">
                          {analysis.overallRiskScore}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Current Score</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-red-400">
                          -{calculateSimulatedRisk().reduction}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Risk Reduction</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-green-400">
                          {calculateSimulatedRisk().newScore}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">New Score</div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-purple-300">
                        Implementing selected measures could reduce your risk by{' '}
                        <strong>{Math.round((calculateSimulatedRisk().reduction / analysis.overallRiskScore) * 100)}%</strong>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Compliance Mapping */}
            {analysis.complianceMapping && (
              <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-green-400" />
                  Compliance Framework Mapping
                </h3>

                <div className="mb-6 bg-slate-900/50 p-5 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold">Overall Compliance Status</h4>
                    <span className="text-2xl font-bold text-yellow-400">
                      {analysis.complianceMapping.overallCompliance}
                    </span>
                  </div>
                  {analysis.complianceMapping.criticalGaps && analysis.complianceMapping.criticalGaps.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-slate-400 mb-2">Critical Compliance Gaps:</p>
                      <ul className="list-disc list-inside text-sm text-red-400 space-y-1">
                        {analysis.complianceMapping.criticalGaps.map((gap, i) => (
                          <li key={i}>{gap}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {analysis.complianceMapping.frameworks && analysis.complianceMapping.frameworks.length > 0 && (
                  <div className="space-y-4">
                    {analysis.complianceMapping.frameworks.map((framework, i) => (
                      <div key={i} className="bg-slate-900/50 p-5 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg">{framework.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-3 py-1 rounded-full ${
                              framework.priority === 'High' ? 'bg-red-600' :
                              framework.priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'
                            }`}>
                              {framework.priority} Priority
                            </span>
                            <span className={`text-xs px-3 py-1 rounded-full ${
                              framework.status === 'Compliant' ? 'bg-green-600' :
                              framework.status === 'Partial' ? 'bg-yellow-600' : 'bg-red-600'
                            }`}>
                              {framework.status}
                            </span>
                          </div>
                        </div>

                        {framework.gaps && framework.gaps.length > 0 && (
                          <div>
                            <p className="text-sm text-slate-400 mb-2">Identified Gaps:</p>
                            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1 ml-2">
                              {framework.gaps.map((gap, j) => (
                                <li key={j}>{gap}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <p className="text-sm text-slate-300">
                    <strong className="text-blue-400">Compliance Tip:</strong> Address high-priority framework gaps first 
                    to avoid regulatory penalties. Non-compliant status in critical frameworks could result in fines, 
                    legal action, or loss of business opportunities.
                  </p>
                </div>
              </div>
            )}

            {/* Discovery Questions */}
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  Discovery Questions
                </h3>
                <button
                  onClick={() => copyToClipboard(analysis.discoveryQuestions.join('\n'))}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Copy All
                </button>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                {analysis.discoveryQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </div>

            {/* Pre-Meeting Brief */}
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Pre-Meeting Brief
                </h3>
                <button
                  onClick={() => copyToClipboard(analysis.preMeetingBrief)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Copy
                </button>
              </div>
              <p className="text-slate-300 whitespace-pre-line">{analysis.preMeetingBrief}</p>
            </div>

            {/* Executive Summary */}
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Executive Summary
                </h3>
                <button
                  onClick={() => copyToClipboard(analysis.executiveSummary)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Copy
                </button>
              </div>
              <p className="text-slate-300 whitespace-pre-line">{analysis.executiveSummary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
