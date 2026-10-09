// Resume page interactions
(function () {
  'use strict';

  // If assets/resume.pdf hasn't been added yet, let the user know instead of
  // silently failing on a broken download link.
  var downloadLinks = document.querySelectorAll('a[href="assets/resume.pdf"]');

  downloadLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      fetch(link.getAttribute('href'), { method: 'HEAD' })
        .then(function (res) {
          if (!res.ok) throw new Error('missing');
        })
        .catch(function () {
          e.preventDefault();
          alert('Add your PDF at assets/resume.pdf to make this download button work.');
        });
    });
  });
})();
