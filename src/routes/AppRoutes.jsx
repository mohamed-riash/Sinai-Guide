import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const lazyPage = (load, exportName) => lazy(() => load().then((page) => ({ default: page[exportName] })));

const HomePage = lazyPage(() => import('../pages/home/HomePage'), 'HomePage');
const ExplorePage = lazyPage(() => import('../pages/explore/ExplorePage'), 'ExplorePage');
const CitiesPage = lazyPage(() => import('../pages/cities/CitiesPage'), 'CitiesPage');
const CityDetailsPage = lazyPage(() => import('../pages/cities/CityDetailsPage'), 'CityDetailsPage');
const PlaceDetailsPage = lazyPage(() => import('../pages/places/PlaceDetailsPage'), 'PlaceDetailsPage');
const RestaurantsPage = lazyPage(() => import('../pages/restaurants/RestaurantsPage'), 'RestaurantsPage');
const CafesPage = lazyPage(() => import('../pages/cafes/CafesPage'), 'CafesPage');
const BlogPage = lazyPage(() => import('../pages/blog/BlogPage'), 'BlogPage');
const BlogPostPage = lazyPage(() => import('../pages/blog/BlogPostPage'), 'BlogPostPage');
const SavedPage = lazyPage(() => import('../pages/saved/SavedPage'), 'SavedPage');
const SettingsPage = lazyPage(() => import('../pages/settings/SettingsPage'), 'SettingsPage');
const NotFoundPage = lazyPage(() => import('../pages/NotFoundPage'), 'NotFoundPage');
const LoginPage = lazyPage(() => import('../pages/auth/LoginPage'), 'LoginPage');
const RegisterPage = lazyPage(() => import('../pages/auth/RegisterPage'), 'RegisterPage');
const ProfilePage = lazyPage(() => import('../pages/profile/ProfilePage'), 'ProfilePage');
const BusinessDashboardPage = lazyPage(() => import('../pages/business/BusinessDashboardPage'), 'BusinessDashboardPage');
const BusinessProfilePage = lazyPage(() => import('../pages/business/BusinessProfilePage'), 'BusinessProfilePage');
const BusinessMenuPage = lazyPage(() => import('../pages/business/BusinessMenuPage'), 'BusinessMenuPage');
const BusinessOrdersPage = lazyPage(() => import('../pages/business/BusinessOrdersPage'), 'BusinessOrdersPage');
const BusinessBookingsPage = lazyPage(() => import('../pages/business/BusinessBookingsPage'), 'BusinessBookingsPage');
const BusinessReviewsPage = lazyPage(() => import('../pages/business/BusinessReviewsPage'), 'BusinessReviewsPage');
const BusinessAnalyticsPage = lazyPage(() => import('../pages/business/BusinessAnalyticsPage'), 'BusinessAnalyticsPage');
const BusinessSettingsPage = lazyPage(() => import('../pages/business/BusinessSettingsPage'), 'BusinessSettingsPage');
const BusinessOnboardingPage = lazyPage(() => import('../pages/business/BusinessOnboardingPage'), 'BusinessOnboardingPage');
const AdminDashboardPage = lazyPage(() => import('../pages/admin/AdminDashboardPage'), 'AdminDashboardPage');
const SystemAdminSetupPage = lazyPage(() => import('../pages/auth/SystemAdminSetupPage'), 'SystemAdminSetupPage');

// Route Protection Guards
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

export const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="min-h-[35vh]" role="status" aria-label="جارٍ تحميل الصفحة" />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/cities" element={<CitiesPage />} />
        <Route path="/cities/:cityId" element={<CityDetailsPage />} />
        <Route path="/places/:placeId" element={<PlaceDetailsPage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/cafes" element={<CafesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/setup" element={<SystemAdminSetupPage />} />

        {/* Customer Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Business Owner Routes */}
        <Route
          path="/business/onboarding"
          element={
            <RoleRoute allowedRoles={['business_owner', 'admin']}>
              <BusinessOnboardingPage />
            </RoleRoute>
          }
        />
        <Route
          path="/business/dashboard"
          element={
            <RoleRoute allowedRoles={['business_owner', 'admin']}>
              <BusinessDashboardPage />
            </RoleRoute>
          }
        />
        <Route
          path="/business/profile"
          element={
            <RoleRoute allowedRoles={['business_owner', 'admin']}>
              <BusinessProfilePage />
            </RoleRoute>
          }
        />
        <Route
          path="/business/menu"
          element={
            <RoleRoute allowedRoles={['business_owner', 'admin']}>
              <BusinessMenuPage />
            </RoleRoute>
          }
        />
        <Route
          path="/business/orders"
          element={
            <RoleRoute allowedRoles={['business_owner', 'admin']}>
              <BusinessOrdersPage />
            </RoleRoute>
          }
        />
        <Route
          path="/business/bookings"
          element={
            <RoleRoute allowedRoles={['business_owner', 'admin']}>
              <BusinessBookingsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/business/reviews"
          element={
            <RoleRoute allowedRoles={['business_owner', 'admin']}>
              <BusinessReviewsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/business/analytics"
          element={
            <RoleRoute allowedRoles={['business_owner', 'admin']}>
              <BusinessAnalyticsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/business/settings"
          element={
            <RoleRoute allowedRoles={['business_owner', 'admin']}>
              <BusinessSettingsPage />
            </RoleRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </RoleRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
