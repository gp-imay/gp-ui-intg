import type { API, BlockTool, BlockToolData } from '@editorjs/editorjs';

interface CustomParagraphData {
  text: string;
}

interface ToolConstructorOptions {
  data: CustomParagraphData;
  api: API;
  config?: any;
}

export class CustomParagraph implements BlockTool {
  private data: CustomParagraphData;
  private api: API;
  private _element: HTMLElement | null = null;

  static get toolbox() {
    return {
      title: 'Text',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  constructor({ data, api }: ToolConstructorOptions) {
    this.data = {
      text: data.text || ''
    };
    this.api = api;
  }

  render() {
    this._element = document.createElement('div');
    this._element.classList.add('ce-paragraph');
    this._element.contentEditable = 'true';
    this._element.innerHTML = this.data.text;
    
    this._element.addEventListener('input', () => {
      if (this._element) {
        this.data.text = this._element.innerHTML;
      }
    });

    // Set focus if this is a new block
    if (!this.data.text) {
      setTimeout(() => {
        if (this._element) {
          this._element.focus();
        }
      }, 0);
    }

    return this._element;
  }

  save(blockContent: HTMLElement): BlockToolData {
    return {
      text: blockContent.innerHTML
    };
  }
}

interface SceneHeadingData {
  text: string;
}

export class SceneHeading implements BlockTool {
  private data: SceneHeadingData;
  private _input: HTMLInputElement | null = null;

  static get toolbox() {
    return {
      title: 'Scene Heading',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15" xmlns="http://www.w3.org/2000/svg"><path d="M15.383 11.217H1.617C.724 11.217 0 10.493 0 9.6V1.617C0 .724.724 0 1.617 0h13.766c.893 0 1.617.724 1.617 1.617V9.6c0 .893-.724 1.617-1.617 1.617z"/></svg>'
    };
  }

  constructor({ data }: { data: SceneHeadingData }) {
    this.data = {
      text: data.text || ''
    };
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('scene-heading');
    
    this._input = document.createElement('input');
    this._input.classList.add('ce-paragraph');
    this._input.placeholder = 'INT./EXT. LOCATION - TIME';
    this._input.value = this.data.text;
    
    this._input.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.data.text = target.value;
    });
    
    // Set focus if this is a new scene heading
    if (!this.data.text) {
      setTimeout(() => {
        if (this._input) {
          this._input.focus();
        }
      }, 0);
    }
    
    wrapper.appendChild(this._input);
    return wrapper;
  }

  save(blockContent: HTMLElement): BlockToolData {
    const input = blockContent.querySelector('input');
    return {
      text: input?.value || ''
    };
  }
}

export const EDITOR_JS_TOOLS = {
  paragraph: {
    class: CustomParagraph,
    inlineToolbar: true
  },
  sceneHeading: {
    class: SceneHeading,
    inlineToolbar: true
  }
};