/**
 * sliderContent
 */
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import _throttle from 'lodash-es/throttle';
import { IComponent } from '../../../src/js/@types/IComponent';

gsap.registerPlugin(ScrollTrigger);

interface ICompSliderContent extends IComponent {
  documentElement: HTMLElement;
  timer: null | ReturnType<typeof setTimeout>;
  init(sliders: NodeListOf<HTMLElement>): void;
}

const sliderContent: ICompSliderContent = {
  name: 'sliderContent',
  documentElement: document.documentElement,
  timer: null,
  init(sliders: NodeListOf<HTMLElement>) {
    if (ScrollTrigger.isTouch !== 1) {
      sliders.forEach((slider) => {
        const blocks = slider.querySelectorAll('.js-sliderBlock') as NodeListOf<HTMLElement>;

        blocks.forEach((block: HTMLElement, index: number) => {
          const sliderBlock = block as HTMLElement;
          const sliderContent = sliderBlock.querySelector(
            '.js-sliderContentWrapper',
          ) as HTMLElement;
          const sliderTitle = sliderBlock.querySelector('.js-sliderTitle') as HTMLElement;
          const sliderDescription = sliderBlock.querySelector(
            '.js-sliderDescription',
          ) as HTMLElement;

          // Set initial opacity for content to 0 (hidden)
          gsap.set(sliderContent, { opacity: 0, yPercent: -50 });
          gsap.set(sliderTitle, { x: 50, opacity: 0 });
          gsap.set(sliderDescription, { x: 50, opacity: 0 });

          ScrollTrigger.create({
            trigger: block,
            start: 'top center',
            end: index === blocks.length - 1 ? 'bottom center+=25%' : 'bottom center',
            pin: sliderContent,
            pinSpacing: false,
            scrub: true,
            markers: false,
            onEnter: () => {
              // Fade in and animate title and description
              gsap.set(sliderContent, { opacity: 1 });
              const tl = gsap.timeline();
              tl.to(sliderTitle, {
                x: 0,
                opacity: 1,
                duration: 0.5,
                ease: 'power1.out',
              }) // Title comes from right to left
                .to(
                  sliderDescription,
                  { x: 0, opacity: 1, duration: 0.5, ease: 'power1.out' },
                  '<',
                ); // Description comes from right to left at the same time
            },
            onLeave: () => {
              if (index !== blocks.length - 1) {
                // Fade out content instantly (title and description) only for non-last blocks
                gsap.set(sliderContent, { opacity: 0 });
                gsap.set(sliderTitle, { opacity: 0, x: 50 }); // Move title back to the right and hide
                gsap.set(sliderDescription, { opacity: 0, x: 50 });
              }
            },
            onEnterBack: () => {
              // Fade in and animate title and description when scrolling back
              gsap.set(sliderContent, { opacity: 1 });
              const tl = gsap.timeline();
              tl.to(sliderTitle, {
                x: 0,
                opacity: 1,
                duration: 0.5,
                ease: 'power1.out',
              }) // Title comes from right to left
                .to(
                  sliderDescription,
                  { x: 0, opacity: 1, duration: 0.5, ease: 'power1.out' },
                  '<',
                ); // Description comes from right to left at the same time
            },
            onLeaveBack: () => {
              // Fade out content instantly (title and description)
              gsap.set(sliderContent, { opacity: 0 });
              gsap.set(sliderTitle, { opacity: 0, x: 50 }); // Move title back to the right and hide
              gsap.set(sliderDescription, { opacity: 0, x: 50 }); // Move description back to the right and hide
            },
          });
        });
      });

      // Refresh
      const winScroll = _throttle(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }, 1000);

      const winResize = _throttle(() => {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 250);
      }, 250);

      window.addEventListener('resize', winScroll);
      window.addEventListener('resize', winResize);
    }
  },
};

export default sliderContent;
