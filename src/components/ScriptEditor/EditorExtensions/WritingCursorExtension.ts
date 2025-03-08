import { Extension } from '@tiptap/core';

export const WritingCursorExtension = Extension.create({
  name: 'writingCursor',

  addOptions() {
    return {
      blinkRate: 530, // milliseconds
      color: '#2563eb',
      width: 2, // pixels
    };
  },

  addStorage() {
    return {
      isBlinking: true,
      lastActivity: Date.now(),
    };
  },

  onCreate() {
    // Start the blinking interval
    this.storage.blinkInterval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - this.storage.lastActivity;
      
      // Only blink cursor if it's been inactive for a short while
      if (timeSinceLastActivity > 500) {
        this.storage.isBlinking = !this.storage.isBlinking;
        this.editor.view.dispatch(this.editor.state.tr);
      } else {
        this.storage.isBlinking = true; // Keep cursor visible during active typing
      }
    }, this.options.blinkRate);
  },

  onDestroy() {
    // Clean up the interval
    if (this.storage.blinkInterval) {
      clearInterval(this.storage.blinkInterval);
    }
  },

  addKeyboardShortcuts() {
    return {
      // Record activity on any key press
      'Backspace': () => {
        this.storage.lastActivity = Date.now();
        this.storage.isBlinking = true;
        return false; // Don't handle the key, just record the activity
      },
      'Enter': () => {
        this.storage.lastActivity = Date.now();
        this.storage.isBlinking = true;
        return false;
      },
      'ArrowUp': () => {
        this.storage.lastActivity = Date.now();
        this.storage.isBlinking = true;
        return false;
      },
      'ArrowDown': () => {
        this.storage.lastActivity = Date.now();
        this.storage.isBlinking = true;
        return false;
      },
      'ArrowLeft': () => {
        this.storage.lastActivity = Date.now();
        this.storage.isBlinking = true;
        return false;
      },
      'ArrowRight': () => {
        this.storage.lastActivity = Date.now();
        this.storage.isBlinking = true;
        return false;
      },
      'Tab': () => {
        this.storage.lastActivity = Date.now();
        this.storage.isBlinking = true;
        return false;
      },
      'Shift-Tab': () => {
        this.storage.lastActivity = Date.now();
        this.storage.isBlinking = true;
        return false;
      }
    };
  },

  // Record activity on mouse events
  addProseMirrorPlugins() {
    const extension = this;
    
    return [
      {
        props: {
          handleClick() {
            extension.storage.lastActivity = Date.now();
            extension.storage.isBlinking = true;
            return false;
          },
          handleDoubleClick() {
            extension.storage.lastActivity = Date.now();
            extension.storage.isBlinking = true;
            return false;
          },
          handleTripleClick() {
            extension.storage.lastActivity = Date.now();
            extension.storage.isBlinking = true;
            return false;
          }
        }
      }
    ];
  }
});