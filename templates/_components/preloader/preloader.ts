/**
 * preloader
 +*/

import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const preloader = {
  name: 'c-preloader',
  body: document.getElementsByTagName('body')[0],
  bar: document.querySelector('.js-preloader'),
  htmlTag: document.getElementsByTagName('html')[0],
  animation: '',
  states: {
    loading: 'is-loading',
    interact: 'is-interactive',
    complete: 'is-complete',
  },
  barstates: {
    loading: 'js-preloader--loading',
    complete: 'js-preloader--complete',
  },

  stateLoading(player: boolean) {
    this.body.classList.add(this.states.loading);

    // Start Preloader Bar
    (this.bar as HTMLDivElement).classList.add(this.barstates.loading);

    const tl = gsap.timeline({
      defaults: {
        duration: 0.25,
        ease: 'power3.in',
        opacity: 0,
      },
    });

    if (player) {
      tl.from(
        '.js-svgPreloader',
        {
          delay: 0.25,
          ease: 'power3.in',
          opacity: 0,
          scale: 0.25,
          onComplete: () => {
            if (document.readyState === 'complete') {
              tl.to(
                '.js-svgPreloader',
                {
                  delay: 0,
                  opacity: 0,
                  onComplete: () => {
                    this.stateComplete();
                  },
                },
                '=0.25',
              );
            }
          },
        },
        '0',
      );
    } else {
      this.stateComplete();
    }
  },

  stateInteractive() {
    this.body.classList.remove(this.states.loading);
    this.body.classList.add(this.states.interact);
  },

  stateComplete() {
    console.log('COMPLETED');

    setTimeout(() => {
      // Change Classes for Preloader Bar
      (this.bar as HTMLDivElement).classList.remove(this.barstates.loading);
      (this.bar as HTMLDivElement).classList.add(this.barstates.complete);
    }, 100);

    setTimeout(() => {
      this.body.classList.remove(this.states.interact);
      this.body.classList.add(this.states.complete);
    }, 100);
  },

  progressLoader(player: boolean) {
    this.stateLoading(player);
    this.stateInteractive();

    console.log('progressLoader: ' + document.readyState);

    /* document.onreadystatechange = () => {
      console.log('ReadyState: ' + document.readyState);
      if (document.readyState === 'complete') {
        this.stateComplete();
      }
    };

    // Check Inital State
    if (document.readyState === 'complete') {
      this.stateComplete();
    } */
  },

  init(preloaderEl: HTMLElement) {
    if (preloaderEl) {
      if (this.htmlTag.classList.contains('template-index')) {
        this.progressLoader(false);
        // this.stateComplete();
      } else {
        this.progressLoader(false);
      }
    }
  },
};

export default preloader;
