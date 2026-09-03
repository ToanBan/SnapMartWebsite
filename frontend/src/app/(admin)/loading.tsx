export default function AdminLoading() {
  return (
    <main className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status" aria-label="Loading" />
      <p className="mt-3 text-muted">Đang tải trang quản trị...</p>
    </main>
  );
}
