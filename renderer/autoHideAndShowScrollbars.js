'use strict';

// eslint-disable-next-line no-unused-vars
class ScrollbarsAutoHideAndShower {
  static scrollbarsContainerPseudElementId = '-webkit-scrollbar';
  static cornerPseudElementId = '-webkit-scrollbar-corner';
  static scrollbarsPseudElementId = '-webkit-scrollbar-thumb';

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

    this.dynamicRule = this.__createCSSRules();

    this.taskIdCounter = 0;
    this.scrollbarsOpacity = 0;
    this.timeout = null;
    this.isFadingIn = false;
  }

  __createCSSRules() {
    const sheet = document.styleSheets[0];
    this.__addStaticScrollbarsCSSRules(sheet);
    const dynamicRule = this.addDynamicRule(sheet);
    return dynamicRule;
  }

  /** @param {CSSStyleSheet} sheet */
  addDynamicRule(sheet) {
    const ruleIdx = sheet.insertRule(`#${this.elementId}::${ScrollbarsAutoHideAndShower.scrollbarsPseudElementId} {}`, sheet.cssRules.length);
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
      #${this.elementId}::${ScrollbarsAutoHideAndShower.scrollbarsContainerPseudElementId} {
        background: transparent;
        width: ${this.scrollbarsWidth};
        height: ${this.scrollbarsHeight};
      }
    `,
      sheet.cssRules.length
    );
    sheet.insertRule(
      `
      #${this.elementId}::${ScrollbarsAutoHideAndShower.cornerPseudElementId} {
        background: transparent;
      }
    `,
      sheet.cssRules.length
    );
    sheet.insertRule(
      `
      #${this.elementId}::${ScrollbarsAutoHideAndShower.scrollbarsPseudElementId} {
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

    if (!this.isFadingIn && this.scrollbarsOpacity < 1) {
      this.isFadingIn = true;
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
      const msSinceStartedFadeIn = Date.now() - startMS;
      const fadeInProgress = msSinceStartedFadeIn / this.fadeInMS;
      this.scrollbarsOpacity = fadeInProgress;
      const completed = this.scrollbarsOpacity >= 1;
      if (completed) {
        this.scrollbarsOpacity = 1;
        this.isFadingIn = false;
      }
      this.__attachStyleByPercent();
      if (!completed) {
        this.__fadeIn(startMS);
      }
    });
  }

  __fadeOut(startMS, taskId) {
    requestAnimationFrame(() => {
      const msSinceStartedFadeOut = Date.now() - startMS;
      const fadeOutProgress = msSinceStartedFadeOut / this.fadeOutMS;
      this.scrollbarsOpacity = 1 - fadeOutProgress;
      const completed = this.scrollbarsOpacity <= 0;
      if (completed) {
        this.scrollbarsOpacity = 0;
      }
      this.__attachStyleByPercent();
      const isLatestFadeOutTask = taskId === this.taskIdCounter;
      if (!completed && isLatestFadeOutTask) {
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
    const obj = this.__getStyle(this.scrollbarsOpacity);
    Object.assign(this.dynamicRule.style, obj);
  }

  __getStyle(opacity) {
    const background = `rgba(${this.scrollbarsColorRGB}, ${opacity})`;
    return {
      background,
      border: `1px solid ${background}`
    };
  }
}
