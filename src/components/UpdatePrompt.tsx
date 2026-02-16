import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <>
      {(offlineReady || needRefresh) && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className="bg-white border-2 border-blue-500 rounded-lg shadow-xl p-4">
            <div className="flex items-start">
              <div className="flex-1">
                {offlineReady ? (
                  <p className="text-sm text-gray-700">
                    앱이 오프라인에서도 사용 가능합니다!
                  </p>
                ) : (
                  <p className="text-sm text-gray-700">
                    새 버전이 있습니다. 업데이트하시겠습니까?
                  </p>
                )}
              </div>
              <button
                onClick={close}
                className="ml-4 text-gray-400 hover:text-gray-600"
                aria-label="닫기"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            {needRefresh && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => updateServiceWorker(true)}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm font-medium"
                >
                  업데이트
                </button>
                <button
                  onClick={close}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-sm font-medium"
                >
                  나중에
                </button>
              </div>
            )}
            {offlineReady && (
              <button
                onClick={close}
                className="mt-3 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm font-medium"
              >
                확인
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
