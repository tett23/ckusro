self.addEventListener('message', (e) => {
  console.log(e);
  (postMessage as any)('fuga');
});
