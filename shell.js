/*
  공용 셸 스크립트.
  apps/ 폴더의 각 콘텐츠 페이지 <head> 안에
    <script src="../shell.js"></script>
  한 줄만 넣으면 우측 하단에 홈(런처)으로 돌아가는 동그란 버튼이 뜬다.
  콘텐츠 파일을 통째로 새 버전으로 교체할 때도 이 한 줄만 다시 넣어주면 됨.
*/
(function () {
  function addHomeButton() {
    var btn = document.createElement('a');
    btn.href = '../index.html';
    btn.textContent = '\u{1F3E0}'; // 🏠
    btn.setAttribute('aria-label', '홈으로');
    btn.style.cssText = [
      'position:fixed',
      'right:14px',
      'bottom:calc(14px + env(safe-area-inset-bottom, 0px))',
      'width:46px',
      'height:46px',
      'border-radius:50%',
      'background:rgba(20,18,15,0.82)',
      'color:#fff',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'font-size:20px',
      'line-height:1',
      'text-decoration:none',
      'z-index:2147483647',
      'box-shadow:0 4px 14px rgba(0,0,0,0.4)',
      '-webkit-backdrop-filter:blur(6px)',
      'backdrop-filter:blur(6px)',
      'border:1px solid rgba(255,255,255,0.12)'
    ].join(';');
    document.body.appendChild(btn);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addHomeButton);
  } else {
    addHomeButton();
  }
})();
