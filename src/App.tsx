import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import LoginPage from '@/pages/Login';
import ProfilePage from '@/pages/Profile';
import ProductCreatePage from '@/pages/ProductCreate';
import ProductMinePage from '@/pages/ProductMine';
import ProductListPage from '@/pages/ProductList';

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Navigate to="/product/list" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            <Layout>
              <ProfilePage />
            </Layout>
          }
        />
        <Route
          path="/product/create"
          element={
            <Layout>
              <ProductCreatePage />
            </Layout>
          }
        />
        <Route
          path="/product/mine"
          element={
            <Layout>
              <ProductMinePage />
            </Layout>
          }
        />
        <Route
          path="/product/list"
          element={
            <Layout>
              <ProductListPage />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}