'use strict';

// eslint-disable-next-line no-unused-vars
class ScrollbarsAutoHideAndShower {
  static pseudElementId = '-webkit-scrollbar-thumb';

  constructor({
    elementId,
    showPeriod = 500,
    fadeInMS = 200,
    fadeOutMS = 400,
    showOnEnter = false,
    scrollbars: { colorRGB: scrollbarsColorRGB = '0, 0, 0', width: scrollbarsWidth = '5px', height: scrollbarsHeight = '5px', radius: scrollbarsBorderRadius = '5px' } = {}
  }) {
    this.elementId = elementId;
    this.element = document.getElementById(elementId);
    this.showPeriod = showPeriod;
    this.fadeInMS = fadeInMS;
    this.fadeOutMS = fadeOutMS;
    this.showOnEnter = showOnEnter;
    this.scrollbarsColorRGB = scrollbarsColorRGB;
    this.scrollbarsWidth = scrollbarsWidth;
    this.scrollbarsHeight = scrollbarsHeight;
    this.scrollbarsBorderRadius = scrollbarsBorderRadius;

    this.rule = this.__createCSSRules();

    this.taskIdCounter = 0;
    this.percent = 0;
    this.timeout = null;
    this.fadeInInProgress = false;
  }

  __createCSSRules() {
    const sheet = document.styleSheets[0];
    this.__addStaticScrollbarsCSSRules(sheet);
    const ruleIdx = sheet.insertRule(`#${this.elementId}::${ScrollbarsAutoHideAndShower.pseudElementId} {}`, sheet.cssRules.length);
    return sheet.cssRules[ruleIdx];
  }

  /** @param {CSSStyleSheet} sheet */
  __addStaticScrollbarsCSSRules(sheet) {
    sheet.insertRule(
      `
      #${this.elementId} {
        overflow: auto;
      }
    `,
      sheet.cssRules.length
    );
    sheet.insertRule(
      `
      #${this.elementId}::-webkit-scrollbar {
        background: transparent;
        width: ${this.scrollbarsWidth};
        height: ${this.scrollbarsHeight};
      }
    `,
      sheet.cssRules.length
    );
    sheet.insertRule(
      `
      #${this.elementId}::-webkit-scrollbar-corner {
        background: transparent;
      }
    `,
      sheet.cssRules.length
    );
    sheet.insertRule(
      `
      #${this.elementId}::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: ${this.scrollbarsBorderRadius};
      }
    `,
      sheet.cssRules.length
    );
  }

  autoHideAndShowScrollbars() {
    this.__attachEvents();
  }

  __showScrollbars() {
    const taskId = ++this.taskIdCounter;

    if (!this.fadeInInProgress && this.percent < 1) {
      this.fadeInInProgress = true;
      const startMS = Date.now();
      this.__fadeIn(startMS);
    }

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      const startMS = Date.now();
      this.__fadeOut(startMS, taskId);
    }, this.showPeriod);
  }

  __fadeIn(startMS) {
    requestAnimationFrame(() => {
      this.percent = (Date.now() - startMS) / this.fadeInMS;
      if (this.percent >= 1) {
        this.percent = 1;
      }
      this.__attachStyleByPercent();
      if (this.percent < 1) {
        this.__fadeIn(startMS);
      } else {
        this.fadeInInProgress = false;
      }
    });
  }

  __fadeOut(startMS, taskId) {
    requestAnimationFrame(() => {
      this.percent = 1 - (Date.now() - startMS) / this.fadeOutMS;
      if (this.percent <= 0) {
        this.percent = 0;
      }
      this.__attachStyleByPercent();
      if (this.percent > 0 && taskId === this.taskIdCounter) {
        this.__fadeOut(startMS, taskId);
      }
    });
  }

  __attachEvents() {
    this.element.addEventListener('scroll', () => this.__showScrollbars());
    if (this.showOnEnter) {
      this.element.addEventListener('mouseenter', () => this.__showScrollbars());
    }
  }

  __attachStyleByPercent() {
    const obj = this.__getStyle(this.percent);
    Object.assign(this.rule.style, obj);
  }

  __getStyle(percent) {
    const background = `rgba(${this.scrollbarsColorRGB}, ${percent})`;
    return {
      background,
      border: `1px solid ${background}`
    };
  }
}
