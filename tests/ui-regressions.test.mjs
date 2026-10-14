import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import ts from 'typescript';

// Run the real source with deterministic effect, timer and layout hosts.
const requireModule = createRequire(import.meta.url);

function load(file, mocks, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    require: name => mocks[name] ?? requireModule(name),
    ...globals,
  });
  return exports;
}

async function checkBoot() {
  let effect;
  let nextTimer = 0;
  let stopped = false;
  let motion = 'full';
  const timers = new Map();
  const updates = [];
  const react = {
    useState: initial => [initial, value => updates.push(value)],
    useEffect: callback => { effect = callback; },
  };
  const setTimeout = callback => { timers.set(++nextTimer, callback); return nextTimer; };
  const clearTimeout = id => timers.delete(id);
  const animate = (_from, _to, options) => {
    stopped = false;
    const progress = new Promise(resolve => setTimeout(() => {
      if (!stopped) options.onUpdate(100);
      resolve();
    }));
    progress.stop = () => { stopped = true; };
    return progress;
  };
  const hook = load('app/(web)/boot/_hooks/use-boot-sequence.ts', {
    react,
    'framer-motion': { animate },
    '@/app/shared/settings/use-setting': { useSetting: () => ({ value: motion }) },
    '../_constants/boot-config': { BOOT_STEPS: ['0', '1', '2', '3', '4', '5'] },
  }, { setTimeout, clearTimeout });
  const tick = async () => {
    const callbacks = [...timers.values()];
    timers.clear();
    callbacks.forEach(callback => callback());
    await Promise.resolve();
    await Promise.resolve();
  };
  hook.useBootSequence();
  const cleanup = effect();
  assert.equal(typeof cleanup, 'function', 'Boot must clean up timers on unmount');
  cleanup();
  await tick();
  assert.equal(updates.length, 0, 'A cancelled boot must never update state');
  assert.equal(timers.size, 0, 'A cancelled boot must leave no timers');

  hook.useBootSequence();
  const cleanupDuringAnimation = effect();
  await tick();
  await tick();
  const count = updates.length;
  cleanupDuringAnimation();
  await tick();
  assert.ok(stopped, 'An in-flight boot animation must stop');
  assert.equal(updates.length, count, 'Animation cleanup must prevent later state updates');

  hook.useBootSequence();
  const cleanupCompleted = effect();
  for (let i = 0; i < 6; i++) await tick();
  assert.equal(updates.at(-1), true, 'An uninterrupted boot must become ready');
  cleanupCompleted();
  motion = 'reduced';
  const reduced = hook.useBootSequence();
  assert.equal(reduced.isReady, true, 'Reduced motion must skip the sequence');
  assert.equal(reduced.playing, false);
  assert.equal(effect(), undefined);
  assert.equal(timers.size, 0);
}

function checkMenu() {
  let slot = 0;
  const states = [];
  const dependencies = [];
  const effects = [];
  let height = 30;
  const react = {
    useRef: () => ({ current: { getBoundingClientRect: () => ({ width: 190, height }) } }),
    useState: initial => {
      const index = slot++;
      if (!(index in states)) states[index] = initial;
      return [states[index], value => { states[index] = value; }];
    },
    useLayoutEffect: (effect, deps) => {
      const index = slot++;
      if (!dependencies[index] || deps.some((value, i) => value !== dependencies[index][i])) effects.push(effect);
      dependencies[index] = deps;
    },
    useEffect: () => {},
  };
  const { ContextMenu } = load('app/(web)/desktop/_components/context-menu.tsx', { react }, {
    window: { innerWidth: 400, innerHeight: 400 },
  });
  const render = items => {
    slot = 0;
    ContextMenu({ menu: { x: 350, y: 350, items }, onClose: () => {} });
    effects.splice(0).forEach(effect => effect());
  };
  render([{ label: 'One' }]);
  assert.equal(states[0].y, 350);
  height = 180;
  render(Array.from({ length: 6 }, (_, i) => ({ label: String(i) })));
  assert.equal(states[0].y, 216, 'Menu must stay within the viewport when items change at the same coordinates');
}

function checkLightbox() {
  const react = requireModule('react');
  const strings = { lightbox: { labelled: label => label, unlabelled: 'Screenshot' } };
  const shared = { '@/app/shared/hooks/use-locale': { useStrings: () => strings } };
  const file = 'app/(web)/desktop/_components/apps/ui/image-lightbox.tsx';
  const props = { images: ['/assets/example.webp'], index: 0, onClose() {}, onIndexChange() {} };
  const { ImageLightbox: ServerLightbox } = load(file, {
    ...shared,
    'react-dom': { createPortal: () => { throw new Error('Server cannot create a DOM portal'); } },
  });
  const { renderToStaticMarkup } = requireModule('react-dom/server');
  assert.equal(renderToStaticMarkup(react.createElement(ServerLightbox, props)), '');

  let portalCalls = 0;
  const { ImageLightbox: ClientLightbox } = load(file, {
    ...shared,
    react: {
      ...react,
      useCallback: callback => callback,
      useEffect: () => {},
      useSyncExternalStore: (_subscribe, getSnapshot, getServerSnapshot) => {
        assert.equal(getServerSnapshot(), false, 'Hydration must start without a portal');
        return getSnapshot();
      },
    },
    'react-dom': { createPortal: children => { portalCalls++; return children; } },
  }, { document: { body: {} } });
  assert.ok(ClientLightbox(props));
  assert.equal(portalCalls, 1, 'The browser must mount the screenshot portal');
}

(async () => {
  let failed = false;
  for (const [name, check] of [['Boot lifecycle', checkBoot], ['Menu repositioning', checkMenu], ['Lightbox rendering', checkLightbox]]) {
    try { await check(); console.log('PASS: ' + name); }
    catch (error) { failed = true; console.error('FAIL: ' + name + ': ' + error.message); }
  }
  if (failed) process.exitCode = 1;
})();
