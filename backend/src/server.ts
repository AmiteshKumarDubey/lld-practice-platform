import app from './app';

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 LLD Practice Platform Backend running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`===================================================`);
});
