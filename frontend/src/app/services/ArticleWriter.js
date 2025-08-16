'use client';

import { useState } from 'react';
import { Send, FileText, Sparkles, Loader2 } from 'lucide-react';

export default function AIArticleWriter() {
  const [prompt, setPrompt] = useState('');
  const [article, setArticle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      // Replace with your actual FastAPI endpoint
      const response = await fetch('http://127.0.0.1:8000/api/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      setArticle(data.article || 'Article generated successfully!');
    } catch (error) {
      console.error('Error generating article:', error);
      setArticle('Error generating article. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        color: 'white'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <Sparkles size={32} />
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            margin: '0',
            background: 'linear-gradient(45deg, #ffffff, #f0f9ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            AI Article Writer
          </h1>
        </div>
        <p style={{
          fontSize: '1.2rem',
          opacity: '0.9',
          margin: '0',
          fontWeight: '300'
        }}>
          Transform your ideas into compelling articles with AI
        </p>
      </div>

      {/* Main Container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '30px'
      }}>
        {/* Input Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <FileText size={24} style={{ color: '#667eea' }} />
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              margin: '0',
              color: '#1f2937'
            }}>
              What would you like to write about?
            </h2>
          </div>
          
          <div style={{ width: '100%' }}>
            <div style={{
              position: 'relative',
              marginBottom: '20px'
            }}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your article topic or idea... (example: Artificial Intelligence)"
                disabled={isLoading}
                style={{
                  color: '#1f2937',
                  width: '100%',
                  minHeight: '120px',
                  padding: '20px 60px 20px 20px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit',
                  background: 'white',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              
              <button
                onClick={handleSubmit}
                disabled={isLoading || !prompt.trim()}
                style={{
                  position: 'absolute',
                  right: '12px',
                  bottom: '12px',
                  width: '44px',
                  height: '44px',
                  border: 'none',
                  borderRadius: '12px',
                  background: isLoading || !prompt.trim() ? '#9ca3af' : 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  cursor: isLoading || !prompt.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  transform: isLoading ? 'scale(0.95)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && prompt.trim()) {
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {isLoading ? (
                  <Loader2 size={20} style={{ 
                    animation: 'spin 1s linear infinite' 
                  }} />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981'
              }}></div>
              Press Enter to generate or click the send button
            </div>
          </div>
        </div>

        {/* Article Display Section */}
        {(article || isLoading) && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animation: isLoading ? 'none' : 'fadeIn 0.5s ease-out'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '2px solid #f3f4f6'
            }}>
              <FileText size={24} style={{ color: '#667eea' }} />
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                margin: '0',
                color: '#1f2937'
              }}>
                Generated Article
              </h2>
              {isLoading && (
                <Loader2 size={20} style={{ 
                  color: '#667eea',
                  animation: 'spin 1s linear infinite',
                  marginLeft: 'auto'
                }} />
              )}
            </div>
            
            {isLoading ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{
                    height: '20px',
                    background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
                    backgroundSize: '200% 100%',
                    borderRadius: '4px',
                    animation: 'shimmer 1.5s infinite',
                    width: i === 4 ? '60%' : '100%'
                  }}></div>
                ))}
              </div>
            ) : (
              <div style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: '#374151',
                whiteSpace: 'pre-wrap',
                fontFamily: 'Georgia, serif'
              }}>
                {article}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inline animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `
      }} />
    </div>
  );
}