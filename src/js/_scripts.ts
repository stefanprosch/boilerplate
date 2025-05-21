export default (async () => {
  // WebP Fallback
  // if (
  //   navigator.userAgent.indexOf('Safari') !== -1 &&
  //   navigator.userAgent.indexOf('Chrome') === -1
  // ) {
  //   const { default: modernImageFormatFallback } = await import(
  //     './scripts/modernImageFormatFallback'
  //   );
  //   modernImageFormatFallback.init('webp');
  // }

  // Avif Fallback
  const avifImage = new Image();
  avifImage.src =
    'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  avifImage.onerror = async () => {
    const { default: modernImageFormatFallback } = await import(
      './scripts/modernImageFormatFallback'
    );
    modernImageFormatFallback.init('avif');
  };

  const { default: globalScrollListener } = await import('./scripts/globalScrollListener');
  globalScrollListener.init();

  const { default: globalResizeListener } = await import('./scripts/globalResizeListener');
  globalResizeListener.init();

  const selector = 'img[loading="lazy"], iframe[loading="lazy"], source[data-srcset]';
  const lazyImageEls = document.querySelectorAll<HTMLElement>(selector);

  let lazyloadReady: Promise<void> = Promise.resolve();

  if (lazyImageEls.length > 0) {
    if ('loading' in HTMLImageElement.prototype) {
      const lazy = await import('./scripts/lazy');
      lazy.init(lazyImageEls, selector);
    } else {
      await import('lazysizes').then((LazySizes) => LazySizes.init());
    }

    lazyloadReady = new Promise<void>((resolve) => {
      const criticalImages = document.querySelectorAll('img[data-critical]');
      if (criticalImages.length === 0) {
        resolve();
        return;
      }

      const promises = Array.from(criticalImages).map((img) => {
        if ((img as HTMLImageElement).complete) {
          return Promise.resolve();
        } else {
          return new Promise((res) => {
            img.addEventListener('load', res, { once: true });
            img.addEventListener('error', res, { once: true });
          });
        }
      });

      Promise.all(promises).then(() => resolve());
    });
  }

  await lazyloadReady;

  const { default: globalAnimationBehavior } = await import('./scripts/globalAnimationBehavior');
  globalAnimationBehavior.init();

  const waypointEls = document.querySelectorAll<HTMLElement>('[waypoint]');
  if (waypointEls.length > 0) {
    const { default: waypointObserver } = await import('./scripts/waypointObserver');
    waypointObserver.init(waypointEls);
  }
})();
