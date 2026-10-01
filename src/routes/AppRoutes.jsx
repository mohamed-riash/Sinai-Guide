import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import { HomePage } from '../pages/home/HomePage';
import { ExplorePage } from '../pages/explore/ExplorePage';
import { CitiesPage } from '../pages/cities/CitiesPage';
import { CityDetailsPage } from '../pages/cities/CityDetailsPage';
import { PlaceDetailsPage } from '../pages/places/PlaceDetailsPage';
import { RestaurantsPage } from '../pages/restaurants/RestaurantsPage';
import { CafesPage } from '../pages/cafes/CafesPage';
import { BlogPage } from '../pages/blog/BlogPage';
import { BlogPostPage } from '../pages/blog/BlogPostPage';
import { SavedPage } from '../pages/saved/SavedPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Customer Protected Pages
import { ProfilePage } from '../pages/profile/ProfilePage';

// Business Owner Protected Pages
import { BusinessDashboardPage } from '../pages/business/BusinessDashboardPage';
import { BusinessProfilePage } from '../pages/business/BusinessProfilePage';
import { BusinessMenuPage } from '../pages/business/BusinessMenuPage';
import { BusinessOrdersPage } from '../pages/business/BusinessOrdersPage';
import { BusinessBookingsPage } from '../pages/business/BusinessBookingsPage';
import { BusinessReviewsPage } from '../pages/business/BusinessReviewsPage';
import { BusinessAnalyticsPage } from '../pages/business/BusinessAnalyticsPage';
import { BusinessSettingsPage } from '../pages/business/BusinessSettingsPage';
import { BusinessOnboardingPage } from '../pages/business/BusinessOnboardingPage';

// Admin Protected Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';

// Route Protection Guards
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

export const AppRoutes = () => {
  return (
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
  );
};
