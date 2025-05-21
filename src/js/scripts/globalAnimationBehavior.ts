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
  getSamePageAnchor(link: string): string | false;
  scrollToHash(hash: string, e: Event): void;
  setupLinks(): void;
  setupHeader(): void;
  observeHtmlClass(): void;
  setupScrollSmoother(): void;
  setupGlobalScroll(): void;
  init(): void;
}

const globalAnimatioBehavior: ICompGlobalAnimationBehavior = {
  name: 'globalAnimatioBehavior',
  documentElement: document.documentElement,
  timer: null,
  smoother: null,
  lastScrollTop: 0,
  scrollTriggered: false,

  getSamePageAnchor(link: string): string | false {
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
    } catch (error) {
      return false;
    }
  },

  scrollToHash(hash: string, e: Event | null): void {
    const elem = hash ? document.querySelector(hash) : false;
    if (elem) {
      if (e) e.preventDefault();
      gsap.to(window, { scrollTo: elem });
    }
  },

  setupLinks() {
    // If a link's href is within the current page, scroll to it instead
    document.querySelectorAll('a[href*="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const anchor = this.getSamePageAnchor(a.toString());
        if (anchor !== false) {
          this.scrollToHash(anchor, e);
        }
      });
    });

    // Scroll to the element in the URL's hash on load
    // this.scrollToHash(window.location.hash);
    if (window.location.hash) {
      window.scrollTo(0, 0);
      setTimeout(() => {
        const fakeEvent = new Event('fake');
        this.scrollToHash(window.location.hash, fakeEvent);
      }, 500);
    }

    window.addEventListener('popstate', (e) => {
      const hash = window.location.hash;
      if (hash) {
        this.scrollToHash(hash, e);
      }
    });
  },

  setupHeader() {
    const navigation: HTMLElement = document.querySelector('.js-header') as HTMLElement;
    if (!navigation) {
      console.error('Navigation element not found');
      return;
    }

    const sections: Array<HTMLElement> = gsap.utils.toArray(
      '.js-section.js-primary',
    ) as Array<HTMLElement>;

    sections.forEach((section) => {
      const rect = navigation.getBoundingClientRect();
      ScrollTrigger.create({
        trigger: section,
        start: `top ${rect.y + rect.height * 0.25}`,
        end: `bottom ${rect.y + rect.height * 0.75}`,
        scrub: 1,
        toggleClass: {
          targets: [navigation],
          className: 'is-onPrimary',
        },
        markers: false,
      });
    });

    const showAnim = gsap
      .from(navigation, {
        yPercent: -100,
        paused: true,
        duration: 0.2,
      })
      .progress(1);

    ScrollTrigger.create({
      start: 'top top',
      end: 99999,
      onUpdate: (self) => {
        self.direction === -1 ? showAnim.play() : showAnim.reverse();
      },
    });
  },

  observeHtmlClass() {
    const htmlElement = document.documentElement; // Das <html> Element
    let previousClassList = [...htmlElement.classList];

    // Funktion, die winScroll auslöst
    const winScroll = _throttle(() => {
      requestAnimationFrame(() => {
        if (!this.scrollTriggered) {
          this.scrollTriggered = true; // Flag setzen, um mehrfaches Auslösen zu verhindern
          console.log('winScroll ausgelöst');
          this.setupScrollSmoother(); // Smooth Scroller wird neu eingerichtet
          // Nach 1 Sekunde das Flag zurücksetzen, um spätere Änderungen zuzulassen
          setTimeout(() => {
            this.scrollTriggered = false;
          }, 1000); // Kleine Verzögerung, um Flackern zu verhindern
        }
      });
    }, 250);

    // Überprüft, ob es Elemente mit der Klasse "js-observer" gibt
    function checkForObserverElements() {
      const observerElements = document.querySelectorAll('.js-observer');
      return observerElements.length > 0;
    }

    // MutationObserver-Callback, der auf Klassenänderungen reagiert
    const classObserver = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const currentClassList = [...htmlElement.classList];
          // Überprüfen, ob die Klasse "sprig-afterSwap" neu hinzugefügt wurde
          if (
            !previousClassList.includes('sprig-afterSwap') &&
            currentClassList.includes('sprig-afterSwap') &&
            checkForObserverElements()
          ) {
            winScroll(); // winScroll-Funktion nur auslösen, wenn js-observer-Elemente vorhanden sind
          }
          // Aktualisiere den vorherigen Zustand der Klassen
          previousClassList = currentClassList;
        }
      });
    });

    // Observer-Konfiguration für das HTML-Element (Klassenänderungen überwachen)
    classObserver.observe(htmlElement, {
      attributes: true, // Nur Attributänderungen überwachen
      attributeFilter: ['class'], // Nur Änderungen der "class"-Attribute
    });
  },

  setupScrollSmoother() {
    this.smoother = ScrollSmoother.create({
      smooth: 1,
      ignoreMobileResize: true,
      effects: true,
    });
    ScrollTrigger.refresh();
  },

  setupGlobalScroll() {
    // create the smooth scroller FIRST!
    this.setupScrollSmoother();
    this.observeHtmlClass(); // Überwache die Klasse "sprig-afterSwap"

    // Refresh
    setTimeout(ScrollTrigger.refresh, 1000);
  },

  init() {
    document.onreadystatechange = () => {
      console.log('Animation Behaviour ReadyState: ' + document.readyState);
      if (document.readyState === 'complete') {
        this.setupGlobalScroll();
        this.setupLinks();
        this.setupHeader();
      }
    };

    if (document.readyState === 'complete') {
      this.setupGlobalScroll();
      this.setupLinks();
      this.setupHeader();
    }
  },
};

export default globalAnimatioBehavior;
