import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Wand2 } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { mockApi } from '../../services/mockApi';

interface NewScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScriptCreated?: () => void;
}

export default function NewScriptModal({ isOpen, onClose, onScriptCreated }: NewScriptModalProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [genre, setGenre] = useState('');
  const [story, setStory] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [useAI, setUseAI] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const createButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useClickOutside(modalRef, onClose);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      createButtonRef.current?.focus();
      // Reset form when modal opens
      setTitle('');
      setSubtitle('');
      setGenre('');
      setStory('');
      setError('');
      setSelectedFile(null);
      setFileError('');
      setUseAI(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      await mockApi.createScript({
        title: title.trim(),
        subtitle: subtitle.trim(),
        genre: genre.trim(),
        story: story.trim()
      });

      onScriptCreated?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create script');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  };

  const handleFileSelection = (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!['pdf', 'fdx'].includes(extension || '')) {
      setFileError('This document is not supported, please delete and upload another file.');
      setSelectedFile(file);
      return;
    }

    setSelectedFile(file);
    setFileError('');
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          ref={modalRef}
          className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all"
        >
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-900" id="modal-title">
              New Script
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You can always change this later, feel free to skip any fields
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8">
            <div className="space-y-6">
              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 block w-full rounded-[8px] border border-gray-300 px-4 py-2.5 focus:border-[#4B84F3] focus:outline-none"
                  placeholder="Enter script title"
                />
              </div>

              <div>
                <label
                  htmlFor="subtitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subtitle
                </label>
                <input
                  type="text"
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="mt-2 block w-full rounded-[8px] border border-gray-300 px-4 py-2.5 focus:border-[#4B84F3] focus:outline-none"
                  placeholder="Enter subtitle (optional)"
                />
              </div>

              <div>
                <label
                  htmlFor="genre"
                  className="block text-sm font-medium text-gray-700"
                >
                  Genre
                </label>
                <input
                  type="text"
                  id="genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="mt-2 block w-full rounded-[8px] border border-gray-300 px-4 py-2.5 focus:border-[#4B84F3] focus:outline-none"
                  placeholder="Enter genre"
                />
              </div>

              <div>
                <label
                  htmlFor="story"
                  className="block text-sm font-medium text-gray-700"
                >
                  Story
                </label>
                <textarea
                  id="story"
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  rows={6}
                  className="mt-2 block w-full rounded-[8px] border border-gray-300 px-4 py-2.5 focus:border-[#4B84F3] focus:outline-none"
                  placeholder="Enter your story"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setUseAI(!useAI)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      useAI ? 'bg-[#4B84F3]' : 'bg-gray-200'
                    }`}
                    role="switch"
                    aria-checked={useAI}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        useAI ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <div className="flex items-center space-x-2">
                    <Wand2 className={`h-5 w-5 ${useAI ? 'text-[#4B84F3]' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium text-gray-700">AI Writing Assistant</span>
                  </div>
                </div>
              </div>

              <button
                ref={createButtonRef}
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-[8px] bg-[#4B84F3] px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#3b6cd2] focus:outline-none disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create New Script'}
              </button>

              <div className="relative mt-8 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative">
                  <span className="bg-white px-4 text-sm text-[#2D3748]">
                    Import a script ?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-bold text-[#2D3748]">Import a script</h3>
                <p className="mt-2 text-sm text-[#2D3748]">
                  Please ensure that the screenplay is in the industry-standard format.
                </p>

                <div
                  onClick={handleBrowseClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`mt-4 cursor-pointer rounded-[8px] border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC] px-6 py-8 text-center transition-colors ${
                    isDragging ? 'border-[#4B84F3] bg-blue-50' : ''
                  }`}
                >
                  <Upload className="mx-auto h-12 w-12 text-[#4B84F3]" />
                  <p className="mt-4 text-sm text-[#2D3748]">
                    Drag & drop files or{' '}
                    <span className="font-medium text-[#4B84F3] hover:text-[#3b6cd2]">
                      Browse
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-[#4A5568]">
                    Supported formats: PDF, FDX
                  </p>
                </div>

                {selectedFile && (
                  <div className={`mt-4 flex items-center justify-between rounded-lg border ${fileError ? 'border-red-300 bg-red-50' : 'border-gray-200'} p-3`}>
                    <span className="text-sm text-gray-600">{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFileError('');
                      }}
                      className="ml-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {fileError && (
                  <p className="mt-2 text-sm text-red-600">{fileError}</p>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.fdx"
                  className="hidden"
                  onChange={(e) => handleFileSelection(Array.from(e.target.files || []))}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}