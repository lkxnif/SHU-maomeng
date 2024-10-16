<script>
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const tag = urlParams.get('tag');
  if (tag) {
    PostQuery.runQuery('tags', decodeURIComponent(tag));
  }
});
</script>
