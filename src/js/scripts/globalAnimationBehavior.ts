/**
 * globalAnimationBehavior
 */
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import _throttle from 'lodash-es/throttle';
import { IComponent } from '../@types/IComponent';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger, ScrollSmoother);

interface ICompGlobalAnimationBehavior extends IComponent {
  documentElement: HTMLElement;
  timer: null | ReturnType<typeof setTimeout>;
  lastScrollTop: number;
  scrollTriggered: boolean;
  smoother: null | ScrollSmoother;
  originalSpeeds: Array<string>;
  targets: HTMLElement[];
  getSamePageAnchor(link: string): string | false;
  scrollToHash(hash: string, e: Event | null): void;
  setupLinks(): void;
  setupHeader(): void;
  observeHtmlClass(): void;
  setupScrollSmoother(): void;
  onChange(event: MediaQueryListEvent): void;
  setupGlobalScroll(): void;
  init(): void;
}

const globalAnimationBehavior: ICompGlobalAnimationBehavior = {
  name: 'globalAnimationBehavior',
  documentElement: document.documentElement,
  timer: null,
  smoother: null,
  lastScrollTop: 0,
  scrollTriggered: false,
  originalSpeeds: [],
  targets: [],

  getSamePageAnchor(link: string) {
    try {
      const url = new URL(link);
      if (
        url.protocol !== window.location.protocol ||
        url.host !== window.location.host ||
        url.pathname !== window.location.pathname ||
        url.search !== window.location.search
      ) {
        return false;
      }
      return url.hash;
    } catch {
      return false;
    }
  },

  scrollToHash(hash: string, e: Event | null) {
    const elem = hash ? document.querySelector(hash) : null;
    if (elem) {
      if (e) e.preventDefault();
      gsap.to(window, { scrollTo: elem });
    }
  },

  setupLinks() {
    document.querySelectorAll('a[href*="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const anchor = this.getSamePageAnchor((a as HTMLAnchorElement).href);
        if (anchor !== false) {
          this.scrollToHash(anchor, e);
        }
      });
    });

    if (window.location.hash) {
      window.scrollTo(0, 0);
      setTimeout(() => {
        this.scrollToHash(window.location.hash, new Event('fake'));
      }, 100);
    }

    window.addEventListener('popstate', (e) => {
      const hash = window.location.hash;
      if (hash) {
        this.scrollToHash(hash, e);
      }
    });
  },

  setupHeader() {
    const navigation = document.querySelector('.js-header') as HTMLElement;
    if (!navigation) {
      console.error('Navigation element not found');
      return;
    }

    const sections = gsap.utils.toArray('.js-section.js-primary') as HTMLElement[];

    sections.forEach((section) => {
      const rect = navigation.getBoundingClientRect();
      ScrollTrigger.create({
        trigger: section,
        start: `top ${rect.y + rect.height * 0.25}`,
        end: `bottom ${rect.y + rect.height * 0.75}`,
        scrub: 1,
        toggleClass: { targets: [navigation], className: 'is-onPrimary' },
        markers: false,
      });
    });
  },

  observeHtmlClass() {
    const htmlElement = this.documentElement;
    let previousClassList = [...htmlElement.classList];

    const winScroll = _throttle(() => {
      requestAnimationFrame(() => {
        if (!this.scrollTriggered) {
          this.scrollTriggered = true;
          ScrollTrigger.refresh();
          setTimeout(() => {
            this.scrollTriggered = false;
          }, 500);
        }
      });
    }, 250);

    const classObserver = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const currentClassList = [...htmlElement.classList];
          if (
            !previousClassList.includes('sprig-afterSwap') &&
            currentClassList.includes('sprig-afterSwap')
          ) {
            winScroll();
          }
          previousClassList = currentClassList;
        }
      });
    });

    classObserver.observe(htmlElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  },

  setupScrollSmoother() {
    this.targets = gsap.utils.toArray('[data-speed]') as HTMLElement[];
    this.originalSpeeds = this.targets.map((t) => t.getAttribute('data-speed') || '1');

    this.targets.forEach((t) => {
      t.removeAttribute('data-speed');
    });

    this.smoother = ScrollSmoother.create({
      smooth: 2,
      ignoreMobileResize: true,
      effects: true,
      normalizeScroll: true,
    });

    ScrollTrigger.refresh();

    const mediaQuery = '(max-width: 820px)';
    const mediaQueryList = window.matchMedia(mediaQuery);
    mediaQueryList.addEventListener('change', (e) => this.onChange(e));

    this.onChange({ matches: mediaQueryList.matches } as MediaQueryListEvent);
  },

  onChange(event: MediaQueryListEvent) {
    if (!this.smoother) return;

    this.smoother.effects().forEach((effect) => {
      this.targets.forEach((t) => {
        if (t === effect.trigger) {
          effect.kill();
        }
      });
    });

    if (!event.matches) {
      this.targets.forEach((t, i) => {
        this.smoother!.effects(t, { speed: this.originalSpeeds[i] });
      });
    }
  },

  setupGlobalScroll() {
    this.setupScrollSmoother();
    this.observeHtmlClass();
    ScrollTrigger.refresh();
  },

  init() {
    const onReady = () => {
      console.log('Animation Behaviour Init');
      this.setupGlobalScroll();
      this.setupLinks();
      this.setupHeader();
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      onReady();
    } else {
      document.addEventListener('DOMContentLoaded', onReady);
    }
  },
};

export default globalAnimationBehavior;
