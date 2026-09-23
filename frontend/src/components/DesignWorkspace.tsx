import React, { useState, useEffect } from 'react';
import { Problem, SubmissionFormat, Attempt } from '../types';
import { StatusBadge } from './StatusBadge';
import { Play, RotateCcw, FileText, CheckCircle, Lightbulb, ShieldAlert, AlertCircle } from 'lucide-react';

interface DesignWorkspaceProps {
  problem: Problem;
  attempt: Attempt | null;
  onSubmitSolution: (format: SubmissionFormat, content: string) => Promise<void>;
  onViewHistory: () => void;
}

export const DesignWorkspace: React.FC<DesignWorkspaceProps> = ({
  problem,
  attempt,
  onSubmitSolution,
  onViewHistory,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<SubmissionFormat>('CODE_TS');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getTemplateForFormat = (fmt: SubmissionFormat): string => {
    // 1. Return problem-specific template if defined in problem templates map
    if (problem.templates && problem.templates[fmt]?.code) {
      return problem.templates[fmt].code;
    }

    // 2. Dynamic fallback generator tailored specifically to current problem's rubric
    const classes = problem.rubric?.expectedClasses || [];
    const methods = problem.rubric?.expectedMethods || [];

    switch (fmt) {
      case 'CODE_JAVA': {
        let code = `// ${problem.title} - Java Starter Template\nimport java.util.*;\n\n`;
        for (const cls of classes) {
          if (cls.type === 'enum') {
            code += `public enum ${cls.name} { TYPE_A, TYPE_B }\n\n`;
          } else if (cls.type === 'interface') {
            code += `public interface ${cls.name} {\n`;
            const mList = methods.filter(m => m.className === cls.name);
            if (mList.length > 0) {
              for (const m of mList) {
                code += `    void ${m.methodName}();\n`;
              }
            } else {
              code += `    void process();\n`;
            }
            code += `}\n\n`;
          } else {
            code += `public class ${cls.name} {\n`;
            const mList = methods.filter(m => m.className === cls.name);
            if (mList.length > 0) {
              for (const m of mList) {
                code += `    public void ${m.methodName}() {\n        // TODO: Implement ${m.description || m.methodName}\n    }\n\n`;
              }
            }
            code += `}\n\n`;
          }
        }
        return code;
      }
      case 'CODE_PYTHON': {
        let code = `# ${problem.title} - Python Starter Template\nfrom abc import ABC, abstractmethod\nfrom enum import Enum\nfrom typing import List, Optional\n\n`;
        for (const cls of classes) {
          if (cls.type === 'enum') {
            code += `class ${cls.name}(Enum):\n    TYPE_A = "TYPE_A"\n    TYPE_B = "TYPE_B"\n\n`;
          } else if (cls.type === 'interface') {
            code += `class ${cls.name}(ABC):\n    @abstractmethod\n    def process(self) -> None:\n        pass\n\n`;
          } else {
            code += `class ${cls.name}:\n    def __init__(self):\n        pass\n\n`;
            const mList = methods.filter(m => m.className === cls.name);
            for (const m of mList) {
              code += `    def ${m.methodName}(self) -> None:\n        # TODO: Implement ${m.description || m.methodName}\n        pass\n\n`;
            }
          }
        }
        return code;
      }
      case 'DIAGRAM_PLANTUML': {
        let code = `' ${problem.title} - PlantUML Class Diagram\n@startuml\n\n`;
        for (const cls of classes) {
          code += `${cls.type} ${cls.name} {\n}\n\n`;
        }
        code += `@enduml\n`;
        return code;
      }
      case 'TEXT': {
        return `${problem.title.toUpperCase()} DESIGN DOCUMENTATION\n\n1. Overview & System Requirements:\n2. Domain Class Hierarchy:\n${classes.map(c => `- ${c.name} (${c.type}): ${c.description}`).join('\n')}\n\n3. Key Design Patterns Applied:\n- ${problem.rubric?.recommendedPatterns?.join(', ') || 'Strategy Pattern'}\n\n4. Extensibility & Concurrency Trade-offs:\n`;
      }
      case 'CODE_TS':
      default: {
        return problem.templates?.['CODE_TS']?.code || `// ${problem.title} - TypeScript Starter\n\nexport class Solution {}\n`;
      }
    }
  };

  // Sync initial content from starter template or previous submission
  useEffect(() => {
    const latestSub = attempt?.submissions && attempt.submissions.length > 0
      ? attempt.submissions[attempt.submissions.length - 1]
      : null;

    if (latestSub) {
      setSelectedFormat(latestSub.format);
      setContent(latestSub.content);
    } else {
      setContent(getTemplateForFormat(selectedFormat));
    }
  }, [problem, attempt]);

  const handleFormatChange = (fmt: SubmissionFormat) => {
    setSelectedFormat(fmt);
    setContent(getTemplateForFormat(fmt));
  };

  const handleResetTemplate = () => {
    setContent(getTemplateForFormat(selectedFormat));
  };

  const handleSubmit = async () => {
    if (!content || content.trim().length === 0) {
      setErrorMsg('Submission content cannot be empty.');
      return;
    }

    try {
      setErrorMsg(null);
      setIsSubmitting(true);
      await onSubmitSolution(selectedFormat, content);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1450px', margin: '1.5rem auto', padding: '0 1.5rem' }}>
      
      {/* Workspace Header Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {problem.title}
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
            <span>Category: {problem.category}</span>
            <span>•</span>
            <span>Format: {selectedFormat}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {attempt && <StatusBadge status={attempt.status} />}
          <button className="btn btn-secondary" onClick={onViewHistory}>
            History ({attempt?.submissions.length || 0})
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '1.5rem', minHeight: 'calc(100vh - 220px)' }}>
        
        {/* Left Column: Problem Requirements & Rubric */}
        <div className="glass-panel" style={{ padding: '1.75rem', overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
          
          <section style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={18} /> Problem Statement
            </h3>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {problem.fullDescription}
            </div>
          </section>

          {/* Core Requirements */}
          <section style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} color="var(--color-success)" /> System Requirements
            </h3>
            <ul style={{ listStyle: 'none', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {problem.requirements.map((req, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--accent-primary)', fontWeight: 700 }}>•</span>
                  {req}
                </li>
              ))}
            </ul>
          </section>

          {/* Required Domain Abstractions & Rubric */}
          <section style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lightbulb size={16} color="#fbbf24" /> Expected Abstractions & Methods
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
              {problem.rubric.expectedClasses.map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>{item.type}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.875rem', color: '#a5b4fc' }}>{item.name}</span>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{item.description}</div>
                </div>
              ))}
            </div>
          </section>

          {/* SOLID Anti-patterns to Avoid */}
          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldAlert size={16} /> Anti-Patterns to Avoid
            </h3>
            <ul style={{ listStyle: 'none', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              {problem.rubric.commonAntiPatterns.map((ap, idx) => (
                <li key={idx} style={{ marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--color-danger)' }}>✕</span> {ap}
                </li>
              ))}
            </ul>
          </section>

        </div>

        {/* Right Column: Code Editor & Submission Controls */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 220px)' }}>
          
          {/* Editor Header / Format Selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {[
                { id: 'CODE_TS', label: 'TypeScript' },
                { id: 'CODE_JAVA', label: 'Java' },
                { id: 'CODE_PYTHON', label: 'Python' },
                { id: 'TEXT', label: 'Design Doc' },
                { id: 'DIAGRAM_PLANTUML', label: 'PlantUML' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => handleFormatChange(fmt.id as SubmissionFormat)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: selectedFormat === fmt.id ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    background: selectedFormat === fmt.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    color: selectedFormat === fmt.id ? '#a5b4fc' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleResetTemplate}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <RotateCcw size={14} /> Reset Template
            </button>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          {/* Textarea Code Editor */}
          <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', marginBottom: '1.25rem' }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Draft your Low-Level Design solution code or architectural class structure here..."
              style={{
                width: '100%',
                flex: 1,
                padding: '1.25rem',
                background: '#090d16',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#e2e8f0',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                resize: 'none',
                outline: 'none',
                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.4)'
              }}
            />
          </div>

          {/* Footer Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {content.length} characters • {content.split('\n').length} lines
            </div>

            <button
              className="btn btn-primary"
              disabled={isSubmitting || attempt?.status === 'EVALUATING'}
              onClick={handleSubmit}
              style={{ padding: '0.75rem 1.75rem' }}
            >
              {attempt?.status === 'EVALUATING' ? (
                <>Evaluating Design...</>
              ) : (
                <>
                  <Play size={16} /> Submit Solution for Feedback
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
