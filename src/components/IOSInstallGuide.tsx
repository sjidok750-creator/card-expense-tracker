import { useEffect, useState } from 'react';

export function IOSInstallGuide() {
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Check if it's iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const hasSeenGuide = localStorage.getItem('ios-install-guide-seen');

    // Show guide only on iOS, not in standalone mode, and if not seen before
    if (isIOS && !isStandalone && !hasSeenGuide) {
      // Show guide after 3 seconds
      const timer = setTimeout(() => {
        setShowGuide(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowGuide(false);
    localStorage.setItem('ios-install-guide-seen', 'true');
  };

  const handleDismiss = () => {
    setShowGuide(false);
    // Don't save to localStorage, so it can show again next time
  };

  if (!showGuide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-t-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            홈 화면에 추가하기
          </h3>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600"
            aria-label="닫기"
          >
            <svg
              className="w-6 h-6"
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

        <p className="text-sm text-gray-600 mb-4">
          이 앱을 홈 화면에 추가하면 네이티브 앱처럼 사용할 수 있습니다!
        </p>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
              1
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                하단의 <span className="font-bold">공유 버튼</span>을 누르세요
              </p>
              <div className="mt-2 flex items-center justify-center bg-gray-100 rounded-lg p-3">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
              2
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-bold">"홈 화면에 추가"</span>를 선택하세요
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
              3
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                오른쪽 상단의 <span className="font-bold">"추가"</span> 버튼을 누르세요
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={handleClose}
            className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 font-medium"
          >
            알겠습니다
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 font-medium"
          >
            나중에
          </button>
        </div>
      </div>
    </div>
  );
}
