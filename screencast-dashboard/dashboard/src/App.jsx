import { useEffect, useRef, useState } from 'react';

const RELAY = 'ws://localhost:8080';

function useFrameStream(testId) {
  const imgRef = useRef(null);
  const urlRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(`${RELAY}/view?testId=${encodeURIComponent(testId)}`);
    ws.binaryType = 'blob';

    ws.onmessage = (event) => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(event.data);
      urlRef.current = url;
      if (imgRef.current) imgRef.current.src = url;
    };

    return () => {
      ws.close();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, [testId]);

  return imgRef;
}

function TestTile({ test, onClick }) {
  const imgRef = useFrameStream(test.testId);
  const elapsed = Math.floor((Date.now() - test.startedAt) / 1000);

  return (
    <div
      onClick={onClick}
      className="relative bg-neutral-900 rounded-lg overflow-hidden cursor-pointer
                 border border-neutral-800 hover:border-blue-500 transition-all
                 hover:scale-[1.02]"
    >
      <img
        ref={imgRef}
        alt={test.name}
        className="w-full aspect-video object-cover bg-black"
      />
      <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/60 px-2 py-1 rounded">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-xs font-mono">REC</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
        <div className="text-sm font-medium truncate">{test.name}</div>
        <div className="text-xs text-neutral-400">{elapsed}s</div>
      </div>
    </div>
  );
}

function ZoomedView({ test, onClose }) {
  const imgRef = useFrameStream(test.testId);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-8"
    >
      <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{test.name}</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            ✕ close
          </button>
        </div>
        <img
          ref={imgRef}
          alt={test.name}
          className="w-full rounded-lg border border-neutral-800"
        />
      </div>
    </div>
  );
}

export default function App() {
  const [tests, setTests] = useState([]);
  const [zoomed, setZoomed] = useState(null);
  const [, forceRender] = useState(0);

  useEffect(() => {
    const ws = new WebSocket(`${RELAY}/view/list`);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'test-list') setTests(msg.tests);
    };
    return () => ws.close();
  }, []);

  useEffect(() => {
    const id = setInterval(() => forceRender((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Keep the zoomed test pointing at fresh metadata if its entry is still live.
  const zoomedLive = zoomed
    ? tests.find((t) => t.testId === zoomed.testId) || zoomed
    : null;

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Playwright Test Dashboard</h1>
        <p className="text-neutral-400 mt-1">
          {tests.length} running {tests.length === 1 ? 'test' : 'tests'}
        </p>
      </header>

      {tests.length === 0 ? (
        <div className="text-center text-neutral-500 py-20">
          Waiting for tests to start...
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {tests.map((test) => (
            <TestTile
              key={test.testId}
              test={test}
              onClick={() => setZoomed(test)}
            />
          ))}
        </div>
      )}

      {zoomedLive && (
        <ZoomedView test={zoomedLive} onClose={() => setZoomed(null)} />
      )}
    </div>
  );
}
