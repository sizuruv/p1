/*
  공용 셸 스크립트.
  apps/ 폴더의 각 콘텐츠 페이지 <head> 안에
    <script src="../shell.js"></script>
  한 줄만 넣으면 좌측 상단에 홈(런처)으로 돌아가는 동그란 버튼이 뜬다.
  콘텐츠 파일을 통째로 새 버전으로 교체할 때도 이 한 줄만 다시 넣어주면 됨.

  페이지마다 좌상단에 이미 자기 UI가 있고(quiz.html의 사이드바/메뉴 열기
  버튼, notes.html의 sticky navbar, mindmap.html의 sticky header) 그마저도
  사이드바 접기 같은 조작으로 상태가 바뀌기 때문에, 좌표를 하드코딩하지 않고
  매번 실제 화면에서 그 요소들의 위치를 재서 안 겹치는 자리를 계산한다.
*/
(function () {
  var btn = null;

  function isVisible(el) {
    if (!el) return false;
    var style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    var rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function computePosition() {
    var top = 14;
    var left = 14;
    var sitRightOfSidebar = false;

    // A tall left column pinned at the top-left (e.g. quiz.html's sidebar
    // nav) — sit just to its right instead of below it.
    var nav = document.querySelector('.nav');
    if (isVisible(nav)) {
      var navRect = nav.getBoundingClientRect();
      if (navRect.left <= 20 && navRect.top <= 20) {
        if (navRect.height >= 200 && navRect.width < 400) {
          left = Math.max(left, navRect.right + 10);
          sitRightOfSidebar = true;
        } else {
          top = Math.max(top, navRect.bottom + 10);
        }
      }
    }

    // A wide bar pinned at the top (sticky navbar / header) — sit below it.
    ['.navbar', 'header'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (isVisible(el)) {
        var rect = el.getBoundingClientRect();
        if (rect.top <= 20) {
          top = Math.max(top, rect.bottom + 10);
        }
      }
    });

    // A small button that only appears when the sidebar above is collapsed
    // (quiz.html's "메뉴 보이기" button).
    var expandBtn = document.getElementById('navExpandBtn');
    if (isVisible(expandBtn)) {
      var eRect = expandBtn.getBoundingClientRect();
      if (eRect.top <= 20 && eRect.left <= 20) {
        top = Math.max(top, eRect.bottom + 10);
      }
    }

    // Sitting to the right of a sidebar puts us over the main content
    // column, which (unlike the sidebar) has no header gap of its own —
    // its first row (page title, progress bar, ...) starts right at the
    // top, so clear that too. This re-runs on every view switch since the
    // MutationObserver below also watches #main's childList.
    if (sitRightOfSidebar) {
      var main = document.getElementById('main') || document.querySelector('main');
      var firstRow = main && main.firstElementChild;
      if (firstRow) {
        var fRect = firstRow.getBoundingClientRect();
        if (fRect.top <= 80 && fRect.width > 0 && fRect.height > 0) {
          top = Math.max(top, fRect.bottom + 10);
        }
      }
    }

    return { top: top, left: left };
  }

  function applyPosition() {
    if (!btn) return;
    var pos = computePosition();
    btn.style.left = pos.left + 'px';
    btn.style.top = 'calc(' + pos.top + 'px + env(safe-area-inset-top, 0px))';
  }

  function addHomeButton() {
    btn = document.createElement('a');
    btn.href = '../index.html';
    btn.textContent = '\u{1F3E0}'; // 🏠
    btn.setAttribute('aria-label', '홈으로');
    btn.style.cssText = [
      'position:fixed',
      'width:46px',
      'height:46px',
      'border-radius:50%',
      'background:rgba(255,255,255,0.88)',
      'color:#1b201d',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'font-size:20px',
      'line-height:1',
      'text-decoration:none',
      'z-index:2147483647',
      'box-shadow:0 4px 14px rgba(20,15,10,0.18)',
      '-webkit-backdrop-filter:blur(6px)',
      'backdrop-filter:blur(6px)',
      'border:1px solid rgba(20,15,10,0.1)',
      'transition:left .15s ease, top .15s ease'
    ].join(';');
    document.body.appendChild(btn);
    applyPosition();

    // Re-measure whenever layout can plausibly change: window resize
    // (responsive breakpoints), and any class/style change on <body> or
    // the sidebar nav (quiz.html toggles body.nav-collapsed at runtime).
    window.addEventListener('resize', applyPosition);
    var mo = new MutationObserver(applyPosition);
    mo.observe(document.body, {
      attributes: true, attributeFilter: ['class', 'style'],
      childList: true, subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addHomeButton);
  } else {
    addHomeButton();
  }
})();
