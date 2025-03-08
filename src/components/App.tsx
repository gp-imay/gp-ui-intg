import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ScriptElement } from './components/ScriptElement';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { TitlePageModal } from './components/TitlePageModal';
import { SettingsModal } from './components/Settings';
import { ViewMode, SidebarTab, TitlePage, ElementType, ScriptElement as ScriptElementType, getNextElementType, Comment, FormatSettings, DEFAULT_FORMAT_SETTINGS, SceneSuggestions, DEFAULT_SUGGESTIONS, UserProfile, DEFAULT_USER_PROFILES } from './types/screenplay';

function App() {
  const [title, setTitle] = useState('Untitled Screenplay');
  const [elements, setElements] = useState<ScriptElementType[]>([
    { id: '1', type: 'scene-heading', content: '' }
  ]);
  const [selectedElement, setSelectedElement] = useState('1');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [hasOpenedAIAssistant, setHasOpenedAIAssistant] = useState(false);
  const [pages, setPages] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('script');
  const [showTitlePageModal, setShowTitlePageModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [titlePage, setTitlePage] = useState<TitlePage>({
    title: 'Untitled Screenplay',
    author: '',
    contact: '',
    date: new Date().toLocaleDateString(),
    draft: '1st Draft',
    copyright: `Copyright © ${new Date().getFullYear()}`,
    coverImage: ''
  });
  const [formatSettings, setFormatSettings] = useState<FormatSettings>(DEFAULT_FORMAT_SETTINGS);
  const [suggestions, setSuggestions] = useState<SceneSuggestions>(DEFAULT_SUGGESTIONS);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>(DEFAULT_USER_PROFILES);
  const [activeProfile, setActiveProfile] = useState<string>('user1');
  const [activeTab, setActiveTab] = useState<SidebarTab>('inputs');
  const [hasCompletedFirstScene, setHasCompletedFirstScene] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [suggestionsEnabled, setSuggestionsEnabled] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const elementRefs = useRef<{ [key: string]: React.RefObject<any> }>({});

  const getSceneText = (content: string) => {
    return content
      .replace(/<[^>]+>/g, '')
      .replace(/&[^;]+;/g, match => {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = match;
        return textarea.value;
      })
      .trim();
  };

  const createNewElement = (type: ElementType, afterId: string) => {
    const newElement: ScriptElementType = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: ''
    };

    setElements(prev => {
      const index = prev.findIndex(el => el.id === afterId);
      const newElements = [...prev];
      newElements.splice(index + 1, 0, newElement);
      return newElements;
    });

    return newElement.id;
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent, id: string, splitData?: { beforeContent: string; afterContent: string }) => {
    const currentElement = elements.find(el => el.id === id);
    if (!currentElement) return;

    const currentIndex = elements.findIndex(el => el.id === id);

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const targetIndex = e.key === 'ArrowUp' ? currentIndex - 1 : currentIndex + 1;
      
      if (targetIndex >= 0 && targetIndex < elements.length) {
        setSelectedElement(elements[targetIndex].id);
      }
      return;
    }

    if (e.key === 'Backspace' && currentIndex > 0) {
      if (currentElement.content === '') {
        e.preventDefault();
        const previousElement = elements[currentIndex - 1];
        const updatedElements = elements.filter(el => el.id !== id);
        
        if (currentElement.content) {
          updatedElements[currentIndex - 1] = {
            ...previousElement,
            content: previousElement.content + ' ' + currentElement.content
          };
        }
        
        setElements(updatedElements);
        setSelectedElement(previousElement.id);
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const nextType = getNextElementType(currentElement.type);
      const newId = createNewElement(nextType, id);
      setSelectedElement(newId);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      
      if (currentElement.type === 'scene-heading' && 
          currentElement.content.trim() !== '' && 
          !hasCompletedFirstScene) {
        setHasCompletedFirstScene(true);
        setActiveTab('scenes');
      }
      
      if (splitData) {
        const updatedElements = [...elements];
        updatedElements[currentIndex] = {
          ...currentElement,
          content: splitData.beforeContent.trim()
        };
        
        const nextType = currentElement.type === 'action' ? 'action' : getNextElementType(currentElement.type);
        
        const newElement: ScriptElementType = {
          id: Math.random().toString(36).substr(2, 9),
          type: nextType,
          content: splitData.afterContent.trim()
        };
        
        updatedElements.splice(currentIndex + 1, 0, newElement);
        setElements(updatedElements);
        setSelectedElement(newElement.id);
      } else {
        const nextType = currentElement.type === 'action' ? 'action' : getNextElementType(currentElement.type);
        const newId = createNewElement(nextType, id);
        setSelectedElement(newId);
      }
    }
  }, [elements, hasCompletedFirstScene]);

  const handleElementChange = (id: string, content: string) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, content } : el
    ));
  };

  const handleTypeChange = (id: string, type: ElementType) => {
    setElements(prev => prev.map(el =>
      el.id === id ? { ...el, type } : el
    ));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    setActiveCommentId(null);
  };

  const handleAddComment = (comment: Comment) => {
    setComments(prev => [...prev, comment]);
    setActiveCommentId(comment.id);
  };

  const handleCommentClick = (comment: Comment) => {
    // Find the element that contains this comment
    const elementId = elements.find(el => {
      const elementRef = elementRefs.current[el.id];
      return elementRef?.current?.containsCommentRange?.(comment.from, comment.to);
    })?.id;

    if (elementId) {
      setSelectedElement(elementId);
      setActiveCommentId(comment.id);
      const elementRef = elementRefs.current[elementId];
      elementRef.current?.focusCommentRange?.(comment.from, comment.to);
    }
  };

  const formatFountainContent = () => {
    const titlePageContent = `Title: ${titlePage.title}
Author: ${titlePage.author}
Contact: ${titlePage.contact}
Date: ${titlePage.date}
Draft: ${titlePage.draft}
Copyright: ${titlePage.copyright}

===

`;

    const content = elements.map(el => {
      switch (el.type) {
        case 'scene-heading':
          return `${el.content.toUpperCase()}\n\n`;
        case 'action':
          return `${el.content}\n\n`;
        case 'character':
          return `${el.content.toUpperCase()}\n`;
        case 'parenthetical':
          return `(${el.content.replace(/^\(|\)$/g, '')})\n`;
        case 'dialogue':
          return `${el.content}\n\n`;
        case 'transition':
          return `> ${el.content.toUpperCase()}${!el.content.endsWith(':') ? ':' : ''}\n\n`;
        default:
          return `${el.content}\n\n`;
      }
    }).join('');

    return titlePageContent + content;
  };

  const handleExport = () => {
    const content = formatFountainContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.fountain`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAIAssistClick = () => {
    if (!hasOpenedAIAssistant) {
      setIsRightSidebarOpen(true);
      setHasOpenedAIAssistant(true);
    }
  };

  // Apply format settings to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Set CSS variables for each element type
    Object.entries(formatSettings.elements).forEach(([type, format]) => {
      root.style.setProperty(`--${type}-alignment`, format.alignment);
      root.style.setProperty(`--${type}-width`, `${format.width}in`);
      root.style.setProperty(`--${type}-spacing-before`, `${format.spacingBefore}rem`);
      root.style.setProperty(`--${type}-spacing-after`, `${format.spacingAfter}rem`);
    });
    
    // Set page layout variables
    root.style.setProperty('--page-width', `${formatSettings.pageLayout.width}in`);
    root.style.setProperty('--page-height', `${formatSettings.pageLayout.height}in`);
    root.style.setProperty('--page-margin-top', `${formatSettings.pageLayout.marginTop}in`);
    root.style.setProperty('--page-margin-right', `${formatSettings.pageLayout.marginRight}in`);
    root.style.setProperty('--page-margin-bottom', `${formatSettings.pageLayout.marginBottom}in`);
    root.style.setProperty('--page-margin-left', `${formatSettings.pageLayout.marginLeft}in`);
  }, [formatSettings]);

  useEffect(() => {
    const calculatePages = () => {
      if (!contentRef.current) return;

      // Use the page height from settings
      const pageHeight = formatSettings.pageLayout.height * 72; // Convert inches to points
      const pageBreaks: number[] = [];
      let currentHeight = 0;
      let currentPage = 1;

      const elements = contentRef.current.children;
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLElement;
        const elementHeight = element.offsetHeight;
        
        if (currentHeight + elementHeight > pageHeight) {
          pageBreaks.push(i);
          currentHeight = elementHeight;
          currentPage++;
        } else {
          currentHeight += elementHeight;
        }
      }

      setPages(pageBreaks);
    };

    calculatePages();

    const resizeObserver = new ResizeObserver(calculatePages);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [elements, formatSettings]);

  // Initialize refs for each element
  useEffect(() => {
    elements.forEach(element => {
      if (!elementRefs.current[element.id]) {
        elementRefs.current[element.id] = React.createRef();
      }
    });
  }, [elements]);

  // Load user profile when activeProfile changes
  useEffect(() => {
    const profile = userProfiles.find(p => p.id === activeProfile);
    if (profile) {
      setFormatSettings(profile.preferences.formatSettings);
    }
  }, [activeProfile, userProfiles]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      <Header
        title={title}
        viewMode={viewMode}
        setViewMode={setViewMode}
        setShowTitlePageModal={setShowTitlePageModal}
        handleExport={handleExport}
        openSettings={() => setShowSettingsModal(true)}
        userProfiles={userProfiles}
        activeProfile={activeProfile}
        setActiveProfile={setActiveProfile}
        suggestionsEnabled={suggestionsEnabled}
        setSuggestionsEnabled={setSuggestionsEnabled}
      />

      <div className="flex-1 flex overflow-hidden">
        {!isLeftSidebarOpen && (
          <div className="absolute left-0 top-0 w-8 h-full z-20 flex items-center">
            <button
              onClick={() => setIsLeftSidebarOpen(true)}
              className="absolute left-2 text-gray-400 p-2 rounded-full transition-all duration-200 hover:bg-white hover:shadow-lg hover:text-gray-600"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        <LeftSidebar
          isOpen={isLeftSidebarOpen}
          setIsOpen={setIsLeftSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          elements={elements}
          getSceneText={getSceneText}
          totalWords={elements.reduce((count, el) => 
            count + (el.content.trim() ? el.content.trim().split(/\s+/).length : 0), 0
          )}
          totalPages={pages.length + 1}
          comments={comments}
          onDeleteComment={handleDeleteComment}
          onCommentClick={handleCommentClick}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="screenplay-container py-8" style={{
            width: `var(--page-width, ${formatSettings.pageLayout.width}in)`,
          }}>
            <div ref={contentRef} className="screenplay-content" style={{
              padding: `var(--page-margin-top, ${formatSettings.pageLayout.marginTop}in) var(--page-margin-right, ${formatSettings.pageLayout.marginRight}in) var(--page-margin-bottom, ${formatSettings.pageLayout.marginBottom}in) var(--page-margin-left, ${formatSettings.pageLayout.marginLeft}in)`,
              minHeight: `var(--page-height, ${formatSettings.pageLayout.height}in)`
            }}>
              {elements.map((element, index) => (
                <div 
                  key={element.id} 
                  className="element-wrapper"
                  data-type={element.type}
                  style={{
                    textAlign: formatSettings.elements[element.type].alignment,
                    marginTop: `var(--${element.type}-spacing-before, ${formatSettings.elements[element.type].spacingBefore}rem)`,
                    marginBottom: `var(--${element.type}-spacing-after, ${formatSettings.elements[element.type].spacingAfter}rem)`
                  }}
                >
                  {pages.includes(index) && (
                    <div className="page-break">
                      <div className="page-number">Page {pages.findIndex(p => p === index) + 2}</div>
                    </div>
                  )}
                  <ScriptElement
                    ref={elementRefs.current[element.id]}
                    {...element}
                    isSelected={selectedElement === element.id}
                    onChange={handleElementChange}
                    onKeyDown={handleKeyDown}
                    onFocus={setSelectedElement}
                    onTypeChange={handleTypeChange}
                    autoFocus={element.id === elements[elements.length - 1].id}
                    onAIAssistClick={handleAIAssistClick}
                    elements={elements}
                    onAddComment={handleAddComment}
                    activeCommentId={activeCommentId}
                    comments={comments.filter(c => 
                      // Only pass comments that belong to this element
                      elementRefs.current[element.id]?.current?.containsCommentRange?.(c.from, c.to)
                    )}
                    formatSettings={formatSettings.elements[element.type]}
                    suggestions={suggestionsEnabled ? suggestions : undefined}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {!isRightSidebarOpen && (
          <div className="absolute right-0 top-0 w-8 h-full z-20 flex items-center">
            <button
              onClick={() => setIsRightSidebarOpen(true)}
              className="absolute right-2 text-gray-400 p-2 rounded-full transition-all duration-200 hover:bg-white hover:shadow-lg hover:text-gray-600"
            >
              <div className="relative">
                <ChevronLeft className="h-5 w-5" />
                <div className="ai-icon-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-75">
                  <div className="ai-icon-pulse"></div>
                  <Sparkles className="ai-icon-sparkle text-blue-500" />
                </div>
              </div>
            </button>
          </div>
        )}

        <RightSidebar
          isOpen={isRightSidebarOpen}
          setIsOpen={setIsRightSidebarOpen}
        />
      </div>

      <TitlePageModal
        show={showTitlePageModal}
        onClose={() => setShowTitlePageModal(false)}
        titlePage={titlePage}
        setTitlePage={setTitlePage}
        setTitle={setTitle}
      />

      <SettingsModal
        show={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={formatSettings}
        setSettings={setFormatSettings}
        suggestions={suggestions}
        setSuggestions={setSuggestions}
        userProfiles={userProfiles}
        setUserProfiles={setUserProfiles}
        activeProfile={activeProfile}
        setActiveProfile={setActiveProfile}
        suggestionsEnabled={suggestionsEnabled}
        setSuggestionsEnabled={setSuggestionsEnabled}
      />
    </div>
  );
}

export default App;